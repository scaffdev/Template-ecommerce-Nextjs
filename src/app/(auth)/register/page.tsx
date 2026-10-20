"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/store/account";
import { useToast } from "@/components/ui/toast";
import { Button, Checkbox, Field, Input } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/icon";

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const user = useAuth((state) => state.user);
  const register = useAuth((state) => state.register);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) router.replace("/account");
  }, [user, router]);

  const strength = (() => {
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[A-Z]/.test(password) || /[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return score;
  })();

  const strengthLabel = ["Terlalu pendek", "Lemah", "Cukup", "Kuat", "Sangat kuat"][strength];

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (name.trim().length < 2) {
      toast({ title: "Nama belum lengkap", tone: "danger" });
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast({ title: "Email belum valid", tone: "danger" });
      return;
    }
    if (phone && !/^[0-9+\-\s]{9,16}$/.test(phone)) {
      toast({ title: "Nomor telepon belum valid", tone: "danger" });
      return;
    }
    if (password.length < 6) {
      toast({ title: "Kata sandi minimal 6 karakter", tone: "danger" });
      return;
    }
    if (!agree) {
      toast({ title: "Setujui syarat & ketentuan dulu", tone: "danger" });
      return;
    }
    setLoading(true);
    window.setTimeout(() => {
      register(name.trim(), email, phone);
      toast({
        title: "Akun berhasil dibuat",
        description: "Selamat bergabung di tokobagus.com. Nikmati pengalaman belanja yang lebih personal.",
        tone: "success",
      });
      router.push("/account");
    }, 600);
  };

  return (
    <div className="animate-fade-up">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-600">Daftar</p>
      <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-ink">Buat akun tokobagus.com Anda.</h1>
      <p className="mt-2 text-[12px] leading-relaxed text-ink-muted">
        Sudah punya akun?{" "}
        <Link href="/login" className="font-bold text-brand-600 hover:underline">
          Masuk di sini
        </Link>
      </p>

      <form onSubmit={submit} className="mt-5 space-y-4">
        <Field label="Nama lengkap">
          <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Nama Anda" autoComplete="name" required />
        </Field>
        <Field label="Alamat email">
          <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="nama@email.com" autoComplete="email" required />
        </Field>
        <Field label="Nomor telepon (opsional)">
          <Input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="08xxxxxxxxxx" inputMode="tel" autoComplete="tel" />
        </Field>
        <Field label="Kata sandi">
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Minimal 6 karakter"
              autoComplete="new-password"
              required
              className="pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-ink-muted transition hover:text-brand-600"
            >
              <Icon name={showPassword ? "eye-off" : "eye"} size={17} />
            </button>
          </div>
          {password.length > 0 && (
            <div className="mt-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((level) => (
                  <span
                    key={level}
                    className={`h-1 flex-1 rounded-full transition ${
                      level <= strength ? (strength <= 1 ? "bg-danger" : strength === 2 ? "bg-accent-400" : "bg-olive-500") : "bg-sand-200"
                    }`}
                  />
                ))}
              </div>
              <p className="mt-1.5 text-[11px] text-ink-muted">Kekuatan kata sandi: {strengthLabel}</p>
            </div>
          )}
        </Field>

        <Checkbox
          checked={agree}
          onChange={setAgree}
          label="Saya menyetujui syarat & ketentuan dan kebijakan privasi tokobagus.com."
          description="Kami mengirim email konfirmasi pesanan dan info pengiriman. Anda bisa berhenti berlangganan kapan saja."
        />

        <Button type="submit" size="lg" className="w-full" loading={loading}>
          Buat akun <Icon name="arrow-right" size={16} />
        </Button>
      </form>

      <ul className="mt-5 space-y-2 border-t border-sand-200 pt-4">
        {["Poin reward setiap pembelian", "Early access koleksi terbatas", "Pengembalian dipercepat untuk member"].map((benefit) => (
          <li key={benefit} className="flex items-center gap-2 text-[11px] text-ink-soft">
            <Icon name="check" size={14} className="text-olive-600" /> {benefit}
          </li>
        ))}
      </ul>
    </div>
  );
}
