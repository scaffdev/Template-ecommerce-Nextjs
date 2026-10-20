"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useCatalog } from "@/store/catalog";
import { useToast } from "@/components/ui/toast";
import { AdminEmpty, AdminPageHeader, StatCard, csvDownload } from "@/components/admin/ui";
import { Button, Input, Select } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { formatIDR } from "@/lib/utils";

export default function AdminInventoryPage() {
  const { toast } = useToast();
  const products = useCatalog((state) => state.products);
  const adjustStock = useCatalog((state) => state.adjustStock);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [editing, setEditing] = useState<string | null>(null);
  const [value, setValue] = useState("");

  const rows = useMemo(
    () =>
      products.flatMap((product) =>
        product.variants.map((variant) => ({
          product,
          variant,
          thumbnail: product.images[0]?.url,
        }))
      ),
    [products]
  );

  const filtered = rows.filter(({ product, variant }) => {
    const matchesQuery = !query.trim() || `${product.name} ${variant.name} ${variant.sku}`.toLowerCase().includes(query.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "low" && variant.stock > 0 && variant.stock <= 5) ||
      (filter === "out" && variant.stock === 0);
    return matchesQuery && matchesFilter;
  });

  const stats = useMemo(() => {
    const totalUnits = rows.reduce((total, row) => total + row.variant.stock, 0);
    const low = rows.filter((row) => row.variant.stock > 0 && row.variant.stock <= 5).length;
    const out = rows.filter((row) => row.variant.stock === 0).length;
    const value = rows.reduce((total, row) => total + row.variant.stock * row.variant.price, 0);
    return { totalUnits, low, out, value };
  }, [rows]);

  const applyStock = (productId: string, variantId: string, next: number, label: string) => {
    const row = rows.find((item) => item.variant.id === variantId);
    if (!row) return;
    const change = Math.max(0, next) - row.variant.stock;
    if (change === 0) {
      setEditing(null);
      return;
    }
    adjustStock(productId, variantId, change, `Penyesuaian manual admin → ${Math.max(0, next)}`);
    toast({ title: "Stok diperbarui", description: `${label}: ${row.variant.stock} → ${Math.max(0, next)}`, tone: "success" });
    setEditing(null);
    setValue("");
  };

  return (
    <div className="space-y-5">
      <AdminPageHeader
        eyebrow="Operasional"
        title="Inventori"
        description="Sesuaikan stok per varian. Setiap perubahan tercatat di audit log."
        actions={
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              csvDownload("tokobagus-inventory.csv", [
                ["Produk", "Varian", "SKU", "Harga", "Stok", "Nilai stok"],
                ...rows.map(({ product, variant }) => [
                  product.name,
                  variant.name,
                  variant.sku,
                  variant.price,
                  variant.stock,
                  variant.price * variant.stock,
                ]),
              ]);
              toast({ title: "CSV inventori diunduh", tone: "success" });
            }}
          >
            <Icon name="download" size={14} /> Ekspor CSV
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total SKU" value={String(rows.length)} hint={`${products.length} produk`} icon="box" />
        <StatCard label="Unit tersedia" value={stats.totalUnits.toLocaleString("id-ID")} hint="Seluruh varian" icon="package" tone="olive" />
        <StatCard label="Stok rendah" value={String(stats.low)} hint="≤ 5 unit per varian" icon="alert" tone="brass" />
        <StatCard label="Nilai inventori" value={formatIDR(stats.value)} hint={`${stats.out} varian habis`} icon="chart" />
      </div>

      <div className="card-surface p-4">
        <div className="flex flex-wrap gap-2">
          <div className="relative min-w-[220px] flex-1">
            <Icon name="search" size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari produk, varian, atau SKU…" className="pl-9 text-xs" />
          </div>
          <Select value={filter} onChange={(event) => setFilter(event.target.value)} className="w-auto text-xs">
            <option value="all">Semua stok</option>
            <option value="low">Stok rendah (≤5)</option>
            <option value="out">Stok habis</option>
          </Select>
        </div>

        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-xs">
            <thead>
              <tr className="border-b border-sand-200 text-[9px] uppercase tracking-widest text-ink-muted">
                <th className="py-2.5 font-semibold">Produk / varian</th>
                <th className="py-2.5 font-semibold">SKU</th>
                <th className="py-2.5 font-semibold">Harga</th>
                <th className="py-2.5 font-semibold">Stok</th>
                <th className="py-2.5 text-right font-semibold">Penyesuaian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-100">
              {filtered.length === 0 && <AdminEmpty colSpan={5} message="Tidak ada varian yang cocok." />}
              {filtered.map(({ product, variant, thumbnail }) => (
                <tr key={variant.id} className="transition hover:bg-canvas-soft">
                  <td className="py-3 pr-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-sand-100">
                        {thumbnail && <Image src={thumbnail} alt="" fill sizes="40px" className="object-cover" />}
                      </div>
                      <div className="min-w-0">
                        <Link href={`/admin/products/${product.id}`} className="block max-w-[240px] truncate font-semibold text-ink hover:text-brass-700">
                          {product.name}
                        </Link>
                        <p className="mt-0.5 text-[10px] text-ink-muted">{variant.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-3 font-mono text-[10px] text-ink-muted">{variant.sku}</td>
                  <td className="py-3 pr-3 text-ink-soft">{formatIDR(variant.price)}</td>
                  <td className="py-3 pr-3">
                    <span
                      className={cn(
                        "inline-flex min-w-9 items-center justify-center rounded-full px-2 py-1 text-[10px] font-bold",
                        variant.stock === 0
                          ? "bg-[#f6e4df] text-danger"
                          : variant.stock <= 5
                            ? "bg-[#f7eedd] text-[#8a6320]"
                            : "bg-[#e6ece2] text-success"
                      )}
                    >
                      {variant.stock}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center justify-end gap-1">
                      {editing === variant.id ? (
                        <div className="flex items-center gap-1">
                          <Input
                            type="number"
                            min={0}
                            value={value}
                            onChange={(event) => setValue(event.target.value)}
                            className="h-8 w-20 text-xs"
                            autoFocus
                            onKeyDown={(event) => {
                              if (event.key === "Enter") applyStock(product.id, variant.id, Number(value), variant.name);
                              if (event.key === "Escape") setEditing(null);
                            }}
                          />
                          <button
                            onClick={() => applyStock(product.id, variant.id, Number(value), variant.name)}
                            className="grid h-8 w-8 place-items-center rounded-lg bg-ink text-surface"
                            aria-label="Simpan stok"
                          >
                            <Icon name="check" size={13} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => adjustStock(product.id, variant.id, -1, "Kurangi stok manual")}
                            disabled={variant.stock === 0}
                            className="grid h-8 w-8 place-items-center rounded-lg border border-sand-200 text-ink-soft transition hover:border-danger hover:text-danger disabled:opacity-30"
                            aria-label="Kurangi stok"
                          >
                            <Icon name="minus" size={13} />
                          </button>
                          <button
                            onClick={() => adjustStock(product.id, variant.id, 1, "Tambah stok manual")}
                            className="grid h-8 w-8 place-items-center rounded-lg border border-sand-200 text-ink-soft transition hover:border-olive-700 hover:text-olive-800"
                            aria-label="Tambah stok"
                          >
                            <Icon name="plus" size={13} />
                          </button>
                          <button
                            onClick={() => {
                              setEditing(variant.id);
                              setValue(String(variant.stock));
                            }}
                            className="grid h-8 w-8 place-items-center rounded-lg text-ink-muted transition hover:bg-canvas hover:text-ink"
                            aria-label="Atur stok"
                          >
                            <Icon name="edit" size={13} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
