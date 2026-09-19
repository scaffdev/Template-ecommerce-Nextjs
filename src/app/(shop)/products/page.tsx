import Link from "next/link";
import { products, categories } from "@/lib/data";
import { ProductCard } from "@/components/product/ProductCard";

export const revalidate = 60;

type SP = { q?: string; category?: string; min?: string; max?: string; sort?: string; page?: string; rating?: string; instock?: string };

function applyFilters(list: typeof products, sp: SP) {
  let out = [...list];
  if (sp.q) {
    const q = sp.q.toLowerCase();
    out = out.filter((p) => (p.name + " " + p.description + " " + p.tags.join(" ")).toLowerCase().includes(q));
  }
  if (sp.category) out = out.filter((p) => p.categoryId === sp.category);
  if (sp.min) out = out.filter((p) => p.basePrice >= Number(sp.min));
  if (sp.max) out = out.filter((p) => p.basePrice <= Number(sp.max));
  if (sp.rating) out = out.filter((p) => p.rating >= Number(sp.rating));
  if (sp.instock === "1") out = out.filter((p) => p.variants.some((v) => v.stock > 0));
  switch (sp.sort) {
    case "cheap": out.sort((a, b) => a.basePrice - b.basePrice); break;
    case "expensive": out.sort((a, b) => b.basePrice - a.basePrice); break;
    case "best": out.sort((a, b) => b.sold - a.sold); break;
    case "rating": out.sort((a, b) => b.rating - a.rating); break;
    default: out.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  }
  return out;
}

export default async function CatalogPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const filtered = applyFilters(products, sp);
  const perPage = 8;
  const page = Math.max(1, Number(sp.page ?? 1));
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const items = filtered.slice((page - 1) * perPage, page * perPage);
  const qs = (patch: Partial<SP>) => {
    const merged = { ...sp, ...patch };
    const s = new URLSearchParams();
    Object.entries(merged).forEach(([k, v]) => { if (v) s.set(k, String(v)); });
    return `/products?${s.toString()}`;
  };

  return (
    <div className="grid gap-6 py-6 md:grid-cols-[240px_1fr]">
      <aside className="h-fit rounded-2xl border bg-white p-4 text-sm">
        <h2 className="font-bold">Filter</h2>
        <p className="mt-3 font-semibold">Kategori</p>
        <div className="mt-1 space-y-1">
          <Link href="/products" className={`block rounded px-2 py-1 ${!sp.category ? "bg-sky-100 font-bold" : "hover:bg-gray-100"}`}>Semua</Link>
          {categories.filter((c) => !c.parentId).map((c) => (
            <Link key={c.id} href={qs({ category: c.id, page: "1" })} className={`block rounded px-2 py-1 ${sp.category === c.id ? "bg-sky-100 font-bold" : "hover:bg-gray-100"}`}>{c.name}</Link>
          ))}
        </div>
        <p className="mt-3 font-semibold">Harga</p>
        <div className="flex gap-2">
          <Link href={qs({ min: "0", max: "150000", page: "1" })} className="rounded border px-2 py-1 hover:bg-gray-50">&lt;150rb</Link>
          <Link href={qs({ min: "150000", max: "400000", page: "1" })} className="rounded border px-2 py-1 hover:bg-gray-50">150–400rb</Link>
          <Link href={qs({ min: "400000", page: "1" })} className="rounded border px-2 py-1 hover:bg-gray-50">&gt;400rb</Link>
        </div>
        <p className="mt-3 font-semibold">Lainnya</p>
        <div className="space-y-1">
          <Link href={qs({ instock: "1", page: "1" })} className="block rounded px-2 py-1 hover:bg-gray-100">✓ Stok tersedia</Link>
          <Link href={qs({ rating: "4.7", page: "1" })} className="block rounded px-2 py-1 hover:bg-gray-100">★ Rating 4.7+</Link>
        </div>
      </aside>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-gray-600">{filtered.length} produk ditemukan</p>
          <div className="flex gap-2 text-xs">
            {[["new", "Terbaru"], ["cheap", "Termurah"], ["expensive", "Termahal"], ["best", "Terlaris"], ["rating", "Rating"]].map(([v, l]) => (
              <Link key={v} href={qs({ sort: v, page: "1" })} className={`rounded-full border px-3 py-1.5 ${sp.sort === v || (!sp.sort && v === "new") ? "bg-sky-600 text-white" : "bg-white"}`}>{l}</Link>
            ))}
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {items.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
        {items.length === 0 && <p className="mt-10 text-center text-sm text-gray-500">Tidak ada produk yang cocok dengan filter.</p>}
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <Link key={n} href={qs({ page: String(n) })} className={`rounded-lg border px-3 py-1.5 text-sm ${n === page ? "bg-sky-600 text-white" : "bg-white"}`}>{n}</Link>
          ))}
        </div>
      </div>
    </div>
  );
}
