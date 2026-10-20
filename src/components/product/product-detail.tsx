"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { Product, Review } from "@/types";
import { couriers } from "@/lib/data";
import { cn } from "@/lib/cn";
import { discountPercent, estimateDelivery, formatDate, formatIDR, formatNumber } from "@/lib/utils";
import { useCatalog } from "@/store/catalog";
import { MAX_COMPARE, useCart, useCompare, useRecentlyViewed, useWishlist } from "@/store/commerce";
import { useOrders, useReviews } from "@/store/orders";

import { useAuth, useNotifications } from "@/store/account";
import { useToast } from "@/components/ui/toast";
import { Modal } from "@/components/ui/overlay";
import { Accordion } from "@/components/ui/accordion";
import { Badge, Button, Field, Input, Progress, QuantityStepper, Textarea } from "@/components/ui/primitives";
import { buttonStyles } from "@/components/ui/button-styles";
import { Icon, StarRow } from "@/components/ui/icon";
import { ProductRail } from "./product-rail";

function StarPicker({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          aria-label={`Beri ${star} bintang`}
          className="rounded p-0.5 transition hover:scale-110"
        >
          <Icon
            name="star"
            size={26}
            className={star <= value ? "fill-brass-400 text-brass-400" : "fill-sand-200 text-sand-300"}
          />
        </button>
      ))}
    </div>
  );
}

function compressReviewPhoto(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const image = new window.Image();
      image.onload = () => {
        const max = 720;
        const scale = Math.min(1, max / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        const context = canvas.getContext("2d");
        if (!context) {
          reject(new Error("Canvas unavailable"));
          return;
        }
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.72));
      };
      image.onerror = () => reject(new Error("Invalid image"));
      image.src = String(reader.result);
    };
    reader.onerror = () => reject(new Error("Cannot read file"));
    reader.readAsDataURL(file);
  });
}

