"use client";
import { products } from "@/lib/data";
import { formatIDR } from "@/lib/utils";
import { Card, Button } from "@/components/ui/primitives";

export default function AdminReports() {
  const revenue = products.reduce((a, p) => a + p.basePrice * p.sold, 0);
  return (
    <div>
      <h1 className="text-xl font-bold">Laporan Penjualan</h1>
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <Card><p className="text-xs">Harian (simulasi)</p><b>{formatIDR(Math.round(revenue / 90))}</b></Card>
        <Card><p className="text-xs">Mingguan</p><b>{formatIDR(Math.round(revenue / 12))}</b></Card>
        <Card><p className="text-xs">Bulanan</p><b>{formatIDR(Math.round(revenue / 3))}</b></Card>
      </div>
      <Button variant="outline" className="mt-3" onClick={() => {}}>Export CSV / Excel</Button>
    </div>
  );
}
