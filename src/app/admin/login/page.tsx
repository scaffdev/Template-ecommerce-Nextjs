"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAdminAuth } from "@/store/admin";
import { useToast } from "@/components/ui/toast";
import { Logo } from "@/components/layout/logo";
import { Button, Field, Input } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/icon";

export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const admin = useAdminAuth((state) => state.admin);
  const login = useAdminAuth((state) => state.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (admin) router.replace("/admin");
  }, [admin, router]);

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
      toast({ title: "Selamat datang di admin panel", tone: "success" });
      router.push("/admin");
    }, 500);
  };

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-ink px-5 py-12">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "linear-gradient(#FFFCF7 1px, transparent 1px), linear-gradient(90deg, #FFFCF7 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center">
          <Logo light className="justify-center" />
          <p className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-surface/15 px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-brass-300">
            <span className="h-1.5 w-1.5 rounded-full bg-brass-400" /> Admin panel
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-surface/10 bg-surface p-6 shadow-lift sm:p-8">
          <h1 className="font-display text-2xl text-ink">Masuk ke studio.</h1>
          <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">
            Kelola produk, pesanan, dan konten tokobagus.com dari satu tempat.
          </p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <Field label="Email admin">
              <Input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@tokobagus.com"
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
                  <Icon name={showPassword ? "eye-off" : "eye"} size={16} />
                </button>
              </div>
            </Field>
            <Button type="submit" className="w-full" size="lg" loading={loading}>
              Masuk ke admin <Icon name="arrow-right" size={16} />
            </Button>
          </form>

          <div className="mt-5 rounded-xl border border-dashed border-brass-300 bg-brass-50/60 p-3.5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-brass-800">Akses demo</p>
            <p className="mt-1 text-[11px] leading-relaxed text-ink-soft">
              Gunakan email apa pun dan kata sandi min. 6 karakter. Atau isi otomatis:
            </p>
            <button
              onClick={() => {
                setEmail("admin@tokobagus.com");
                setPassword("tokobagus2026");
              }}
              className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold text-brass-800 underline decoration-brass-300 underline-offset-4"
            >
              <Icon name="sparkles" size={12} /> Isi kredensial demo
            </button>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between text-[11px] text-surface/40">
          <Link href="/" className="inline-flex items-center gap-1.5 transition hover:text-surface">
            <Icon name="arrow-left" size={13} /> Kembali ke toko
          </Link>
          <span>© 2026 tokobagus.com Studio</span>
        </div>
      </div>
    </div>
  );
}