export function ProductDetail({ product }: { product: Product }) {
  const router = useRouter();
  const { toast } = useToast();
  const addItem = useCart((state) => state.addItem);
  const toggleWishlist = useWishlist((state) => state.toggle);
  const wished = useWishlist((state) => state.ids.includes(product.id));
  const compareIds = useCompare((state) => state.ids);
  const toggleCompare = useCompare((state) => state.toggle);
  const addNotification = useNotifications((state) => state.addNotification);
  const addRecent = useRecentlyViewed((state) => state.add);
  const recentIds = useRecentlyViewed((state) => state.ids);
  const reviews = useReviews((state) => state.reviews);
  const addReview = useReviews((state) => state.addReview);
  const orders = useOrders((state) => state.orders);
  const user = useAuth((state) => state.user);
  const products = useCatalog((state) => state.products);
  const categories = useCatalog((state) => state.categories);

  const [variantId, setVariantId] = useState(() => product.variants.find((variant) => variant.stock > 0)?.id ?? product.variants[0]?.id);
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [tab, setTab] = useState<"description" | "specs" | "reviews" | "shipping">("description");
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewPhotos, setReviewPhotos] = useState<string[]>([]);
  const [reviewPhotoError, setReviewPhotoError] = useState("");

  useEffect(() => {
    addRecent(product.id);
  }, [product.id, addRecent]);

  useEffect(() => {
    setVariantId(product.variants.find((variant) => variant.stock > 0)?.id ?? product.variants[0]?.id);
    setQty(1);
    setActiveImage(0);
  }, [product]);

  const variant = useMemo(
    () => product.variants.find((item) => item.id === variantId) ?? product.variants[0],
    [product, variantId]
  );
  const stock = variant?.stock ?? 0;
  const discount = discountPercent(product.basePrice, product.comparePrice);
  const category = categories.find((item) => item.id === product.categoryId);
  const productReviews = useMemo(() => reviews.filter((review) => review.productId === product.id), [reviews, product.id]);

  const distribution = useMemo(() => {
    return [5, 4, 3, 2, 1].map((star) => {
      const count = productReviews.filter((review) => Math.round(review.rating) === star).length;
      return { star, count, percent: productReviews.length ? Math.round((count / productReviews.length) * 100) : 0 };
    });
  }, [productReviews]);

  const related = products
    .filter((item) => item.categoryId === product.categoryId && item.id !== product.id && item.status === "active")
    .slice(0, 8);
  const recentlyViewed = recentIds
    .filter((id) => id !== product.id)
    .map((id) => products.find((item) => item.id === id))
    .filter((item): item is Product => Boolean(item))
    .slice(0, 4);
  const canReview = user ? orders.some((order) => order.items.some((item) => item.productId === product.id)) : false;

  const handleAdd = (redirect?: boolean) => {
    if (!variant || stock === 0) return;
    addItem({
      productId: product.id,
      variantId: variant.id,
      slug: product.slug,
      name: product.name,
      variantName: variant.name,
      image: variant.imageUrl ?? product.images[0].url,
      price: variant.price,
      qty,
      stock: variant.stock,
    });
    if (redirect) {
      router.push("/checkout");
      return;
    }
    toast({ title: "Ditambahkan ke keranjang", description: `${product.name} — ${variant.name} (±${qty})`, tone: "success" });
  };

  const submitReview = () => {
    if (reviewComment.trim().length < 10) {
      toast({ title: "Ulasan terlalu singkat", description: "Tuliskan minimal 10 karakter.", tone: "danger" });
      return;
    }
    addReview({
      productId: product.id,
      user: user?.name ?? "Tamu tokobagus.com",
      rating: reviewRating,
      title: reviewTitle.trim() || undefined,
      comment: reviewComment.trim(),
      photos: reviewPhotos.length > 0 ? reviewPhotos : undefined,
      verified: canReview,
      helpful: 0,
    });
    setReviewOpen(false);
    setReviewTitle("");
    setReviewComment("");
    setReviewPhotos([]);
    setReviewPhotoError("");
    setReviewRating(5);
    toast({ title: "Terima kasih atas ulasan Anda", description: "Ulasan tampil setelah moderasi singkat.", tone: "success" });
  };

  const addReviewPhotos = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setReviewPhotoError("");
    const available = 3 - reviewPhotos.length;
    if (available <= 0) {
      setReviewPhotoError("Maksimal 3 foto per ulasan.");
      return;
    }
    try {
      const selected = Array.from(files).filter((file) => file.type.startsWith("image/")).slice(0, available);
      const compressed = await Promise.all(selected.map(compressReviewPhoto));
      setReviewPhotos((current) => [...current, ...compressed].slice(0, 3));
    } catch {
      setReviewPhotoError("Foto gagal diproses. Coba file lain.");
    }
  };

  const notifyRestock = () => {
    addNotification({
      title: "Notifikasi restock aktif",
      description: `Kami akan mengabari saat ${product.name} tersedia kembali.`,
      href: `/products/${product.slug}`,
      type: "restock",
      productId: product.id,
    });
    toast({ title: "Kami akan mengabari", description: "Notifikasi restock sudah diaktifkan.", tone: "success" });
  };

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({ title: "Tautan disalin", description: "Bagikan produk ini ke teman Anda.", tone: "info" });
    } catch {
      toast({ title: "Tidak dapat menyalin tautan", tone: "danger" });
    }
  };

  return (
    <>
      <div className="container-lume pb-10">
        <nav aria-label="Breadcrumb" className="no-scrollbar flex items-center gap-1.5 overflow-x-auto whitespace-nowrap py-3 text-[11px] text-ink-muted">
          <Link href="/" className="hover:text-brand-600">
            Beranda
          </Link>
          <Icon name="chevron-right" size={11} />
          <Link href="/products" className="hover:text-brand-600">
            Produk
          </Link>
          {category && (
            <>
              <Icon name="chevron-right" size={11} />
              <Link href={`/category/${category.slug}`} className="hover:text-brand-600">
                {category.name}
              </Link>
            </>
          )}
          <Icon name="chevron-right" size={11} />
          <span className="max-w-[220px] truncate text-ink">{product.name}</span>
        </nav>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_440px] lg:items-start lg:gap-7">
          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            <div className="no-scrollbar flex gap-2 overflow-x-auto sm:w-[68px] sm:flex-col sm:overflow-visible">
              {product.images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setActiveImage(index)}
                  aria-label={`Lihat gambar ${index + 1}`}
                  className={cn(
                    "relative aspect-square w-14 shrink-0 overflow-hidden rounded-lg border-2 transition sm:w-full",
                    activeImage === index ? "border-brand-600" : "border-sand-200 opacity-70 hover:opacity-100"
                  )}
                >
                  <Image src={image.url} alt={image.alt} fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
            <div className="group relative min-w-0 flex-1 overflow-hidden rounded-xl border border-sand-200 bg-white">
              <div className="relative aspect-square">
                <Image
                  src={product.images[activeImage].url}
                  alt={product.images[activeImage].alt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 720px"
                  className="object-cover transition duration-700 group-hover:scale-[1.04]"
                />
              </div>
              <div className="absolute left-3 top-3 flex flex-col gap-1.5">
                {discount > 0 && <Badge tone="brass">-{discount}%</Badge>}
                {product.isNew && <Badge tone="ink">Baru</Badge>}
                {product.isBestSeller && <Badge tone="olive">Terlaris</Badge>}
              </div>
              <button
                onClick={share}
                aria-label="Bagikan produk"
                className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border border-sand-200 bg-white/95 text-ink-soft shadow-soft backdrop-blur transition hover:text-brand-600"
              >
                <Icon name="share" size={15} />
              </button>
              <span className="absolute bottom-3 right-3 rounded-md bg-ink/65 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur">
                {activeImage + 1} / {product.images.length}
              </span>
            </div>
          </div>

          <div className="lg:sticky lg:top-32">
            <div className="mb-1.5 flex items-center gap-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-600">{product.brand}</p>
              <span className="inline-flex items-center gap-1 rounded bg-olive-50 px-1.5 py-0.5 text-[9px] font-bold text-olive-700">
                <Icon name="check-circle" size={10} /> Official store
              </span>
            </div>

            <h1 className="text-xl font-extrabold leading-snug tracking-tight text-ink sm:text-2xl">{product.name}</h1>
            <p className="mt-1.5 text-[12px] leading-relaxed text-ink-muted">{product.tagline}</p>

            <div className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] text-ink-muted">
              <StarRow value={product.rating} size={13} />
              <span className="font-bold text-ink">{product.rating.toFixed(1)}</span>
              <span className="text-sand-300">|</span>
              <span>{product.reviewCount} ulasan</span>
              <span className="text-sand-300">|</span>
              <span>{formatNumber(product.sold)} terjual</span>
              <button onClick={() => setTab("reviews")} className="ml-auto font-bold text-brand-600 hover:underline">
                Lihat ulasan
              </button>
            </div>

            <div className="mt-4 rounded-xl bg-brand-50 p-4">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="text-3xl font-extrabold tracking-tight text-brand-600">{formatIDR(variant?.price ?? product.basePrice)}</span>
                {product.comparePrice && (
                  <span className="text-[12px] text-ink-muted line-through">{formatIDR(product.comparePrice)}</span>
                )}
                {discount > 0 && (
                  <span className="rounded bg-brand-600 px-1.5 py-0.5 text-[10px] font-bold text-white">-{discount}%</span>
                )}
              </div>
              {discount > 0 && (
                <p className="mt-1 text-[11px] font-semibold text-brand-700">
                  Hemat {formatIDR(product.comparePrice! - product.basePrice)} dari harga normal
                </p>
              )}
              <div className="mt-3 flex items-start gap-2 border-t border-brand-100 pt-3 text-[11px] text-ink-soft">
                <Icon name="ticket" size={14} className="mt-0.5 shrink-0 text-brand-600" />
                <p>
                  Pakai kode <span className="inline-flex rounded bg-white px-1.5 py-0.5 font-bold text-brand-700">TOKOBAGUS10</span> — potongan 10% untuk pesanan pertama.
                </p>
              </div>
            </div>

            {product.variants.some((item) => item.options.length > 0) && (
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-ink">Pilih varian</p>
                  <span className={cn("text-[11px] font-semibold", stock > 0 ? "text-olive-600" : "text-danger")}>
                    {stock > 0 ? `Stok ${stock}` : "Stok habis"}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {product.variants.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setVariantId(item.id);
                        setQty(1);
                      }}
                      disabled={item.stock === 0}
                      className={cn(
                        "rounded-md border px-3 py-2 text-[11px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-35",
                        item.id === variant?.id ? "border-brand-600 bg-brand-50 text-brand-700" : "border-sand-300 text-ink-soft hover:border-brand-400"
                      )}
                    >
                      {item.name}
                      {item.price !== product.basePrice && <span className="ml-1 opacity-65">{formatIDR(item.price)}</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4">
              <div className="flex items-center justify-between text-[11px]">
                <p className="font-bold uppercase tracking-wider text-ink">Jumlah</p>
                <span className={cn("font-semibold", stock > 0 ? "text-olive-600" : "text-danger")}>
                  {stock > 0 ? `Tersisa ${stock} unit` : "Habis"}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <QuantityStepper value={qty} onChange={setQty} max={Math.max(1, stock)} />
                <button
                  onClick={() => {
                    const added = toggleWishlist(product.id);
                    toast({ title: added ? "Disimpan ke wishlist" : "Dihapus dari wishlist", tone: added ? "success" : "info" });
                  }}
                  aria-pressed={wished}
                  aria-label="Simpan ke wishlist"
                  className={cn(
                    "grid h-10 w-10 place-items-center rounded-md border transition",
                    wished ? "border-brand-600 bg-brand-50 text-brand-600" : "border-sand-300 text-ink-soft hover:border-brand-400 hover:text-brand-600"
                  )}
                >
                  <Icon name="heart" size={17} className={wished ? "fill-current" : ""} />
                </button>
                <button
                  onClick={() => {
                    if (!compareIds.includes(product.id) && compareIds.length >= MAX_COMPARE) {
                      toast({ title: "Maksimal 4 produk", description: "Hapus salah satu produk dari daftar banding.", tone: "info" });
                      return;
                    }
                    const added = toggleCompare(product.id);
                    toast({ title: added ? "Ditambahkan ke perbandingan" : "Dihapus dari perbandingan", tone: "info" });
                  }}
                  aria-pressed={compareIds.includes(product.id)}
                  aria-label="Bandingkan produk"
                  className={cn(
                    "grid h-10 w-10 place-items-center rounded-md border transition",
                    compareIds.includes(product.id) ? "border-brand-600 bg-brand-50 text-brand-600" : "border-sand-300 text-ink-soft hover:border-brand-400 hover:text-brand-600"
                  )}
                >
                  <Icon name="compare" size={17} />
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              {stock > 0 ? (
                <>
                  <Button size="lg" variant="outline" disabled={stock === 0} onClick={() => handleAdd()}>
                    <Icon name="bag" size={17} /> + Keranjang
                  </Button>
                  <Button size="lg" disabled={stock === 0} onClick={() => handleAdd(true)}>
                    Beli sekarang
                  </Button>
                </>
              ) : (
                <>
                  <Button size="lg" variant="outline" onClick={notifyRestock}>
                    <Icon name="bell" size={16} /> Beri tahu saya
                  </Button>
                  <Button size="lg" disabled>
                    Stok habis
                  </Button>
                </>
              )}
            </div>

            <ul className="mt-4 grid grid-cols-2 gap-2 rounded-xl border border-sand-200 p-3">
              {[
                { icon: "truck" as const, text: `Tiba ${estimateDelivery("2-4")}` },
                { icon: "refresh" as const, text: "Retur gratis 30 hari" },
                { icon: "shield" as const, text: "Garansi resmi" },
                { icon: "headset" as const, text: "CS siap 24 jam" },
              ].map((item) => (
                <li key={item.text} className="flex items-center gap-2 text-[10px] font-medium text-ink-soft">
                  <Icon name={item.icon} size={14} className="shrink-0 text-brand-600" /> {item.text}
                </li>
              ))}
            </ul>

            <ul className="mt-3 space-y-1.5">
              {product.highlights.slice(0, 3).map((highlight) => (
                <li key={highlight} className="flex items-start gap-2 text-[11px] leading-relaxed text-ink-soft">
                  <Icon name="check" size={13} className="mt-0.5 shrink-0 text-olive-600" /> {highlight}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <section className="mt-6 overflow-hidden rounded-xl border border-sand-200 bg-white">
          <div className="no-scrollbar flex gap-1 overflow-x-auto border-b border-sand-200 px-2 sm:px-4">
            {(
              [
                ["description", "Deskripsi"],
                ["specs", "Spesifikasi"],
                ["shipping", "Pengiriman & retur"],
                ["reviews", `Ulasan (${product.reviewCount})`],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={cn(
                  "-mb-px shrink-0 border-b-2 px-3 py-3 text-[12px] font-bold transition sm:px-4 sm:text-[13px]",
                  tab === key ? "border-brand-600 text-brand-600" : "border-transparent text-ink-muted hover:text-ink"
                )}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="grid gap-8 p-4 sm:p-5 lg:grid-cols-[1.5fr_1fr] lg:p-6">
            <div>
              {tab === "description" && (
                <div className="max-w-2xl space-y-3 text-[13px] leading-relaxed text-ink-soft">
                  <p className="text-[14px] font-medium text-ink">{product.description}</p>
                  {product.story && <p>{product.story}</p>}
                  <p>
                    Setiap unit diperiksa satu per satu sebelum dikirim. Karena dibuat dalam batch kecil, warna dan
                    tekstur alami dapat sedikit berbeda antar unit — itu bagian dari karakter produk.
                  </p>
                </div>
              )}

              {tab === "specs" && (
                <dl className="max-w-2xl divide-y divide-sand-200 border-y border-sand-200">
                  {[
                    { label: "SKU", value: variant?.sku ?? "-" },
                    { label: "Berat", value: `${product.weight} gram` },
                    { label: "Kategori", value: category?.name ?? "-" },
                    ...product.specs,
                  ].map((spec) => (
                    <div key={spec.label} className="grid grid-cols-[120px_1fr] gap-3 py-3 text-[12px] sm:grid-cols-[160px_1fr] sm:text-[13px]">
                      <dt className="text-ink-muted">{spec.label}</dt>
                      <dd className="font-medium text-ink">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              )}

              {tab === "shipping" && (
                <div className="max-w-2xl">
                  <Accordion
                    items={[
                      {
                        id: "shipping",
                        title: "Estimasi pengiriman",
                        content: (
                          <ul className="space-y-3">
                            {couriers.map((courier) => (
                              <li key={courier.id} className="flex items-center justify-between gap-3">
                                <span className="flex items-center gap-2.5 text-[13px] font-medium text-ink">
                                  <Icon name="truck" size={15} className="text-brand-600" /> {courier.name}
                                </span>
                                <span className="text-right text-xs text-ink-muted">
                                  {estimateDelivery(courier.etd)}
                                  <br />
                                  {formatIDR(courier.cost)}
                                </span>
                              </li>
                            ))}
                          </ul>
                        ),
                      },
                      {
                        id: "returns",
                        title: "Pengembalian & penukaran",
                        content: (
                          <p>
                            Anda punya 30 hari sejak barang diterima untuk mengajukan pengembalian. Produk harus dalam
                            kondisi belum dipakai dengan kemasan lengkap. Biaya kirim pengembalian kami tanggung untuk
                            produk cacat atau salah kirim.
                          </p>
                        ),
                      },
                      {
                        id: "care",
                        title: "Perawatan produk",
                        content: (
                          <p>
                            Simpan di tempat kering, jauh dari sinar matahari langsung. Untuk material alami, bersihkan
                            dengan kain lembap dan hindari pembersih berbahan kimia keras.
                          </p>
                        ),
                      },
                    ]}
                    defaultOpen="shipping"
                  />
                </div>
              )}

              {tab === "reviews" && (
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-sand-50 p-3.5 sm:p-4">
                    <div className="flex items-center gap-3">
                      <p className="text-4xl font-extrabold text-ink">{product.rating.toFixed(1)}</p>
                      <div>
                        <StarRow value={product.rating} size={15} />
                        <p className="mt-1 text-[11px] text-ink-muted">{product.reviewCount} ulasan · {productReviews.filter((review) => review.photos?.length).length} dengan foto</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => setReviewOpen(true)}>
                      <Icon name="edit" size={14} /> Tulis ulasan
                    </Button>
                  </div>

                  <div className="mt-4 space-y-2">
                    {distribution.map((row) => (
                      <div key={row.star} className="flex items-center gap-3">
                        <span className="w-8 shrink-0 text-[11px] font-semibold text-ink-soft">{row.star}★</span>
                        <Progress value={row.percent} className="flex-1" />
                        <span className="w-8 shrink-0 text-right text-[11px] text-ink-muted">{row.count}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 divide-y divide-sand-200 border-t border-sand-200">
                    {productReviews.length === 0 && (
                      <p className="py-8 text-sm text-ink-muted">Belum ada ulasan tertulis. Jadilah yang pertama.</p>
                    )}
                    {productReviews.map((review) => (
                      <ReviewRow key={review.id} review={review} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <aside>
              <div className="rounded-lg border border-sand-200 p-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-ink">Tentang produk</p>
                <dl className="mt-3 space-y-2.5 text-[11px]">
                  {[
                    ["Brand", product.brand],
                    ["Kategori", category?.name ?? "-"],
                    ["Stok", stock > 0 ? `${stock} unit` : "Habis"],
                    ["Pengiriman", "Dikirim dari Jakarta"],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between gap-3 border-b border-dashed border-sand-200 pb-2 last:border-0 last:pb-0">
                      <dt className="text-ink-muted">{label}</dt>
                      <dd className={cn("font-semibold text-ink", label === "Stok" && stock === 0 && "text-danger")}>{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="mt-3 rounded-lg bg-sand-50 p-4">
                <p className="text-[11px] font-bold text-ink">Belanja dengan tenang</p>
                <ul className="mt-2 space-y-2 text-[10px] leading-relaxed text-ink-muted">
                  <li className="flex items-start gap-2"><Icon name="shield" size={12} className="mt-0.5 shrink-0 text-olive-600" /> Produk 100% original dan bergaransi.</li>
                  <li className="flex items-start gap-2"><Icon name="refresh" size={12} className="mt-0.5 shrink-0 text-olive-600" /> Retur mudah dalam 30 hari.</li>
                  <li className="flex items-start gap-2"><Icon name="lock" size={12} className="mt-0.5 shrink-0 text-olive-600" /> Pembayaran aman dan terenkripsi.</li>
                </ul>
                <Link href="/journal" className={buttonStyles({ variant: "ghost", size: "sm", className: "mt-3 w-full" })}>
                  Cerita di balik koleksi <Icon name="arrow-right" size={13} />
                </Link>
              </div>
            </aside>
          </div>
        </section>
      </div>

      <div className="border-t border-sand-200 bg-white py-8 sm:py-10">
        <ProductRail eyebrow="Lengkapi tampilan" title={`Lebih banyak dari ${category?.name ?? "koleksi"}`} products={related} href={category ? `/category/${category.slug}` : "/products"} />
      </div>

      {recentlyViewed.length > 0 && (
        <div className="border-t border-sand-200 py-8 sm:py-10">
          <ProductRail eyebrow="Kembali ke" title="Terakhir Anda lihat" products={recentlyViewed} />
        </div>
      )}

      <div className={cn("fixed inset-x-0 z-30 border-t border-sand-200 bg-white/95 px-3 py-2.5 shadow-[0_-8px_30px_-20px_rgba(0,0,0,0.35)] backdrop-blur md:hidden", compareIds.length > 0 ? "bottom-[8.25rem]" : "bottom-14")}>
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-[10px] text-ink-muted">{product.name}</p>
            <p className="text-sm font-extrabold text-brand-600">{formatIDR(variant?.price ?? product.basePrice)}</p>
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              onClick={notifyRestock}
              aria-label="Beri tahu saat restock"
              className="grid h-9 w-9 place-items-center rounded-md border border-sand-300 text-ink-muted"
            >
              <Icon name="bell" size={16} />
            </button>
            {stock > 0 ? (
              <Button size="sm" onClick={() => handleAdd()}>
                <Icon name="bag" size={14} /> Tambah
              </Button>
            ) : (
              <Button size="sm" variant="outline" onClick={notifyRestock}>
                Restock
              </Button>
            )}
          </div>
        </div>
      </div>

      <Modal
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        title="Tulis ulasan"
        description="Ceritakan pengalaman Anda memakai produk ini — ulasan membantu pembeli lain."
      >
        <div className="space-y-5 p-5 sm:p-6">
          <div>
            <p className="label">Penilaian Anda</p>
            <StarPicker value={reviewRating} onChange={setReviewRating} />
          </div>
          <Field label="Judul (opsional)">
            <Input value={reviewTitle} onChange={(event) => setReviewTitle(event.target.value)} placeholder="Misal: Kualitas di atas ekspektasi" />
          </Field>
          <Field label="Ulasan" hint="Minimal 10 karakter. Tulis jujur, hindari info pribadi.">
            <Textarea value={reviewComment} onChange={(event) => setReviewComment(event.target.value)} placeholder="Bagaimana bahan, ukuran, dan pemakaiannya?" />
          </Field>
          <div>
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-wider text-ink">Foto produk (opsional)</p>
              <span className="text-[10px] text-ink-muted">{reviewPhotos.length}/3</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {reviewPhotos.map((photo, index) => (
                <div key={`${photo.slice(0, 24)}-${index}`} className="group relative h-20 w-20 overflow-hidden rounded-lg border border-sand-200">
                  <Image src={photo} alt={`Foto ulasan ${index + 1}`} width={80} height={80} unoptimized className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setReviewPhotos((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                    aria-label="Hapus foto"
                    className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-ink/70 text-white"
                  >
                    <Icon name="close" size={11} />
                  </button>
                </div>
              ))}
              {reviewPhotos.length < 3 && (
                <label className="grid h-20 w-20 cursor-pointer place-items-center rounded-lg border border-dashed border-sand-300 bg-sand-50 text-center text-[9px] font-semibold text-ink-muted transition hover:border-brand-400 hover:text-brand-600">
                  <span className="flex flex-col items-center gap-1">
                    <Icon name="image" size={18} /> Tambah foto
                  </span>
                  <input type="file" accept="image/*" multiple onChange={(event) => addReviewPhotos(event.target.files)} className="sr-only" />
                </label>
              )}
            </div>
            {reviewPhotoError && <p className="mt-1.5 text-[10px] font-medium text-danger">{reviewPhotoError}</p>}
            <p className="mt-1.5 text-[10px] text-ink-muted">JPG/PNG, maksimal 3 foto. Foto otomatis dioptimalkan.</p>
          </div>
          {!canReview && user && (
            <p className="flex items-start gap-2 rounded-lg bg-canvas p-3 text-[11px] leading-relaxed text-ink-muted">
              <Icon name="info" size={14} className="mt-0.5 shrink-0" />
              Ulasan Anda akan ditandai belum terverifikasi karena pesanan dengan produk ini belum ditemukan di akun Anda.
            </p>
          )}
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setReviewOpen(false)}>
              Batal
            </Button>
            <Button className="flex-1" onClick={submitReview}>
              Kirim ulasan
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

function ReviewRow({ review }: { review: Review }) {
  const [helpful, setHelpful] = useState(review.helpful ?? 0);
  const [marked, setMarked] = useState(false);

  return (
    <article className="py-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-olive-100 font-display text-sm text-olive-800">
            {review.user.slice(0, 1).toUpperCase()}
          </span>
          <div>
            <p className="flex items-center gap-2 text-[13px] font-semibold text-ink">
              {review.user}
              {review.verified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-olive-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-olive-800">
                  <Icon name="check" size={10} /> Terverifikasi
                </span>
              )}
            </p>
            <p className="mt-0.5 flex items-center gap-2 text-[11px] text-ink-muted">
              <StarRow value={review.rating} size={11} /> {formatDate(review.date)}
            </p>
          </div>
        </div>
      </div>
      {review.title && <p className="mt-3 text-sm font-semibold text-ink">{review.title}</p>}
      <p className="mt-1.5 text-[13px] leading-relaxed text-ink-soft">{review.comment}</p>
      {review.photos && review.photos.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {review.photos.map((photo, index) => (
            <a
              key={`${photo.slice(0, 24)}-${index}`}
              href={photo}
              target="_blank"
              rel="noreferrer"
              className="relative h-20 w-20 overflow-hidden rounded-lg border border-sand-200 bg-sand-50 transition hover:border-brand-400"
            >
              <Image src={photo} alt={`Foto ulasan ${index + 1}`} width={80} height={80} unoptimized className="h-full w-full object-cover" />
            </a>
          ))}
        </div>
      )}
      <button
        onClick={() => {
          if (marked) return;
          setHelpful((value) => value + 1);
          setMarked(true);
        }}
        className={cn(
          "mt-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold transition",
          marked ? "border-olive-300 bg-olive-100 text-olive-800" : "border-sand-300 text-ink-muted hover:border-ink hover:text-ink"
        )}
      >
        <Icon name="award" size={12} /> Membantu ({helpful})
      </button>
    </article>
  );
}
