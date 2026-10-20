"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Product } from "@/types";
import { recommendProducts } from "@/lib/utils";
import { useCatalog } from "@/store/catalog";
import { useRecentlyViewed, useWishlist } from "@/store/commerce";
import { ProductCard } from "@/components/product/product-card";
import { QuickView } from "@/components/product/quick-view";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

const tabs = [
  { id: "for-you", label: "Untuk Kamu" },
  { id: "best", label: "Terlaris" },
  { id: "new", label: "Terbaru" },
  { id: "sale", label: "Diskon" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function ProductFeed() {
  const products = useCatalog((state) => state.products);
  const recent = useRecentlyViewed((state) => state.ids);
  const wishlist = useWishlist((state) => state.ids);
  const [tab, setTab] = useState<TabId>("for-you");
  const [quickView, setQuickView] = useState<Product | null>(null);

  const feed = useMemo(() => {
    const active = products.filter((product) => product.status === "active");
    if (tab === "best") return [...active].sort((a, b) => b.sold - a.sold).slice(0, 10);
    if (tab === "new") return [...active].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 10);
    if (tab === "sale") {
      return active
        .filter((product) => product.comparePrice && product.comparePrice > product.basePrice)
        .sort((a, b) => (b.comparePrice ?? 0) / b.basePrice - (a.comparePrice ?? 0) / a.basePrice)
        .slice(0, 10);
    }
    const personalized = recommendProducts(active, [...recent, ...wishlist], 10);
    return personalized.length > 0 ? personalized : [...active].sort((a, b) => b.rating - a.rating).slice(0, 10);
  }, [products, tab, recent, wishlist]);

  return (
    <section className="rounded-xl border border-sand-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sand-200 px-4 py-3.5 sm:px-5">
        <div className="flex items-center gap-1 overflow-x-auto">
          {tabs.map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={cn(
                "shrink-0 rounded-lg px-3 py-2 text-[12px] font-bold transition",
                tab === item.id ? "bg-brand-50 text-brand-600" : "text-ink-soft hover:bg-sand-100"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
        <Link href="/products" className="flex items-center gap-1 text-[11px] font-bold text-brand-600 hover:underline">
          Semua produk <Icon name="arrow-right" size={13} />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 p-3 sm:grid-cols-3 sm:p-4 lg:grid-cols-4 3xl:grid-cols-6">
        {feed.map((product) => (
          <ProductCard key={product.id} product={product} onQuickView={setQuickView} />
        ))}
      </div>

      <div className="border-t border-sand-200 p-3 text-center">
        <Link href="/products" className="inline-flex items-center gap-1.5 rounded-lg border border-sand-300 px-5 py-2 text-[12px] font-bold text-ink transition hover:border-brand-500 hover:text-brand-600">
          Muat lebih banyak <Icon name="chevron-down" size={14} />
        </Link>
      </div>

      <QuickView product={quickView} open={Boolean(quickView)} onClose={() => setQuickView(null)} />
    </section>
  );
}
