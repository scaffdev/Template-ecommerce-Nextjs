import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cari produk",
  description: "Cari fashion, living, tech, dan beauty pilihan dari koleksi kurasi tokobagus.com.",
  robots: { index: false, follow: true },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
