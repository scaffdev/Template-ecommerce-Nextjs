import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lacak pesanan",
  description: "Pantau status pengiriman pesanan tokobagus.com menggunakan nomor pesanan atau resi.",
  robots: { index: false, follow: true },
};

export default function TrackOrderLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
