"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ProductDetail } from "@/components/product/product-detail";
import { useCatalog } from "@/store/catalog";
import { Button, EmptyState } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/icon";

export default function ProductPage() {
  const params = useParams<{ slug: string }>();
  const products = useCatalog((state) => state.products);
  const product = products.find((item) => item.slug === params.slug);

  if (!product) {
    return (
      <div className="container-lume py-24">
        <EmptyState
          icon="box"
          title="Produk tidak ditemukan"
          description="Produk ini mungkin sudah dihapus atau tautannya berubah. Coba lihat koleksi lain kami."
          action={
            <Link href="/products">
              <Button>
                Kembali ke katalog <Icon name="arrow-right" size={15} />
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  return <ProductDetail product={product} />;
}
