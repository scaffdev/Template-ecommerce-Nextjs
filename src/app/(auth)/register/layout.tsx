import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar",
  description: "Buat akun tokobagus.com untuk pengalaman belanja yang lebih personal.",
  robots: { index: false, follow: false },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
