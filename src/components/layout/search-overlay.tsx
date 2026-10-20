"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useCatalog } from "@/store/catalog";
import { formatIDR } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

const popular = ["Headphone", "Serum", "Linen", "Candle", "Kopi"];
const RECENT_KEY = "tokobagus-recent-searches";

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { products, categories } = useCatalog();
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    try {
      setRecent(JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]"));
    } catch {
      setRecent([]);
    }
    window.setTimeout(() => inputRef.current?.focus(), 80);
    document.body.style.overflow = "hidden";
    const listener = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", listener);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", listener);
    };
  }, [open, onClose]);

  if (!open) return null;

  const term = query.trim().toLowerCase();
  const matches = term
    ? products
        .filter((product) =>
          `${product.name} ${product.tagline} ${product.brand} ${product.tags.join(" ")}`.toLowerCase().includes(term)
        )
        .slice(0, 4)
    : [];
  const categoryMatches = term
    ? categories.filter((category) => category.name.toLowerCase().includes(term)).slice(0, 3)
    : [];

  const saveRecent = (value: string) => {
    const next = [value, ...recent.filter((item) => item.toLowerCase() !== value.toLowerCase())].slice(0, 5);
    setRecent(next);
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {}
  };

  const go = (value: string) => {
    if (!value.trim()) return;
    saveRecent(value.trim());
    onClose();
    router.push(`/search?q=${encodeURIComponent(value.trim())}`);
  };

  return (
    <div className="fixed inset-0 z-[85]">
      <button className="absolute inset-0 bg-ink/45 backdrop-blur-[3px] animate-fade-in" onClick={onClose} aria-label="Tutup pencarian" />
      <div className="relative mx-auto mt-0 max-h-[92vh] w-full overflow-y-auto border-b border-sand-200 bg-white shadow-lift animate-slide-in-bottom sm:mt-16 sm:max-w-2xl sm:rounded-xl sm:border">
        <div className="flex items-center gap-3 border-b border-sand-200 px-4 py-3 sm:px-5">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-brand-50 text-brand-600"><Icon name="search" size={16} /></span>
          <form
            className="flex-1"
            onSubmit={(event) => {
              event.preventDefault();
              go(query);
            }}
          >
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari produk, brand, atau kategori..."
              className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-muted"
              aria-label="Cari produk"
            />
          </form>
          <kbd className="hidden rounded border border-sand-300 px-1.5 py-0.5 text-[10px] text-ink-muted sm:block">ESC</kbd>
          <button onClick={onClose} className="rounded-full p-2 text-ink-soft transition hover:bg-sand-100" aria-label="Tutup">
            <Icon name="close" size={18} />
          </button>
        </div>

        <div className="p-5 sm:p-6">
          {!term && (
            <div className="space-y-6">
              <div>
                <p className="eyebrow mb-3">Pencarian populer</p>
                <div className="flex flex-wrap gap-2">
                  {popular.map((item) => (
                    <button
                      key={item}
                      onClick={() => go(item)}
                      className="rounded-md border border-sand-300 px-3 py-1.5 text-[11px] font-semibold text-ink-soft transition hover:border-brand-400 hover:bg-brand-50 hover:text-brand-600"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
              {recent.length > 0 && (
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <p className="eyebrow">Terakhir dicari</p>
                    <button
                      onClick={() => {
                        setRecent([]);
                        localStorage.removeItem(RECENT_KEY);
                      }}
                      className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted hover:text-brand-600"
                    >
                      Hapus
                    </button>
                  </div>
                  <div className="space-y-1">
                    {recent.map((item) => (
                      <button
                        key={item}
                        onClick={() => go(item)}
                        className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-[12px] text-ink-soft transition hover:bg-sand-50"
                      >
                        <Icon name="clock" size={15} className="text-ink-muted" />
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="rounded-xl border border-sand-200 bg-sand-50 p-3.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-brand-600">Kategori populer</p>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {categories.slice(0, 3).map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        onClose();
                        router.push(`/category/${category.slug}`);
                      }}
                      className="group relative aspect-[4/5] overflow-hidden rounded-lg text-left"
                    >
                      <Image src={category.image} alt={category.name} fill sizes="150px" className="object-cover transition duration-500 group-hover:scale-105" />
                      <span className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
                      <span className="absolute bottom-2 left-2.5 text-xs font-semibold text-surface">{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {term && (
            <div className="space-y-5">
              {categoryMatches.length > 0 && (
                <div>
                  <p className="eyebrow mb-2">Kategori</p>
                  <div className="flex flex-wrap gap-2">
                    {categoryMatches.map((category) => (
                      <Link
                        key={category.id}
                        href={`/category/${category.slug}`}
                        onClick={onClose}
                        className="inline-flex items-center gap-1.5 rounded-md bg-brand-50 px-2.5 py-1.5 text-[11px] font-semibold text-brand-600 hover:bg-brand-100"
                      >
                        {category.name} <Icon name="arrow-up-right" size={12} />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="eyebrow">Produk</p>
                  <span className="text-[10px] text-ink-muted">{matches.length} hasil</span>
                </div>
                <div className="divide-y divide-sand-200">
                  {matches.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      onClick={() => {
                        saveRecent(query);
                        onClose();
                      }}
                      className="group flex items-center gap-3 rounded-lg px-1 py-3 transition hover:bg-sand-50"
                    >
                      <div className="relative h-14 w-14 overflow-hidden rounded-lg bg-canvas">
                        <Image src={product.images[0].url} alt={product.name} fill sizes="56px" className="object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[12px] font-semibold text-ink group-hover:text-brand-600">{product.name}</p>
                        <p className="mt-0.5 truncate text-[10px] text-ink-muted">{product.tagline}</p>
                      </div>
                      <span className="text-[12px] font-extrabold text-brand-600">{formatIDR(product.basePrice)}</span>
                    </Link>
                  ))}
                  {matches.length === 0 && (
                    <div className="py-6 text-center">
                      <p className="text-sm text-ink-soft">Tidak ada produk untuk “{query}”.</p>
                      <p className="mt-1 text-xs text-ink-muted">Coba kata kunci lain seperti “linen” atau “candle”.</p>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => go(query)}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg bg-brand-50 px-4 py-3 text-[12px] font-bold text-brand-600 transition hover:bg-brand-100"
                )}
              >
                Lihat semua hasil untuk “{query}”
                <Icon name="arrow-right" size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
