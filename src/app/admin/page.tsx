import { products } from "@/lib/data";
import { formatIDR } from "@/lib/utils";
import { Card } from "@/components/ui/primitives";

export default function AdminDashboard() {
  const revenue = products.reduce((a, p) => a + p.basePrice * p.sold, 0);
  const orders = products.reduce((a, p) => a + p.sold, 0);
  const lowStock = products.flatMap((p) => p.variants.map((v) => ({ p: p.name, ...v }))).filter((v) => v.stock < 10);
  const best = [...products].sort((a, b) => b.sold - a.sold).slice(0, 5);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Dashboard</h1>
      <div className="grid gap-3 md:grid-cols-4">
        <Card><p className="text-xs text-gray-500">Omzet (simulasi)</p><b>{formatIDR(revenue)}</b></Card>
        <Card><p className="text-xs text-gray-500">Unit terjual</p><b>{orders.toLocaleString("id-ID")}</b></Card>
        <Card><p className="text-xs text-gray-500">AOV</p><b>{formatIDR(Math.round(revenue / Math.max(1, orders)))}</b></Card>
        <Card><p className="text-xs text-gray-500">Stok menipis</p><b className="text-red-600">{lowStock.length} SKU</b></Card>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <Card>
          <p className="font-bold">Produk Terlaris</p>
          <ul className="mt-2 space-y-1 text-sm">{best.map((p) => <li key={p.id} className="flex justify-between"><span>{p.name}</span><b>{p.sold.toLocaleString("id-ID")}</b></li>)}</ul>
        </Card>
        <Card>
          <p className="font-bold">Stok Menipis (&lt;10)</p>
          <ul className="mt-2 space-y-1 text-sm">{lowStock.slice(0, 8).map((v) => <li key={v.id} className="flex justify-between"><span>{v.p} — {v.name} ({v.sku})</span><b className="text-red-600">{v.stock}</b></li>)}</ul>
        </Card>
      </div>
    </div>
  );
}
