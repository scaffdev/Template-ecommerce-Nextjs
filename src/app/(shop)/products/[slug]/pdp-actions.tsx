"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { products } from "@/lib/data";
import { formatIDR } from "@/lib/utils";
import { useCart, useWishlist } from "@/store/shop";
import { Button } from "@/components/ui/primitives";

export function PdpActions({ productId }: { productId: string }) {
  const p = products.find((x) => x.id === productId)!;
  const [variantId, setVariantId] = useState(p.variants[0]?.id);
  const [qty, setQty] = useState(1);
  const addItem = useCart((s) => s.addItem);
  const wish = useWishlist((s) => s.ids);
  const toggle = useWishlist((s) => s.toggle);
  const router = useRouter();

  const variant = useMemo(() => p.variants.find((v) => v.id === variantId) ?? p.variants[0], [p, variantId]);
  const price = variant?.price ?? p.basePrice;
  const stock = variant?.stock ?? 0;
  const wished = wish.includes(p.id);

  const doAdd = (goCheckout: boolean) => {
    if (stock === 0) return;
    addItem({
      productId: p.id,
      variantId: variant?.id,
      name: p.name,
      variantName: variant?.name,
      image: variant?.imageUrl ?? p.images[0]?.url,
      price,
      qty: Math.min(qty, stock),
      stock,
    });
    if (goCheckout) router.push("/checkout");
    else router.push("/cart");
  };

  return (
    <div className="mt-4 space-y-3">
      <div>
        <p className="text-xs font-semibold text-gray-600">Pilih Varian: <b>{variant?.name}</b></p>
        <div className="mt-1.5 flex flex-wrap gap-2">
          {p.variants.map((v) => (
            <button
              key={v.id}
              disabled={v.stock === 0}
              onClick={() => setVariantId(v.id)}
              className={`rounded-lg border px-3 py-2 text-sm font-semibold disabled:opacity-40 ${v.id === variantId ? "border-sky-600 bg-sky-50 text-sky-700" : "bg-white"}`}
            >
              {v.name} {v.stock === 0 ? "(Habis)" : `(${v.stock})`}
            </button>
          ))}
        </div>
      </div>
      <p className="text-sm">Stok: {stock > 0 ? <b className="text-emerald-600">{stock} tersedia</b> : <b className="text-red-600">Stok Habis</b>} • Harga: <b>{formatIDR(price)}</b></p>
      <div className="flex items-center gap-2">
        <div className="flex items-center rounded-lg border">
          <button className="px-3 py-2" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Kurangi">−</button>
          <span className="w-10 text-center font-bold">{qty}</span>
          <button className="px-3 py-2" onClick={() => setQty((q) => Math.min(stock || 1, q + 1))} aria-label="Tambah">+</button>
        </div>
        <button onClick={() => toggle(p.id)} className={`rounded-lg border px-3 py-2 text-sm ${wished ? "bg-red-50 text-red-600" : ""}`} aria-label="Wishlist">
          {wished ? "♥ Wishlist" : "♡ Wishlist"}
        </button>
        <button
          onClick={() => { const url = `${location.origin}/products/${p.slug}`; navigator.clipboard?.writeText(url); alert("Tautan produk disalin!"); }}
          className="rounded-lg border px-3 py-2 text-sm" aria-label="Bagikan">Bagikan</button>
      </div>
      <div className="sticky bottom-0 flex gap-2 bg-white/90 py-2 md:static">
        <Button disabled={stock === 0} onClick={() => doAdd(false)} variant="outline" className="flex-1">
          {stock === 0 ? "Stok Habis" : "Tambah ke Keranjang"}
        </Button>
        <Button disabled={stock === 0} onClick={() => doAdd(true)} className="flex-1">Beli Sekarang</Button>
      </div>
      <Link href="/cart" className="text-xs text-sky-600 underline">Lihat keranjang →</Link>
    </div>
  );
}
