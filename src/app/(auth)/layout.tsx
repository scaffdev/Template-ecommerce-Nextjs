import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { Logo } from "@/components/layout/logo";

const benefits = [
  "Lacak semua pesanan dalam satu dashboard",
  "Simpan alamat dan metode pembayaran",
  "Akses awal ke koleksi terbatas dan diskon member",
];

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
      <aside className="relative hidden overflow-hidden bg-ink lg:block">
        <Image
          src="/images/editorial/lookbook.webp"
          alt=""
          fill
          sizes="55vw"
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-brand-900/30" />
        <div className="relative z-10 flex h-full flex-col justify-between p-12">
          <Logo light />
          <div className="max-w-md">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-300">Member tokobagus.com</p>
            <p className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-white">
              Belanja lebih tenang, mulai dari akun Anda.
            </p>
            <ul className="mt-8 space-y-3.5">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3 text-sm text-surface/75">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-500/25 text-brand-200">
                    <Icon name="check" size={12} />
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-[11px] text-surface/40">© 2026 tokobagus.com — Jakarta</p>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col bg-white">
        <header className="flex items-center justify-between border-b border-sand-200 px-5 py-4 sm:px-10">
          <div className="lg:hidden">
            <Logo />
          </div>
          <Link href="/products" className="ml-auto inline-flex items-center gap-1.5 text-[11px] font-semibold text-ink-soft transition hover:text-brand-600">
            <Icon name="arrow-left" size={14} /> Lanjut belanja
          </Link>
        </header>
        <main id="main-content" className="flex flex-1 items-center justify-center bg-sand-50/50 px-5 py-8 sm:px-10">
          <div className="w-full max-w-md rounded-xl border border-sand-200 bg-white p-5 shadow-soft sm:p-7">{children}</div>
        </main>
      </div>
    </div>
  );
}
