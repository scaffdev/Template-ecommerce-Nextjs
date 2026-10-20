"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useCatalog } from "@/store/catalog";
import { useToast } from "@/components/ui/toast";
import { ProductForm } from "@/components/admin/product-form";
import { AdminPageHeader } from "@/components/admin/ui";
import { Button } from "@/components/ui/primitives";
import { buttonStyles } from "@/components/ui/button-styles";
import { Modal } from "@/components/ui/overlay";
import { Icon } from "@/components/ui/icon";

export default function AdminEditProductPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const products = useCatalog((state) => state.products);
  const deleteProduct = useCatalog((state) => state.deleteProduct);
  const product = products.find((item) => item.id === params.id);
  const [confirming, setConfirming] = useState(false);

  if (!product) {
    return (
      <div className="card-surface mx-auto max-w-lg p-10 text-center">
        <Icon name="box" size={28} className="mx-auto text-ink-muted" />
        <h1 className="display mt-4 text-xl">Produk tidak ditemukan</h1>
        <p className="mt-2 text-sm text-ink-muted">Produk mungkin sudah dihapus dari katalog demo.</p>
        <Link href="/admin/products" className={buttonStyles({ className: "mt-6" })}>
          Kembali ke daftar produk
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Edit produk"
        title={product.name}
        description={`${product.variants.length} varian · ${product.sold} terjual · rating ${product.rating || "—"}`}
        actions={
          <>
            <Link href="/admin/products" className="inline-flex items-center gap-2 text-xs font-semibold text-ink-soft transition hover:text-ink">
              <Icon name="arrow-left" size={14} /> Daftar
            </Link>
            <Button variant="danger" size="sm" onClick={() => setConfirming(true)}>
              <Icon name="trash" size={14} /> Hapus
            </Button>
          </>
        }
      />
      <ProductForm product={product} />

      <Modal open={confirming} onClose={() => setConfirming(false)} title="Hapus produk ini?">
        <p className="text-sm leading-relaxed text-ink-soft">
          <strong className="text-ink">{product.name}</strong> akan dihapus dari katalog demo beserta variannya. Tindakan
          ini tidak bisa dibatalkan.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setConfirming(false)}>
            Batal
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              deleteProduct(product.id);
              toast({ title: "Produk dihapus", description: product.name, tone: "success" });
              router.push("/admin/products");
            }}
          >
            Ya, hapus produk
          </Button>
        </div>
      </Modal>
    </div>
  );
}
