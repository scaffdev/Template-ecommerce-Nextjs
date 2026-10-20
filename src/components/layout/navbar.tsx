"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useCart, useWishlist } from "@/store/commerce";
import { useAuth, useNotifications } from "@/store/account";
import { useCatalog } from "@/store/catalog";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { Logo } from "./logo";
import { SearchOverlay } from "./search-overlay";
import { Drawer } from "@/components/ui/overlay";

const promos = [
  { href: "/flash-sale", label: "Flash Sale", icon: "bolt" as const, tone: "text-brand-600" },
  { href: "/vouchers", label: "Voucher", icon: "ticket" as const },
  { href: "/products?sort=new", label: "Terbaru", icon: "sparkles" as const },
  { href: "/products?sort=best", label: "Terlaris", icon: "chart" as const },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState("all");
  const categories = useCatalog((state) => state.categories);
  const products = useCatalog((state) => state.products);
  const cartCount = useCart((state) => state.count());
  const setCartOpen = useCart((state) => state.setOpen);
  const wishCount = useWishlist((state) => state.ids.length);
  const user = useAuth((state) => state.user);
  const logout = useAuth((state) => state.logout);
  const unread = useNotifications((state) => state.unread());
  const [mounted, setMounted] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    setMegaOpen(false);
    setMobileOpen(false);
    setAccountOpen(false);
  }, [pathname]);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing = target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable;
      if (!typing && (event.key === "/" || (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)))) {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);

  const featured = products.filter((product) => product.isFeatured).slice(0, 3);

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const term = query.trim();
    if (scope !== "all" && !term) {
      router.push(`/category/${scope}`);
      return;
    }
    if (scope !== "all" && term) {
      const category = categories.find((item) => item.slug === scope);
      if (category) {
        router.push(`/category/${category.slug}?q=${encodeURIComponent(term)}`);
        return;
      }
    }
    if (term) router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-sand-200 bg-surface/98 backdrop-blur-xl">
        <div className="container-lume">
          <div className="flex h-16 items-center gap-3 sm:gap-5">
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Buka menu"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-ink-soft transition hover:bg-sand-100 lg:hidden"
            >
              <Icon name="menu" size={21} />
            </button>

            <Logo className="shrink-0" />

            <form onSubmit={submitSearch} className="hidden min-w-0 flex-1 lg:block">
              <div className="flex h-10 items-center overflow-hidden rounded-lg border-2 border-brand-600 bg-surface">
                <div className="relative h-full shrink-0">
                  <select
                    value={scope}
                    onChange={(event) => setScope(event.target.value)}
                    aria-label="Cari dalam kategori"
                    className="h-full max-w-[145px] cursor-pointer appearance-none border-r border-sand-200 bg-sand-50 py-0 pl-3 pr-7 text-[11px] font-semibold text-ink-soft outline-none"
                  >
                    <option value="all">Semua Kategori</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.slug}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <Icon name="chevron-down" size={12} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-ink-muted" />
                </div>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Cari produk, brand, atau kategori…"
                  aria-label="Kata kunci pencarian"
                  className="min-w-0 flex-1 bg-transparent px-3 text-[13px] text-ink outline-none placeholder:text-ink-muted"
                />
                <button type="submit" aria-label="Cari" className="grid h-full w-12 place-items-center bg-brand-600 text-white transition hover:bg-brand-700">
                  <Icon name="search" size={19} />
                </button>
              </div>
            </form>

            <div className="ml-auto flex items-center gap-0.5 sm:gap-1">
              <Link
                href="/account/notifications"
                aria-label="Notifikasi"
                className="relative hidden h-10 w-10 place-items-center rounded-lg text-ink-soft transition hover:bg-sand-100 hover:text-ink sm:grid"
              >
                <Icon name="bell" size={19} />
                {mounted && unread > 0 && (
                  <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-brand-600 px-1 text-[9px] font-bold text-white">
                    {unread}
                  </span>
                )}
              </Link>

              <Link
                href="/account/wishlist"
                aria-label="Wishlist"
                className="relative hidden h-10 w-10 place-items-center rounded-lg text-ink-soft transition hover:bg-sand-100 hover:text-ink sm:grid"
              >
                <Icon name="heart" size={19} />
                {mounted && wishCount > 0 && (
                  <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-brand-600 px-1 text-[9px] font-bold text-white">
                    {wishCount}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setCartOpen(true)}
                aria-label="Buka keranjang"
                className="relative grid h-10 w-10 place-items-center rounded-lg text-ink-soft transition hover:bg-sand-100 hover:text-ink"
              >
                <Icon name="bag" size={20} />
                {mounted && cartCount > 0 && (
                  <span className="absolute right-0 top-0 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-brand-600 px-1 text-[9px] font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </button>

              <div ref={accountRef} className="relative hidden sm:block">
                <button
                  onClick={() => setAccountOpen((value) => !value)}
                  aria-expanded={accountOpen}
                  aria-haspopup="menu"
                  className={cn(
                    "flex h-10 items-center gap-2 rounded-lg px-2 text-ink-soft transition hover:bg-sand-100 hover:text-ink",
                    accountOpen && "bg-sand-100 text-ink"
                  )}
                >
                  <Icon name="user" size={19} />
                  <span className="hidden max-w-28 truncate text-xs font-semibold xl:inline">
                    {user ? user.name.split(" ")[0] : "Masuk"}
                  </span>
                </button>
                {accountOpen && (
                  <>
                    <button className="fixed inset-0 z-10 cursor-default" onClick={() => setAccountOpen(false)} aria-label="Tutup menu akun" tabIndex={-1} />
                    <div
                      role="menu"
                      className="absolute right-0 top-12 z-20 w-64 overflow-hidden rounded-xl border border-sand-200 bg-surface p-2 shadow-lift animate-scale-in"
                    >
                      {user ? (
                        <>
                          <div className="border-b border-sand-200 px-3 pb-3 pt-2">
                            <p className="text-sm font-semibold text-ink">{user.name}</p>
                            <p className="truncate text-xs text-ink-muted">{user.email}</p>
                          </div>
                          <Link href="/account" onClick={() => setAccountOpen(false)} className="mt-1 flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-ink-soft hover:bg-canvas">
                            <Icon name="layout-grid" size={16} /> Ringkasan akun
                          </Link>
                          <Link href="/account/orders" onClick={() => setAccountOpen(false)} className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-ink-soft hover:bg-canvas">
                            <Icon name="package" size={16} /> Pesanan saya
                          </Link>
                          <Link href="/account/notifications" onClick={() => setAccountOpen(false)} className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-ink-soft hover:bg-canvas">
                            <Icon name="bell" size={16} /> Notifikasi
                          </Link>
                          <Link href="/account/wishlist" onClick={() => setAccountOpen(false)} className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-ink-soft hover:bg-canvas">
                            <Icon name="heart" size={16} /> Wishlist
                          </Link>
                          <div className="my-1 h-px bg-sand-200" />
                          <button
                            onClick={() => {
                              logout();
                              setAccountOpen(false);
                              router.push("/");
                            }}
                            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm text-ink-soft hover:bg-canvas"
                          >
                            <Icon name="logout" size={16} /> Keluar
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="px-3 pb-3 pt-2">
                            <p className="text-sm font-semibold text-ink">Selamat datang di tokobagus.com</p>
                            <p className="text-xs leading-relaxed text-ink-muted">Masuk untuk menyimpan alamat dan melacak pesanan.</p>
                          </div>
                          <Link href="/login" onClick={() => setAccountOpen(false)} className="flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-700">
                            Masuk <Icon name="arrow-right" size={15} />
                          </Link>
                          <Link href="/register" onClick={() => setAccountOpen(false)} className="mt-1.5 flex items-center justify-center rounded-lg border border-sand-300 px-4 py-2.5 text-sm font-bold text-ink hover:border-brand-500 hover:text-brand-600">
                            Daftar gratis
                          </Link>
                          <div className="my-2 h-px bg-sand-200" />
                          <Link href="/track-order" onClick={() => setAccountOpen(false)} className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-ink-soft hover:bg-canvas">
                            <Icon name="truck" size={16} /> Lacak pesanan
                          </Link>
                        </>
                      )}
                      <Link href="/admin" onClick={() => setAccountOpen(false)} className="mt-1 flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs text-ink-muted hover:bg-canvas">
                        <Icon name="settings" size={14} /> Admin panel (demo)
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <form onSubmit={submitSearch} className="pb-3 lg:hidden">
            <div className="flex h-10 items-center overflow-hidden rounded-lg border border-brand-500 bg-surface">
              <Icon name="search" size={17} className="ml-3 shrink-0 text-ink-muted" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cari di tokobagus.com…"
                aria-label="Kata kunci pencarian"
                className="min-w-0 flex-1 bg-transparent px-2.5 text-[13px] text-ink outline-none placeholder:text-ink-muted"
              />
              <button type="submit" aria-label="Cari" className="h-full bg-brand-600 px-4 text-xs font-bold text-white">
                Cari
              </button>
            </div>
          </form>
        </div>

        <div className="hidden border-t border-sand-200 lg:block">
          <div className="container-lume flex h-10 items-center gap-1">
            <div className="relative" onMouseLeave={() => setMegaOpen(false)}>
              <button
                onMouseEnter={() => setMegaOpen(true)}
                onClick={() => setMegaOpen((value) => !value)}
                aria-expanded={megaOpen}
                aria-haspopup="true"
                className="inline-flex h-10 items-center gap-2 border-r border-sand-200 pr-4 text-[12px] font-bold text-ink transition hover:text-brand-600"
              >
                <Icon name="menu" size={15} /> Semua Kategori
                <Icon name="chevron-down" size={12} className={cn("transition", megaOpen && "rotate-180")} />
              </button>
            </div>
            <nav aria-label="Navigasi kategori" className="flex items-center gap-0.5">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="rounded-md px-3 py-2 text-[12px] font-medium text-ink-soft transition hover:bg-brand-50 hover:text-brand-600"
                >
                  {category.name}
                </Link>
              ))}
            </nav>
            <div className="ml-auto flex items-center gap-3">
              {promos.map((promo) => (
                <Link
                  key={promo.href}
                  href={promo.href}
                  className={cn("flex items-center gap-1.5 text-[12px] font-semibold text-ink-soft transition hover:text-brand-600", promo.tone)}
                >
                  <Icon name={promo.icon} size={13} /> {promo.label}
                </Link>
              ))}
              <Link href="/track-order" className="flex items-center gap-1.5 border-l border-sand-200 pl-3 text-[11px] font-medium text-ink-muted transition hover:text-ink">
                <Icon name="truck" size={13} /> Lacak pesanan
              </Link>
            </div>
          </div>

          {megaOpen && (
            <div
              onMouseEnter={() => setMegaOpen(true)}
              className="absolute inset-x-0 top-full border-b border-sand-200 bg-surface shadow-soft animate-fade-in"
            >
              <div className="container-lume grid grid-cols-12 gap-8 py-7">
                <div className="col-span-5">
                  <p className="eyebrow mb-3">Kategori populer</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/category/${category.slug}`}
                        onClick={() => setMegaOpen(false)}
                        className="group flex items-center gap-3 rounded-lg p-2 transition hover:bg-brand-50"
                      >
                        <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-canvas">
                          <Image src={category.image} alt="" fill sizes="40px" className="object-cover" />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-[13px] font-bold text-ink group-hover:text-brand-600">{category.name}</span>
                          <span className="block truncate text-[10px] text-ink-muted">{category.tagline}</span>
                        </span>
                      </Link>
                    ))}
                  </div>
                  <Link href="/products" onClick={() => setMegaOpen(false)} className="mt-3 inline-flex items-center gap-1.5 px-2 text-xs font-bold text-brand-600 hover:underline">
                    Lihat semua produk <Icon name="arrow-right" size={14} />
                  </Link>
                </div>

                <div className="col-span-4 border-l border-sand-200 pl-8">
                  <p className="eyebrow mb-3">Lagi populer</p>
                  <div className="grid grid-cols-3 gap-3">
                    {featured.map((product) => (
                      <Link key={product.id} href={`/products/${product.slug}`} onClick={() => setMegaOpen(false)} className="group">
                        <div className="relative aspect-square overflow-hidden rounded-lg bg-canvas">
                          <Image src={product.images[0].url} alt={product.name} fill sizes="120px" className="object-cover transition duration-500 group-hover:scale-105" />
                        </div>
                        <p className="mt-1.5 line-clamp-1 text-[11px] font-semibold text-ink">{product.name}</p>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="col-span-3">
                  <Link href="/flash-sale" onClick={() => setMegaOpen(false)} className="flex h-full min-h-[150px] flex-col justify-between overflow-hidden rounded-xl bg-brand-600 p-5 text-white">
                    <div>
                      <span className="inline-flex items-center gap-1 rounded-md bg-white/15 px-2 py-1 text-[9px] font-bold uppercase tracking-wider">
                        <Icon name="bolt" size={11} /> Flash sale
                      </span>
                      <p className="mt-2 text-xl font-extrabold leading-tight">Harga spesial, waktu terbatas.</p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-bold">
                      Belanja sekarang <Icon name="arrow-right" size={14} />
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

      <Drawer open={mobileOpen} onClose={() => setMobileOpen(false)} title="Menu" side="left" width="max-w-[320px]">
        <div className="flex h-full flex-col px-4 py-4">
          {user ? (
            <Link href="/account" onClick={() => setMobileOpen(false)} className="mb-4 flex items-center gap-3 rounded-xl bg-canvas p-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-600 font-bold text-white">{user.name.slice(0, 1)}</span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold text-ink">{user.name}</span>
                <span className="block truncate text-[11px] text-ink-muted">{user.email}</span>
              </span>
            </Link>
          ) : (
            <div className="mb-4 rounded-xl border border-sand-200 p-3">
              <p className="text-sm font-bold text-ink">Masuk atau daftar</p>
              <p className="mt-0.5 text-[11px] text-ink-muted">Nikmati voucher dan lacak pesanan.</p>
              <div className="mt-3 flex gap-2">
                <Link href="/login" onClick={() => setMobileOpen(false)} className="flex-1 rounded-lg bg-brand-600 py-2 text-center text-xs font-bold text-white">
                  Masuk
                </Link>
                <Link href="/register" onClick={() => setMobileOpen(false)} className="flex-1 rounded-lg border border-sand-300 py-2 text-center text-xs font-bold text-ink">
                  Daftar
                </Link>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            {promos.map((promo) => (
              <Link
                key={promo.href}
                href={promo.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 rounded-lg border border-sand-200 px-3 py-2.5 text-xs font-bold text-ink"
              >
                <Icon name={promo.icon} size={15} className={promo.href === "/flash-sale" ? "text-brand-600" : "text-ink-muted"} />
                {promo.label}
              </Link>
            ))}
          </div>

          <div className="my-4 h-px bg-sand-200" />
          <p className="eyebrow mb-2 px-1">Kategori</p>
          <div className="space-y-0.5">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-lg px-2 py-2.5 text-sm font-medium text-ink-soft hover:bg-canvas"
              >
                <span className="relative h-8 w-8 overflow-hidden rounded-md bg-canvas">
                  <Image src={category.image} alt="" fill sizes="32px" className="object-cover" />
                </span>
                {category.name}
                <Icon name="chevron-right" size={14} className="ml-auto text-ink-muted" />
              </Link>
            ))}
          </div>

          <div className="mt-4 space-y-0.5 border-t border-sand-200 pt-3">
            <Link href="/products" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5 rounded-lg px-2 py-2.5 text-sm text-ink-soft hover:bg-canvas">
              <Icon name="bag" size={17} /> Semua produk
            </Link>
            <Link href="/account/wishlist" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5 rounded-lg px-2 py-2.5 text-sm text-ink-soft hover:bg-canvas">
              <Icon name="heart" size={17} /> Wishlist {mounted && wishCount > 0 ? `(${wishCount})` : ""}
            </Link>
            <Link href="/track-order" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5 rounded-lg px-2 py-2.5 text-sm text-ink-soft hover:bg-canvas">
              <Icon name="truck" size={17} /> Lacak pesanan
            </Link>
            <Link href="/faq" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5 rounded-lg px-2 py-2.5 text-sm text-ink-soft hover:bg-canvas">
              <Icon name="headset" size={17} /> Bantuan
            </Link>
          </div>
        </div>
      </Drawer>
    </>
  );
}
