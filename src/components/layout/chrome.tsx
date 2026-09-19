"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useCart, useWishlist } from "@/store/shop";

export function Navbar() {
  const [q, setQ] = useState("");
  const router = useRouter();
  const count = useCart((s) => s.count());
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);
  const wish = useWishlist((s) => s.ids);

  return (
    <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
        <Link href="/" className="text-xl font-extrabold text-sky-700">
          TokoKita<span className="text-amber-500">.</span>
        </Link>
        <form
          className="hidden flex-1 md:flex"
          onSubmit={(e) => {
            e.preventDefault();
            router.push(`/search?q=${encodeURIComponent(q)}`);
          }}
        >
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari sepatu, kemeja, TWS…"
            className="w-full rounded-l-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-sky-500"
            aria-label="Pencarian produk"
          />
          <button className="rounded-r-lg bg-sky-600 px-5 text-sm font-semibold text-white hover:bg-sky-700">
            Cari
          </button>
        </form>
        <nav className="ml-auto flex items-center gap-1 text-sm font-medium">
          <Link href="/products" className="rounded-lg px-3 py-2 hover:bg-gray-100">Katalog</Link>
          <Link href="/account/wishlist" className="rounded-lg px-3 py-2 hover:bg-gray-100">
            Wishlist ({wish.length})
          </Link>
          <Link href="/cart" className="rounded-lg px-3 py-2 hover:bg-gray-100">
            Keranjang ({count})
          </Link>
          {user ? (
            <>
              <Link href="/account" className="rounded-lg px-3 py-2 hover:bg-gray-100">{user.name}</Link>
              <button onClick={logout} className="rounded-lg px-3 py-2 text-red-600 hover:bg-red-50">Keluar</button>
            </>
          ) : (
            <Link href="/login" className="rounded-lg bg-sky-600 px-4 py-2 text-white hover:bg-sky-700">Masuk</Link>
          )}
        </nav>
      </div>
      <div className="border-t bg-gray-50 md:hidden">
        <form
          className="mx-auto flex max-w-7xl gap-2 px-4 py-2"
          onSubmit={(e) => {
            e.preventDefault();
            router.push(`/search?q=${encodeURIComponent(q)}`);
          }}
        >
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari produk…"
            className="w-full rounded-lg border px-3 py-2 text-sm"
            aria-label="Pencarian produk"
          />
        </form>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-16 border-t bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-4">
        <div>
          <p className="text-lg font-extrabold text-sky-700">TokoKita.</p>
          <p className="mt-2 text-sm text-gray-600">Belanja cepat, aman, dan bergaransi. Dukung UMKM Indonesia.</p>
        </div>
        <div>
          <p className="font-semibold">Belanja</p>
          <ul className="mt-2 space-y-1 text-sm text-gray-600">
            <li><Link href="/products">Semua Produk</Link></li>
            <li><Link href="/search?q=sepatu">Sepatu</Link></li>
            <li><Link href="/account/orders">Lacak Pesanan</Link></li>
            <li><Link href="/account/wishlist">Wishlist</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold">Bantuan</p>
          <ul className="mt-2 space-y-1 text-sm text-gray-600">
            <li><Link href="/faq">FAQ</Link></li>
            <li><Link href="/shipping-policy">Kebijakan Pengiriman</Link></li>
            <li><Link href="/return-policy">Pengembalian</Link></li>
            <li><Link href="/contact">Hubungi Kami</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold">Perusahaan</p>
          <ul className="mt-2 space-y-1 text-sm text-gray-600">
            <li><Link href="/about">Tentang</Link></li>
            <li><Link href="/terms">Syarat & Ketentuan</Link></li>
            <li><Link href="/privacy">Privasi</Link></li>
            <li><Link href="/admin">Admin Panel</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t py-4 text-center text-xs text-gray-500">© 2026 TokoKita — Template E-Commerce Next.js (PRD v1.0)</div>
    </footer>
  );
}
