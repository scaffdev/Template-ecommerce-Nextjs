"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/types";
import { formatIDR } from "@/lib/utils";
import { useCart } from "@/store/commerce";
import { Modal } from "@/components/ui/overlay";
import { Button, QuantityStepper } from "@/components/ui/primitives";
import { buttonStyles } from "@/components/ui/button-styles";
import { Icon, StarRow } from "@/components/ui/icon";
import { useToast } from "@/components/ui/toast";

export function QuickView({
  product,
  open,
  onClose,
}: {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}) {
  const addItem = useCart((state) => state.addItem);
  const { toast } = useToast();
  const [variantId, setVariantId] = useState<string | undefined>(product?.variants[0]?.id);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setVariantId(product?.variants.find((variant) => variant.stock > 0)?.id ?? product?.variants[0]?.id);
    setQty(1);
  }, [product]);

  const variant = useMemo(
    () => product?.variants.find((item) => item.id === variantId) ?? product?.variants[0],
    [product, variantId]
  );

  if (!product || !variant) return null;

  const handleAdd = () => {
    addItem({
      productId: product.id,
      variantId: variant.id,
      slug: product.slug,
      name: product.name,
      variantName: variant.name,
      image: variant.imageUrl ?? product.images[0].url,
      price: variant.price,
      qty,
      stock: variant.stock,
    });
    toast({ title: "Ditambahkan ke keranjang", description: `${product.name} — ${variant.name}`, tone: "success" });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} size="lg" className="overflow-hidden p-0">
      <div className="grid sm:grid-cols-2">
        <div className="relative aspect-square bg-canvas sm:aspect-auto sm:min-h-[420px]">
          <Image src={product.images[0].url} alt={product.name} fill sizes="(max-width: 640px) 100vw, 480px" className="object-cover" />
        </div>
        <div className="flex flex-col p-6 sm:p-7">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted">{product.brand}</p>
          <h2 className="display mt-2 text-2xl leading-tight">{product.name}</h2>
          <div className="mt-2 flex items-center gap-2">
            <StarRow value={product.rating} size={12} />
            <span className="text-xs text-ink-muted">{product.rating.toFixed(1)} · {product.reviewCount} ulasan</span>
          </div>
          <p className="mt-4 text-lg font-semibold text-ink">{formatIDR(variant.price)}</p>
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink-soft">{product.tagline}. {product.description}</p>

          {product.variants.some((item) => item.options.length > 0) && (
            <div className="mt-5">
              <p className="label">Varian</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setVariantId(item.id)}
                    disabled={item.stock === 0}
                    className={`rounded-full border px-3.5 py-2 text-xs font-semibold transition disabled:opacity-35 ${
                      item.id === variant.id ? "border-ink bg-ink text-surface" : "border-sand-300 text-ink-soft hover:border-ink"
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-[11px] text-ink-muted">
                {variant.stock > 0 ? `${variant.stock} tersedia` : "Stok habis"}
              </p>
            </div>
          )}

          <div className="mt-6 flex items-center gap-3">
            <QuantityStepper value={qty} onChange={setQty} max={Math.max(1, variant.stock)} />
            <Button onClick={handleAdd} disabled={variant.stock === 0} className="flex-1">
              Tambah ke keranjang
            </Button>
          </div>
          <Link
            href={`/products/${product.slug}`}
            onClick={onClose}
            className={buttonStyles({ variant: "ghost", className: "mt-2 w-full" })}
          >
            Lihat detail lengkap <Icon name="arrow-right" size={15} />
          </Link>
        </div>
      </div>
    </Modal>
  );
}
