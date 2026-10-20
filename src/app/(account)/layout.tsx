import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Akun", template: "%s | Akun tokobagus.com" },
  description: "Kelola pesanan, wishlist, alamat, dan profil akun tokobagus.com Anda.",
  robots: { index: false, follow: false },
};

export default function AccountGroupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
