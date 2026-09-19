import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProduct, products, reviews, getCategory } from "@/lib/data";
import { formatIDR } from "@/lib/utils";
import { Badge, Rating } from "@/components/ui/primitives";
import { PdpActions } from "./pdp-actions";

export const revalidate = 120;

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return { title: "Produk tidak ditemukan" };
  return {
    title: p.name,
    description: p.description.slice(0, 160),
    openGraph: { title: p.name, description: p.description.slice(0, 160), images: [p.images[0]?.url] },
  };
}

export default async function PdpPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();
  const cat = getCategory(p.categoryId);
  const related = products.filter((x) => x.categoryId === p.categoryId && x.id !== p.id).slice(0, 4);
  const revs = reviews.filter((r) => r.productId === p.id);

  return (
    <div className="space-y-8 py-6">
      <nav className="text-xs text-gray-500" aria-label="Breadcrumb">
        <Link href="/" className="hover:underline">Home</Link> /{" "}
        <Link href="/products" className="hover:underline">Produk</Link> /{" "}
        {cat && <><Link href={`/category/${cat.slug}`} className="hover:underline">{cat.name}</Link> / </>}
        <span className="text-gray-800">{p.name}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.images[0]?.url} alt={p.images[0]?.alt ?? p.name} className="aspect-square w-full rounded-2xl border object-cover" />
          <div className="mt-2 flex gap-2">
            {p.images.map((im) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={im.id} src={im.url} alt={im.alt} className="h-16 w-16 rounded-lg border object-cover" loading="lazy" />
            ))}
          </div>
        </div>
        <div>
          <div className="flex gap-1">
            {p.isBestSeller && <Badge tone="red">Best Seller</Badge>}
            {p.isNew && <Badge tone="green">Terbaru</Badge>}
            {p.comparePrice && <Badge tone="amber">Hemat {formatIDR(p.comparePrice - p.basePrice)}</Badge>}
          </div>
          <h1 className="mt-2 text-2xl font-bold">{p.name}</h1>
          <div className="mt-1 flex items-center gap-3 text-sm">
            <Rating value={p.rating} count={p.reviewCount} />
            <span className="text-gray-400">|</span>
            <span className="text-gray-600">Terjual {p.sold.toLocaleString("id-ID")}</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-sky-700">{formatIDR(p.basePrice)}</span>
            {p.comparePrice && <s className="text-gray-400">{formatIDR(p.comparePrice)}</s>}
          </div>
          <PdpActions productId={p.id} />
          <div className="mt-4 space-y-1 text-xs text-gray-600">
            <p>Berat: {p.weight} gram • SKU tersedia: {p.variants.length} varian</p>
            <p>Estimasi ongkir: Rp11–25rb (1–3 hari) • <Link href="/shipping-policy" className="text-sky-600 underline">Lihat kebijakan</Link></p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border bg-white p-5 md:col-span-2">
          <h2 className="font-bold">Deskripsi Produk</h2>
          <p className="mt-2 whitespace-pre-line text-sm text-gray-700">{p.description}</p>
          <h3 className="mt-4 font-bold">Spesifikasi</h3>
          <ul className="mt-1 text-sm text-gray-700">
            <li>Berat: {p.weight} g</li>
            <li>Kategori: {cat?.name}</li>
            <li>Tag: {p.tags.join(", ")}</li>
          </ul>
        </div>
        <div className="rounded-2xl border bg-white p-5">
          <h2 className="font-bold">Ulasan ({p.reviewCount.toLocaleString("id-ID")})</h2>
          <p className="mt-1 text-3xl font-black">{p.rating.toFixed(1)} <span className="text-base font-normal text-gray-500">/ 5.0</span></p>
          <div className="mt-3 space-y-3">
            {revs.length === 0 && <p className="text-xs text-gray-500">Belum ada ulasan terverifikasi. Hanya pembeli yang sudah menyelesaikan pesanan yang dapat mengulas.</p>}
            {revs.map((r) => (
              <div key={r.id} className="rounded-xl bg-gray-50 p-3 text-sm">
                <p className="font-semibold">{r.user} <span className="text-amber-500">{"★".repeat(r.rating)}</span></p>
                <p className="text-gray-700">{r.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div>
          <h2 className="mb-3 font-bold">Produk Serupa</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {related.map((r) => (
              <Link key={r.id} href={`/products/${r.slug}`} className="rounded-2xl border bg-white p-3 hover:shadow">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={r.images[0].url} alt={r.name} className="aspect-square w-full rounded-xl object-cover" loading="lazy" />
                <p className="mt-2 line-clamp-2 text-sm font-medium">{r.name}</p>
                <b className="text-sm text-sky-700">{formatIDR(r.basePrice)}</b>
              </Link>
            ))}
          </div>
        </div>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: p.name,
            image: p.images.map((i) => i.url),
            description: p.description.slice(0, 200),
            offers: { "@type": "Offer", priceCurrency: "IDR", price: p.basePrice, availability: "https://schema.org/InStock" },
            aggregateRating: { "@type": "AggregateRating", ratingValue: p.rating, reviewCount: p.reviewCount },
          }),
        }}
      />
    </div>
  );
}
