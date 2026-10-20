"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Suspense } from "react";
import { CatalogBrowser } from "@/components/product/catalog-browser";
import { useCatalog } from "@/store/catalog";
import { Button, EmptyState, Skeleton } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/icon";

function CategoryFallback() {
  return (
    <div className="container-lume grid grid-cols-2 gap-3 py-5 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index}>
          <Skeleton className="aspect-square w-full rounded-lg" />
          <Skeleton className="mt-3 h-3 w-1/3" />
          <Skeleton className="mt-2 h-4 w-4/5" />
        </div>
      ))}
    </div>
  );
}

function CategoryContent() {
  const params = useParams<{ slug: string }>();
  const categories = useCatalog((state) => state.categories);
  const category = categories.find((item) => item.slug === params.slug);

  if (!category) {
    return (
      <div className="container-lume py-10">
        <EmptyState
          icon="layout-grid"
          title="Kategori tidak ditemukan"
          description="Kategori yang Anda cari mungkin sudah berganti nama atau tidak tersedia lagi."
          action={
            <Link href="/products">
              <Button>
                Lihat semua produk <Icon name="arrow-right" size={15} />
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <CatalogBrowser
      eyebrow={`Kategori — ${category.tagline}`}
      title={category.name}
      description={category.description}
      initialCategoryId={category.id}
      hideCategoryFilter
    />
  );
}

export default function CategoryPage() {
  return (
    <Suspense fallback={<CategoryFallback />}>
      <CategoryContent />
    </Suspense>
  );
}
