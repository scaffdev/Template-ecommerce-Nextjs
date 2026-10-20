import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pertanyaan umum",
  description: "Jawaban atas pertanyaan paling sering tentang pengiriman, pembayaran, dan pengembalian.",
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
