"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useCatalog } from "@/store/catalog";
import { useOrders } from "@/store/orders";
import { formatDateTime, formatIDR, ORDER_STATUS_LABEL } from "@/lib/utils";
import { AdminCard, AdminPageHeader, MiniBars, StatCard } from "@/components/admin/ui";
import { Badge } from "@/components/ui/primitives";
import { buttonStyles } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

const STATUS_TONE: Record<string, string> = {
  pending: "bg-[#f7eedd] text-[#8a6320]",
  paid: "bg-[#e6ece2] text-success",
  processing: "bg-[#e4ebf0] text-[#3c5c70]",
  shipped: "bg-[#ece6f2] text-[#5c4470]",
  completed: "bg-[#e6ece2] text-success",
  cancelled: "bg-[#f6e4df] text-danger",
  returned: "bg-sand-100 text-ink-muted",
};

export default function AdminDashboardPage() {
  const products = useCatalog((state) => state.products);
  const categories = useCatalog((state) => state.categories);
  const auditLog = useCatalog((state) => state.auditLog);
  const orders = useOrders((state) => state.orders);

  const stats = useMemo(() => {
    const valid = orders.filter((order) => order.status !== "cancelled" && order.status !== "returned");
    const revenue = valid.reduce((total, order) => total + order.total, 0);
    const paid = valid.filter((order) => order.paymentStatus === "paid" || order.paymentStatus === "cod");
    const aov = valid.length ? Math.round(revenue / valid.length) : 0;

    const days = Array.from({ length: 7 }).map((_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));
      const key = date.toISOString().slice(0, 10);
      const value = valid
        .filter((order) => order.createdAt.slice(0, 10) === key)
        .reduce((total, order) => total + order.total, 0);
      return { label: date.toLocaleDateString("id-ID", { weekday: "short" }), value };
    });

    const lowStock = products
      .flatMap((product) => product.variants.map((variant) => ({ product, variant })))
      .filter(({ variant }) => variant.stock <= 5)
      .sort((a, b) => a.variant.stock - b.variant.stock)
      .slice(0, 5);

    const topProducts = [...products].sort((a, b) => b.sold - a.sold).slice(0, 5);
    const customers = new Set(valid.map((order) => order.customer.email)).size;

    return { revenue, aov, paidCount: paid.length, lowStock, days, topProducts, customers };
  }, [orders, products]);

  const pending = orders.filter((order) => order.status === "pending").length;
  const toProcess = orders.filter((order) => order.status === "paid").length;
  const toShip = orders.filter((order) => order.status === "processing").length;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Ringkasan hari ini"
        title="Selamat datang kembali."
        description="Pantau performa toko, pesanan masuk, dan kesehatan stok dalam satu layar."
        actions={
          <>
            <Link href="/admin/products/new" className={buttonStyles({ variant: "outline", size: "sm" })}>
              <Icon name="plus" size={14} /> Produk baru
            </Link>
            <Link href="/admin/orders" className={buttonStyles({ size: "sm" })}>
              Kelola pesanan <Icon name="arrow-right" size={14} />
            </Link>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Pendapatan" value={formatIDR(stats.revenue)} hint={`${orders.length} pesanan total`} icon="chart" tone="olive" trend={{ value: "12,4%", positive: true }} />
        <StatCard label="Rata-rata pesanan" value={formatIDR(stats.aov)} hint="Nilai order rata-rata" icon="wallet" tone="brass" trend={{ value: "3,1%", positive: true }} />
        <StatCard label="Pelanggan" value={String(stats.customers)} hint="Email unik bertransaksi" icon="users" trend={{ value: "8,2%", positive: true }} />
        <StatCard label="Perlu tindakan" value={String(pending + toProcess + toShip)} hint={`${pending} belum bayar · ${toProcess} siap proses · ${toShip} siap kirim`} icon="bell" trend={{ value: "2 baru", positive: false }} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <AdminCard
          title="Pendapatan 7 hari"
          description="Transaksi valid, tidak termasuk pembatalan"
          action={<Badge tone="olive">Live demo data</Badge>}
        >
          <MiniBars data={stats.days} formatValue={(value) => formatIDR(value)} className="px-2 pt-2" />
          <div className="mt-6 grid grid-cols-3 gap-3 border-t border-sand-200 pt-4">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-ink-muted">Hari ini</p>
              <p className="display mt-1 text-lg">{formatIDR(stats.days[stats.days.length - 1]?.value ?? 0)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-ink-muted">Sudah dibayar</p>
              <p className="display mt-1 text-lg">{stats.paidCount}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-ink-muted">Katalog aktif</p>
              <p className="display mt-1 text-lg">{products.filter((product) => product.status === "active").length}</p>
            </div>
          </div>
        </AdminCard>

        <AdminCard title="Pesanan terbaru" description="5 transaksi terakhir" action={<Link href="/admin/orders" className="text-[10px] font-bold uppercase tracking-widest text-brass-700">Semua</Link>} bodyClassName="p-0">
          <ul className="divide-y divide-sand-200">
            {orders.slice(0, 5).map((order) => (
              <li key={order.id}>
                <Link href={`/admin/orders/${order.id}`} className="flex items-center gap-3 px-5 py-3.5 transition hover:bg-canvas-soft">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-canvas-deep text-ink-soft">
                    <Icon name="package" size={15} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-ink">{order.customer.name}</p>
                    <p className="mt-0.5 text-[10px] text-ink-muted">
                      {order.orderNumber} · {formatDateTime(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-ink">{formatIDR(order.total)}</p>
                    <span className={cn("mt-1 inline-block rounded-full px-2 py-0.5 text-[9px] font-bold", STATUS_TONE[order.status])}>
                      {ORDER_STATUS_LABEL[order.status]}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </AdminCard>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <AdminCard title="Stok menipis" description="Varian dengan stok ≤ 5" action={<Link href="/admin/inventory" className="text-[10px] font-bold uppercase tracking-widest text-brass-700">Atur</Link>} bodyClassName="p-0">
          {stats.lowStock.length === 0 ? (
            <p className="px-5 py-8 text-center text-xs text-ink-muted">Semua stok aman.</p>
          ) : (
            <ul className="divide-y divide-sand-200">
              {stats.lowStock.map(({ product, variant }) => (
                <li key={variant.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-ink">{product.name}</p>
                    <p className="mt-0.5 text-[10px] text-ink-muted">{variant.name} · {variant.sku}</p>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-2 py-1 text-[10px] font-bold",
                      variant.stock === 0 ? "bg-[#f6e4df] text-danger" : "bg-[#f7eedd] text-[#8a6320]"
                    )}
                  >
                    {variant.stock === 0 ? "Habis" : `${variant.stock} tersisa`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </AdminCard>

        <AdminCard title="Produk terlaris" description="Berdasarkan unit terjual" bodyClassName="p-0">
          <ul className="divide-y divide-sand-200">
            {stats.topProducts.map((product, index) => (
              <li key={product.id} className="flex items-center gap-3 px-5 py-3">
                <span className="display w-5 text-sm text-brass-600">0{index + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-ink">{product.name}</p>
                  <p className="mt-0.5 text-[10px] text-ink-muted">
                    {categories.find((category) => category.id === product.categoryId)?.name ?? "Tanpa kategori"}
                  </p>
                </div>
                <span className="text-[10px] font-semibold text-ink-soft">{product.sold} terjual</span>
              </li>
            ))}
          </ul>
        </AdminCard>

        <AdminCard title="Aktivitas terbaru" description="Jejak audit katalog" action={<Icon name="clock" size={15} className="text-ink-muted" />} bodyClassName="p-0">
          <ul className="divide-y divide-sand-200">
            {auditLog.slice(0, 5).map((entry) => (
              <li key={entry.id} className="flex items-start gap-3 px-5 py-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brass-500" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-ink-soft">{entry.action}</p>
                  <p className="mt-0.5 text-[10px] text-ink-muted">
                    {entry.entity} · {formatDateTime(entry.at)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </AdminCard>
      </div>
    </div>
  );
}
