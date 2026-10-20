"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { useCatalog } from "@/store/catalog";
import { useCart, useClaimedVouchers } from "@/store/commerce";
import { useHydrated } from "@/components/ui/hooks";
import { useToast } from "@/components/ui/toast";
import { Icon, type IconName } from "@/components/ui/icon";
import { formatIDR } from "@/lib/utils";
import { cn } from "@/lib/cn";

const hiddenRoutes = ["/cart", "/checkout", "/track-order", "/compare"];

const quickLinks: { href: string; label: string; icon: IconName }[] = [
  { href: "/track-order", label: "Lacak pesanan", icon: "truck" },
  { href: "/faq", label: "Pusat bantuan", icon: "headset" },
  { href: "/shipping-policy", label: "Info pengiriman", icon: "package" },
  { href: "/return-policy", label: "Pengembalian", icon: "refresh" },
];

function Panel({
  title,
  icon,
  href,
  action,
  children,
}: {
  title: string;
  icon?: IconName;
  href?: string;
  action?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-sand-200 bg-white">
      <div className="flex items-center justify-between gap-2 border-b border-sand-200 px-3.5 py-2.5">
        <p className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.1em] text-ink">
          {icon && <Icon name={icon} size={13} className="text-brand-600" />}
          {title}
        </p>
        {href && action && (
          <Link href={href} className="shrink-0 text-[10px] font-bold text-brand-600 hover:underline">
            {action}
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

function LeftSidebar() {
  const categories = useCatalog((state) => state.categories);
  const products = useCatalog((state) => state.products);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    products.forEach((product) => {
      map.set(product.categoryId, (map.get(product.categoryId) ?? 0) + 1);
    });
    return map;
  }, [products]);

  return (
    <aside className="hidden xl:col-start-1 xl:row-start-1 xl:block" aria-label="Navigasi toko">
      <div className="no-scrollbar sticky top-[120px] max-h-[calc(100vh-140px)] space-y-3 overflow-y-auto overscroll-contain pb-6">
        <Panel title="Kategori" icon="layout-grid" href="/products" action="Semua">
          <nav className="p-1.5">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="group flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition hover:bg-brand-50"
              >
                <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-md bg-canvas">
                  <Image src={category.image} alt="" fill sizes="32px" className="object-cover" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[12px] font-semibold text-ink-soft transition group-hover:text-brand-600">
                    {category.name}
                  </span>
                  <span className="block text-[9px] text-ink-muted">{counts.get(category.id) ?? 0} produk</span>
                </span>
                <Icon
                  name="chevron-right"
                  size={13}
                  className="shrink-0 text-sand-400 transition group-hover:translate-x-0.5 group-hover:text-brand-600"
                />
              </Link>
            ))}
          </nav>
        </Panel>

        <Link
          href="/flash-sale"
          className="group relative block overflow-hidden rounded-xl bg-gradient-to-br from-brand-600 to-accent-500 p-4 text-white"
        >
          <span className="inline-flex items-center gap-1 rounded-md bg-white/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">
            <Icon name="bolt" size={10} /> Flash sale
          </span>
          <p className="mt-2 text-[15px] font-extrabold leading-tight">Harga spesial, hanya hari ini.</p>
          <p className="mt-1 text-[10px] text-white/80">Diskon hingga 40% untuk pilihan terbatas.</p>
          <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold">
            Belanja sekarang <Icon name="arrow-right" size={12} className="transition group-hover:translate-x-0.5" />
          </span>
          <Icon name="bolt" size={64} className="absolute -bottom-3 -right-3 text-white/10" />
        </Link>

        <Panel title="Bantuan cepat" icon="headset">
          <div className="space-y-0.5 p-1.5">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 rounded-lg px-2 py-2 text-[11px] font-medium text-ink-soft transition hover:bg-sand-50 hover:text-brand-600"
              >
                <Icon name={link.icon} size={14} className="text-ink-muted" />
                {link.label}
                <Icon name="chevron-right" size={12} className="ml-auto text-sand-400" />
              </Link>
            ))}
          </div>
        </Panel>

        <div className="rounded-xl border border-sand-200 bg-ink p-4 text-white">
          <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white/70">
            <Icon name="calendar" size={12} /> Layanan pelanggan
          </p>
          <p className="mt-1.5 text-[13px] font-extrabold">Setiap hari, 09.00–21.00</p>
          <p className="mt-1 text-[10px] leading-relaxed text-white/65">
            Tim tokobagus.com siap membantu pertanyaan produk, pembayaran, dan pengiriman.
          </p>
          <Link
            href="/contact"
            className="mt-3 inline-flex items-center gap-1 rounded-md bg-white/10 px-2.5 py-1.5 text-[10px] font-bold text-white transition hover:bg-white/20"
          >
            Hubungi kami <Icon name="arrow-right" size={11} />
          </Link>
        </div>
      </div>
    </aside>
  );
}

