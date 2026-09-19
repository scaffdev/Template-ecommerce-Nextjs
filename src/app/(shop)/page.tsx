import Link from "next/link";
import { categories, products, coupons } from "@/lib/data";
import { ProductCard } from "@/components/product/ProductCard";
import { formatIDR } from "@/lib/utils";

export const revalidate = 120;

export default function HomePage() {
  const featured = products.filter((p) => p.isFeatured);
  const best = [...products].sort((a, b) => b.sold - a.sold).slice(0, 4);

  return (
    <div className="space-y-10 py-6">
      {/* Hero */}
      <section className="grid gap-4 rounded-3xl bg-gradient-to-r from-sky-700 to-sky-500 p-8 text-white md:grid-cols-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-sky-200">Promo s/d akhir bulan</p>
          <h1 className="mt-2 text-3xl font-black leading-tight md:text-4xl">
            Belanja Lokal, <br />Gratis Ongkir + Diskon 10%
          </h1>
          <p className="mt-2 text-sm text-sky-100">Gunakan kode <b className="rounded bg-white/20 px-2 py-0.5">HEMAT10</b> & <b className="rounded bg-white/20 px-2 py-0.5">GRATISONGKIR</b> di checkout.</p>
          <div className="mt-5 flex gap-2">
            <Link href="/products" className="rounded-lg bg-white px-5 py-2.5 text-sm font-bold text-sky-700">Belanja Sekarang</Link>
            <Link href="/products?sort=best" className="rounded-lg border border-white/40 px-5 py-2.5 text-sm font-semibold">Terlaris</Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {featured.slice(0, 4).map((p) => (
            <Link key={p.id} href={`/products/${p.slug}`} className="overflow-hidden rounded-2xl bg-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.images[0].url} alt={p.name} className="aspect-square w-full object-cover" loading="lazy" />
              <p className="truncate px-2 py-1.5 text-xs font-semibold">{p.name} — {formatIDR(p.basePrice)}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Kategori */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold">Jelajahi Kategori</h2>
          <Link href="/products" className="text-sm text-sky-600">Lihat semua →</Link>
        </div>
        <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
          {categories.filter((c) => !c.parentId).map((c) => (
            <Link key={c.id} href={`/category/${c.slug}`} className="overflow-hidden rounded-2xl border bg-white text-center hover:shadow">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.image} alt={c.name} className="aspect-square w-full object-cover" loading="lazy" />
              <p className="py-2 text-xs font-semibold">{c.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Voucher aktif */}
      <section className="grid gap-3 md:grid-cols-3">
        {coupons.map((k) => (
          <div key={k.id} className="rounded-2xl border border-dashed border-sky-300 bg-sky-50 p-4">
            <p className="font-mono text-lg font-black text-sky-700">{k.code}</p>
            <p className="text-xs text-gray-600">
              {k.type === "percent" ? `Diskon ${k.value}% s/d ${formatIDR(k.maxDiscount ?? 0)}` : k.type === "fixed" ? `Potongan ${formatIDR(k.value)}` : "Gratis ongkir"} • Min. {formatIDR(k.minPurchase)}
            </p>
          </div>
        ))}
      </section>

      {/* Produk unggulan */}
      <section>
        <h2 className="mb-3 text-lg font-bold">Produk Unggulan</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {featured.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>

      {/* Terlaris */}
      <section>
        <h2 className="mb-3 text-lg font-bold">Paling Laris</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {best.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "TokoKita",
            url: "https://tokokita.example.com",
          }),
        }}
      />
    </div>
  );
}
