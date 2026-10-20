"use client";

import Link from "next/link";
import { ProductForm } from "@/components/admin/product-form";
import { AdminPageHeader } from "@/components/admin/ui";
import { Icon } from "@/components/ui/icon";

export default function AdminNewProductPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Katalog"
        title="Tambah produk baru"
        description="Lengkapi informasi produk, galeri, varian, dan publikasikan ke storefront."
        actions={
          <Link href="/admin/products" className="inline-flex items-center gap-2 text-xs font-semibold text-ink-soft transition hover:text-ink">
            <Icon name="arrow-left" size={14} /> Kembali ke daftar
          </Link>
        }
      />
      <ProductForm />
    </div>
  );
}
