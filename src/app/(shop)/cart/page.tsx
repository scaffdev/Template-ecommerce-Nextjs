"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useCart, useWishlist } from "@/store/commerce";
import { findCouponByCode, useCatalog } from "@/store/catalog";
import { calcCouponDiscount, couponRejectionReason, formatIDR, isFreeShipping } from "@/lib/utils";
import { useHydrated } from "@/components/ui/hooks";
import { useToast } from "@/components/ui/toast";
import { Badge, Button, Divider, EmptyState, Input, Progress, QuantityStepper } from "@/components/ui/primitives";
import { buttonStyles } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/icon";
import { ProductRail } from "@/components/product/product-rail";

export default function CartPage() {
  const hydrated = useHydrated();
  const { toast } = useToast();
  const items = useCart((state) => state.items);
  const subtotal = useCart((state) => state.subtotal());
  const couponCode = useCart((state) => state.couponCode);
  const setCoupon = useCart((state) => state.setCoupon);
  const updateQty = useCart((state) => state.updateQty);
  const removeItem = useCart((state) => state.removeItem);
  const toggleWishlist = useWishlist((state) => state.toggle);
  const products = useCatalog((state) => state.products);
  const settings = useCatalog((state) => state.settings);

  const [code, setCode] = useState(couponCode);

  const coupon = useMemo(() => (couponCode ? findCouponByCode(couponCode) : null), [couponCode]);
  const discount = coupon ? calcCouponDiscount(subtotal, coupon) : 0;
  const freeShipping = isFreeShipping(subtotal, coupon, settings.freeShippingThreshold);
  const remainingForFreeShipping = Math.max(0, settings.freeShippingThreshold - subtotal);
  const progress = Math.min(100, Math.round((subtotal / settings.freeShippingThreshold) * 100));

  const applyCoupon = () => {
    const found = findCouponByCode(code);
    const reason = couponRejectionReason(subtotal, found);
    if (reason) {
      toast({ title: "Voucher tidak bisa dipakai", description: reason, tone: "danger" });
      return;
    }
    setCoupon(found!.code);
    toast({
      title: `Voucher ${found!.code} aktif`,
      description: found!.description,
      tone: "success",
    });
  };

  const removeCoupon = () => {
    setCoupon("");
    setCode("");
    toast({ title: "Voucher dilepas", tone: "info" });
  };

  const recommended = products.filter((product) => product.isFeatured).slice(0, 8);

  if (items.length === 0) {
    return (
      <>
        <div className="container-lume py-5 sm:py-7">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] text-ink-muted">
            <Link href="/" className="hover:text-brand-600">
              Beranda
            </Link>
            <Icon name="chevron-right" size={11} />
            <span className="text-ink">Keranjang</span>
          </nav>
          <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">Keranjang Anda</h1>
          <EmptyState
            className="mt-4"
            icon="bag"
            title="Keranjang masih kosong"
            description="Mulai dari produk yang paling sering dipesan, atau telusuri koleksi lengkap kami."
            action={
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/products" className={buttonStyles({})}>
                  Belanja sekarang <Icon name="arrow-right" size={15} />
                </Link>
                <Link href="/account/wishlist" className={buttonStyles({ variant: "outline" })}>
                  Lihat wishlist
                </Link>
              </div>
            }
          />
        </div>
        <div className="border-t border-sand-200 py-16">
          <ProductRail eyebrow="Rekomendasi" title="Mungkin Anda suka" products={recommended} href="/products" />
        </div>
      </>
    );
  }

  return (
    <div className="container-lume py-5 sm:py-7">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] text-ink-muted">
        <Link href="/" className="hover:text-brand-600">
          Beranda
        </Link>
        <Icon name="chevron-right" size={11} />
        <span className="text-ink">Keranjang</span>
      </nav>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">Keranjang Anda</h1>
          <p className="mt-1 text-[12px] text-ink-muted">
            {hydrated ? `${items.length} jenis produk` : "Memuat keranjang…"} · harga sudah termasuk PPN 11%
          </p>
        </div>
        <Link href="/products" className={buttonStyles({ variant: "ghost", size: "sm" })}>
          <Icon name="arrow-left" size={14} /> Lanjut belanja
        </Link>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.6fr_1fr] lg:gap-6">
        <div>
          {!freeShipping && (
            <div className="mb-4 rounded-xl border border-brand-100 bg-brand-50 p-3.5">
              <p className="flex items-center gap-2 text-[11px] font-semibold text-brand-700">
                <Icon name="truck" size={15} />
                {remainingForFreeShipping > 0
                  ? `Tambah ${formatIDR(remainingForFreeShipping)} lagi untuk gratis ongkir`
                  : "Gratis ongkir untuk pesanan ini"}
              </p>
              <Progress value={progress} className="mt-2.5" />
            </div>
          )}

          <ul className="divide-y divide-sand-200 overflow-hidden rounded-xl border border-sand-200 bg-white">
            {items.map((item) => (
              <li key={`${item.productId}-${item.variantId}`} className="flex gap-3 p-3 sm:gap-4 sm:p-4">
                <Link
                  href={`/products/${item.slug}`}
                  className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-sand-50 sm:h-32 sm:w-28"
                >
                  <Image src={item.image} alt={item.name} fill sizes="140px" className="object-cover" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link href={`/products/${item.slug}`} className="line-clamp-2 text-[13px] font-bold text-ink hover:text-brand-600 sm:text-[14px]">
                        {item.name}
                      </Link>
                      {item.variantName && <p className="mt-0.5 text-[10px] text-ink-muted">Varian: {item.variantName}</p>}
                      <p className="mt-1 text-[10px] font-medium text-olive-600">
                        {item.stock > 0 ? "Stok tersedia" : "Stok habis — hapus untuk melanjutkan"}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        removeItem(item.productId, item.variantId);
                        toast({ title: "Produk dihapus", description: item.name, tone: "info" });
                      }}
                      aria-label={`Hapus ${item.name}`}
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-ink-muted transition hover:bg-sand-100 hover:text-danger"
                    >
                      <Icon name="trash" size={16} />
                    </button>
                  </div>
                  <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-4">
                    <div className="flex items-center gap-3">
                      <QuantityStepper
                        size="sm"
                        value={item.qty}
                        max={Math.max(1, item.stock)}
                        onChange={(qty) => updateQty(item.productId, item.variantId, qty)}
                      />
                      <button
                        onClick={() => {
                          toggleWishlist(item.productId);
                          removeItem(item.productId, item.variantId);
                          toast({ title: "Dipindahkan ke wishlist", description: item.name, tone: "success" });
                        }}
                        className="text-[10px] font-semibold text-ink-muted underline decoration-sand-300 underline-offset-4 transition hover:text-brand-600"
                      >
                        Pindah ke wishlist
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-[14px] font-extrabold text-brand-600">{formatIDR(item.price * item.qty)}</p>
                      {item.qty > 1 && <p className="text-[10px] text-ink-muted">{formatIDR(item.price)} / item</p>}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-[10px] text-ink-muted">
            <Icon name="lock" size={14} />
            Transaksi dienkripsi dan diproses melalui payment gateway bersertifikat PCI-DSS.
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-sand-200 bg-white p-4 sm:p-5">
            <h2 className="text-[12px] font-extrabold text-ink">Ringkasan pesanan</h2>
            <dl className="mt-4 space-y-2.5 text-[12px]">
              <div className="flex justify-between gap-3">
                <dt className="text-ink-soft">Subtotal</dt>
                <dd className="font-semibold text-ink">{formatIDR(subtotal)}</dd>
              </div>
              {discount > 0 && (
                <div className="flex justify-between gap-3">
                  <dt className="text-ink-soft">Diskon voucher</dt>
                  <dd className="font-semibold text-success">−{formatIDR(discount)}</dd>
                </div>
              )}
              <div className="flex justify-between gap-3">
                <dt className="text-ink-soft">Ongkos kirim</dt>
                <dd className="font-semibold text-ink">{freeShipping ? "Gratis" : "Dihitung saat checkout"}</dd>
              </div>
            </dl>

            <Divider className="my-5" />

            <div className="flex items-end justify-between gap-3">
              <span className="text-sm text-ink-soft">Total</span>
              <span className="text-xl font-extrabold text-brand-600">{formatIDR(Math.max(0, subtotal - discount))}</span>
            </div>

            <div className="mt-6">
              {coupon ? (
                <div className="flex items-center justify-between gap-3 rounded-xl border border-olive-200 bg-olive-50 p-3.5">
                  <div className="flex items-center gap-2.5">
                    <Icon name="ticket" size={16} className="text-olive-700" />
                    <div>
                      <p className="text-xs font-bold text-olive-800">{coupon.code}</p>
                      <p className="text-[10px] text-olive-700">{coupon.description}</p>
                    </div>
                  </div>
                  <button onClick={removeCoupon} aria-label="Hapus voucher" className="text-ink-muted transition hover:text-danger">
                    <Icon name="close" size={15} />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    value={code}
                    onChange={(event) => setCode(event.target.value.toUpperCase())}
                    placeholder="Kode voucher"
                    aria-label="Kode voucher"
                  />
                  <Button variant="outline" onClick={applyCoupon}>
                    Pakai
                  </Button>
                </div>
              )}
              <div className="mt-2.5 flex flex-wrap gap-2">
                {["TOKOBAGUS10", "GRATISONGKIR"].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setCode(suggestion)}
                    className="rounded-md border border-dashed border-sand-400 px-2.5 py-1 text-[10px] font-semibold text-ink-muted transition hover:border-brand-400 hover:text-brand-600"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            <Link href="/checkout" className={buttonStyles({ size: "lg", className: "mt-4 w-full" })}>
              Lanjut ke checkout <Icon name="arrow-right" size={16} />
            </Link>
            <p className="mt-3 text-center text-[11px] leading-relaxed text-ink-muted">
              Dengan melanjutkan, Anda menyetujui <Link href="/terms" className="underline underline-offset-2">syarat & ketentuan</Link> kami.
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 border-t border-sand-200 pt-5">
              {settings.paymentMethods.slice(0, 4).map((method) => (
                <Badge key={method.id} tone="sand">
                  {method.name}
                </Badge>
              ))}
            </div>
          </div>

          <div className="mt-3 flex items-start gap-2.5 rounded-xl bg-sand-50 p-3 text-[10px] leading-relaxed text-ink-muted">
            <Icon name="refresh" size={14} className="mt-0.5 shrink-0 text-brand-600" />
            Butuh mengubah pesanan? Anda bisa membatalkan dalam 2 jam setelah checkout dengan dana kembali penuh.
          </div>
        </aside>
      </div>

      <div className="mt-6 border-t border-sand-200 bg-white py-6">
        <ProductRail eyebrow="Sering dibeli bersama" title="Lengkapi pesanan Anda" products={recommended} href="/products" />
      </div>
    </div>
  );
}
