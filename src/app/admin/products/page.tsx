"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useCatalog } from "@/store/catalog";
import { useToast } from "@/components/ui/toast";
import { AdminEmpty, AdminPageHeader, statusPill } from "@/components/admin/ui";
import { Button, Input, Select } from "@/components/ui/primitives";
import { buttonStyles } from "@/components/ui/button-styles";
import { Modal } from "@/components/ui/overlay";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { formatIDR } from "@/lib/utils";

const PAGE_SIZE = 8;

export default function AdminProductsPage() {
  const { toast } = useToast();
  const products = useCatalog((state) => state.products);
  const categories = useCatalog((state) => state.categories);
  const updateProduct = useCatalog((state) => state.updateProduct);
  const deleteProduct = useCatalog((state) => state.deleteProduct);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [stock, setStock] = useState("all");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [confirmDelete, setConfirmDelete] = useState<string[] | null>(null);

  const filtered = useMemo(() => {
    const list = products.filter((product) => {
      const matchesQuery =
        !query.trim() ||
        `${product.name} ${product.slug} ${product.brand}`.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === "all" || product.categoryId === category;
      const matchesStatus = status === "all" || product.status === status;
      const totalStock = product.variants.reduce((total, variant) => total + variant.stock, 0);
      const matchesStock =
        stock === "all" ||
        (stock === "low" && totalStock > 0 && totalStock <= 10) ||
        (stock === "out" && totalStock === 0);
      return matchesQuery && matchesCategory && matchesStatus && matchesStock;
    });

    return list.sort((a, b) => {
      if (sort === "price-asc") return a.basePrice - b.basePrice;
      if (sort === "price-desc") return b.basePrice - a.basePrice;
      if (sort === "sold") return b.sold - a.sold;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [products, query, category, status, stock, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const rows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const allSelected = rows.length > 0 && rows.every((row) => selected.includes(row.id));

  const toggleAll = () =>
    setSelected((current) =>
      allSelected ? current.filter((id) => !rows.some((row) => row.id === id)) : [...new Set([...current, ...rows.map((row) => row.id)])]
    );

  const bulkStatus = (next: "active" | "draft") => {
    selected.forEach((id) => updateProduct(id, { status: next }));
    toast({ title: `${selected.length} produk diubah ke ${next === "active" ? "aktif" : "draft"}`, tone: "success" });
    setSelected([]);
  };

  return (
    <div className="space-y-5">
      <AdminPageHeader
        eyebrow="Katalog"
        title="Produk"
        description={`${products.length} produk di katalog demo. Kelola harga, stok, dan visibilitas.`}
        actions={
          <Link href="/admin/products/new" className={buttonStyles({ size: "sm" })}>
            <Icon name="plus" size={14} /> Tambah produk
          </Link>
        }
      />

      <div className="card-surface p-4">
        <div className="grid gap-2 lg:grid-cols-[1.6fr_1fr_0.8fr_0.8fr_0.9fr]">
          <div className="relative">
            <Icon name="search" size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
            <Input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="Cari nama, slug, atau brand…"
              className="pl-9 text-xs"
            />
          </div>
          <Select
            value={category}
            onChange={(event) => {
              setCategory(event.target.value);
              setPage(1);
            }}
            className="text-xs"
          >
            <option value="all">Semua kategori</option>
            {categories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </Select>
          <Select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
            className="text-xs"
          >
            <option value="all">Semua status</option>
            <option value="active">Aktif</option>
            <option value="draft">Draft</option>
          </Select>
          <Select
            value={stock}
            onChange={(event) => {
              setStock(event.target.value);
              setPage(1);
            }}
            className="text-xs"
          >
            <option value="all">Semua stok</option>
            <option value="low">Stok rendah (≤10)</option>
            <option value="out">Stok habis</option>
          </Select>
          <Select value={sort} onChange={(event) => setSort(event.target.value)} className="text-xs">
            <option value="newest">Terbaru</option>
            <option value="sold">Terlaris</option>
            <option value="price-asc">Harga terendah</option>
            <option value="price-desc">Harga tertinggi</option>
          </Select>
        </div>

        {selected.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl border border-brass-300 bg-brass-50 px-3 py-2">
            <span className="text-[11px] font-semibold text-brass-800">{selected.length} produk dipilih</span>
            <div className="ml-auto flex flex-wrap gap-1.5">
              <Button size="sm" variant="outline" onClick={() => bulkStatus("active")}>
                Aktifkan
              </Button>
              <Button size="sm" variant="outline" onClick={() => bulkStatus("draft")}>
                Jadikan draft
              </Button>
              <Button size="sm" variant="danger" onClick={() => setConfirmDelete(selected)}>
                Hapus
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setSelected([])}>
                Batal pilih
              </Button>
            </div>
          </div>
        )}

        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-xs">
            <thead>
              <tr className="border-b border-sand-200 text-[9px] uppercase tracking-widest text-ink-muted">
                <th className="w-8 py-2.5 pl-1">
                  <input type="checkbox" checked={allSelected} onChange={toggleAll} aria-label="Pilih semua" className="h-3.5 w-3.5 accent-[#26301F]" />
                </th>
                <th className="py-2.5 font-semibold">Produk</th>
                <th className="py-2.5 font-semibold">Kategori</th>
                <th className="py-2.5 font-semibold">Harga</th>
                <th className="py-2.5 font-semibold">Stok</th>
                <th className="py-2.5 font-semibold">Terjual</th>
                <th className="py-2.5 font-semibold">Status</th>
                <th className="py-2.5 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-100">
              {rows.length === 0 && <AdminEmpty colSpan={8} message="Tidak ada produk yang cocok dengan filter." />}
              {rows.map((product) => {
                const totalStock = product.variants.reduce((total, variant) => total + variant.stock, 0);
                const categoryName = categories.find((item) => item.id === product.categoryId)?.name ?? "—";
                return (
                  <tr key={product.id} className={cn("transition hover:bg-canvas-soft", selected.includes(product.id) && "bg-brass-50/50")}>
                    <td className="py-3 pl-1">
                      <input
                        type="checkbox"
                        checked={selected.includes(product.id)}
                        onChange={() =>
                          setSelected((current) =>
                            current.includes(product.id) ? current.filter((id) => id !== product.id) : [...current, product.id]
                          )
                        }
                        aria-label={`Pilih ${product.name}`}
                        className="h-3.5 w-3.5 accent-[#26301F]"
                      />
                    </td>
                    <td className="py-3 pr-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-sand-100">
                          {product.images[0] && <Image src={product.images[0].url} alt="" fill sizes="44px" className="object-cover" />}
                        </div>
                        <div className="min-w-0">
                          <Link href={`/admin/products/${product.id}`} className="block max-w-[220px] truncate font-semibold text-ink hover:text-brass-700">
                            {product.name}
                          </Link>
                          <p className="mt-0.5 text-[10px] text-ink-muted">
                            {product.variants.length} varian · {product.brand}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-3 text-ink-soft">{categoryName}</td>
                    <td className="py-3 pr-3">
                      <p className="font-semibold text-ink">{formatIDR(product.basePrice)}</p>
                      {product.comparePrice && <p className="text-[10px] text-ink-muted line-through">{formatIDR(product.comparePrice)}</p>}
                    </td>
                    <td className="py-3 pr-3">
                      <span
                        className={cn(
                          "font-semibold",
                          totalStock === 0 ? "text-danger" : totalStock <= 10 ? "text-[#8a6320]" : "text-ink-soft"
                        )}
                      >
                        {totalStock}
                      </span>
                    </td>
                    <td className="py-3 pr-3 text-ink-soft">{product.sold}</td>
                    <td className="py-3 pr-3">{statusPill(product.status === "active", "Aktif", "Draft")}</td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => {
                            updateProduct(product.id, { status: product.status === "active" ? "draft" : "active" });
                            toast({
                              title: product.status === "active" ? "Produk disembunyikan" : "Produk diaktifkan",
                              description: product.name,
                              tone: "info",
                            });
                          }}
                          className="grid h-8 w-8 place-items-center rounded-lg text-ink-muted transition hover:bg-canvas hover:text-ink"
                          aria-label="Ubah status"
                        >
                          <Icon name={product.status === "active" ? "eye-off" : "eye"} size={14} />
                        </button>
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="grid h-8 w-8 place-items-center rounded-lg text-ink-muted transition hover:bg-canvas hover:text-ink"
                          aria-label="Edit produk"
                        >
                          <Icon name="edit" size={14} />
                        </Link>
                        <button
                          onClick={() => setConfirmDelete([product.id])}
                          className="grid h-8 w-8 place-items-center rounded-lg text-ink-muted transition hover:bg-canvas hover:text-danger"
                          aria-label="Hapus produk"
                        >
                          <Icon name="trash" size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-sand-200 pt-3">
          <p className="text-[11px] text-ink-muted">
            Menampilkan {filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}–
            {Math.min(currentPage * PAGE_SIZE, filtered.length)} dari {filtered.length} produk
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((value) => Math.max(1, value - 1))}
              disabled={currentPage === 1}
              className="grid h-8 w-8 place-items-center rounded-full border border-sand-200 text-ink-soft transition hover:border-ink disabled:opacity-40"
              aria-label="Halaman sebelumnya"
            >
              <Icon name="chevron-left" size={14} />
            </button>
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setPage(index + 1)}
                className={cn(
                  "h-8 min-w-8 rounded-full px-2 text-[11px] font-semibold transition",
                  currentPage === index + 1 ? "bg-ink text-surface" : "text-ink-soft hover:bg-canvas"
                )}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
              disabled={currentPage === totalPages}
              className="grid h-8 w-8 place-items-center rounded-full border border-sand-200 text-ink-soft transition hover:border-ink disabled:opacity-40"
              aria-label="Halaman berikutnya"
            >
              <Icon name="chevron-right" size={14} />
            </button>
          </div>
        </div>
      </div>

      <Modal open={confirmDelete !== null} onClose={() => setConfirmDelete(null)} title="Hapus produk terpilih?">
        <p className="text-sm leading-relaxed text-ink-soft">
          {confirmDelete?.length ?? 0} produk akan dihapus dari katalog demo. Stok dan datanya tidak bisa dikembalikan.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setConfirmDelete(null)}>
            Batal
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              (confirmDelete ?? []).forEach((id) => deleteProduct(id));
              toast({ title: `${confirmDelete?.length ?? 0} produk dihapus`, tone: "success" });
              setSelected([]);
              setConfirmDelete(null);
            }}
          >
            Ya, hapus
          </Button>
        </div>
      </Modal>
    </div>
  );
}