function RightSidebar() {
  const hydrated = useHydrated();
  const { toast } = useToast();
  const items = useCart((state) => state.items);
  const setCartOpen = useCart((state) => state.setOpen);
  const setCoupon = useCart((state) => state.setCoupon);
  const claimed = useClaimedVouchers((state) => state.codes);
  const claim = useClaimedVouchers((state) => state.claim);
  const products = useCatalog((state) => state.products);
  const coupons = useCatalog((state) => state.coupons);

  const cartItems = hydrated ? items : [];
  const count = cartItems.reduce((total, item) => total + item.qty, 0);
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.qty, 0);

  const trending = useMemo(
    () =>
      products
        .filter((product) => product.status === "active")
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 3),
    [products]
  );

  const vouchers = useMemo(() => coupons.filter((coupon) => coupon.isActive).slice(0, 2), [coupons]);

  return (
    <aside className="hidden xl:col-start-3 xl:row-start-1 xl:block" aria-label="Ringkasan belanja">
      <div className="no-scrollbar sticky top-[120px] max-h-[calc(100vh-140px)] space-y-3 overflow-y-auto overscroll-contain pb-6">
        <Panel title="Keranjang" icon="bag" href="/cart" action="Lihat">
          <div className="p-3">
            {!hydrated ? (
              <div className="space-y-2">
                <div className="skeleton h-9 rounded-lg" />
                <div className="skeleton h-9 rounded-lg" />
              </div>
            ) : cartItems.length === 0 ? (
              <div className="py-3 text-center">
                <span className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-sand-100 text-ink-muted">
                  <Icon name="bag" size={18} />
                </span>
                <p className="mt-2 text-[11px] font-semibold text-ink">Keranjang masih kosong</p>
                <p className="mt-0.5 text-[10px] leading-relaxed text-ink-muted">Temukan produk pilihan dan mulai belanja.</p>
                <Link
                  href="/products"
                  className="mt-2.5 inline-flex items-center gap-1 rounded-md bg-brand-600 px-3 py-1.5 text-[10px] font-bold text-white transition hover:bg-brand-700"
                >
                  Mulai belanja <Icon name="arrow-right" size={11} />
                </Link>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  {cartItems.slice(0, 3).map((item) => (
                    <div key={`${item.productId}-${item.variantId ?? ""}`} className="flex items-center gap-2">
                      <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md border border-sand-200 bg-canvas">
                        <Image src={item.image} alt="" fill sizes="36px" className="object-cover" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[11px] font-semibold text-ink">{item.name}</span>
                        <span className="block text-[9px] text-ink-muted">
                          {item.qty} × {formatIDR(item.price)}
                        </span>
                      </span>
                    </div>
                  ))}
                  {cartItems.length > 3 && (
                    <p className="text-[9px] text-ink-muted">+{cartItems.length - 3} produk lainnya</p>
                  )}
                </div>
                <div className="mt-2.5 flex items-center justify-between border-t border-sand-200 pt-2.5">
                  <span className="text-[10px] font-semibold text-ink-muted">Subtotal ({count})</span>
                  <span className="text-[13px] font-extrabold text-brand-600">{formatIDR(subtotal)}</span>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => setCartOpen(true)}
                    className="rounded-md border border-sand-300 py-1.5 text-[10px] font-bold text-ink transition hover:border-brand-500 hover:text-brand-600"
                  >
                    Detail
                  </button>
                  <Link
                    href="/checkout"
                    className="rounded-md bg-brand-600 py-1.5 text-center text-[10px] font-bold text-white transition hover:bg-brand-700"
                  >
                    Checkout
                  </Link>
                </div>
              </>
            )}
          </div>
        </Panel>

        {vouchers.length > 0 && (
          <Panel title="Voucher" icon="ticket" href="/vouchers" action="Semua">
            <div className="space-y-1.5 p-3">
              {vouchers.map((coupon) => {
                const isClaimed = claimed.includes(coupon.code);
                return (
                  <div key={coupon.id} className="rounded-lg border border-dashed border-brand-200 bg-brand-50/60 p-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[12px] font-extrabold text-brand-700">
                        {coupon.type === "percent"
                          ? `${coupon.value}%`
                          : coupon.type === "freeship"
                            ? "Gratis ongkir"
                            : formatIDR(coupon.value)}
                      </span>
                      <button
                        onClick={async () => {
                          claim(coupon.code);
                          setCoupon(coupon.code);
                          try {
                            await navigator.clipboard.writeText(coupon.code);
                          } catch {}
                          toast({
                            title: `Voucher ${coupon.code} siap dipakai`,
                            description: coupon.description,
                            tone: "success",
                          });
                        }}
                        className={cn(
                          "rounded px-2 py-1 text-[9px] font-bold transition",
                          isClaimed ? "bg-white text-brand-700 ring-1 ring-brand-200" : "bg-brand-600 text-white hover:bg-brand-700"
                        )}
                      >
                        {isClaimed ? "Dipakai" : "Klaim"}
                      </button>
                    </div>
                    <p className="mt-1 truncate text-[9px] text-ink-muted">{coupon.description}</p>
                    <p className="mt-0.5 text-[9px] text-ink-muted">Min. {formatIDR(coupon.minPurchase)}</p>
                  </div>
                );
              })}
            </div>
          </Panel>
        )}

        <Panel title="Paling dicari" icon="chart" href="/products?sort=best" action="Semua">
          <div className="space-y-0.5 p-1.5">
            {trending.map((product, index) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group flex items-center gap-2 rounded-lg p-1.5 transition hover:bg-sand-50"
              >
                <span className="w-3 shrink-0 text-center text-[11px] font-extrabold text-sand-400">{index + 1}</span>
                <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border border-sand-200 bg-canvas">
                  <Image src={product.images[0].url} alt="" fill sizes="40px" className="object-cover" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[11px] font-semibold text-ink group-hover:text-brand-600">
                    {product.name}
                  </span>
                  <span className="block text-[10px] font-bold text-brand-600">{formatIDR(product.basePrice)}</span>
                </span>
              </Link>
            ))}
          </div>
        </Panel>

        <div className="rounded-xl border border-sand-200 bg-white p-3.5">
          <p className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.1em] text-ink">
            <Icon name="headset" size={13} className="text-brand-600" /> Butuh bantuan?
          </p>
          <p className="mt-1.5 text-[10px] leading-relaxed text-ink-muted">
            Chat tim kami setiap hari pukul 09.00–21.00 WIB.
          </p>
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noreferrer"
            className="mt-2 flex items-center justify-center gap-1.5 rounded-md bg-olive-600 py-1.5 text-[10px] font-bold text-white transition hover:bg-olive-700"
          >
            <Icon name="whatsapp" size={12} /> WhatsApp
          </a>
          <Link
            href="/faq"
            className="mt-1.5 flex items-center justify-center gap-1 text-[10px] font-semibold text-ink-muted transition hover:text-brand-600"
          >
            Lihat FAQ <Icon name="arrow-right" size={10} />
          </Link>
        </div>
      </div>
    </aside>
  );
}

export function StoreSidebarFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hide = hiddenRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

  if (hide) return <>{children}</>;

  return (
    <div className="mx-auto w-full max-w-[1920px] xl:grid xl:grid-cols-[168px_minmax(0,1fr)_184px] xl:items-start xl:gap-3 xl:px-4 2xl:grid-cols-[184px_minmax(0,1fr)_200px] 2xl:gap-4 2xl:px-5 3xl:grid-cols-[200px_minmax(0,1fr)_220px]">
      <LeftSidebar />
      <div className="min-w-0 xl:col-start-2 xl:row-start-1">{children}</div>
      <RightSidebar />
    </div>
  );
}
