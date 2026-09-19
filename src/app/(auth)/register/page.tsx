"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/store/shop";
import { Button, Input, Card } from "@/components/ui/primitives";

export default function RegisterPage() {
  const login = useAuth((s) => s.login);
  const router = useRouter();
  const [f, setF] = useState({ name: "", email: "", password: "", confirm: "" });
  const [err, setErr] = useState("");
  const set = (k: string, v: string) => setF((s) => ({ ...s, [k]: v }));

  return (
    <div className="mx-auto max-w-md py-10">
      <Card>
        <h1 className="text-xl font-bold">Daftar</h1>
        <form
          className="mt-4 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (f.name.length < 3) { setErr("Nama minimal 3 karakter."); return; }
            if (!f.email.includes("@")) { setErr("Email tidak valid."); return; }
            if (f.password.length < 6) { setErr("Password minimal 6 karakter."); return; }
            if (f.password !== f.confirm) { setErr("Konfirmasi password tidak sama."); return; }
            login(f.name, f.email);
            router.push("/account");
          }}
        >
          <label className="block text-xs">Nama<Input value={f.name} onChange={(e) => set("name", e.target.value)} /></label>
          <label className="block text-xs">Email<Input value={f.email} onChange={(e) => set("email", e.target.value)} /></label>
          <label className="block text-xs">Password<Input type="password" value={f.password} onChange={(e) => set("password", e.target.value)} /></label>
          <label className="block text-xs">Konfirmasi password<Input type="password" value={f.confirm} onChange={(e) => set("confirm", e.target.value)} /></label>
          {err && <p className="text-xs text-red-600">{err}</p>}
          <Button className="w-full">Buat Akun</Button>
        </form>
        <p className="mt-3 text-xs">Sudah punya akun? <Link href="/login" className="text-sky-600 underline">Masuk</Link></p>
      </Card>
    </div>
  );
}
