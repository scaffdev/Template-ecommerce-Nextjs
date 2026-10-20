import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Masuk admin",
  description: "Panel admin tokobagus.com untuk mengelola katalog, pesanan, dan konten toko.",
  robots: { index: false, follow: false },
};

export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
