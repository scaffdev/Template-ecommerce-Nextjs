"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { estimateDelivery, formatIDR } from "@/lib/utils";
import { useOrders } from "@/store/orders";
import { useCatalog } from "@/store/catalog";
import { useHydrated } from "@/components/ui/hooks";
import { useToast } from "@/components/ui/toast";
import { Button, Skeleton } from "@/components/ui/primitives";
import { buttonStyles } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/icon";
import { ProductRail } from "@/components/product/product-rail";

function SuccessFallback() {
  return (
    <div className="container-lume max-w-2xl py-16 text-center">
      <Skeleton className="mx-auto h-16 w-16 rounded-full" />
      <Skeleton className="mx-auto mt-6 h-8 w-72" />
      <Skeleton className="mx-auto mt-3 h-4 w-96" />
    </div>
  );
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");
  const orders = useOrders((state) => state.orders);
  const products = useCatalog((state) => state.products);
  const hydrated = useHydrated();
  const { toast } = useToast();
  const order = orders.find((item) => item.id === orderId) ?? orders[0];

  if (hydrated && !order) {
    return (
      <div className="container-lume max-w-2xl py-16 text-center">
        <h1 className="text-2xl font-extrabold text-ink">Belum ada pesanan</h1>
        <p className="mt-3 text-sm text-ink-soft">Selesaikan checkout terlebih dahulu untuk melihat halaman ini.</p>
        <Link href="/products" className={buttonStyles({ className: "mt-6" })}>
          Mulai belanja <Icon name="arrow-right" size={15} />
        </Link>
      </div>
    );
  }

  const recommended = products.filter((product) => product.isFeatured).slice(0, 8);

  return (
    <>
      <section className="border-b border-sand-200 bg-white">
        <div className="container-lume max-w-3xl py-10 text-center sm:py-14">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-olive-600 text-white animate-scale-in">
            <Icon name="check" size={30} />
          </span>
          <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.18em] text-olive-600">Terima kasih sudah berbelanja</p>
          <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">Pesanan Anda sudah kami terima.</h1>
          <p className="mx-auto mt-3 max-w-xl text-[12px] leading-relaxed text-ink-muted">
            Konfirmasi telah dikirim ke <span className="font-semibold text-ink">{order?.customer.email ?? "email Anda"}</span>. Simpan nomor
            pesanan untuk melacak pengiriman.
          </p>

          {order && (
            <div className="mx-auto mt-8 flex max-w-md flex-wrap items-center justify-center gap-3">
              <button
                onClick={async () => {
                  await navigator.clipboard.writeText(order.orderNumber);
                  toast({ title: "Nomor pesanan disalin", tone: "info" });
                }}
                className="inline-flex items-center gap-2 rounded-lg border border-sand-300 bg-white px-4 py-2.5 text-[12px] font-bold tracking-wide text-ink transition hover:border-brand-400 hover:text-brand-600"
              >
                <Icon name="copy" size={15} /> {order.orderNumber}
              </button>
              <span className="text-[13px] font-extrabold text-brand-600">{formatIDR(order.total)}</span>
            </div>
          )}

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/account/orders" className={buttonStyles({ size: "lg" })}>
              <Icon name="package" size={16} /> Lacak pesanan
            </Link>
            <Link href="/products" className={buttonStyles({ variant: "outline", size: "lg" })}>
              Lanjut belanja
            </Link>
          </div>
        </div>
      </section>

      {order && (
        <section className="container-lume py-4 sm:py-6">
          <div className="mx-auto grid max-w-4xl gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-sand-200 bg-white p-4">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-brand-600">
                <Icon name="truck" size={18} />
              </span>
              <h2 className="mt-3 text-[12px] font-bold text-ink">Estimasi tiba</h2>
              <p className="mt-1 text-sm text-ink-soft">{estimateDelivery(order.etd)}</p>
              <p className="mt-1 text-[11px] text-ink-muted">via {order.courier}</p>
            </div>
            <div className="rounded-xl border border-sand-200 bg-white p-4">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-brand-600">
                <Icon name="credit-card" size={18} />
              </span>
              <h2 className="mt-3 text-[12px] font-bold text-ink">Metode pembayaran</h2>
              <p className="mt-1 text-sm text-ink-soft">{order.paymentMethod}</p>
              <p className="mt-1 text-[11px] text-ink-muted">
                {order.paymentStatus === "paid" ? "Pembayaran terverifikasi" : "Menunggu verifikasi pembayaran"}
              </p>
            </div>
            <div className="rounded-xl border border-sand-200 bg-white p-4">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-brand-600">
                <Icon name="map-pin" size={18} />
              </span>
              <h2 className="mt-3 text-[12px] font-bold text-ink">Dikirim ke</h2>
              <p className="mt-1 line-clamp-2 text-sm text-ink-soft">{order.address.recipient}</p>
              <p className="mt-1 text-[11px] text-ink-muted">
                {order.address.city}, {order.address.province} {order.address.postalCode}
              </p>
            </div>
          </div>

          <div className="mx-auto mt-3 max-w-4xl">
            <div className="overflow-hidden rounded-xl border border-sand-200 bg-white">
              <div className="border-b border-sand-200 px-4 py-3.5">
                <h2 className="text-[12px] font-extrabold text-ink">Detail pesanan</h2>
              </div>
              <ul className="divide-y divide-sand-200">
                {order.items.map((item) => (
                  <li key={`${item.productId}-${item.variantId}`} className="flex items-center gap-3 px-4 py-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt={item.name} className="h-16 w-14 rounded-lg object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-[13px] font-semibold text-ink">{item.name}</p>
                      <p className="mt-0.5 text-[11px] text-ink-muted">
                        {item.variantName ? `${item.variantName} · ` : ""}
                        {item.qty} barang
                      </p>
                    </div>
                    <span className="text-[12px] font-bold text-brand-600">{formatIDR(item.price * item.qty)}</span>
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between border-t border-sand-200 bg-sand-50 px-4 py-3.5">
                <span className="text-sm font-semibold text-ink-soft">Total dibayar</span>
                <span className="text-lg font-extrabold text-brand-600">{formatIDR(order.total)}</span>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="border-t border-sand-200 bg-white py-6">
        <ProductRail eyebrow="Selagi menunggu" title="Mungkin Anda juga suka" products={recommended} href="/products" />
      </div>
    </>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<SuccessFallback />}>
      <SuccessContent />
    </Suspense>
  );
}
