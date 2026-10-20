"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useAuth } from "@/store/account";
import { useToast } from "@/components/ui/toast";
import { Button, Checkbox, Field, Input, Skeleton } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/icon";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const user = useAuth((state) => state.user);
  const login = useAuth((state) => state.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const redirect = searchParams.get("redirect") ?? "/account";

  useEffect(() => {
    if (user) router.replace(redirect);
  }, [user, redirect, router]);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast({ title: "Email belum valid", tone: "danger" });
      return;
    }
    if (password.length < 6) {
      toast({ title: "Kata sandi minimal 6 karakter", tone: "danger" });
      return;
    }
    setLoading(true);
    window.setTimeout(() => {
      login(email);
      toast({
        title: "Selamat datang kembali",
        description: "Anda berhasil masuk. Selamat menjelajah.",
        tone: "success",
      });
      router.push(redirect);
    }, 600);
  };

  return (
    <div className="animate-fade-up">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-600">Masuk</p>
      <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-ink">Selamat datang kembali.</h1>
      <p className="mt-2 text-[12px] leading-relaxed text-ink-muted">
        Belum punya akun?{" "}
        <Link href="/register" className="font-bold text-brand-600 hover:underline">
          Buat akun gratis
        </Link>
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
        <Field label="Kata sandi">
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Minimal 6 karakter"
              autoComplete="current-password"
              required
              className="pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-ink-muted transition hover:text-ink"
            >
              <Icon name={showPassword ? "eye-off" : "eye"} size={17} />
            </button>
          </div>
        </Field>

        <div className="flex items-center justify-between gap-3">
          <Checkbox checked={remember} onChange={setRemember} label="Ingat saya" />
          <Link href="/forgot-password" className="text-[11px] font-semibold text-brand-600 hover:underline">
            Lupa kata sandi?
          </Link>
        </div>

        <Button type="submit" size="lg" className="w-full" loading={loading}>
          Masuk <Icon name="arrow-right" size={16} />
        </Button>
      </form>

      <div className="mt-5 rounded-xl border border-dashed border-brand-300 bg-brand-50/60 p-3.5">
        <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-brand-700">
          <Icon name="sparkles" size={14} /> Akun demo
        </p>
        <p className="mt-1.5 text-[11px] leading-relaxed text-ink-muted">
          Email <span className="font-semibold text-ink">alya@example.com</span> · kata sandi apa pun (min. 6 karakter).
        </p>
        <button
          onClick={() => {
            setEmail("alya@example.com");
            setPassword("demo123");
          }}
          className="mt-2.5 inline-flex items-center gap-1.5 text-[10px] font-bold text-brand-700 underline decoration-brand-300 underline-offset-4 hover:decoration-brand-700"
        >
          <Icon name="copy" size={12} /> Isi otomatis kredensial demo
        </button>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
