"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useOrders } from "@/store/orders";
import { AdminEmpty, AdminPageHeader, StatCard, csvDownload } from "@/components/admin/ui";
import { Button, Input } from "@/components/ui/primitives";
import { Modal } from "@/components/ui/overlay";
import { Icon } from "@/components/ui/icon";
import { formatDate, formatIDR } from "@/lib/utils";
import type { Order } from "@/types";

interface CustomerRow {
  email: string;
  name: string;
  phone: string;
  orders: Order[];
  totalSpent: number;
  lastOrder: string;
}

export default function AdminCustomersPage() {
  const orders = useOrders((state) => state.orders);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"spent" | "recent" | "orders">("spent");
  const [detail, setDetail] = useState<CustomerRow | null>(null);

  const customers = useMemo(() => {
    const map = new Map<string, CustomerRow>();
    orders.forEach((order) => {
      const key = order.customer.email.toLowerCase();
      const existing = map.get(key);
      if (existing) {
        existing.orders.push(order);
        existing.totalSpent += order.status === "cancelled" || order.status === "returned" ? 0 : order.total;
        if (new Date(order.createdAt).getTime() > new Date(existing.lastOrder).getTime()) {
          existing.lastOrder = order.createdAt;
          existing.name = order.customer.name;
          existing.phone = order.customer.phone;
        }
      } else {
        map.set(key, {
          email: order.customer.email,
          name: order.customer.name,
          phone: order.customer.phone,
          orders: [order],
          totalSpent: order.status === "cancelled" || order.status === "returned" ? 0 : order.total,
          lastOrder: order.createdAt,
        });
      }
    });
    return Array.from(map.values()).sort((a, b) => {
      if (sort === "recent") return new Date(b.lastOrder).getTime() - new Date(a.lastOrder).getTime();
      if (sort === "orders") return b.orders.length - a.orders.length;
      return b.totalSpent - a.totalSpent;
    });
  }, [orders, sort]);

  const filtered = customers.filter(
    (customer) => !query.trim() || `${customer.name} ${customer.email} ${customer.phone}`.toLowerCase().includes(query.toLowerCase())
  );

  const totalSpent = customers.reduce((total, customer) => total + customer.totalSpent, 0);
  const repeat = customers.filter((customer) => customer.orders.length > 1).length;

  return (
    <div className="space-y-5">
      <AdminPageHeader
        eyebrow="Relasi"
        title="Pelanggan"
        description="Data pelanggan terbentuk otomatis dari pesanan yang masuk."
        actions={
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              csvDownload("tokobagus-customers.csv", [
                ["Nama", "Email", "Telepon", "Pesanan", "Total belanja", "Terakhir order"],
                ...filtered.map((customer) => [
                  customer.name,
                  customer.email,
                  customer.phone,
                  customer.orders.length,
                  customer.totalSpent,
                  customer.lastOrder,
                ]),
              ])
            }
          >
            <Icon name="download" size={14} /> Ekspor CSV
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total pelanggan" value={String(customers.length)} hint="Email unik" icon="users" />
        <StatCard label="Pelanggan berulang" value={String(repeat)} hint={`${customers.length ? Math.round((repeat / customers.length) * 100) : 0}% dari total`} icon="refresh" tone="olive" />
        <StatCard label="Total belanja" value={formatIDR(totalSpent)} hint="Semua pelanggan" icon="chart" tone="brass" />
        <StatCard label="Rata-rata / pelanggan" value={formatIDR(customers.length ? Math.round(totalSpent / customers.length) : 0)} hint="Lifetime value" icon="sparkles" />
      </div>

      <div className="card-surface p-4">
        <div className="flex flex-wrap gap-2">
          <div className="relative min-w-[240px] flex-1">
            <Icon name="search" size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari nama, email, atau telepon…" className="pl-9 text-xs" />
          </div>
          <div className="flex rounded-full border border-sand-200 p-0.5">
            {[
              { value: "spent", label: "Belanja" },
              { value: "recent", label: "Terbaru" },
              { value: "orders", label: "Frekuensi" },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => setSort(item.value as typeof sort)}
                className={`rounded-full px-3 py-1.5 text-[10px] font-semibold transition ${
                  sort === item.value ? "bg-ink text-surface" : "text-ink-muted hover:text-ink"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-xs">
            <thead>
              <tr className="border-b border-sand-200 text-[9px] uppercase tracking-widest text-ink-muted">
                <th className="py-2.5 font-semibold">Pelanggan</th>
                <th className="py-2.5 font-semibold">Telepon</th>
                <th className="py-2.5 font-semibold">Pesanan</th>
                <th className="py-2.5 font-semibold">Total belanja</th>
                <th className="py-2.5 font-semibold">Terakhir</th>
                <th className="py-2.5 font-semibold">Segmen</th>
                <th className="py-2.5 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-100">
              {filtered.length === 0 && <AdminEmpty colSpan={7} message="Belum ada pelanggan." />}
              {filtered.map((customer) => {
                const segment = customer.totalSpent >= 5000000 ? "VIP" : customer.orders.length > 1 ? "Loyal" : "Baru";
                return (
                  <tr key={customer.email} className="transition hover:bg-canvas-soft">
                    <td className="py-3 pr-3">
                      <div className="flex items-center gap-3">
                        <span className="grid h-9 w-9 place-items-center rounded-full bg-canvas-deep font-display text-xs text-ink-soft">
                          {customer.name.slice(0, 1)}
                        </span>
                        <div>
                          <p className="font-semibold text-ink">{customer.name}</p>
                          <p className="text-[10px] text-ink-muted">{customer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-3 text-ink-soft">{customer.phone}</td>
                    <td className="py-3 pr-3 text-ink-soft">{customer.orders.length}</td>
                    <td className="py-3 pr-3 font-semibold text-ink">{formatIDR(customer.totalSpent)}</td>
                    <td className="py-3 pr-3 text-[10px] text-ink-muted">{formatDate(customer.lastOrder)}</td>
                    <td className="py-3 pr-3">
                      <span
                        className={`inline-block rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide ${
                          segment === "VIP"
                            ? "bg-brass-100 text-brass-800"
                            : segment === "Loyal"
                              ? "bg-[#e6ece2] text-success"
                              : "bg-canvas text-ink-muted"
                        }`}
                      >
                        {segment}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => setDetail(customer)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-ink-soft transition hover:text-ink"
                      >
                        Detail <Icon name="arrow-right" size={12} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={detail !== null} onClose={() => setDetail(null)} title={detail?.name ?? "Pelanggan"}>
        {detail && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-canvas-soft p-3">
                <p className="text-[9px] uppercase tracking-widest text-ink-muted">Total belanja</p>
                <p className="display mt-1 text-lg">{formatIDR(detail.totalSpent)}</p>
              </div>
              <div className="rounded-xl bg-canvas-soft p-3">
                <p className="text-[9px] uppercase tracking-widest text-ink-muted">Pesanan</p>
                <p className="display mt-1 text-lg">{detail.orders.length}</p>
              </div>
            </div>
            <div className="text-[11px] text-ink-soft">
              <p className="flex items-center gap-2">
                <Icon name="mail" size={12} className="text-ink-muted" /> {detail.email}
              </p>
              <p className="mt-1 flex items-center gap-2">
                <Icon name="phone" size={12} className="text-ink-muted" /> {detail.phone}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">Riwayat pesanan</p>
              <ul className="mt-2 max-h-64 space-y-1.5 overflow-y-auto pr-1">
                {[...detail.orders]
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((order) => (
                    <li key={order.id}>
                      <Link
                        href={`/admin/orders/${order.id}`}
                        onClick={() => setDetail(null)}
                        className="flex items-center justify-between rounded-lg border border-sand-200 px-3 py-2 text-[11px] transition hover:border-ink"
                      >
                        <span>
                          <span className="font-semibold text-ink">{order.orderNumber}</span>
                          <span className="ml-2 text-ink-muted">{formatDate(order.createdAt)}</span>
                        </span>
                        <span className="font-semibold text-ink">{formatIDR(order.total)}</span>
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
