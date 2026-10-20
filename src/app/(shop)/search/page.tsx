"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import type { Product } from "@/types";
import { useCatalog } from "@/store/catalog";
import { CatalogBrowser } from "@/components/product/catalog-browser";
import { ProductCard } from "@/components/product/product-card";
import { QuickView } from "@/components/product/quick-view";
import { SectionHeading, Skeleton } from "@/components/ui/primitives";
import { buttonStyles } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/icon";

const popular = ["Linen", "Headphones", "Candle", "Sneakers", "Serum", "Tote bag", "Jam tangan"];

function SearchFallback() {
  return (
    <div className="container-lume grid grid-cols-2 gap-5 py-16 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index}>
          <Skeleton className="aspect-[4/5] w-full rounded-xl" />
          <Skeleton className="mt-3 h-3 w-1/3" />
          <Skeleton className="mt-2 h-4 w-4/5" />
        </div>
      ))}
    </div>
  );
}

function SearchView() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const products = useCatalog((state) => state.products);
  const categories = useCatalog((state) => state.categories);
  const [quickView, setQuickView] = useState<Product | null>(null);
  const query = searchParams.get("q")?.trim() ?? "";

  if (query) {
    return (
      <CatalogBrowser
        key={query}
        eyebrow="Pencarian"
        title={`Hasil untuk “${query}”`}
        description="Kami menampilkan produk yang paling relevan dengan kata kunci Anda."
        initialQuery={query}
      />
    );
  }

  const trending = products.filter((product) => product.isBestSeller || product.isFeatured).slice(0, 8);

  return (
    <>
      <section className="border-b border-sand-200 bg-white">
        <div className="container-lume py-7 sm:py-9">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-600">Pencarian</p>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">Mau mencari apa hari ini?</h1>
          <p className="mt-2 max-w-xl text-[12px] leading-relaxed text-ink-muted">
            Ketik kata kunci — nama produk, bahan, atau kategori. Tekan <kbd className="rounded border border-sand-300 bg-surface px-1.5 py-0.5 text-[10px]">/</kbd> di
            halaman mana pun untuk membuka pencarian cepat.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {popular.map((term) => (
              <button
                key={term}
                onClick={() => router.push(`/search?q=${encodeURIComponent(term)}`)}
                className="rounded-md border border-sand-300 bg-white px-3 py-1.5 text-[11px] font-semibold text-ink-soft transition hover:border-brand-400 hover:bg-brand-50 hover:text-brand-600"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="container-lume py-6">
        <SectionHeading
          eyebrow="Telusuri kategori"
          title="Mulai dari bagian rumah atau lemari Anda."
          action={
            <Link href="/products" className={buttonStyles({ variant: "outline" })}>
              Semua produk <Icon name="arrow-right" size={15} />
            </Link>
          }
        />
        <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="group rounded-lg border border-sand-200 bg-white p-4 transition hover:border-brand-400 hover:shadow-soft"
            >
              <p className="text-[13px] font-bold text-ink group-hover:text-brand-600">{category.name}</p>
              <p className="mt-1 text-[11px] text-ink-muted">{category.tagline}</p>
              <Icon name="arrow-up-right" size={14} className="mt-3 text-ink-muted transition group-hover:text-brand-600" />
            </Link>
          ))}
        </div>
      </section>

      <section className="container-lume pb-8">
        <SectionHeading eyebrow="Sering dilihat" title="Yang sedang banyak dicari orang." />
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {trending.map((product) => (
            <ProductCard key={product.id} product={product} onQuickView={setQuickView} />
          ))}
        </div>
      </section>

      <QuickView product={quickView} open={Boolean(quickView)} onClose={() => setQuickView(null)} />
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchFallback />}>
      <SearchView />
    </Suspense>
  );
}
