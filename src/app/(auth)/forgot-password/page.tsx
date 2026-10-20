"use client";

import Link from "next/link";
import { useState } from "react";
import { maskEmail } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import { Button, Field, Input } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/icon";

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast({ title: "Email belum valid", tone: "danger" });
      return;
    }
    setLoading(true);
    window.setTimeout(() => {
      setSent(true);
      setLoading(false);
    }, 600);
  };

  if (sent) {
    return (
      <div className="animate-fade-up text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand-50 text-brand-600">
          <Icon name="mail" size={24} />
        </span>
        <h1 className="mt-4 text-2xl font-extrabold text-ink">Cek email Anda</h1>
        <p className="mt-2 text-[12px] leading-relaxed text-ink-muted">
          Kami mengirim tautan pengaturan ulang kata sandi ke <span className="font-semibold text-ink">{maskEmail(email)}</span>. Tautan
          berlaku selama 60 menit.
        </p>
        <div className="mt-5 space-y-3">
          <Button className="w-full" onClick={() => toast({ title: "Email dikirim ulang", tone: "info" })}>
            <Icon name="refresh" size={15} /> Kirim ulang email
          </Button>
          <Link href="/login" className="block text-[11px] font-semibold text-brand-600 hover:underline">
            Kembali ke halaman masuk
          </Link>
        </div>
        <p className="mt-5 rounded-lg bg-sand-50 p-3.5 text-[10px] leading-relaxed text-ink-muted">
          Tidak menerima email? Periksa folder spam atau pastikan alamat yang Anda masukkan sudah benar.
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-600">Lupa kata sandi</p>
      <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-ink">Atur ulang kata sandi.</h1>
      <p className="mt-2 text-[12px] leading-relaxed text-ink-muted">
        Masukkan email yang terdaftar. Kami akan mengirim tautan untuk membuat kata sandi baru.
      </p>

      <form onSubmit={submit} className="mt-5 space-y-4">
        <Field label="Alamat email">
          <Input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="nama@email.com"
            autoComplete="email"
            required
          />
        </Field>
        <Button type="submit" size="lg" className="w-full" loading={loading}>
          Kirim tautan reset <Icon name="arrow-right" size={16} />
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-ink-muted">
        Ingat kata sandi Anda?{" "}
        <Link href="/login" className="font-bold text-brand-600 hover:underline">
          Masuk
        </Link>
      </p>
    </div>
  );
}
