"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import type { Product } from "@/types";
import { totalStock } from "@/lib/data";
import { discountPercent, formatIDR, formatNumber } from "@/lib/utils";
import { MAX_COMPARE, useCart, useCompare } from "@/store/commerce";
import { useCatalog } from "@/store/catalog";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/primitives";
import { buttonStyles } from "@/components/ui/button-styles";
import { Icon, StarRow } from "@/components/ui/icon";

function CompareRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[120px_repeat(var(--compare-cols),minmax(180px,1fr))] border-t border-sand-200 sm:grid-cols-[160px_repeat(var(--compare-cols),minmax(200px,1fr))]">
      <div className="bg-sand-50 px-3 py-3 text-[10px] font-bold uppercase tracking-wide text-ink-muted sm:text-[11px]">{label}</div>
      {children}
    </div>
  );
}

function CompareCell({ children }: { children: React.ReactNode }) {
  return <div className="border-l border-sand-200 px-3 py-3 text-[11px] leading-relaxed text-ink-soft sm:text-[12px]">{children}</div>;
}

export default function ComparePage() {
  const products = useCatalog((state) => state.products);
  const categories = useCatalog((state) => state.categories);
  const ids = useCompare((state) => state.ids);
  const remove = useCompare((state) => state.remove);
  const clear = useCompare((state) => state.clear);
  const toggleCompare = useCompare((state) => state.toggle);
  const addItem = useCart((state) => state.addItem);
  const { toast } = useToast();

  const selected = useMemo(
    () =>
      ids
        .map((id) => products.find((product) => product.id === id))
        .filter((product): product is Product => Boolean(product)),
    [ids, products]
  );

  const suggestions = useMemo(
    () => products.filter((product) => product.status === "active" && !ids.includes(product.id)).sort((a, b) => b.rating - a.rating).slice(0, 4),
    [products, ids]
  );

  const quickAdd = (product: Product) => {
    const variant = product.variants.find((item) => item.stock > 0);
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
  };

  return (
    <div className="container-lume py-5 sm:py-7">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] text-ink-muted">
        <Link href="/" className="hover:text-brand-600">
          Beranda
        </Link>
        <Icon name="chevron-right" size={11} />
        <span className="text-ink">Bandingkan produk</span>
      </nav>

      <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">Bandingkan produk</h1>
          <p className="mt-1 text-[12px] text-ink-muted">Bandingkan hingga {MAX_COMPARE} produk berdasarkan harga, rating, spesifikasi, dan ketersediaan.</p>
        </div>
        <div className="flex gap-2">
          {selected.length > 0 && (
            <Button size="sm" variant="outline" onClick={clear}>
              <Icon name="trash" size={14} /> Hapus semua
            </Button>
          )}
          <Link href="/products" className={buttonStyles({ size: "sm" })}>
            <Icon name="plus" size={14} /> Tambah produk
          </Link>
        </div>
      </div>

      {selected.length === 0 ? (
        <div className="mt-5 rounded-xl border border-sand-200 bg-white py-12 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand-50 text-brand-600">
            <Icon name="compare" size={26} />
          </span>
          <p className="mt-4 text-base font-extrabold text-ink">Belum ada produk untuk dibandingkan</p>
          <p className="mx-auto mt-1 max-w-md text-[12px] leading-relaxed text-ink-muted">
            Tekan ikon bandingkan pada kartu produk untuk melihat perbedaan spesifikasi secara berdampingan.
          </p>
          <Link href="/products" className={buttonStyles({ className: "mt-5", size: "sm" })}>
            Jelajahi produk <Icon name="arrow-right" size={14} />
          </Link>

          {suggestions.length > 0 && (
            <div className="mx-auto mt-8 max-w-4xl px-4 text-left">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-ink">Mulai dari produk populer</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {suggestions.map((product) => (
                  <div key={product.id} className="rounded-lg border border-sand-200 p-2.5">
                    <Link href={`/products/${product.slug}`} className="relative block aspect-square overflow-hidden rounded-md bg-sand-50">
                      <Image src={product.images[0].url} alt={product.name} fill sizes="160px" className="object-cover" />
                    </Link>
                    <p className="mt-2 line-clamp-1 text-[11px] font-semibold text-ink">{product.name}</p>
                    <p className="mt-0.5 text-[11px] font-extrabold text-brand-600">{formatIDR(product.basePrice)}</p>
                    <button
                      onClick={() => {
                        toggleCompare(product.id);
                        toast({ title: "Ditambahkan ke perbandingan", description: product.name, tone: "info" });
                      }}
                      className="mt-2 w-full rounded-md border border-brand-200 bg-brand-50 py-1.5 text-[10px] font-bold text-brand-600 transition hover:bg-brand-100"
                    >
                      + Bandingkan
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="mt-4 overflow-x-auto rounded-xl border border-sand-200 bg-white" style={{ "--compare-cols": selected.length } as React.CSSProperties}>
            <div className="min-w-[680px]">
              <div className="grid grid-cols-[120px_repeat(var(--compare-cols),minmax(180px,1fr))] sm:grid-cols-[160px_repeat(var(--compare-cols),minmax(200px,1fr))]">
                <div className="flex items-end bg-sand-50 px-3 py-3">
                  <span className="text-[10px] font-bold uppercase tracking-wide text-ink-muted sm:text-[11px]">Produk</span>
                </div>
                {selected.map((product) => (
                  <div key={product.id} className="relative border-l border-sand-200 p-3">
                    <button
                      onClick={() => remove(product.id)}
                      aria-label={`Hapus ${product.name}`}
                      className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full border border-sand-200 bg-white text-ink-muted transition hover:border-danger hover:text-danger"
                    >
                      <Icon name="close" size={12} />
                    </button>
                    <Link href={`/products/${product.slug}`} className="relative block aspect-square overflow-hidden rounded-lg bg-sand-50">
                      <Image src={product.images[0].url} alt={product.name} fill sizes="200px" className="object-cover" />
                    </Link>
                    <p className="mt-2 text-[9px] font-bold uppercase tracking-wide text-brand-600">{product.brand}</p>
                    <Link href={`/products/${product.slug}`} className="mt-0.5 line-clamp-2 block text-[12px] font-bold text-ink hover:text-brand-600">
                      {product.name}
                    </Link>
                  </div>
                ))}
              </div>

              <CompareRow label="Harga">
                {selected.map((product) => (
                  <CompareCell key={product.id}>
                    <p className="text-base font-extrabold text-brand-600">{formatIDR(product.basePrice)}</p>
                    {product.comparePrice && (
                      <p className="mt-0.5 flex items-center gap-1.5 text-[10px]">
                        <span className="text-ink-muted line-through">{formatIDR(product.comparePrice)}</span>
                        <span className="rounded bg-brand-50 px-1 py-0.5 font-bold text-brand-600">-{discountPercent(product.basePrice, product.comparePrice)}%</span>
                      </p>
                    )}
                  </CompareCell>
                ))}
              </CompareRow>

              <CompareRow label="Rating">
                {selected.map((product) => (
                  <CompareCell key={product.id}>
                    <span className="flex items-center gap-1.5">
                      <StarRow value={product.rating} size={12} />
                      <span className="font-bold text-ink">{product.rating.toFixed(1)}</span>
                    </span>
                    <p className="mt-1 text-[10px] text-ink-muted">{product.reviewCount} ulasan</p>
                  </CompareCell>
                ))}
              </CompareRow>

              <CompareRow label="Terjual">
                {selected.map((product) => (
                  <CompareCell key={product.id}>
                    <span className="inline-flex items-center gap-1 font-semibold text-ink">
                      <Icon name="bag" size={12} className="text-brand-600" /> {formatNumber(product.sold)} terjual
                    </span>
                  </CompareCell>
                ))}
              </CompareRow>

              <CompareRow label="Ketersediaan">
                {selected.map((product) => {
                  const stock = totalStock(product);
                  return (
                    <CompareCell key={product.id}>
                      <span className={`font-semibold ${stock > 0 ? "text-olive-600" : "text-danger"}`}>{stock > 0 ? `Stok ${stock} unit` : "Stok habis"}</span>
                    </CompareCell>
                  );
                })}
              </CompareRow>

              <CompareRow label="Kategori">
                {selected.map((product) => (
                  <CompareCell key={product.id}>{categories.find((category) => category.id === product.categoryId)?.name ?? "-"}</CompareCell>
                ))}
              </CompareRow>

              <CompareRow label="Varian">
                {selected.map((product) => (
                  <CompareCell key={product.id}>
                    <div className="flex flex-wrap gap-1">
                      {product.variants.map((variant) => (
                        <span key={variant.id} className="rounded border border-sand-200 bg-sand-50 px-1.5 py-0.5 text-[10px]">
                          {variant.name}
                        </span>
                      ))}
                    </div>
                  </CompareCell>
                ))}
              </CompareRow>

              <CompareRow label="Spesifikasi">
                {selected.map((product) => (
                  <CompareCell key={product.id}>
                    <ul className="space-y-1">
                      {product.specs.slice(0, 4).map((spec) => (
                        <li key={spec.label} className="flex flex-col gap-0.5 border-b border-dashed border-sand-200 pb-1 last:border-0 last:pb-0">
                          <span className="text-[9px] uppercase tracking-wide text-ink-muted">{spec.label}</span>
                          <span className="font-medium text-ink">{spec.value}</span>
                        </li>
                      ))}
                    </ul>
                  </CompareCell>
                ))}
              </CompareRow>

              <CompareRow label="Keunggulan">
                {selected.map((product) => (
                  <CompareCell key={product.id}>
                    <ul className="space-y-1.5">
                      {product.highlights.slice(0, 3).map((highlight) => (
                        <li key={highlight} className="flex items-start gap-1.5">
                          <Icon name="check" size={12} className="mt-0.5 shrink-0 text-olive-600" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </CompareCell>
                ))}
              </CompareRow>

              <div className="grid grid-cols-[120px_repeat(var(--compare-cols),minmax(180px,1fr))] border-t border-sand-200 sm:grid-cols-[160px_repeat(var(--compare-cols),minmax(200px,1fr))]">
                <div className="bg-sand-50 px-3 py-3" />
                {selected.map((product) => {
                  const inStock = totalStock(product) > 0;
                  return (
                    <div key={product.id} className="border-l border-sand-200 p-3">
                      <Button size="sm" className="w-full" disabled={!inStock} onClick={() => quickAdd(product)}>
                        <Icon name="bag" size={14} /> {inStock ? "Tambah ke keranjang" : "Stok habis"}
                      </Button>
                      <Link href={`/products/${product.slug}`} className={buttonStyles({ variant: "outline", size: "sm", className: "mt-2 w-full" })}>
                        Lihat detail
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {selected.length < MAX_COMPARE && suggestions.length > 0 && (
            <div className="mt-4 rounded-xl border border-sand-200 bg-white p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-ink">Tambah produk lain</p>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {suggestions.slice(0, 4).map((product) => (
                  <button
                    key={product.id}
                    onClick={() => {
                      toggleCompare(product.id);
                      toast({ title: "Ditambahkan ke perbandingan", description: product.name, tone: "info" });
                    }}
                    className="flex items-center gap-2 rounded-lg border border-sand-200 p-2 text-left transition hover:border-brand-300 hover:bg-brand-50/30"
                  >
                    <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-sand-50">
                      <Image src={product.images[0].url} alt={product.name} fill sizes="40px" className="object-cover" />
                    </span>
                    <span className="min-w-0">
                      <span className="line-clamp-1 block text-[10px] font-semibold text-ink">{product.name}</span>
                      <span className="mt-0.5 block text-[10px] font-bold text-brand-600">{formatIDR(product.basePrice)}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
