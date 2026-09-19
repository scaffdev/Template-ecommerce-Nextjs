"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getOrders } from "@/store/shop";
import { formatIDR, formatDate, ORDER_STATUS_LABEL } from "@/lib/utils";
import { Card, Button } from "@/components/ui/primitives";

const FLOW = ["pending", "paid", "processing", "shipped", "completed"];

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [order, setOrder] = useState<any>(null);
  useEffect(() => {
    setOrder(getOrders().find((o) => o.id === params.id));
  }, [params.id]);
  if (!order) return <p className="py-10 text-sm">Memuat… <Link href="/account/orders" className="text-sky-600 underline">Kembali</Link></p>;
  const step = FLOW.indexOf(order.status);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Pesanan {order.orderNumber}</h1>
      <Card>
        <div className="flex gap-1">
          {FLOW.map((s, i) => (
            <div key={s} className={`h-2 flex-1 rounded-full ${i <= step ? "bg-sky-600" : "bg-gray-200"}`} title={ORDER_STATUS_LABEL[s]} />
          ))}
        </div>
        <p className="mt-2 text-sm">Status: <b>{ORDER_STATUS_LABEL[order.status] ?? order.status}</b> • {formatDate(order.createdAt)}</p>
        {order.trackingNumber ? <p className="text-sm">Resi: <b className="font-mono">{order.trackingNumber}</b> (<a className="text-sky-600 underline" href="#">Lacak di ekspedisi</a>)</p> : <p className="text-xs text-gray-500">Resi akan muncul setelah admin memproses & mengirim paket.</p>}
      </Card>
      <Card>
        {order.items?.map((i: { name: string; variantName?: string; qty: number; price: number }, idx: number) => (
          <div key={idx} className="flex justify-between py-1 text-sm"><span>{i.name} {i.variantName ? `(${i.variantName})` : ""} × {i.qty}</span><b>{formatIDR(i.price * i.qty)}</b></div>
        ))}
        <div className="mt-2 border-t pt-2 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><b>{formatIDR(order.subtotal)}</b></div>
          <div className="flex justify-between"><span>Ongkir</span><b>{formatIDR(order.shippingCost)}</b></div>
          <div className="flex justify-between text-base"><span>Total</span><b className="text-sky-700">{formatIDR(order.total)}</b></div>
        </div>
      </Card>
      <div className="flex gap-2">
        {order.status === "pending" && <Link href={`/checkout/${order.id}/payment?total=${order.total}&method=qris`} className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-bold text-white">Bayar Sekarang</Link>}
        {(order.status === "pending" || order.status === "paid") && <Button variant="outline" onClick={() => alert("Pembatalan diajukan (simulasi). Stok akan dikembalikan otomatis.")}>Batalkan Pesanan</Button>}
        {order.status === "completed" && <Button variant="outline" onClick={() => alert("Item ditambahkan kembali ke keranjang (simulasi).")}>Beli Lagi</Button>}
      </div>
    </div>
  );
}
