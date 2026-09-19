"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getOrders } from "@/store/shop";
import { formatIDR, formatDate, ORDER_STATUS_LABEL, ORDER_STATUS_COLOR } from "@/lib/utils";
import { Card, Badge } from "@/components/ui/primitives";

export default function OrdersPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [orders, setOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  useEffect(() => { setOrders(getOrders()); }, []);
  const list = orders.filter((o) => filter === "all" || o.status === filter);

  return (
    <div>
      <h1 className="text-xl font-bold">Riwayat Pesanan</h1>
      <div className="mt-2 flex gap-2 text-xs">
        {[["all", "Semua"], ["pending", "Menunggu Bayar"], ["paid", "Dibayar"], ["shipped", "Dikirim"], ["completed", "Selesai"]].map(([v, l]) => (
          <button key={v} onClick={() => setFilter(v)} className={`rounded-full border px-3 py-1.5 ${filter === v ? "bg-sky-600 text-white" : "bg-white"}`}>{l}</button>
        ))}
      </div>
      <div className="mt-4 space-y-3">
        {list.length === 0 && <Card><p className="text-sm text-gray-500">Belum ada pesanan. <Link href="/products" className="text-sky-600 underline">Mulai belanja</Link></p></Card>}
        {list.map((o) => (
          <Card key={o.id} className="flex flex-wrap items-center gap-3">
            <div className="flex-1">
              <p className="font-bold">{o.orderNumber} <Badge tone="blue">{ORDER_STATUS_LABEL[o.status] ?? o.status}</Badge></p>
              <p className="text-xs text-gray-500">{formatDate(o.createdAt)} • {o.items?.length} item • {o.courier}</p>
            </div>
            <b className="text-sky-700">{formatIDR(o.total)}</b>
            <Link href={`/account/orders/${o.id}`} className="rounded-lg border px-3 py-2 text-xs font-semibold">Detail</Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
