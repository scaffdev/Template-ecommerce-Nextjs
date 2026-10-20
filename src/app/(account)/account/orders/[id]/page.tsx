"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { estimateDelivery, formatDateTime, formatIDR, ORDER_STATUS_COLOR, ORDER_STATUS_FLOW, ORDER_STATUS_LABEL, PAYMENT_STATUS_LABEL } from "@/lib/utils";
import { useOrders } from "@/store/orders";
import { useCart } from "@/store/commerce";
import { useHydrated } from "@/components/ui/hooks";
import { useToast } from "@/components/ui/toast";
import { Badge, Button, EmptyState } from "@/components/ui/primitives";
import { buttonStyles } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const hydrated = useHydrated();
  const { toast } = useToast();
  const orders = useOrders((state) => state.orders);
  const updateStatus = useOrders((state) => state.updateStatus);
  const addItem = useCart((state) => state.addItem);
  const order = orders.find((item) => item.id === params.id);

  if (hydrated && !order) {
    return (
      <EmptyState
        icon="package"
        title="Pesanan tidak ditemukan"
        description="Pesanan ini mungkin sudah dihapus dari riwayat demo. Coba kembali ke daftar pesanan."
        action={
          <Link href="/account/orders" className={buttonStyles({})}>
            Kembali ke pesanan
          </Link>
        }
      />
    );
  }

  if (!order) return <div className="py-20 text-center text-sm text-ink-muted">Memuat pesanan…</div>;

  const flowIndex = ORDER_STATUS_FLOW.indexOf(order.status);
  const terminal = order.status === "cancelled" || order.status === "returned";
  const nextStatus = !terminal && flowIndex >= 0 && flowIndex < ORDER_STATUS_FLOW.length - 1 ? ORDER_STATUS_FLOW[flowIndex + 1] : null;

  const reorder = () => {
    order.items.forEach((item) => {
      if (item.stock > 0) addItem({ ...item });
    });
    toast({ title: "Produk dimasukkan ke keranjang", description: order.orderNumber, tone: "success" });
  };

  return (
    <div>
      <Link href="/account/orders" className="inline-flex items-center gap-2 text-xs font-semibold text-ink-soft transition hover:text-brand-600">
        <Icon name="arrow-left" size={14} /> Semua pesanan
      </Link>

      <header className="mt-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="eyebrow">Detail pesanan</p>
          <h1 className="mt-1 text-xl font-extrabold tracking-tight text-ink sm:text-2xl">{order.orderNumber}</h1>
          <p className="mt-2 text-sm text-ink-soft">
            Dibuat {formatDateTime(order.createdAt)} · {order.items.length} produk · {order.courier}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge className={cn("normal-case", ORDER_STATUS_COLOR[order.status])} tone="neutral">
            {ORDER_STATUS_LABEL[order.status]}
          </Badge>
          <Badge tone="sand">{PAYMENT_STATUS_LABEL[order.paymentStatus]}</Badge>
        </div>
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          <section className="rounded-xl border border-sand-200 bg-white p-6">
            <h2 className="text-[11px] font-bold uppercase tracking-widest2 text-ink">Status pengiriman</h2>
            <ol className="mt-6 space-y-0">
              {order.timeline.map((event, index) => {
                const isLast = index === order.timeline.length - 1;
                return (
                  <li key={`${event.status}-${event.at}-${index}`} className="relative flex gap-4 pb-6 last:pb-0">
                    {!isLast && <span className="absolute left-[13px] top-7 h-full w-px bg-sand-300" aria-hidden />}
                    <span
                      className={cn(
                        "z-10 grid h-7 w-7 shrink-0 place-items-center rounded-full border",
                        isLast ? "border-olive-600 bg-olive-600 text-surface" : "border-sand-300 bg-surface text-ink-muted"
                      )}
                    >
                      <Icon name={isLast ? "check" : "clock"} size={12} />
                    </span>
                    <div className="pt-0.5">
                      <p className="text-[13px] font-semibold text-ink">{ORDER_STATUS_LABEL[event.status]}</p>
                      <p className="mt-0.5 text-[11px] text-ink-muted">{formatDateTime(event.at)}</p>
                      {event.note && <p className="mt-1 text-xs leading-relaxed text-ink-soft">{event.note}</p>}
                    </div>
                  </li>
                );
              })}
            </ol>

            {nextStatus && (
              <div className="mt-2 flex items-center gap-3 rounded-xl bg-sand-50 p-4 text-xs text-ink-soft">
                <Icon name="info" size={15} className="shrink-0 text-brand-600" />
                Langkah berikutnya: <span className="font-semibold text-ink">{ORDER_STATUS_LABEL[nextStatus]}</span>
                {order.status === "shipped" && order.etd && <span className="text-ink-muted">· estimasi tiba {estimateDelivery(order.etd)}</span>}
              </div>
            )}

            {order.trackingNumber && (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-dashed border-sand-400 bg-surface p-4">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-ink-muted">Nomor resi — {order.courier}</p>
                  <p className="mt-1 font-mono text-sm font-bold tracking-wide text-ink">{order.trackingNumber}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      await navigator.clipboard.writeText(order.trackingNumber!);
                      toast({ title: "Nomor resi disalin", tone: "info" });
                    }}
                  >
                    <Icon name="copy" size={13} /> Salin
                  </Button>
                  <Link href={`/track-order?order=${order.id}`} className={buttonStyles({ size: "sm" })}>
                    Lacak
                  </Link>
                </div>
              </div>
            )}
          </section>

          <section className="rounded-xl border border-sand-200 bg-white overflow-hidden">
            <div className="flex items-center justify-between border-b border-sand-200 px-6 py-4">
              <h2 className="text-[11px] font-bold uppercase tracking-widest2 text-ink">Produk</h2>
              <span className="text-[11px] text-ink-muted">{order.items.length} item</span>
            </div>
            <ul className="divide-y divide-sand-200">
              {order.items.map((item) => (
                <li key={`${item.productId}-${item.variantId}`} className="flex items-center gap-4 px-6 py-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt={item.name} className="h-20 w-16 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <Link href={`/products/${item.slug}`} className="line-clamp-2 text-[13px] font-semibold text-ink hover:text-brand-700">
                      {item.name}
                    </Link>
                    {item.variantName && <p className="mt-0.5 text-[11px] text-ink-muted">Varian: {item.variantName}</p>}
                    <p className="mt-1 text-[11px] text-ink-muted">
                      {item.qty} × {formatIDR(item.price)}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-ink">{formatIDR(item.price * item.qty)}</span>
                </li>
              ))}
            </ul>
            <dl className="space-y-2.5 border-t border-sand-200 bg-sand-50/60 px-6 py-5 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-ink-soft">Subtotal</dt>
                <dd className="font-semibold text-ink">{formatIDR(order.subtotal)}</dd>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between gap-3">
                  <dt className="text-ink-soft">Diskon {order.couponCode ? `(${order.couponCode})` : ""}</dt>
                  <dd className="font-semibold text-success">−{formatIDR(order.discount)}</dd>
                </div>
              )}
              <div className="flex justify-between gap-3">
                <dt className="text-ink-soft">Pengiriman</dt>
                <dd className="font-semibold text-ink">{order.shippingCost === 0 ? "Gratis" : formatIDR(order.shippingCost)}</dd>
              </div>
              <div className="flex justify-between gap-3 border-t border-sand-200 pt-3">
                <dt className="font-semibold text-ink">Total</dt>
                <dd className="text-xl font-extrabold text-brand-600">{formatIDR(order.total)}</dd>
              </div>
            </dl>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-xl border border-sand-200 bg-white p-6">
            <h2 className="text-[11px] font-bold uppercase tracking-widest2 text-ink">Pembayaran</h2>
            <p className="mt-3 text-[13px] font-semibold text-ink">{order.paymentMethod}</p>
            <p className="mt-1 text-xs text-ink-muted">{PAYMENT_STATUS_LABEL[order.paymentStatus]}</p>
            {order.status === "pending" && order.paymentStatus === "unpaid" && (
              <div className="mt-4 space-y-2">
                <Link href={`/checkout/${order.id}/payment`} className={buttonStyles({ className: "w-full" })}>
                  Selesaikan pembayaran
                </Link>
                <p className="text-[10px] leading-relaxed text-ink-muted">
                  Batas waktu {formatDateTime(order.expiresAt)}. Pesanan dibatalkan otomatis jika melewati batas.
                </p>
              </div>
            )}
          </section>

          <section className="rounded-xl border border-sand-200 bg-white p-6">
            <h2 className="text-[11px] font-bold uppercase tracking-widest2 text-ink">Alamat pengiriman</h2>
            <p className="mt-3 text-[13px] font-semibold text-ink">
              {order.address.recipient} · {order.address.phone}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-ink-muted">
              {order.address.detail}, {order.address.district}, {order.address.city}, {order.address.province}{" "}
              {order.address.postalCode}
            </p>
            {order.notes && (
              <p className="mt-3 rounded-lg bg-sand-50 p-3 text-[11px] leading-relaxed text-ink-soft">
                <span className="font-semibold text-ink">Catatan: </span>
                {order.notes}
              </p>
            )}
          </section>

          <section className="rounded-xl border border-sand-200 bg-white p-6">
            <h2 className="text-[11px] font-bold uppercase tracking-widest2 text-ink">Butuh bantuan?</h2>
            <p className="mt-2 text-xs leading-relaxed text-ink-muted">
              Sertakan nomor pesanan {order.orderNumber} saat menghubungi tim kami agar prosesnya lebih cepat.
            </p>
            <div className="mt-4 space-y-2">
              <a
                href={`https://wa.me/6281234567890?text=Halo%20LUM%C3%89%2C%20saya%20ingin%20bertanya%20tentang%20pesanan%20${order.orderNumber}`}
                target="_blank"
                rel="noreferrer"
                className={buttonStyles({ variant: "outline", size: "sm", className: "w-full" })}
              >
                <Icon name="whatsapp" size={14} /> WhatsApp
              </a>
              <Link href="/contact" className={buttonStyles({ variant: "ghost", size: "sm", className: "w-full" })}>
                <Icon name="mail" size={14} /> Email dukungan
              </Link>
            </div>
          </section>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3 border-t border-sand-200 pt-6">
        <Button variant="outline" onClick={() => window.print()}>
          <Icon name="printer" size={15} /> Cetak invoice
        </Button>
        {order.status === "shipped" && (
          <Button
            onClick={() => {
              updateStatus(order.id, "completed", "Diterima oleh pelanggan");
              toast({ title: "Terima kasih!", description: "Pesanan ditandai selesai.", tone: "success" });
            }}
          >
            <Icon name="check" size={15} /> Konfirmasi diterima
          </Button>
        )}
        {["completed", "cancelled", "returned"].includes(order.status) && (
          <Button variant="outline" onClick={reorder}>
            <Icon name="refresh" size={15} /> Beli lagi
          </Button>
        )}
        {["pending", "paid", "processing"].includes(order.status) && (
          <Button
            variant="ghost"
            className="text-danger hover:bg-[#f6e4df]"
            onClick={() => {
              updateStatus(order.id, "cancelled", "Dibatalkan oleh pelanggan");
              toast({ title: "Pesanan dibatalkan", description: "Dana dikembalikan maksimal 3 hari kerja (simulasi).", tone: "info" });
            }}
          >
            Batalkan pesanan
          </Button>
        )}
      </div>
    </div>
  );
}
