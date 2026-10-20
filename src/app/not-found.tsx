import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { buttonStyles } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/icon";

const suggestions = [
  { label: "Semua produk", href: "/products" },
  { label: "Living", href: "/category/living" },
  { label: "FAQ", href: "/faq" },
  { label: "Lacak pesanan", href: "/track-order" },
];

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <header className="container-lume py-6">
        <Logo />
      </header>
      <main className="container-lume flex flex-1 items-center py-12">
        <div className="grid w-full items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Error 404</p>
            <h1 className="display mt-4 text-5xl leading-[1.02] sm:text-6xl">Halaman ini tidak ada di rak kami.</h1>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-ink-soft">
              Mungkin tautannya salah ketik, atau produknya sudah tidak diproduksi lagi. Mari kembali ke hal-hal yang
              ada.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/" className={buttonStyles({ size: "lg" })}>
                <Icon name="home" size={16} /> Kembali ke beranda
              </Link>
              <Link href="/products" className={buttonStyles({ variant: "outline", size: "lg" })}>
                Jelajahi koleksi
              </Link>
            </div>
            <div className="mt-10">
              <p className="text-[10px] font-bold uppercase tracking-widest2 text-ink-muted">Mungkin Anda mencari</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {suggestions.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-full border border-sand-300 bg-surface px-4 py-2 text-xs font-medium text-ink-soft transition hover:border-ink hover:text-ink"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex aspect-square items-center justify-center rounded-2xl bg-olive-800">
                <span className="font-display text-[7rem] leading-none text-brass-300">4</span>
              </div>
              <div className="flex aspect-square items-center justify-center rounded-2xl bg-brass-500">
                <span className="font-display text-[7rem] leading-none text-ink">0</span>
              </div>
              <div className="flex aspect-square items-center justify-center rounded-2xl bg-ink">
                <span className="font-display text-[7rem] leading-none text-surface">4</span>
              </div>
              <div className="flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl border border-sand-300 bg-surface">
                <Icon name="search" size={28} className="text-brass-600" />
                <span className="text-[11px] font-semibold text-ink-muted">Nothing here</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="container-lume border-t border-sand-200 py-5 text-[11px] text-ink-muted">
        © 2026 tokobagus.com — Curated living, considered.
      </footer>
    </div>
  );
}
