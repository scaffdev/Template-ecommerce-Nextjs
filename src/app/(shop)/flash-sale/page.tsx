"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Product } from "@/types";
import { useCatalog } from "@/store/catalog";
import { discountPercent, formatNumber } from "@/lib/utils";
import { useCountdown, useHydrated } from "@/components/ui/hooks";
import { ProductCard } from "@/components/product/product-card";
import { QuickView } from "@/components/product/quick-view";
import { buttonStyles } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/icon";

function endOfDay() {
  const date = new Date();
  date.setHours(23, 59, 59, 999);
  return date.toISOString();
}

export default function FlashSalePage() {
  const products = useCatalog((state) => state.products);
  const [quickView, setQuickView] = useState<Product | null>(null);
  const hydrated = useHydrated();
  const [target] = useState(endOfDay);
  const countdown = useCountdown(hydrated ? target : null);

  const saleProducts = useMemo(
    () =>
      products
        .filter((product) => product.status === "active" && product.comparePrice && product.comparePrice > product.basePrice)
        .sort((a, b) => discountPercent(b.basePrice, b.comparePrice) - discountPercent(a.basePrice, a.comparePrice)),
    [products]
  );

  const maxDiscount = saleProducts[0] ? discountPercent(saleProducts[0].basePrice, saleProducts[0].comparePrice) : 0;
  const totalSold = saleProducts.reduce((sum, product) => sum + product.sold, 0);
  const units = [
    { label: "Hari", value: countdown.days },
    { label: "Jam", value: countdown.hours },
    { label: "Menit", value: countdown.minutes },
    { label: "Detik", value: countdown.seconds },
  ];

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-accent-500 text-white">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/10" />
        <div className="absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-white/10" />
        <div className="container-lume relative py-7 sm:py-10">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] text-white/70">
            <Link href="/" className="hover:text-white">
              Beranda
            </Link>
            <Icon name="chevron-right" size={11} />
            <span className="text-white">Flash Sale</span>
          </nav>

          <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide backdrop-blur">
                <Icon name="bolt" size={12} /> Diskon kilat hari ini
              </span>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Flash Sale</h1>
              <p className="mt-2 max-w-lg text-[12px] leading-relaxed text-white/80 sm:text-sm">
                Harga terbaik untuk produk pilihan. Stok terbatas dan promo berakhir dalam hitungan jam.
              </p>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-white/80">
                <span className="inline-flex items-center gap-1.5"><Icon name="bolt" size={13} /> Diskon hingga {maxDiscount}%</span>
                <span className="inline-flex items-center gap-1.5"><Icon name="tag" size={13} /> {saleProducts.length} produk pilihan</span>
                <span className="inline-flex items-center gap-1.5"><Icon name="users" size={13} /> {formatNumber(totalSold)} terjual</span>
              </div>
            </div>

            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-white/70">Berakhir dalam</p>
              <div className="flex items-center gap-1.5">
                {units.map((unit) => (
                  <div key={unit.label} className="text-center">
                    <span className="grid h-12 min-w-12 place-items-center rounded-lg bg-white px-2 text-xl font-extrabold tabular-nums text-brand-600 sm:h-14 sm:min-w-14 sm:text-2xl">
                      {hydrated ? String(unit.value).padStart(2, "0") : "--"}
                    </span>
                    <span className="mt-1 block text-[9px] font-semibold text-white/70">{unit.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container-lume space-y-4 py-5">
        <div className="grid gap-2.5 sm:grid-cols-3">
          {[
            { icon: "ticket" as const, title: "Voucher tambahan", text: "Klaim voucher untuk potongan ekstra." },
            { icon: "truck" as const, title: "Gratis ongkir", text: "Belanja min. Rp750rb ke seluruh Indonesia." },
            { icon: "refresh" as const, title: "Retur 30 hari", text: "Belanja tenang dengan pengembalian mudah." },
          ].map((item) => (
            <div key={item.title} className="flex items-center gap-2.5 rounded-lg border border-sand-200 bg-white p-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-brand-50 text-brand-600">
                <Icon name={item.icon} size={16} />
              </span>
              <div>
                <p className="text-[11px] font-bold text-ink">{item.title}</p>
                <p className="text-[10px] text-ink-muted">{item.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-sand-200 bg-white px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-brand-50 text-brand-600">
              <Icon name="bolt" size={15} />
            </span>
            <p className="text-sm font-extrabold text-ink">Semua produk flash sale</p>
            <span className="rounded bg-brand-50 px-1.5 py-0.5 text-[10px] font-bold text-brand-600">{saleProducts.length}</span>
          </div>
          <Link href="/vouchers" className="text-[11px] font-bold text-brand-600 hover:underline">
            Klaim voucher dulu
          </Link>
        </div>

        {saleProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 3xl:grid-cols-5">
            {saleProducts.map((product) => (
              <ProductCard key={product.id} product={product} onQuickView={setQuickView} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-sand-200 bg-white py-16 text-center">
            <Icon name="bolt" size={28} className="mx-auto text-sand-300" />
            <p className="mt-3 text-sm font-bold text-ink">Belum ada flash sale hari ini</p>
            <p className="mt-1 text-xs text-ink-muted">Cek lagi nanti atau lihat produk terlaris kami.</p>
            <Link href="/products" className={buttonStyles({ className: "mt-4", size: "sm" })}>
              Lihat semua produk <Icon name="arrow-right" size={14} />
            </Link>
          </div>
        )}
      </div>

      <QuickView product={quickView} open={Boolean(quickView)} onClose={() => setQuickView(null)} />
    </>
  );
}
