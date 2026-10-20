import type { Metadata } from "next";
import { categories } from "@/lib/data";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = categories.find((item) => item.slug === slug);
  if (!category) return { title: "Kategori" };
  return {
    title: category.name,
    description: category.tagline || category.description.slice(0, 155),
    alternates: { canonical: `/category/${category.slug}` },
    openGraph: {
      title: `${category.name} — koleksi tokobagus.com`,
      description: category.tagline || category.description.slice(0, 155),
      images: [{ url: category.image, alt: category.name }],
    },
  };
}

export default function CategoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
