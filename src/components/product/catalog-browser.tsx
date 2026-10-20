"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/types";
import { totalStock } from "@/lib/data";
import { cn } from "@/lib/cn";
import { discountPercent, formatIDR, formatNumber, recommendProducts } from "@/lib/utils";
import { useCatalog } from "@/store/catalog";
import { useCart, useCompare, useRecentlyViewed, useWishlist } from "@/store/commerce";
import { useNotifications } from "@/store/account";
import { useToast } from "@/components/ui/toast";
import { Drawer } from "@/components/ui/overlay";
import { Button, Checkbox, EmptyState, Select } from "@/components/ui/primitives";
import { buttonStyles } from "@/components/ui/button-styles";
import { Icon, StarRow } from "@/components/ui/icon";
import { ProductCard } from "./product-card";
import { QuickView } from "./quick-view";

type SortKey = "featured" | "new" | "best" | "price-asc" | "price-desc" | "rating";

const sortLabels: Record<SortKey, string> = {
  featured: "Direkomendasikan",
  new: "Terbaru",
  best: "Terlaris",
  "price-asc": "Harga terendah",
  "price-desc": "Harga tertinggi",
  rating: "Rating tertinggi",
};

const priceRanges = [
  { id: "all", label: "Semua harga", min: 0, max: Infinity },
  { id: "under-300", label: "< Rp300rb", min: 0, max: 300000 },
  { id: "300-700", label: "Rp300rb – Rp700rb", min: 300000, max: 700000 },
  { id: "700-1500", label: "Rp700rb – Rp1,5jt", min: 700000, max: 1500000 },
  { id: "above-1500", label: "> Rp1,5jt", min: 1500000, max: Infinity },
];

const PAGE_SIZE = 12;

