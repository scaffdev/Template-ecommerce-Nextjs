import { Suspense } from "react";
import type { Metadata } from "next";
import { CatalogBrowser } from "@/components/product/catalog-browser";
import { Skeleton } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Semua Produk",
  description:
    "Jelajahi seluruh produk tokobagus.com — fashion, elektronik, kecantikan, perlengkapan rumah, dan aksesori pilihan dengan harga terbaik.",
};

function CatalogFallback() {
  return (
    <div className="container-lume grid grid-cols-2 gap-3 py-5 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index}>
          <Skeleton className="aspect-square w-full rounded-lg" />
          <Skeleton className="mt-2 h-3 w-1/3" />
          <Skeleton className="mt-1.5 h-4 w-4/5" />
          <Skeleton className="mt-1.5 h-4 w-1/4" />
        </div>
      ))}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<CatalogFallback />}>
      <CatalogBrowser
        eyebrow="Katalog"
        title="Semua Produk"
        description="Temukan produk favorit dengan filter kategori, brand, harga, rating, dan diskon. Semua produk original dan bergaransi."
      />
    </Suspense>
  );
}
