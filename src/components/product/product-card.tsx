"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { totalStock } from "@/lib/data";
import { discountPercent, formatIDR, formatNumber } from "@/lib/utils";
import { MAX_COMPARE, useCart, useCompare, useWishlist } from "@/store/commerce";
import { useNotifications } from "@/store/account";
import { useToast } from "@/components/ui/toast";
import { Icon, StarRow } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import type { Product } from "@/types";

export function ProductCard({
  product,
  onQuickView,
  className,
  priority,
}: {
  product: Product;
  onQuickView?: (product: Product) => void;
  className?: string;
  priority?: boolean;
}) {
  const addItem = useCart((state) => state.addItem);
  const toggleWishlist = useWishlist((state) => state.toggle);
  const wished = useWishlist((state) => state.ids.includes(product.id));
  const compareIds = useCompare((state) => state.ids);
  const toggleCompare = useCompare((state) => state.toggle);
  const addNotification = useNotifications((state) => state.addNotification);
  const { toast } = useToast();

  const stock = useMemo(() => totalStock(product), [product]);
  const discount = discountPercent(product.basePrice, product.comparePrice);
  const secondary = product.images[1]?.url ?? product.images[0]?.url;
  const comparing = compareIds.includes(product.id);

  const quickAdd = () => {
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

  const askRestock = () => {
    addNotification({
      title: "Notifikasi restock aktif",
      description: `Kami akan memberi tahu Anda saat ${product.name} tersedia kembali.`,
      href: `/products/${product.slug}`,
      type: "restock",
      productId: product.id,
    });
    toast({
      title: "Kami akan mengabari",
      description: "Notifikasi restock tersimpan di pusat notifikasi akun Anda.",
      tone: "success",
    });
  };

  const handleCompare = () => {
    if (!comparing && compareIds.length >= MAX_COMPARE) {
      toast({ title: "Maksimal 4 produk", description: "Hapus salah satu produk dari daftar bandingkan.", tone: "info" });
      return;
    }
    const added = toggleCompare(product.id);
    toast({
      title: added ? "Ditambahkan ke perbandingan" : "Dihapus dari perbandingan",
      description: product.name,
      tone: added ? "success" : "info",
    });
  };

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border border-sand-200 bg-white transition duration-200 hover:-translate-y-0.5 hover:border-sand-300 hover:shadow-card",
        className
      )}
    >
      <div className="relative aspect-square overflow-hidden bg-sand-50">
        <Link href={`/products/${product.slug}`} aria-label={product.name} className="absolute inset-0 z-10">
          <Image
            src={product.images[0].url}
            alt={product.images[0].alt}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 260px"
            priority={priority}
            className="object-cover transition duration-500 group-hover:scale-[1.03] group-hover:opacity-0"
          />
          <Image
            src={secondary}
            alt=""
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 260px"
            className="object-cover opacity-0 transition duration-500 group-hover:scale-[1.03] group-hover:opacity-100"
          />
        </Link>

        <div className="pointer-events-none absolute left-2 top-2 z-20 flex flex-col items-start gap-1">
          {discount > 0 && (
            <span className="rounded-md bg-brand-600 px-1.5 py-1 text-[10px] font-extrabold leading-none text-white">
              -{discount}%
            </span>
          )}
          {product.isNew && (
            <span className="rounded-md bg-ink px-1.5 py-1 text-[9px] font-bold uppercase leading-none tracking-wide text-white">
              Baru
            </span>
          )}
        </div>

        <button
          onClick={() => {
            const added = toggleWishlist(product.id);
            toast({
              title: added ? "Disimpan ke wishlist" : "Dihapus dari wishlist",
              description: product.name,
              tone: added ? "success" : "info",
            });
          }}
          aria-label={wished ? "Hapus dari wishlist" : "Simpan ke wishlist"}
          aria-pressed={wished}
          className={cn(
            "absolute right-2 top-2 z-20 grid h-8 w-8 place-items-center rounded-full border transition",
            wished ? "border-brand-600 bg-brand-600 text-white" : "border-sand-200 bg-white/90 text-ink-soft backdrop-blur hover:border-brand-400 hover:text-brand-600"
          )}
        >
          <Icon name="heart" size={14} className={wished ? "fill-current" : ""} />
        </button>

        <button
          onClick={handleCompare}
          aria-label="Bandingkan produk"
          aria-pressed={comparing}
          className={cn(
            "absolute bottom-2 right-2 z-20 hidden h-8 items-center gap-1 rounded-md border px-2 text-[10px] font-bold backdrop-blur transition sm:flex",
            comparing ? "border-brand-600 bg-brand-600 text-white" : "border-sand-200 bg-white/90 text-ink-soft opacity-0 group-hover:opacity-100"
          )}
        >
          <Icon name="compare" size={13} /> {comparing ? "Dipilih" : "Bandingkan"}
        </button>

        {stock === 0 && (
          <div className="absolute inset-0 z-10 grid place-items-center bg-white/65 backdrop-blur-[1px]">
            <span className="rounded-md bg-ink/85 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-white">Stok habis</span>
          </div>
        )}

        {onQuickView && stock > 0 && (
          <button
            onClick={() => onQuickView(product)}
            className="absolute inset-x-2 bottom-2 z-20 hidden translate-y-2 items-center justify-center gap-1.5 rounded-md bg-white/95 py-2 text-[11px] font-bold text-ink opacity-0 shadow-soft backdrop-blur transition group-hover:translate-y-0 group-hover:opacity-100 sm:flex"
          >
            <Icon name="eye" size={13} /> Lihat cepat
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-muted">{product.brand}</p>
        <h3 className="mt-1">
          <Link href={`/products/${product.slug}`} className="line-clamp-2 min-h-[36px] text-[13px] font-semibold leading-snug text-ink transition hover:text-brand-600">
            {product.name}
          </Link>
        </h3>

        <div className="mt-1.5">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="text-[15px] font-extrabold text-brand-600">{formatIDR(product.basePrice)}</span>
            {product.comparePrice && product.comparePrice > product.basePrice && (
              <span className="text-[11px] text-ink-muted line-through">{formatIDR(product.comparePrice)}</span>
            )}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-[10px] text-ink-muted">
            <StarRow value={product.rating} size={10} />
            <span>{product.rating.toFixed(1)}</span>
            <span className="h-2.5 w-px bg-sand-300" />
            <span>{formatNumber(product.sold)} terjual</span>
          </div>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-1">
          <span className="inline-flex items-center gap-1 rounded bg-olive-50 px-1.5 py-0.5 text-[9px] font-semibold text-olive-700">
            <Icon name="truck" size={10} /> Gratis ongkir
          </span>
          {product.isBestSeller && (
            <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[9px] font-semibold text-amber-700">Terlaris</span>
          )}
        </div>

        <div className="mt-auto flex items-end justify-between gap-2 pt-2.5">
          {stock > 0 ? (
            <span className="text-[10px] font-medium text-ink-muted">Stok {stock}</span>
          ) : (
            <button onClick={askRestock} className="inline-flex items-center gap-1 text-[10px] font-bold text-brand-600 hover:underline">
              <Icon name="bell" size={11} /> Beri tahu saya
            </button>
          )}
          <button
            onClick={quickAdd}
            disabled={stock === 0}
            aria-label={`Tambah ${product.name} ke keranjang`}
            className="inline-flex h-8 items-center gap-1 rounded-md border border-brand-200 bg-brand-50 px-2.5 text-[11px] font-bold text-brand-700 transition hover:bg-brand-600 hover:text-white disabled:opacity-30"
          >
            <Icon name="bag" size={13} className="hidden sm:block" />
            <Icon name="plus" size={14} className="sm:hidden" />
            <span className="hidden sm:inline">Tambah</span>
          </button>
        </div>
      </div>
    </article>
  );
}
