"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Order, OrderStatus } from "@/types";
import { ORDER_STATUS_COLOR, ORDER_STATUS_LABEL, formatDateTime, formatIDR } from "@/lib/utils";
import { useOrders } from "@/store/orders";
import { useCart } from "@/store/commerce";
import { useToast } from "@/components/ui/toast";
import { Badge, Button, EmptyState } from "@/components/ui/primitives";
import { buttonStyles } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

type TabKey = "all" | "unpaid" | "processing" | "shipped" | "completed" | "cancelled";

const tabs: { key: TabKey; label: string; match: (order: Order) => boolean }[] = [
  { key: "all", label: "Semua", match: () => true },
  { key: "unpaid", label: "Belum bayar", match: (order) => order.status === "pending" },
  { key: "processing", label: "Diproses", match: (order) => order.status === "paid" || order.status === "processing" },
  { key: "shipped", label: "Dikirim", match: (order) => order.status === "shipped" },
  { key: "completed", label: "Selesai", match: (order) => order.status === "completed" },
  { key: "cancelled", label: "Dibatalkan", match: (order) => order.status === "cancelled" || order.status === "returned" },
];

export default function AccountOrdersPage() {
  const { toast } = useToast();
  const orders = useOrders((state) => state.orders);
  const updateStatus = useOrders((state) => state.updateStatus);
  const addItem = useCart((state) => state.addItem);
  const [tab, setTab] = useState<TabKey>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const activeTab = tabs.find((item) => item.key === tab) ?? tabs[0];
    const normalized = query.trim().toLowerCase();
    return orders
      .filter((order) => activeTab.match(order))
      .filter((order) => !normalized || order.orderNumber.toLowerCase().includes(normalized) || order.items.some((item) => item.name.toLowerCase().includes(normalized)));
  }, [orders, tab, query]);

  const counts = useMemo(
    () =>
      tabs.reduce<Record<TabKey, number>>(
        (accumulator, item) => ({ ...accumulator, [item.key]: orders.filter(item.match).length }),
        { all: 0, unpaid: 0, processing: 0, shipped: 0, completed: 0, cancelled: 0 }
      ),
    [orders]
  );

  const reorder = (order: Order) => {
    let added = 0;
    order.items.forEach((item) => {
      if (item.stock > 0) {
        addItem({ ...item });
        added += 1;
      }
    });
    if (added === 0) {
      toast({ title: "Produk sudah tidak tersedia", tone: "danger" });
      return;
    }
    toast({ title: "Ditambahkan kembali ke keranjang", description: `${added} produk dari ${order.orderNumber}`, tone: "success" });
  };

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-600">Pesanan</p>
          <h1 className="mt-1 text-xl font-extrabold tracking-tight text-ink sm:text-2xl">Riwayat pesanan Anda.</h1>
          <p className="mt-2 text-sm text-ink-soft">Semua transaksi, status pengiriman, dan tautan pembayaran ada di sini.</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Icon name="search" size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari nomor atau produk…"
            className="field pl-9"
            aria-label="Cari pesanan"
          />
        </div>
      </header>

      <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto border-b border-sand-200 pb-3">
        {tabs.map((item) => (
          <button
            key={item.key}
            onClick={() => setTab(item.key)}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition",
              tab === item.key ? "bg-ink text-surface" : "text-ink-soft hover:bg-sand-50"
            )}
          >
            {item.label}
            <span
              className={cn(
                "grid h-4 min-w-4 place-items-center rounded-full px-1 text-[9px]",
                tab === item.key ? "bg-surface/20 text-surface" : "bg-brand-50 text-ink-muted"
              )}
            >
              {counts[item.key]}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          className="mt-8"
          icon="package"
          title={query ? "Pesanan tidak ditemukan" : "Belum ada pesanan di kategori ini"}
          description={query ? "Coba kata kunci lain atau periksa nomor pesanan Anda." : "Pesanan dengan status ini akan muncul di sini."}
          action={
            query ? (
              <Button variant="outline" onClick={() => setQuery("")}>
                Hapus pencarian
              </Button>
            ) : (
              <Link href="/products" className={buttonStyles({})}>
                Mulai belanja
              </Link>
            )
          }
        />
      ) : (
        <ul className="mt-6 space-y-4">
          {filtered.map((order) => (
            <li key={order.id} className="rounded-xl border border-sand-200 bg-white overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sand-200 bg-sand-50/60 px-5 py-4">
                <div className="flex flex-wrap items-center gap-4">
                  <div>
                    <p className="text-[13px] font-bold text-ink">{order.orderNumber}</p>
                    <p className="mt-0.5 text-[11px] text-ink-muted">{formatDateTime(order.createdAt)}</p>
                  </div>
                  <Badge className={cn("normal-case", ORDER_STATUS_COLOR[order.status as OrderStatus])} tone="neutral">
                    {ORDER_STATUS_LABEL[order.status]}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-widest text-ink-muted">Total</p>
                  <p className="text-sm font-bold text-ink">{formatIDR(order.total)}</p>
                </div>
              </div>

              <ul className="divide-y divide-sand-200/70">
                {order.items.map((item) => (
                  <li key={`${item.productId}-${item.variantId}`} className="flex items-center gap-4 px-5 py-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt={item.name} className="h-16 w-14 rounded-lg object-cover" />
                    <div className="min-w-0 flex-1">
                      <Link href={`/products/${item.slug}`} className="line-clamp-1 text-[13px] font-semibold text-ink hover:text-brand-700">
                        {item.name}
                      </Link>
                      <p className="mt-0.5 text-[11px] text-ink-muted">
                        {item.variantName ? `${item.variantName} · ` : ""}
                        {item.qty}× {formatIDR(item.price)}
                      </p>
                    </div>
                    {order.trackingNumber && order.status === "shipped" && (
                      <span className="hidden text-right text-[10px] text-ink-muted sm:block">
                        Resi
                        <br />
                        <span className="font-semibold text-ink">{order.trackingNumber}</span>
                      </span>
                    )}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap items-center gap-2 border-t border-sand-200 px-5 py-4">
                <Link href={`/account/orders/${order.id}`} className={buttonStyles({ variant: "outline", size: "sm" })}>
                  Detail
                </Link>
                {order.status === "pending" && order.paymentStatus === "unpaid" && (
                  <>
                    <Link href={`/checkout/${order.id}/payment`} className={buttonStyles({ size: "sm" })}>
                      Bayar sekarang
                    </Link>
                    <button
                      onClick={() => {
                        updateStatus(order.id, "cancelled", "Dibatalkan oleh pelanggan dari daftar pesanan");
                        toast({ title: "Pesanan dibatalkan", description: "Stok telah dikembalikan.", tone: "info" });
                      }}
                      className="text-xs font-semibold text-ink-muted transition hover:text-danger"
                    >
                      Batalkan
                    </button>
                  </>
                )}
                {order.status === "shipped" && (
                  <>
                    <Link href={`/track-order?order=${order.id}`} className={buttonStyles({ size: "sm" })}>
                      <Icon name="truck" size={14} /> Lacak paket
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        updateStatus(order.id, "completed", "Diterima oleh pelanggan");
                        toast({ title: "Terima kasih!", description: "Pesanan ditandai selesai.", tone: "success" });
                      }}
                    >
                      Konfirmasi diterima
                    </Button>
                  </>
                )}
                {order.status === "completed" && (
                  <>
                    <Button size="sm" variant="outline" onClick={() => reorder(order)}>
                      <Icon name="refresh" size={14} /> Beli lagi
                    </Button>
                    <Link href={`/products/${order.items[0]?.slug ?? ""}`} className="text-xs font-semibold text-ink-muted transition hover:text-brand-600">
                      Tulis ulasan
                    </Link>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
