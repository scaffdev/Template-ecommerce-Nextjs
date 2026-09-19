import { notFound } from "next/navigation";
import { categories, products, getCategory } from "@/lib/data";
import { ProductCard } from "@/components/product/ProductCard";

export const revalidate = 120;

export async function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = getCategory(slug);
  if (!cat) notFound();
  const childIds = categories.filter((c) => c.parentId === cat.id).map((c) => c.id);
  const items = products.filter((p) => p.categoryId === cat.id || childIds.includes(p.categoryId));

  return (
    <div className="py-6">
      <h1 className="text-xl font-bold">{cat.name}</h1>
      <p className="text-sm text-gray-600">{items.length} produk</p>
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {items.map((p) => <ProductCard key={p.id} p={p} />)}
      </div>
    </div>
  );
}
