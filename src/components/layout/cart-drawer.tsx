"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { useCart } from "@/store/commerce";
import { useCatalog } from "@/store/catalog";
import { calcCouponDiscount, formatIDR } from "@/lib/utils";
import { Drawer } from "@/components/ui/overlay";
import { Button, Progress, QuantityStepper } from "@/components/ui/primitives";
import { buttonStyles } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/icon";
import { useToast } from "@/components/ui/toast";

export function CartDrawer() {
  const items = useCart((state) => state.items);
  const isOpen = useCart((state) => state.isOpen);
  const setOpen = useCart((state) => state.setOpen);
  const updateQty = useCart((state) => state.updateQty);
  const removeItem = useCart((state) => state.removeItem);
  const addItem = useCart((state) => state.addItem);
  const subtotal = useCart((state) => state.subtotal);
  const itemCount = useCart((state) => state.count());
  const couponCode = useCart((state) => state.couponCode);
  const products = useCatalog((state) => state.products);
  const coupons = useCatalog((state) => state.coupons);
  const threshold = useCatalog((state) => state.settings.freeShippingThreshold);
  const { toast } = useToast();

  const total = subtotal();
  const coupon = coupons.find((item) => item.code === couponCode) ?? null;
  const discount = calcCouponDiscount(total, coupon);
  const remaining = Math.max(0, threshold - total);
  const progress = Math.min(100, (total / threshold) * 100);

  const recommended = useMemo(() => {
    return products.find((product) => {
      const inCart = items.some((item) => item.productId === product.id);
      return !inCart && product.status === "active" && product.variants.some((variant) => variant.stock > 0);
    });
  }, [products, items]);

  const handleAddRecommended = () => {
    if (!recommended) return;
    const variant = recommended.variants.find((item) => item.stock > 0) ?? recommended.variants[0];
    addItem({
      productId: recommended.id,
      variantId: variant.id,
      slug: recommended.slug,
      name: recommended.name,
      variantName: variant.name,
      image: recommended.images[0].url,
      price: variant.price,
      qty: 1,
      stock: variant.stock,
    });
    toast({ title: "Ditambahkan ke keranjang", description: recommended.name, tone: "success" });
  };

  return (
    <Drawer
      open={isOpen}
      onClose={() => setOpen(false)}
      title={`Keranjang belanja (${itemCount})`}
      footer={
        items.length > 0 ? (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-ink-soft">Subtotal ({itemCount} produk)</span>
              <span className="text-lg font-extrabold text-brand-600">{formatIDR(total)}</span>
            </div>
            {discount > 0 && (
              <div className="flex items-center justify-between text-[12px] font-semibold text-olive-600">
                <span>Diskon ({couponCode})</span>
                <span>−{formatIDR(discount)}</span>
              </div>
            )}
            <p className="text-[10px] text-ink-muted">Ongkir dan voucher dihitung otomatis di checkout.</p>
            <Link href="/checkout" onClick={() => setOpen(false)} className={buttonStyles({ className: "w-full" })}>
              Lanjut ke checkout <Icon name="arrow-right" size={15} />
            </Link>
            <Link
              href="/cart"
              onClick={() => setOpen(false)}
              className="block text-center text-[11px] font-semibold text-ink-soft underline decoration-sand-400 underline-offset-4 hover:text-ink"
            >
              Lihat keranjang
            </Link>
            <p className="flex items-center justify-center gap-1.5 text-[9px] text-ink-muted">
              <Icon name="lock" size={11} /> Pembayaran aman & terenkripsi
            </p>
          </div>
        ) : undefined
      }
    >
      {items.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center px-6 py-16 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-brand-50 text-brand-600">
            <Icon name="bag" size={26} />
          </span>
          <h3 className="mt-4 text-lg font-extrabold text-ink">Keranjang masih kosong</h3>
          <p className="mt-1.5 max-w-xs text-[12px] leading-relaxed text-ink-muted">
            Yuk, mulai belanja dan temukan produk favoritmu hari ini.
          </p>
          <Link href="/products" onClick={() => setOpen(false)} className={buttonStyles({ className: "mt-5", size: "sm" })}>
            Mulai belanja <Icon name="arrow-right" size={14} />
          </Link>
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="border-b border-sand-200 bg-brand-50/60 px-5 py-3.5">
            {remaining > 0 ? (
              <p className="text-[11px] text-ink-soft">
                <span className="font-bold text-brand-700">{formatIDR(remaining)}</span> lagi untuk gratis ongkir
              </p>
            ) : (
              <p className="flex items-center gap-1.5 text-[11px] font-semibold text-olive-700">
                <Icon name="check-circle" size={14} /> Anda mendapat gratis ongkir
              </p>
            )}
            <Progress value={progress} className="mt-2" />
          </div>

          <ul className="divide-y divide-sand-200 px-5">
            {items.map((item) => (
              <li key={`${item.productId}-${item.variantId}`} className="flex gap-3 py-4">
                <Link href={`/products/${item.slug}`} onClick={() => setOpen(false)} className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-canvas">
                  <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <Link
                        href={`/products/${item.slug}`}
                        onClick={() => setOpen(false)}
                        className="line-clamp-2 text-[12px] font-semibold leading-snug text-ink hover:text-brand-600"
                      >
                        {item.name}
                      </Link>
                      {item.variantName && <p className="mt-0.5 text-[11px] text-ink-muted">{item.variantName}</p>}
                    </div>
                    <button
                      onClick={() => removeItem(item.productId, item.variantId)}
                      aria-label={`Hapus ${item.name}`}
                      className="rounded-full p-1 text-ink-muted transition hover:bg-sand-100 hover:text-danger"
                    >
                      <Icon name="close" size={14} />
                    </button>
                  </div>
                  <div className="mt-auto flex items-end justify-between gap-2 pt-2">
                    <QuantityStepper
                      value={item.qty}
                      onChange={(value) => updateQty(item.productId, item.variantId, value)}
                      max={item.stock}
                      size="sm"
                    />
                    <span className="text-sm font-semibold text-ink">{formatIDR(item.price * item.qty)}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {recommended && (
            <div className="m-4 rounded-xl border border-brand-100 bg-brand-50/40 p-3.5">
              <p className="mb-2.5 text-[10px] font-bold uppercase tracking-wider text-brand-700">Sering dibeli bersama</p>
              <div className="flex items-center gap-2.5">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-white">
                  <Image src={recommended.images[0].url} alt={recommended.name} fill sizes="56px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-[11px] font-semibold text-ink">{recommended.name}</p>
                  <p className="mt-0.5 text-[11px] font-bold text-brand-600">{formatIDR(recommended.basePrice)}</p>
                </div>
                <Button variant="outline" size="sm" onClick={handleAddRecommended}>
                  <Icon name="plus" size={12} /> Tambah
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </Drawer>
  );
}
