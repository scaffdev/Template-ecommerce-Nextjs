"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart, useWishlist } from "@/store/commerce";
import { Icon, type IconName } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

const items: { href: string; label: string; icon: IconName }[] = [
  { href: "/", label: "Beranda", icon: "home" },
  { href: "/products", label: "Kategori", icon: "layout-grid" },
  { href: "/flash-sale", label: "Flash Sale", icon: "bolt" },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const cartCount = useCart((state) => state.count());
  const setCartOpen = useCart((state) => state.setOpen);
  const wishCount = useWishlist((state) => state.ids.length);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <nav
      aria-label="Navigasi mobile"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-sand-200 bg-surface/98 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
    >
      <div className="grid grid-cols-5">
        {items.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center gap-1 py-2 text-[9px] font-semibold transition",
                active ? "text-brand-600" : "text-ink-muted"
              )}
            >
              <Icon name={item.icon} size={20} />
              {item.label}
              {active && <span className="absolute -top-px h-0.5 w-8 rounded-full bg-brand-600" />}
            </Link>
          );
        })}
        <button
          onClick={() => setCartOpen(true)}
          className="relative flex flex-col items-center gap-1 py-2 text-[9px] font-semibold text-ink-muted transition hover:text-brand-600"
          aria-label="Buka keranjang"
        >
          <Icon name="bag" size={20} />
          Keranjang
          {mounted && cartCount > 0 && (
            <span className="absolute right-[20%] top-1 grid h-4 min-w-4 place-items-center rounded-full bg-brand-600 px-1 text-[8px] font-bold text-white">
              {cartCount}
            </span>
          )}
        </button>
        <Link
          href="/account"
          className={cn(
            "relative flex flex-col items-center gap-1 py-2 text-[9px] font-semibold transition",
            pathname.startsWith("/account") ? "text-brand-600" : "text-ink-muted"
          )}
        >
          <Icon name="user" size={20} />
          Akun
          {mounted && wishCount > 0 && (
            <span className="absolute right-[18%] top-1 h-2 w-2 rounded-full bg-brand-600" />
          )}
          {pathname.startsWith("/account") && <span className="absolute -top-px h-0.5 w-8 rounded-full bg-brand-600" />}
        </Link>
      </div>
    </nav>
  );
}

export function WhatsAppFloat() {
  return (
    <a
      href="https://wa.me/6281234567890?text=Halo%20LUM%C3%89%2C%20saya%20ingin%20bertanya"
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-20 right-4 z-30 inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lift transition hover:scale-105 md:bottom-6 md:right-6 md:h-auto md:w-auto md:gap-2 md:px-4 md:py-3 md:text-xs md:font-bold"
      aria-label="Hubungi kami via WhatsApp"
    >
      <Icon name="whatsapp" size={20} />
      <span className="hidden md:inline">Chat kami</span>
    </a>
  );
}
