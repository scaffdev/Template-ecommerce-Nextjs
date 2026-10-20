import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hubungi kami",
  description: "Tim tokobagus.com siap membantu pertanyaan tentang produk, pesanan, dan kerja sama.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
