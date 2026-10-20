"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/types";
import { useCatalog } from "@/store/catalog";
import { useCart, useWishlist } from "@/store/commerce";
import { useToast } from "@/components/ui/toast";
import { Button, EmptyState } from "@/components/ui/primitives";
import { buttonStyles } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/icon";
import { ProductCard } from "@/components/product/product-card";
import { QuickView } from "@/components/product/quick-view";

export default function WishlistPage() {
  const { toast } = useToast();
  const products = useCatalog((state) => state.products);
  const ids = useWishlist((state) => state.ids);
  const toggle = useWishlist((state) => state.toggle);
  const remove = useWishlist((state) => state.remove);
  const addItem = useCart((state) => state.addItem);
  const [quickView, setQuickView] = useState<Product | null>(null);

  const wished = ids
    .map((id) => products.find((product) => product.id === id))
    .filter((product): product is Product => Boolean(product));

  const addAll = () => {
    let added = 0;
    wished.forEach((product) => {
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
      added += 1;
    });
    toast({
      title: added > 0 ? `${added} produk masuk keranjang` : "Semua produk sedang habis",
      tone: added > 0 ? "success" : "danger",
    });
  };

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-600">Wishlist</p>
          <h1 className="mt-1 text-xl font-extrabold tracking-tight text-ink sm:text-2xl">Produk yang Anda simpan.</h1>
          <p className="mt-2 text-sm text-ink-soft">
            {wished.length > 0 ? `${wished.length} produk menunggu di wishlist Anda.` : "Simpan produk favorit agar mudah ditemukan nanti."}
          </p>
        </div>
        {wished.length > 0 && (
          <div className="flex gap-2">
            <Button size="sm" onClick={addAll}>
              <Icon name="bag" size={14} /> Tambah semua ke keranjang
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                ids.forEach((id) => remove(id));
                toast({ title: "Wishlist dikosongkan", tone: "info" });
              }}
            >
              <Icon name="trash" size={14} /> Bersihkan
            </Button>
          </div>
        )}
      </header>

      {wished.length === 0 ? (
        <EmptyState
          className="mt-8"
          icon="heart"
          title="Wishlist masih kosong"
          description="Tekan ikon hati pada produk mana pun untuk menyimpannya di sini."
          action={
            <Link href="/products" className={buttonStyles({})}>
              Jelajahi produk <Icon name="arrow-right" size={15} />
            </Link>
          }
        />
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {wished.map((product) => (
            <div key={product.id} className="relative">
              <ProductCard product={product} onQuickView={setQuickView} />
              <button
                onClick={() => {
                  toggle(product.id);
                  toast({ title: "Dihapus dari wishlist", description: product.name, tone: "info" });
                }}
                className="absolute right-12 top-2.5 z-20 hidden h-7 w-7 place-items-center rounded-md border border-sand-200 bg-white/95 text-ink-soft shadow-soft backdrop-blur transition hover:border-danger hover:text-danger group-hover:grid sm:grid"
                aria-label={`Hapus ${product.name} dari wishlist`}
              >
                <Icon name="close" size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <QuickView product={quickView} open={Boolean(quickView)} onClose={() => setQuickView(null)} />
    </div>
  );
}
