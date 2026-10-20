import type { MetadataRoute } from "next";
import { categories, journalPosts, products } from "@/lib/data";
import { staticSlugs } from "@/lib/static";

const BASE = "https://tokobagus.com";

const staticPages = [
  "",
  "/products",
  "/search",
  "/about",
  "/contact",
  "/faq",
  "/journal",
  "/track-order",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    ...staticPages.map((path) => ({ url: `${BASE}${path}`, lastModified: now })),
    ...categories.map((category) => ({ url: `${BASE}/category/${category.slug}`, lastModified: now })),
    ...products
      .filter((product) => product.status === "active")
      .map((product) => ({ url: `${BASE}/products/${product.slug}`, lastModified: now })),
    ...journalPosts.map((post) => ({ url: `${BASE}/journal/${post.slug}`, lastModified: now })),
    ...staticSlugs().map((slug) => ({ url: `${BASE}/${slug}`, lastModified: now })),
  ];
}
