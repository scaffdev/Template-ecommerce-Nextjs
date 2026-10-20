import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Selesaikan pesanan Anda dengan alur checkout tokobagus.com.",
  robots: { index: false, follow: false },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
