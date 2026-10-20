"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useOrders } from "@/store/orders";
import { useToast } from "@/components/ui/toast";
import { AdminEmpty, AdminPageHeader } from "@/components/admin/ui";
import { Button, Input } from "@/components/ui/primitives";
import { buttonStyles } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { formatDateTime, formatIDR, ORDER_STATUS_COLOR, ORDER_STATUS_LABEL, PAYMENT_STATUS_LABEL } from "@/lib/utils";
import type { OrderStatus } from "@/types";

const TABS: { value: "all" | OrderStatus; label: string }[] = [
  { value: "all", label: "Semua" },
  { value: "pending", label: "Menunggu bayar" },
  { value: "paid", label: "Dibayar" },
  { value: "processing", label: "Diproses" },
  { value: "shipped", label: "Dikirim" },
  { value: "completed", label: "Selesai" },
  { value: "cancelled", label: "Batal" },
];

export default function AdminOrdersPage() {
  const { toast } = useToast();
  const orders = useOrders((state) => state.orders);
  const updateStatus = useOrders((state) => state.updateStatus);
  const [tab, setTab] = useState<"all" | OrderStatus>("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: orders.length };
    orders.forEach((order) => {
      map[order.status] = (map[order.status] ?? 0) + 1;
    });
    return map;
  }, [orders]);

  const filtered = orders.filter((order) => {
    const matchesTab = tab === "all" || order.status === tab;
    const text = `${order.orderNumber} ${order.id} ${order.customer.name} ${order.customer.email} ${order.trackingNumber ?? ""}`.toLowerCase();
    return matchesTab && (!query.trim() || text.includes(query.toLowerCase()));
  });

  const bulk = (status: OrderStatus) => {
    selected.forEach((id) => updateStatus(id, status, `Diperbarui massal oleh admin`));
    toast({ title: `${selected.length} pesanan → ${ORDER_STATUS_LABEL[status]}`, tone: "success" });
    setSelected([]);
  };

  return (
    <div className="space-y-5">
      <AdminPageHeader
        eyebrow="Operasional"
        title="Pesanan"
        description="Pantau pembayaran, proses pengemasan, dan pengiriman dalam satu alur."
        actions={
          <Link href="/admin/reports" className={buttonStyles({ variant: "outline", size: "sm" })}>
            <Icon name="chart" size={14} /> Laporan
          </Link>
        }
      />

      <div className="card-surface overflow-hidden">
        <div className="flex gap-1 overflow-x-auto border-b border-sand-200 px-3 pt-2">
          {TABS.map((item) => (
            <button
              key={item.value}
              onClick={() => {
                setTab(item.value);
                setSelected([]);
              }}
              className={cn(
                "flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-2.5 text-[11px] font-semibold transition",
                tab === item.value ? "border-ink text-ink" : "border-transparent text-ink-muted hover:text-ink"
              )}
            >
              {item.label}
              <span className="rounded-full bg-canvas px-1.5 py-0.5 text-[9px]">{counts[item.value] ?? 0}</span>
            </button>
          ))}
        </div>

        <div className="p-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[240px] flex-1">
              <Icon name="search" size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
              <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari nomor pesanan, nama, email, atau resi…" className="pl-9 text-xs" />
            </div>
            {selected.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                <Button size="sm" variant="outline" onClick={() => bulk("processing")}>
                  Proses
                </Button>
                <Button size="sm" variant="outline" onClick={() => bulk("shipped")}>
                  Kirim
                </Button>
                <Button size="sm" variant="outline" onClick={() => bulk("completed")}>
                  Selesai
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setSelected([])}>
                  Batal ({selected.length})
                </Button>
              </div>
            )}
          </div>

          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[880px] text-left text-xs">
              <thead>
                <tr className="border-b border-sand-200 text-[9px] uppercase tracking-widest text-ink-muted">
                  <th className="w-8 py-2.5">
                    <input
                      type="checkbox"
                      checked={filtered.length > 0 && filtered.every((order) => selected.includes(order.id))}
                      onChange={() =>
                        setSelected((current) =>
                          filtered.every((order) => current.includes(order.id))
                            ? current.filter((id) => !filtered.some((order) => order.id === id))
                            : [...new Set([...current, ...filtered.map((order) => order.id)])]
                        )
                      }
                      aria-label="Pilih semua pesanan"
                      className="h-3.5 w-3.5 accent-[#26301F]"
                    />
                  </th>
                  <th className="py-2.5 font-semibold">Pesanan</th>
                  <th className="py-2.5 font-semibold">Pelanggan</th>
                  <th className="py-2.5 font-semibold">Tanggal</th>
                  <th className="py-2.5 font-semibold">Item</th>
                  <th className="py-2.5 font-semibold">Total</th>
                  <th className="py-2.5 font-semibold">Bayar</th>
                  <th className="py-2.5 font-semibold">Status</th>
                  <th className="py-2.5 text-right font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100">
                {filtered.length === 0 && <AdminEmpty colSpan={9} message="Belum ada pesanan pada filter ini." />}
                {filtered.map((order) => (
                  <tr key={order.id} className={cn("transition hover:bg-canvas-soft", selected.includes(order.id) && "bg-brass-50/50")}>
                    <td className="py-3">
                      <input
                        type="checkbox"
                        checked={selected.includes(order.id)}
                        onChange={() =>
                          setSelected((current) =>
                            current.includes(order.id) ? current.filter((id) => id !== order.id) : [...current, order.id]
                          )
                        }
                        aria-label={`Pilih ${order.orderNumber}`}
                        className="h-3.5 w-3.5 accent-[#26301F]"
                      />
                    </td>
                    <td className="py-3 pr-3">
                      <Link href={`/admin/orders/${order.id}`} className="font-semibold text-ink hover:text-brass-700">
                        {order.orderNumber}
                      </Link>
                      <p className="mt-0.5 text-[10px] text-ink-muted">{order.paymentMethod}</p>
                    </td>
                    <td className="py-3 pr-3">
                      <p className="font-medium text-ink-soft">{order.customer.name}</p>
                      <p className="text-[10px] text-ink-muted">{order.customer.email}</p>
                    </td>
                    <td className="py-3 pr-3 text-[10px] text-ink-muted">{formatDateTime(order.createdAt)}</td>
                    <td className="py-3 pr-3 text-ink-soft">{order.items.reduce((total, item) => total + item.qty, 0)}</td>
                    <td className="py-3 pr-3 font-semibold text-ink">{formatIDR(order.total)}</td>
                    <td className="py-3 pr-3">
                      <span className="text-[10px] font-semibold text-ink-muted">{PAYMENT_STATUS_LABEL[order.paymentStatus]}</span>
                    </td>
                    <td className="py-3 pr-3">
                      <span className={cn("inline-block rounded-full px-2 py-1 text-[9px] font-bold uppercase tracking-wide", ORDER_STATUS_COLOR[order.status])}>
                        {ORDER_STATUS_LABEL[order.status]}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-1">
                        {order.status === "paid" && (
                          <button
                            onClick={() => {
                              updateStatus(order.id, "processing", "Pesanan mulai dikemas");
                              toast({ title: "Pesanan diproses", description: order.orderNumber, tone: "success" });
                            }}
                            className="grid h-8 w-8 place-items-center rounded-lg text-ink-muted transition hover:bg-canvas hover:text-ink"
                            aria-label="Proses pesanan"
                          >
                            <Icon name="box" size={14} />
                          </button>
                        )}
                        {order.status === "processing" && (
                          <button
                            onClick={() => {
                              updateStatus(order.id, "shipped", "Paket diserahkan ke kurir");
                              toast({ title: "Pesanan dikirim", description: order.orderNumber, tone: "success" });
                            }}
                            className="grid h-8 w-8 place-items-center rounded-lg text-ink-muted transition hover:bg-canvas hover:text-ink"
                            aria-label="Kirim pesanan"
                          >
                            <Icon name="truck" size={14} />
                          </button>
                        )}
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="grid h-8 w-8 place-items-center rounded-lg text-ink-muted transition hover:bg-canvas hover:text-ink"
                          aria-label="Lihat detail"
                        >
                          <Icon name="arrow-right" size={14} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
