import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { ToastProvider } from "@/components/ui/toast";
import "./globals.css";

const manrope = localFont({
  src: [{ path: "./manrope.woff2", weight: "200 800", style: "normal" }],
  variable: "--font-manrope",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tokobagus.com"),
  title: {
    default: "tokobagus.com — Belanja Online Fashion, Living & Tech",
    template: "%s | tokobagus.com",
  },
  description:
    "Belanja online di tokobagus.com: fashion, living, tech, beauty, dan aksesori pilihan. Harga terbaik, gratis ongkir, voucher, dan pengembalian 30 hari.",
  keywords: ["belanja online", "ecommerce", "fashion", "home decor", "elektronik", "beauty", "Indonesia"],
  authors: [{ name: "tokobagus.com Store" }],
  creator: "tokobagus.com Store",
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "tokobagus.com",
    title: "tokobagus.com — Belanja Online Fashion, Living & Tech",
    description: "Promo, voucher, dan produk pilihan dengan pengiriman cepat ke seluruh Indonesia.",
    images: [{ url: "/images/editorial/hero.webp", width: 1200, height: 630, alt: "tokobagus.com Store" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "tokobagus.com — Belanja Online Fashion, Living & Tech",
    description: "Promo, voucher, dan produk pilihan dengan pengiriman cepat ke seluruh Indonesia.",
    images: ["/images/editorial/hero.webp"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#FFFFFF",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={manrope.variable}>
      <body className="min-h-screen bg-canvas font-sans text-ink antialiased">
        <a
          href="#main-content"
          className="sr-only z-[120] rounded-full bg-ink px-5 py-3 text-sm font-semibold text-surface focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Lewati ke konten utama
        </a>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
