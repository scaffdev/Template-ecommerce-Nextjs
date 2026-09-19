import { products } from "@/lib/data";
import { ProductCard } from "@/components/product/ProductCard";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const query = q.toLowerCase();
  const items = query
    ? products.filter((p) => (p.name + " " + p.description + " " + p.tags.join(" ")).toLowerCase().includes(query))
    : [];
  const suggestions = query
    ? products.filter((p) => p.name.toLowerCase().includes(query)).slice(0, 5)
    : [];

  return (
    <div className="py-6">
      <h1 className="text-xl font-bold">Hasil pencarian: “{q}”</h1>
      <p className="text-sm text-gray-600">{items.length} produk ditemukan</p>
      {suggestions.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          <span className="text-gray-500">Saran:</span>
          {suggestions.map((s) => (
            <a key={s.id} href={`/products/${s.slug}`} className="rounded-full border bg-white px-3 py-1 hover:bg-gray-50">{s.name}</a>
          ))}
        </div>
      )}
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {items.map((p) => <ProductCard key={p.id} p={p} />)}
      </div>
      {query && items.length === 0 && <p className="mt-8 text-center text-sm text-gray-500">Coba kata kunci lain, mis. “sepatu”, “kemeja”, “TWS”.</p>}
    </div>
  );
}
