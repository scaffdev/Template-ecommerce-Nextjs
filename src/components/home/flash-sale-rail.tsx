"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { totalStock } from "@/lib/data";
import { discountPercent, formatIDR, soldPercent } from "@/lib/utils";
import { useCatalog } from "@/store/catalog";
import { useCart } from "@/store/commerce";
import { useToast } from "@/components/ui/toast";
import { Icon } from "@/components/ui/icon";
import { buttonStyles } from "@/components/ui/button-styles";
import { useCountdown, useHydrated } from "@/components/ui/hooks";

function endOfDay() {
  const date = new Date();
  date.setHours(23, 59, 59, 999);
  return date.toISOString();
}

export function FlashSaleRail() {
  const products = useCatalog((state) => state.products);
  const addItem = useCart((state) => state.addItem);
  const { toast } = useToast();
  const hydrated = useHydrated();
  const [target] = useState(endOfDay);
  const countdown = useCountdown(hydrated ? target : null);

  const saleProducts = useMemo(
    () =>
      products
        .filter((product) => product.status === "active" && product.comparePrice && product.comparePrice > product.basePrice)
        .sort((a, b) => discountPercent(b.basePrice, b.comparePrice) - discountPercent(a.basePrice, a.comparePrice))
        .slice(0, 10),
    [products]
  );

  if (saleProducts.length === 0) return null;

  const units = [
    { label: "Jam", value: countdown.days * 24 + countdown.hours },
    { label: "Menit", value: countdown.minutes },
    { label: "Detik", value: countdown.seconds },
  ];

  return (
    <section className="overflow-hidden rounded-xl border border-brand-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-brand-600 to-accent-500 px-4 py-3.5 sm:px-5">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/20 text-white">
            <Icon name="bolt" size={18} />
          </span>
          <div>
            <h2 className="text-base font-extrabold text-white sm:text-lg">Flash Sale</h2>
            <p className="text-[10px] font-medium text-white/80">Harga spesial, hanya hari ini</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden text-[11px] font-semibold text-white/90 sm:block">Berakhir dalam</span>
          <div className="flex items-center gap-1">
            {units.map((unit) => (
              <span key={unit.label} className="flex items-baseline gap-0.5">
                <span className="grid h-7 min-w-7 place-items-center rounded bg-ink px-1 text-[13px] font-extrabold tabular-nums text-white">
                  {hydrated ? String(unit.value).padStart(2, "0") : "--"}
                </span>
                {unit.label !== "Detik" && <span className="text-xs font-bold text-white">:</span>}
              </span>
            ))}
          </div>
          <Link href="/flash-sale" className="ml-1 rounded-lg bg-white/15 px-3 py-2 text-[11px] font-bold text-white transition hover:bg-white/25">
            Lihat semua
          </Link>
        </div>
      </div>

      <div className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto p-3 sm:p-4">
        {saleProducts.map((product) => {
          const discount = discountPercent(product.basePrice, product.comparePrice);
          const stock = totalStock(product);
          const percent = soldPercent(product);
          const variant = product.variants.find((item) => item.stock > 0);
          return (
            <article key={product.id} className="w-[42%] shrink-0 snap-start overflow-hidden rounded-lg border border-sand-200 sm:w-[28%] lg:w-[15.5%]">
              <Link href={`/products/${product.slug}`} className="group relative block aspect-square overflow-hidden bg-sand-50">
                <Image src={product.images[0].url} alt={product.name} fill sizes="200px" className="object-cover transition duration-500 group-hover:scale-105" />
                <span className="absolute left-1.5 top-1.5 rounded bg-brand-600 px-1.5 py-0.5 text-[10px] font-extrabold text-white">-{discount}%</span>
                <span className="absolute bottom-1.5 right-1.5 grid h-7 w-7 place-items-center rounded-md bg-white text-brand-600 shadow-soft">
                  <Icon name="bolt" size={14} />
                </span>
              </Link>
              <div className="p-2.5">
                <p className="line-clamp-1 text-[12px] font-semibold text-ink">{product.name}</p>
                <p className="mt-1 text-[13px] font-extrabold text-brand-600">{formatIDR(product.basePrice)}</p>
                <div className="relative mt-2 h-3.5 overflow-hidden rounded-full bg-brand-100">
                  <div className="h-full rounded-full bg-gradient-to-r from-accent-400 to-brand-500" style={{ width: `${percent}%` }} />
                  <span className="absolute inset-0 grid place-items-center text-[8px] font-bold text-white">
                    {percent}% terjual · sisa {stock}
                  </span>
                </div>
                <button
                  disabled={stock === 0 || !variant}
                  onClick={() => {
                    if (!variant) return;
                    addItem({
                      productId: product.id,
                      variantId: variant.id,
                      slug: product.slug,
                      name: product.name,
                      variantName: variant.name,
                      image: variant.imageUrl ?? product.images[0].url,
                      price: variant.price,
                      qty: 1,
                      stock: variant.stock,
                    });
                    toast({ title: "Ditambahkan ke keranjang", description: product.name, tone: "success" });
                  }}
                  className="mt-2 w-full rounded-md bg-brand-600 py-1.5 text-[11px] font-bold text-white transition hover:bg-brand-700 disabled:opacity-40"
                >
                  {stock > 0 ? "Ambil harga sale" : "Stok habis"}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <div className="border-t border-sand-200 px-4 py-3 text-center sm:hidden">
        <Link href="/flash-sale" className={buttonStyles({ variant: "outline", size: "sm", className: "w-full" })}>
          Lihat semua flash sale <Icon name="arrow-right" size={14} />
        </Link>
      </div>
    </section>
  );
}
