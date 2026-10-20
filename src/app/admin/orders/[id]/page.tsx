"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useOrders } from "@/store/orders";
import { useToast } from "@/components/ui/toast";
import { AdminPageHeader } from "@/components/admin/ui";
import { Button, Input } from "@/components/ui/primitives";
import { buttonStyles } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { formatDateTime, formatIDR, ORDER_STATUS_COLOR, ORDER_STATUS_LABEL, PAYMENT_STATUS_LABEL } from "@/lib/utils";
import type { OrderStatus } from "@/types";

const ACTIONS: { status: OrderStatus; label: string; icon: "check" | "box" | "truck" | "package" | "close"; tone: "primary" | "outline" | "danger" }[] = [
  { status: "paid", label: "Tandai dibayar", icon: "check", tone: "primary" },
  { status: "processing", label: "Mulai proses", icon: "box", tone: "outline" },
  { status: "shipped", label: "Kirim paket", icon: "truck", tone: "outline" },
  { status: "completed", label: "Selesaikan", icon: "package", tone: "outline" },
  { status: "cancelled", label: "Batalkan", icon: "close", tone: "danger" },
];

export default function AdminOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const { toast } = useToast();
  const orders = useOrders((state) => state.orders);
  const updateStatus = useOrders((state) => state.updateStatus);
  const setTracking = useOrders((state) => state.setTracking);
  const order = orders.find((item) => item.id === params.id);
  const [trackingInput, setTrackingInput] = useState(order?.trackingNumber ?? "");

  if (!order) {
    return (
      <div className="card-surface mx-auto max-w-lg p-10 text-center">
        <Icon name="package" size={28} className="mx-auto text-ink-muted" />
        <h1 className="display mt-4 text-xl">Pesanan tidak ditemukan</h1>
        <p className="mt-2 text-sm text-ink-muted">Pesanan mungkin sudah dihapus atau belum dibuat.</p>
        <Link href="/admin/orders" className={buttonStyles({ className: "mt-6" })}>
          Kembali ke daftar pesanan
        </Link>
      </div>
    );
  }

  const subtotal = order.items.reduce((total, item) => total + item.price * item.qty, 0);
  const apply = (status: OrderStatus) => {
    if (status === order.status) return;
    updateStatus(order.id, status, `Diperbarui oleh admin (${ORDER_STATUS_LABEL[status]})`);
    toast({ title: `Status → ${ORDER_STATUS_LABEL[status]}`, description: order.orderNumber, tone: status === "cancelled" ? "info" : "success" });
  };

  return (
    <div className="space-y-5">
      <AdminPageHeader
        eyebrow="Detail pesanan"
        title={order.orderNumber}
        description={`Dibuat ${formatDateTime(order.createdAt)} · ${order.customer.name}`}
        actions={
          <>
            <Link href="/admin/orders" className="inline-flex items-center gap-2 text-xs font-semibold text-ink-soft transition hover:text-ink">
              <Icon name="arrow-left" size={14} /> Daftar
            </Link>
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Icon name="printer" size={14} /> Cetak
            </Button>
          </>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[1.7fr_1fr]">
        <div className="space-y-5">
          <section className="card-surface p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className={cn("rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide", ORDER_STATUS_COLOR[order.status])}>
                  {ORDER_STATUS_LABEL[order.status]}
                </span>
                <span className="rounded-full bg-canvas px-2.5 py-1 text-[10px] font-semibold text-ink-soft">
                  {PAYMENT_STATUS_LABEL[order.paymentStatus]}
                </span>
                <span className="text-[10px] text-ink-muted">{order.paymentMethod}</span>
              </div>
              <p className="text-[10px] text-ink-muted">ID: {order.id}</p>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {ACTIONS.map((action) => (
                <Button
                  key={action.status}
                  size="sm"
                  variant={action.status === order.status ? "ghost" : action.tone}
                  disabled={action.status === order.status}
                  onClick={() => apply(action.status)}
                >
                  <Icon name={action.icon} size={13} />
                  {action.label}
                </Button>
              ))}
            </div>

            <div className="mt-4 grid gap-2 border-t border-sand-200 pt-4 sm:grid-cols-[1fr_auto]">
              <div className="relative">
                <Icon name="truck" size={14} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
                <Input
                  value={trackingInput}
                  onChange={(event) => setTrackingInput(event.target.value)}
                  placeholder="Nomor resi — mis. JP1234567890"
                  className="pl-9 text-xs"
                />
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setTracking(order.id, trackingInput.trim());
                  toast({ title: "Nomor resi disimpan", description: trackingInput.trim() || "Resi dikosongkan", tone: "success" });
                }}
              >
                Simpan resi
              </Button>
            </div>
          </section>

          <section className="card-surface overflow-hidden">
            <div className="border-b border-sand-200 px-5 py-4">
              <h2 className="text-[11px] font-bold uppercase tracking-widest2 text-ink">Item pesanan</h2>
            </div>
            <div className="divide-y divide-sand-100">
              {order.items.map((item) => (
                <div key={`${item.productId}-${item.variantId}`} className="flex items-center gap-3 px-5 py-3.5">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-ink">{item.name}</p>
                    <p className="mt-0.5 text-[10px] text-ink-muted">
                      {item.variantName ?? "Default"} · {formatIDR(item.price)} × {item.qty}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-ink">{formatIDR(item.price * item.qty)}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2 border-t border-sand-200 bg-canvas-soft px-5 py-4 text-xs">
              <div className="flex justify-between text-ink-soft">
                <span>Subtotal</span>
                <span>{formatIDR(subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-success">
                  <span>Diskon {order.couponCode ? `(${order.couponCode})` : ""}</span>
                  <span>−{formatIDR(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-ink-soft">
                <span>Pengiriman · {order.courier}</span>
                <span>{order.shippingCost === 0 ? "Gratis" : formatIDR(order.shippingCost)}</span>
              </div>
              <div className="flex justify-between border-t border-sand-200 pt-2 text-sm font-bold text-ink">
                <span>Total</span>
                <span>{formatIDR(order.total)}</span>
              </div>
            </div>
          </section>

          <section className="card-surface p-5">
            <h2 className="text-[11px] font-bold uppercase tracking-widest2 text-ink">Riwayat status</h2>
            <ol className="mt-4 space-y-4">
              {order.timeline.map((entry, index) => (
                <li key={`${entry.status}-${entry.at}-${index}`} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span className={cn("mt-1 h-2 w-2 rounded-full", index === order.timeline.length - 1 ? "bg-brass-500" : "bg-sand-300")} />
                    {index < order.timeline.length - 1 && <span className="mt-1 h-full w-px flex-1 bg-sand-200" />}
                  </div>
                  <div className="pb-1">
                    <p className="text-xs font-semibold text-ink">{ORDER_STATUS_LABEL[entry.status]}</p>
                    <p className="mt-0.5 text-[10px] text-ink-muted">{formatDateTime(entry.at)}</p>
                    {entry.note && <p className="mt-1 text-[11px] text-ink-soft">{entry.note}</p>}
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <div className="space-y-5">
          <section className="card-surface p-5">
            <h2 className="text-[11px] font-bold uppercase tracking-widest2 text-ink">Pelanggan</h2>
            <div className="mt-3 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-olive-100 font-display text-sm text-olive-800">
                {order.customer.name.slice(0, 1)}
              </span>
              <div>
                <p className="text-xs font-semibold text-ink">{order.customer.name}</p>
                <p className="text-[10px] text-ink-muted">{order.customer.email}</p>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-[11px] text-ink-soft">
              <p className="flex items-center gap-2">
                <Icon name="phone" size={12} className="text-ink-muted" /> {order.customer.phone}
              </p>
              <a
                href={`https://wa.me/${order.customer.phone.replace(/\D/g, "").replace(/^0/, "62")}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 font-semibold text-success"
              >
                <Icon name="whatsapp" size={12} /> Hubungi via WhatsApp
              </a>
            </div>
          </section>

          <section className="card-surface p-5">
            <h2 className="text-[11px] font-bold uppercase tracking-widest2 text-ink">Alamat pengiriman</h2>
            <p className="mt-3 text-xs font-semibold text-ink">
              {order.address.recipient} · {order.address.phone}
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-ink-soft">
              {order.address.detail}
              <br />
              {order.address.district}, {order.address.city}
              <br />
              {order.address.province} {order.address.postalCode}
            </p>
            <div className="mt-3 rounded-lg bg-canvas-soft p-3 text-[11px] text-ink-soft">
              <p className="flex justify-between">
                <span>Kurir</span>
                <span className="font-semibold text-ink">{order.courier}</span>
              </p>
              <p className="mt-1 flex justify-between">
                <span>Estimasi</span>
                <span className="font-semibold text-ink">{order.etd ?? "—"}</span>
              </p>
              <p className="mt-1 flex justify-between">
                <span>Resi</span>
                <span className="font-semibold text-ink">{order.trackingNumber || "Belum ada"}</span>
              </p>
            </div>
          </section>

          <section className="card-surface p-5">
            <h2 className="text-[11px] font-bold uppercase tracking-widest2 text-ink">Pembayaran</h2>
            <p className="mt-3 text-xs font-semibold text-ink">{order.paymentMethod}</p>
            <p className="mt-1 text-[11px] text-ink-muted">Status: {PAYMENT_STATUS_LABEL[order.paymentStatus]}</p>
            <p className="mt-1 text-[11px] text-ink-muted">Batas bayar: {formatDateTime(order.expiresAt)}</p>
            {order.couponCode && (
              <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-brass-50 px-2.5 py-1 text-[10px] font-semibold text-brass-800">
                <Icon name="ticket" size={11} /> {order.couponCode}
              </p>
            )}
          </section>

          {order.notes && (
            <section className="card-surface p-5">
              <h2 className="text-[11px] font-bold uppercase tracking-widest2 text-ink">Catatan pembeli</h2>
              <p className="mt-2 text-[11px] leading-relaxed text-ink-soft">{order.notes}</p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