export function CatalogBrowser({
  initialCategoryId,
  initialQuery = "",
  title,
  description,
  eyebrow,
  basePath = "/products",
  hideCategoryFilter = false,
}: {
  initialCategoryId?: string;
  initialQuery?: string;
  title: string;
  description?: string;
  eyebrow?: string;
  basePath?: string;
  hideCategoryFilter?: boolean;
}) {
  const searchParams = useSearchParams();
  const products = useCatalog((state) => state.products);
  const categories = useCatalog((state) => state.categories);
  const addItem = useCart((state) => state.addItem);
  const toggleWishlist = useWishlist((state) => state.toggle);
  const compareIds = useCompare((state) => state.ids);
  const toggleCompare = useCompare((state) => state.toggle);
  const addNotification = useNotifications((state) => state.addNotification);
  const recent = useRecentlyViewed((state) => state.ids);
  const wishlist = useWishlist((state) => state.ids);
  const { toast } = useToast();

  const [query, setQuery] = useState(initialQuery || searchParams.get("q") || "");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategoryId ? [initialCategoryId] : []);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState("all");
  const [minRating, setMinRating] = useState(0);
  const [onlyDiscount, setOnlyDiscount] = useState(searchParams.get("sale") === "true");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>((searchParams.get("sort") as SortKey) ?? "featured");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [quickView, setQuickView] = useState<Product | null>(null);

  const brands = useMemo(() => {
    const map = new Map<string, number>();
    products.forEach((product) => {
      if (product.status !== "active") return;
      map.set(product.brand, (map.get(product.brand) ?? 0) + 1);
    });
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [products]);

  const filtered = useMemo(() => {
    const range = priceRanges.find((item) => item.id === priceRange) ?? priceRanges[0];
    const normalizedQuery = query.trim().toLowerCase();

    const result = products.filter((product) => {
      if (product.status !== "active") return false;
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.categoryId)) return false;
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) return false;
      if (product.basePrice < range.min || product.basePrice > range.max) return false;
      if (minRating > 0 && product.rating < minRating) return false;
      if (onlyDiscount && !(product.comparePrice && product.comparePrice > product.basePrice)) return false;
      if (inStockOnly && totalStock(product) === 0) return false;
      if (
        normalizedQuery &&
        !`${product.name} ${product.brand} ${product.tagline} ${product.tags.join(" ")}`
          .toLowerCase()
          .includes(normalizedQuery)
      ) {
        return false;
      }
      return true;
    });

    const sorted = [...result];
    sorted.sort((a, b) => {
      if (sort === "price-asc") return a.basePrice - b.basePrice;
      if (sort === "price-desc") return b.basePrice - a.basePrice;
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "best") return b.sold - a.sold;
      if (sort === "new") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return Number(b.isFeatured ?? 0) - Number(a.isFeatured ?? 0) || b.sold - a.sold;
    });
    return sorted;
  }, [products, selectedCategories, selectedBrands, priceRange, minRating, onlyDiscount, inStockOnly, query, sort]);

  useEffect(() => setPage(1), [selectedCategories, selectedBrands, priceRange, minRating, onlyDiscount, inStockOnly, query, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const activeFilterCount =
    selectedCategories.length +
    selectedBrands.length +
    (priceRange !== "all" ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    Number(onlyDiscount) +
    Number(inStockOnly);

  const recommendations = useMemo(
    () => recommendProducts(products, [...recent, ...wishlist], 5),
    [products, recent, wishlist]
  );

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange("all");
    setMinRating(0);
    setOnlyDiscount(false);
    setInStockOnly(false);
    setQuery("");
  };

  const goToPage = (next: number) => {
    setPage(next);
    if (typeof window !== "undefined") window.scrollTo({ top: 180, behavior: "smooth" });
  };

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

  const filterPanel = (
    <div className="space-y-5">
      {!hideCategoryFilter && (
        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-ink">Kategori</p>
          <div className="space-y-0.5">
            {categories.map((category) => (
              <Checkbox
                key={category.id}
                label={
                  <span className="flex w-full items-center justify-between gap-2 text-[12px]">
                    {category.name}
                    <span className="text-[10px] text-ink-muted">{products.filter((product) => product.categoryId === category.id).length}</span>
                  </span>
                }
                checked={selectedCategories.includes(category.id)}
                onChange={(checked) =>
                  setSelectedCategories((current) => (checked ? [...current, category.id] : current.filter((id) => id !== category.id)))
                }
              />
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-sand-200 pt-4">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-ink">Brand</p>
        <div className="space-y-0.5">
          {brands.map(([brand, count]) => (
            <Checkbox
              key={brand}
              label={
                <span className="flex w-full items-center justify-between gap-2 text-[12px]">
                  {brand}
                  <span className="text-[10px] text-ink-muted">{count}</span>
                </span>
              }
              checked={selectedBrands.includes(brand)}
              onChange={(checked) => setSelectedBrands((current) => (checked ? [...current, brand] : current.filter((item) => item !== brand)))}
            />
          ))}
        </div>
      </div>

      <div className="border-t border-sand-200 pt-4">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-ink">Harga</p>
        <div className="space-y-0.5">
          {priceRanges.map((range) => (
            <button
              key={range.id}
              onClick={() => setPriceRange(range.id)}
              className={cn(
                "flex w-full items-center justify-between rounded-md px-2.5 py-2 text-left text-[12px] transition",
                priceRange === range.id ? "bg-brand-50 font-bold text-brand-700" : "text-ink-soft hover:bg-sand-50"
              )}
            >
              {range.label}
              {priceRange === range.id && <Icon name="check" size={13} />}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-sand-200 pt-4">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-ink">Rating</p>
        <div className="space-y-0.5">
          {[0, 4, 4.5, 4.8].map((rating) => (
            <button
              key={rating}
              onClick={() => setMinRating(rating)}
              className={cn(
                "flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-[12px] transition",
                minRating === rating ? "bg-brand-50 font-bold text-brand-700" : "text-ink-soft hover:bg-sand-50"
              )}
            >
              {rating === 0 ? (
                "Semua rating"
              ) : (
                <>
                  <StarRow value={rating} size={11} /> ke atas
                </>
              )}
              {minRating === rating && <Icon name="check" size={13} className="ml-auto" />}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2 border-t border-sand-200 pt-4">
        <Checkbox label="Sedang diskon" checked={onlyDiscount} onChange={setOnlyDiscount} />
        <Checkbox label="Hanya yang tersedia" checked={inStockOnly} onChange={setInStockOnly} />
      </div>

      {activeFilterCount > 0 && (
        <Button variant="outline" className="w-full" onClick={clearFilters}>
          <Icon name="filter-x" size={15} /> Bersihkan filter
        </Button>
      )}
    </div>
  );

  return (
    <>
      <section className="border-b border-sand-200 bg-white">
        <div className="container-lume py-4 sm:py-5">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] text-ink-muted">
            <Link href="/" className="hover:text-brand-600">
              Beranda
            </Link>
            <Icon name="chevron-right" size={11} />
            <span className="text-ink">{title}</span>
          </nav>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
            <div className="max-w-2xl">
              {eyebrow && <p className="eyebrow mb-1">{eyebrow}</p>}
              <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">{title}</h1>
              {description && <p className="mt-1.5 max-w-xl text-[12px] leading-relaxed text-ink-muted sm:text-[13px]">{description}</p>}
            </div>
            <p className="text-xs text-ink-muted">
              <span className="font-bold text-brand-600">{filtered.length}</span> produk
            </p>
          </div>

          {!hideCategoryFilter && (
            <div className="no-scrollbar -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
              <button
                onClick={() => setSelectedCategories([])}
                className={cn(
                  "shrink-0 rounded-full border px-3.5 py-1.5 text-[11px] font-semibold transition",
                  selectedCategories.length === 0 ? "border-brand-600 bg-brand-50 text-brand-600" : "border-sand-200 text-ink-soft hover:border-brand-300"
                )}
              >
                Semua
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategories([category.id])}
                  className={cn(
                    "shrink-0 rounded-full border px-3.5 py-1.5 text-[11px] font-semibold transition",
                    selectedCategories.includes(category.id) ? "border-brand-600 bg-brand-50 text-brand-600" : "border-sand-200 text-ink-soft hover:border-brand-300"
                  )}
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="container-lume grid gap-5 py-5 lg:grid-cols-[230px_1fr] lg:gap-6">
        <aside className="hidden lg:block">
          <div className="sticky top-32 rounded-xl border border-sand-200 bg-white p-4">
            <p className="mb-3 flex items-center gap-2 text-sm font-extrabold text-ink">
              <Icon name="filter" size={15} className="text-brand-600" /> Filter
              {activeFilterCount > 0 && (
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-brand-600 px-1 text-[9px] font-bold text-white">{activeFilterCount}</span>
              )}
            </p>
            {filterPanel}
          </div>
        </aside>

        <div>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-sand-200 bg-white p-2.5">
            <div className="flex min-w-0 items-center gap-2">
              <button onClick={() => setFilterOpen(true)} className={buttonStyles({ variant: "outline", size: "sm", className: "lg:hidden" })}>
                <Icon name="filter" size={14} /> Filter
                {activeFilterCount > 0 && (
                  <span className="grid h-4 min-w-4 place-items-center rounded-full bg-brand-600 px-1 text-[9px] text-white">{activeFilterCount}</span>
                )}
              </button>
              <div className="no-scrollbar flex flex-wrap items-center gap-1.5">
                {selectedCategories.map((id) => {
                  const category = categories.find((item) => item.id === id);
                  if (!category) return null;
                  return (
                    <button
                      key={id}
                      onClick={() => setSelectedCategories((current) => current.filter((item) => item !== id))}
                      className="inline-flex items-center gap-1 rounded-md bg-brand-50 px-2 py-1 text-[10px] font-semibold text-brand-700"
                    >
                      {category.name} <Icon name="close" size={10} />
                    </button>
                  );
                })}
                {selectedBrands.map((brand) => (
                  <button
                    key={brand}
                    onClick={() => setSelectedBrands((current) => current.filter((item) => item !== brand))}
                    className="inline-flex items-center gap-1 rounded-md bg-brand-50 px-2 py-1 text-[10px] font-semibold text-brand-700"
                  >
                    {brand} <Icon name="close" size={10} />
                  </button>
                ))}
                {onlyDiscount && (
                  <button onClick={() => setOnlyDiscount(false)} className="inline-flex items-center gap-1 rounded-md bg-brand-50 px-2 py-1 text-[10px] font-semibold text-brand-700">
                    Diskon <Icon name="close" size={10} />
                  </button>
                )}
              </div>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <div className="hidden items-center gap-0.5 rounded-md border border-sand-200 p-0.5 sm:flex">
                {(["grid", "list"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setView(mode)}
                    aria-label={mode === "grid" ? "Tampilan grid" : "Tampilan list"}
                    className={cn(
                      "grid h-7 w-7 place-items-center rounded transition",
                      view === mode ? "bg-brand-600 text-white" : "text-ink-muted hover:bg-sand-50 hover:text-ink"
                    )}
                  >
                    <Icon name={mode} size={14} />
                  </button>
                ))}
              </div>
              <div className="w-[170px] sm:w-[190px]">
                <Select value={sort} onChange={(event) => setSort(event.target.value as SortKey)} aria-label="Urutkan" className="min-h-[34px] py-1.5 text-xs">
                  {Object.entries(sortLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </div>

          {paged.length === 0 ? (
            <EmptyState
              icon="filter"
              title="Tidak ada produk yang cocok"
              description="Coba longgarkan filter, ubah kata kunci, atau lihat rekomendasi produk di bawah."
              action={
                <Button onClick={clearFilters}>
                  Reset filter <Icon name="refresh" size={15} />
                </Button>
              }
            />
          ) : view === "grid" ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5">
              {paged.map((product, index) => (
                <ProductCard key={product.id} product={product} onQuickView={setQuickView} priority={index < 4 && currentPage === 1} />
              ))}
            </div>
          ) : (
            <div className="space-y-2.5">
              {paged.map((product) => {
                const stock = totalStock(product);
                const discount = discountPercent(product.basePrice, product.comparePrice);
                const comparing = compareIds.includes(product.id);
                return (
                  <article key={product.id} className="flex gap-3 rounded-xl border border-sand-200 bg-white p-3 transition hover:border-sand-300 sm:gap-4 sm:p-4">
                    <Link href={`/products/${product.slug}`} className="relative h-28 w-24 shrink-0 overflow-hidden rounded-lg bg-sand-50 sm:h-36 sm:w-32">
                      <Image src={product.images[0].url} alt={product.name} fill sizes="150px" className="object-cover" />
                      {discount > 0 && (
                        <span className="absolute left-1.5 top-1.5 rounded bg-brand-600 px-1.5 py-0.5 text-[9px] font-bold text-white">-{discount}%</span>
                      )}
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-muted">{product.brand}</p>
                          <h3 className="mt-0.5">
                            <Link href={`/products/${product.slug}`} className="line-clamp-2 text-[14px] font-bold text-ink hover:text-brand-600">
                              {product.name}
                            </Link>
                          </h3>
                        </div>
                        <button
                          onClick={() => {
                            const added = toggleWishlist(product.id);
                            toast({ title: added ? "Disimpan ke wishlist" : "Dihapus dari wishlist", tone: added ? "success" : "info" });
                          }}
                          aria-label="Simpan ke wishlist"
                          className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-sand-200 text-ink-muted transition hover:border-brand-400 hover:text-brand-600"
                        >
                          <Icon name="heart" size={15} />
                        </button>
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-[10px] text-ink-muted">
                        <StarRow value={product.rating} size={11} />
                        <span>{product.rating.toFixed(1)}</span>
                        <span>·</span>
                        <span>{formatNumber(product.sold)} terjual</span>
                        <span className={cn("font-semibold", stock > 0 ? "text-olive-600" : "text-danger")}>
                          {stock > 0 ? `Stok ${stock}` : "Habis"}
                        </span>
                      </div>
                      <p className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed text-ink-muted sm:text-xs">{product.tagline}</p>
                      <div className="mt-auto flex flex-wrap items-end justify-between gap-2 pt-2">
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-[17px] font-extrabold text-brand-600">{formatIDR(product.basePrice)}</span>
                            {product.comparePrice && (
                              <span className="text-[11px] text-ink-muted line-through">{formatIDR(product.comparePrice)}</span>
                            )}
                          </div>
                          <p className="mt-0.5 inline-flex items-center gap-1 text-[10px] font-semibold text-olive-600">
                            <Icon name="truck" size={11} /> Gratis ongkir
                          </p>
                        </div>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => {
                              if (!comparing && compareIds.length >= 4) {
                                toast({ title: "Maksimal 4 produk", tone: "info" });
                                return;
                              }
                              toggleCompare(product.id);
                            }}
                            aria-label="Bandingkan"
                            className={cn(
                              "grid h-9 w-9 place-items-center rounded-md border transition",
                              comparing ? "border-brand-600 bg-brand-600 text-white" : "border-sand-300 text-ink-muted hover:border-brand-400 hover:text-brand-600"
                            )}
                          >
                            <Icon name="compare" size={15} />
                          </button>
                          {stock > 0 ? (
                            <Button size="sm" onClick={() => quickAdd(product)}>
                              <Icon name="bag" size={14} /> Tambah
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                addNotification({
                                  title: "Notifikasi restock aktif",
                                  description: `Kami akan memberi tahu saat ${product.name} tersedia kembali.`,
                                  href: `/products/${product.slug}`,
                                  type: "restock",
                                  productId: product.id,
                                });
                                toast({ title: "Kami akan mengabari", tone: "success" });
                              }}
                            >
                              <Icon name="bell" size={14} /> Restock
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {totalPages > 1 && (
            <nav aria-label="Navigasi halaman" className="mt-6 flex items-center justify-center gap-1">
              <button
                onClick={() => goToPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                aria-label="Halaman sebelumnya"
                className="grid h-8 w-8 place-items-center rounded-md border border-sand-200 text-ink-soft transition hover:border-brand-400 hover:text-brand-600 disabled:opacity-30"
              >
                <Icon name="chevron-left" size={15} />
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
                <button
                  key={number}
                  onClick={() => goToPage(number)}
                  aria-current={number === currentPage ? "page" : undefined}
                  className={cn(
                    "grid h-8 w-8 place-items-center rounded-md text-[12px] font-bold transition",
                    number === currentPage ? "bg-brand-600 text-white" : "text-ink-soft hover:bg-sand-100"
                  )}
                >
                  {number}
                </button>
              ))}
              <button
                onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                aria-label="Halaman berikutnya"
                className="grid h-8 w-8 place-items-center rounded-md border border-sand-200 text-ink-soft transition hover:border-brand-400 hover:text-brand-600 disabled:opacity-30"
              >
                <Icon name="chevron-right" size={15} />
              </button>
            </nav>
          )}

          <p className="mt-3 text-center text-[10px] text-ink-muted">
            Menampilkan {paged.length} dari {filtered.length} produk · halaman {currentPage}/{totalPages}
          </p>

          {recommendations.length > 0 && (
            <section className="mt-8 rounded-xl border border-sand-200 bg-white p-4">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="eyebrow">Untuk kamu</p>
                  <h2 className="mt-1 text-base font-extrabold text-ink">Rekomendasi produk lain</h2>
                </div>
                <Link href={`${basePath}?sort=best`} className="text-[11px] font-bold text-brand-600 hover:underline">
                  Lihat semua
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 3xl:grid-cols-5">
                {recommendations.map((product) => (
                  <ProductCard key={product.id} product={product} onQuickView={setQuickView} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      <Drawer open={filterOpen} onClose={() => setFilterOpen(false)} title="Filter produk" side="bottom">
        <div className="px-4 pb-24 pt-4">{filterPanel}</div>
      </Drawer>

      <QuickView product={quickView} open={Boolean(quickView)} onClose={() => setQuickView(null)} />
    </>
  );
}
