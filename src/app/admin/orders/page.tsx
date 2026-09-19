"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getOrders } from "@/store/shop";
import { formatIDR, ORDER_STATUS_LABEL } from "@/lib/utils";
import { Card } from "@/components/ui/primitives";

export default function AdminOrders() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [orders, setOrders] = useState<any[]>([]);
  useEffect(() => { setOrders(getOrders()); }, []);
  return (
    <div>
      <h1 className="text-xl font-bold">Pesanan ({orders.length})</h1>
      <div className="mt-3 space-y-2">
        {orders.length === 0 && <Card><p className="text-sm text-gray-500">Belum ada pesanan di browser ini. Buat pesanan lewat storefront → checkout untuk menguji alur.</p></Card>}
        {orders.map((o) => (
          <Card key={o.id} className="flex items-center gap-3">
            <div className="flex-1"><p className="text-sm font-bold">{o.orderNumber} — {ORDER_STATUS_LABEL[o.status] ?? o.status}</p><p className="text-xs text-gray-500">{o.address?.recipient} • {o.courier} • {o.paymentMethod}</p></div>
            <b className="text-sm">{formatIDR(o.total)}</b>
            <Link href={`/admin/orders/${o.id}`} className="rounded-lg border px-3 py-1.5 text-xs font-semibold">Kelola</Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
