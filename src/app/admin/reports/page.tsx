"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useCatalog } from "@/store/catalog";
import { useOrders } from "@/store/orders";
import { useToast } from "@/components/ui/toast";
import { AdminCard, AdminPageHeader, BarRow, MiniBars, StatCard, csvDownload } from "@/components/admin/ui";
import { Button } from "@/components/ui/primitives";
import { buttonStyles } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { formatIDR, ORDER_STATUS_LABEL } from "@/lib/utils";

const RANGES = [
  { value: 7, label: "7 hari" },
  { value: 30, label: "30 hari" },
  { value: 90, label: "90 hari" },
];

export default function AdminReportsPage() {
  const { toast } = useToast();
  const products = useCatalog((state) => state.products);
  const categories = useCatalog((state) => state.categories);
  const resetCatalog = useCatalog((state) => state.resetDemo);
  const orders = useOrders((state) => state.orders);
  const resetOrders = useOrders((state) => state.resetOrders);
  const [range, setRange] = useState(30);

  const data = useMemo(() => {
    const cutoff = Date.now() - range * 86400000;
    const inRange = orders.filter((order) => new Date(order.createdAt).getTime() >= cutoff);
    const valid = inRange.filter((order) => order.status !== "cancelled" && order.status !== "returned");
    const revenue = valid.reduce((total, order) => total + order.total, 0);
    const units = valid.reduce((total, order) => total + order.items.reduce((sum, item) => sum + item.qty, 0), 0);

    const days = Array.from({ length: 14 }).map((_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (13 - index));
      const key = date.toISOString().slice(0, 10);
      const value = valid
        .filter((order) => order.createdAt.slice(0, 10) === key)
        .reduce((total, order) => total + order.total, 0);
      return { label: String(date.getDate()), value };
    });

    const byCategory = categories
      .map((category) => {
        const value = valid.reduce((total, order) => {
          return (
            total +
            order.items.reduce((sum, item) => {
              const product = products.find((entry) => entry.id === item.productId);
              return product?.categoryId === category.id ? sum + item.price * item.qty : sum;
            }, 0)
          );
        }, 0);
        return { label: category.name, value };
      })
      .sort((a, b) => b.value - a.value);

    const groupBy = (getter: (order: (typeof valid)[number]) => string) =>
      Object.entries(
        valid.reduce<Record<string, number>>((acc, order) => {
          const key = getter(order);
          acc[key] = (acc[key] ?? 0) + 1;
          return acc;
        }, {})
      ).sort((a, b) => b[1] - a[1]);

    const statusCounts = Object.entries(
      inRange.reduce<Record<string, number>>((acc, order) => {
        acc[order.status] = (acc[order.status] ?? 0) + 1;
        return acc;
      }, {})
    );

    const productSales = products
      .map((product) => ({
        product,
        units: valid.reduce(
          (total, order) =>
            total + order.items.filter((item) => item.productId === product.id).reduce((sum, item) => sum + item.qty, 0),
          0
        ),
      }))
      .filter((row) => row.units > 0)
      .sort((a, b) => b.units - a.units)
      .slice(0, 6);

    return {
      inRange,
      valid,
      revenue,
      units,
      days,
      byCategory,
      payment: groupBy((order) => order.paymentMethod),
      courier: groupBy((order) => order.courier),
      statusCounts,
      productSales,
      aov: valid.length ? Math.round(revenue / valid.length) : 0,
    };
  }, [orders, products, categories, range]);

  const maxCategory = Math.max(1, ...data.byCategory.map((row) => row.value));

  return (
    <div className="space-y-5">
      <AdminPageHeader
        eyebrow="Analitik"
        title="Laporan"
        description="Ringkasan performa penjualan dari data pesanan demo."
        actions={
          <>
            <div className="flex rounded-full border border-sand-200 bg-surface p-0.5">
              {RANGES.map((item) => (
                <button
                  key={item.value}
                  onClick={() => setRange(item.value)}
                  className={cn(
                    "rounded-full px-3.5 py-1.5 text-[10px] font-semibold transition",
                    range === item.value ? "bg-ink text-surface" : "text-ink-muted hover:text-ink"
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                csvDownload("tokobagus-orders-report.csv", [
                  ["Nomor", "Tanggal", "Pelanggan", "Status", "Pembayaran", "Subtotal", "Diskon", "Ongkir", "Total"],
                  ...data.inRange.map((order) => [
                    order.orderNumber,
                    order.createdAt,
                    order.customer.name,
                    ORDER_STATUS_LABEL[order.status],
                    order.paymentMethod,
                    order.subtotal,
                    order.discount,
                    order.shippingCost,
                    order.total,
                  ]),
                ]);
                toast({ title: "Laporan CSV diunduh", tone: "success" });
              }}
            >
              <Icon name="download" size={14} /> Ekspor
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Pendapatan" value={formatIDR(data.revenue)} hint={`${data.valid.length} pesanan valid`} icon="chart" tone="olive" />
        <StatCard label="Rata-rata pesanan" value={formatIDR(data.aov)} hint="Nilai order rata-rata" icon="wallet" tone="brass" />
        <StatCard label="Unit terjual" value={data.units.toLocaleString("id-ID")} hint="Semua item" icon="box" />
        <StatCard
          label="Tingkat konversi demo"
          value={`${data.inRange.length ? Math.round((data.valid.length / data.inRange.length) * 100) : 0}%`}
          hint="Pesanan valid dari total"
          icon="sparkles"
        />
      </div>

      <AdminCard title="Tren pendapatan 14 hari" description="Nilai transaksi valid per hari">
        <MiniBars data={data.days} formatValue={(value) => formatIDR(value)} className="pt-2" />
      </AdminCard>

      <div className="grid gap-5 lg:grid-cols-3">
        <AdminCard title="Pendapatan per kategori" description={`Rentang ${range} hari`}>
          <div className="space-y-3">
            {data.byCategory.map((row) => (
              <BarRow key={row.label} label={row.label} value={row.value} max={maxCategory} formatValue={(value) => formatIDR(value)} />
            ))}
            {data.byCategory.every((row) => row.value === 0) && <p className="py-4 text-center text-xs text-ink-muted">Belum ada penjualan pada rentang ini.</p>}
          </div>
        </AdminCard>

        <AdminCard title="Metode pembayaran" description="Jumlah pesanan per metode">
          <div className="space-y-3">
            {data.payment.map(([label, count]) => (
              <BarRow key={label} label={label} value={count} max={Math.max(1, ...data.payment.map(([, value]) => value))} formatValue={(value) => `${value}×`} tone="brass" />
            ))}
            {data.payment.length === 0 && <p className="py-4 text-center text-xs text-ink-muted">Belum ada data.</p>}
          </div>
        </AdminCard>

        <AdminCard title="Kurir" description="Preferensi pengiriman pelanggan">
          <div className="space-y-3">
            {data.courier.map(([label, count]) => (
              <BarRow key={label} label={label} value={count} max={Math.max(1, ...data.courier.map(([, value]) => value))} formatValue={(value) => `${value}×`} />
            ))}
            {data.courier.length === 0 && <p className="py-4 text-center text-xs text-ink-muted">Belum ada data.</p>}
          </div>
        </AdminCard>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <AdminCard title="Produk terlaris" description={`Rentang ${range} hari`} bodyClassName="p-0">
          <ul className="divide-y divide-sand-100">
            {data.productSales.map((row, index) => (
              <li key={row.product.id} className="flex items-center gap-3 px-5 py-3">
                <span className="display w-5 text-sm text-brass-600">0{index + 1}</span>
                <div className="min-w-0 flex-1">
                  <Link href={`/admin/products/${row.product.id}`} className="block truncate text-xs font-semibold text-ink hover:text-brass-700">
                    {row.product.name}
                  </Link>
                  <p className="mt-0.5 text-[10px] text-ink-muted">{categories.find((category) => category.id === row.product.categoryId)?.name}</p>
                </div>
                <span className="text-[10px] font-semibold text-ink-soft">{row.units} unit</span>
              </li>
            ))}
            {data.productSales.length === 0 && <li className="px-5 py-8 text-center text-xs text-ink-muted">Belum ada produk terjual.</li>}
          </ul>
        </AdminCard>

        <div className="space-y-5">
          <AdminCard title="Status pesanan" description="Distribusi seluruh pesanan dalam rentang">
            <div className="grid grid-cols-2 gap-3">
              {data.statusCounts.map(([status, count]) => (
                <div key={status} className="rounded-xl bg-canvas-soft p-3">
                  <p className="text-[9px] uppercase tracking-widest text-ink-muted">{ORDER_STATUS_LABEL[status as keyof typeof ORDER_STATUS_LABEL]}</p>
                  <p className="display mt-1 text-lg">{count}</p>
                </div>
              ))}
              {data.statusCounts.length === 0 && <p className="col-span-2 py-4 text-center text-xs text-ink-muted">Belum ada pesanan.</p>}
            </div>
          </AdminCard>

          <AdminCard title="Zona demo" description="Kembalikan data contoh untuk presentasi ulang">
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  resetCatalog();
                  resetOrders();
                  toast({ title: "Data demo direset", description: "Katalog dan pesanan kembali ke kondisi awal", tone: "success" });
                }}
              >
                <Icon name="refresh" size={14} /> Reset katalog & pesanan
              </Button>
              <Link href="/" className={buttonStyles({ variant: "ghost", size: "sm" })}>
                <Icon name="external" size={13} /> Lihat storefront
              </Link>
            </div>
          </AdminCard>
        </div>
      </div>
    </div>
  );
}
