"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/store/shop";
import { Button, Input, Card } from "@/components/ui/primitives";

export default function LoginPage() {
  const login = useAuth((s) => s.login);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  return (
    <div className="mx-auto max-w-md py-10">
      <Card>
        <h1 className="text-xl font-bold">Masuk</h1>
        <p className="text-xs text-gray-500">Session via Auth.js (simulasi client). Rate-limited di produksi.</p>
        <form
          className="mt-4 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!email.includes("@") || password.length < 6) { setErr("Email/password tidak valid (min 6 karakter)."); return; }
            login(email.split("@")[0], email);
            router.push("/account");
          }}
        >
          <label className="block text-xs">Email<Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nama@email.com" /></label>
          <label className="block text-xs">Password<Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
          {err && <p className="text-xs text-red-600">{err}</p>}
          <Button className="w-full">Masuk</Button>
        </form>
        <div className="mt-3 flex justify-between text-xs">
          <Link href="/register" className="text-sky-600 underline">Daftar akun</Link>
          <Link href="/forgot-password" className="text-sky-600 underline">Lupa password?</Link>
        </div>
        <button onClick={() => { login("Pengguna Google", "google.user@gmail.com"); router.push("/account"); }} className="mt-3 w-full rounded-lg border py-2.5 text-sm font-semibold">Masuk dengan Google</button>
      </Card>
    </div>
  );
}
