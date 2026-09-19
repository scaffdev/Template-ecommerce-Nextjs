import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "TokoKita — Belanja Cepat & Aman", template: "%s | TokoKita" },
  description: "Template e-commerce Next.js: katalog, keranjang, checkout, pembayaran, dan admin panel.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="min-h-screen font-sans text-gray-900 antialiased">{children}</body>
    </html>
  );
}
