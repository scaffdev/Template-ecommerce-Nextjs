"use client";
import { useState } from "react";
import { useAuth } from "@/store/shop";
import { Card, Button, Input } from "@/components/ui/primitives";

export default function ProfilePage() {
  const user = useAuth((s) => s.user);
  const login = useAuth((s) => s.login);
  const [name, setName] = useState(user?.name ?? "");
  const [msg, setMsg] = useState("");
  return (
    <div>
      <h1 className="text-xl font-bold">Profil</h1>
      <Card className="mt-3 space-y-3">
        <label className="block text-xs">Nama<Input value={name} onChange={(e) => setName(e.target.value)} /></label>
        <label className="block text-xs">Email<Input value={user?.email ?? ""} disabled /></label>
        <Button onClick={() => { login(name || "Pengguna", user?.email ?? "user@mail.com"); setMsg("Profil tersimpan."); }}>Simpan</Button>
        {msg && <p className="text-xs text-emerald-600">{msg}</p>}
      </Card>
      <Card className="mt-3">
        <p className="text-sm font-bold">Ganti password</p>
        <div className="mt-2 grid gap-2 md:grid-cols-2">
          <Input type="password" placeholder="Password baru" />
          <Input type="password" placeholder="Konfirmasi" />
        </div>
        <Button variant="outline" className="mt-2" onClick={() => alert("Password diubah (simulasi). Email notifikasi dikirim.")}>Ubah Password</Button>
      </Card>
    </div>
  );
}
