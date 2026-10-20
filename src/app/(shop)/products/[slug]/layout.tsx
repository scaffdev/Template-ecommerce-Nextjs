import type { Metadata } from "next";
import { products } from "@/lib/data";
import { formatIDR } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  if (!product) return { title: "Produk" };
  const description = product.tagline || product.description.slice(0, 155);
  return {
    title: product.name,
    description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      type: "website",
      title: `${product.name} — ${formatIDR(product.basePrice)}`,
      description,
      images: product.images.slice(0, 1).map((image) => ({ url: image.url, alt: product.name })),
    },
  };
}

export default async function ProductSlugLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);

  if (!product) return <>{children}</>;

  const totalStock = product.variants.reduce((total, variant) => total + variant.stock, 0);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((image) => image.url),
    sku: product.variants[0]?.sku,
    brand: { "@type": "Brand", name: product.brand },
    ...(product.reviewCount > 0
      ? { aggregateRating: { "@type": "AggregateRating", ratingValue: product.rating, reviewCount: product.reviewCount } }
      : {}),
    offers: {
      "@type": "Offer",
      priceCurrency: "IDR",
      price: product.basePrice,
      url: `https://tokobagus.com/products/${product.slug}`,
      availability: totalStock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  return (
    <>
      {children}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
