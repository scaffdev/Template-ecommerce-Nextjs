"use client";
import { useState } from "react";
import { Button, Input, Card } from "@/components/ui/primitives";

export default function ForgotPage() {
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");
  return (
    <div className="mx-auto max-w-md py-10">
      <Card>
        <h1 className="text-xl font-bold">Lupa Password</h1>
        {sent ? (
          <p className="mt-3 text-sm">Tautan reset dikirim ke <b>{email}</b> (simulasi Resend + React Email). Cek kotak masuk Anda.</p>
        ) : (
          <form className="mt-4 space-y-3" onSubmit={(e) => { e.preventDefault(); if (email.includes("@")) setSent(true); }}>
            <label className="block text-xs">Email terdaftar<Input value={email} onChange={(e) => setEmail(e.target.value)} /></label>
            <Button className="w-full">Kirim Tautan Reset</Button>
          </form>
        )}
      </Card>
    </div>
  );
}
