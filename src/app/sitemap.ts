import type { MetadataRoute } from "next";
import { products, categories } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://tokokita.example.com";
  return [
    { url: base, lastModified: new Date() },
    { url: `${base}/products`, lastModified: new Date() },
    ...categories.map((c) => ({ url: `${base}/category/${c.slug}`, lastModified: new Date() })),
    ...products.map((p) => ({ url: `${base}/products/${p.slug}`, lastModified: new Date() })),
  ];
}
