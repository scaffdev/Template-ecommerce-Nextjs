"use client";
import { useWishlist } from "@/store/shop";
import { products } from "@/lib/data";
import { ProductCard } from "@/components/product/ProductCard";

export default function WishlistPage() {
  const ids = useWishlist((s) => s.ids);
  const items = products.filter((p) => ids.includes(p.id));
  return (
    <div>
      <h1 className="text-xl font-bold">Wishlist ({items.length})</h1>
      {items.length === 0 && <p className="mt-3 text-sm text-gray-500">Belum ada favorit. Klik ♡ pada halaman produk.</p>}
      <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3">
        {items.map((p) => <ProductCard key={p.id} p={p} />)}
      </div>
    </div>
  );
}
