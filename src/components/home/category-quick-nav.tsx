"use client";

import Image from "next/image";
import Link from "next/link";
import { useCatalog } from "@/store/catalog";

export function CategoryQuickNav() {
  const categories = useCatalog((state) => state.categories);
  const products = useCatalog((state) => state.products);

  return (
    <section className="rounded-xl border border-sand-200 bg-white p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-extrabold text-ink sm:text-base">Kategori pilihan</h2>
        <Link href="/products" className="text-[11px] font-bold text-brand-600 hover:underline">
          Lihat semua
        </Link>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-3">
        {categories.map((category) => {
          const count = products.filter((product) => product.categoryId === category.id).length;
          return (
            <Link key={category.id} href={`/category/${category.slug}`} className="group flex flex-col items-center gap-2 rounded-lg p-1.5 transition hover:bg-brand-50">
              <span className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-sand-200 transition group-hover:border-brand-400 sm:h-16 sm:w-16">
                <Image src={category.image} alt={category.name} fill sizes="64px" className="object-cover transition duration-300 group-hover:scale-110" />
              </span>
              <span className="text-center">
                <span className="block text-[11px] font-bold text-ink group-hover:text-brand-600 sm:text-xs">{category.name}</span>
                <span className="block text-[9px] text-ink-muted">{count} produk</span>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
