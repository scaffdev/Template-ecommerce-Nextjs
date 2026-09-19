import Link from "next/link";
import type { Product } from "@/types";
import { formatIDR } from "@/lib/utils";
import { Badge, Rating } from "@/components/ui/primitives";

export function ProductCard({ p }: { p: Product }) {
  const outOfStock = p.variants.every((v) => v.stock === 0);
  const disc = p.comparePrice ? Math.round((1 - p.basePrice / p.comparePrice) * 100) : 0;
  return (
    <Link
      href={`/products/${p.slug}`}
      className="group overflow-hidden rounded-2xl border bg-white transition hover:shadow-lg"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.images[0]?.url} alt={p.images[0]?.alt ?? p.name} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition" />
        {disc > 0 && (
          <span className="absolute left-2 top-2 rounded-full bg-red-600 px-2 py-0.5 text-xs font-bold text-white">-{disc}%</span>
        )}
        {outOfStock && (
          <span className="absolute inset-x-0 bottom-0 bg-black/60 py-1 text-center text-xs font-bold text-white">STOK HABIS</span>
        )}
      </div>
      <div className="space-y-1 p-3">
        <p className="line-clamp-2 min-h-[2.5rem] text-sm font-medium">{p.name}</p>
        <div className="flex items-baseline gap-2">
          <b className="text-sky-700">{formatIDR(p.basePrice)}</b>
          {p.comparePrice && <s className="text-xs text-gray-400">{formatIDR(p.comparePrice)}</s>}
        </div>
        <div className="flex items-center justify-between">
          <Rating value={p.rating} count={p.reviewCount} />
          <span className="text-[11px] text-gray-500">Terjual {p.sold.toLocaleString("id-ID")}</span>
        </div>
        <div className="flex gap-1 pt-1">
          {p.isBestSeller && <Badge tone="red">Best Seller</Badge>}
          {p.isNew && <Badge tone="green">Terbaru</Badge>}
        </div>
      </div>
    </Link>
  );
}
