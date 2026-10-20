import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lupa kata sandi",
  description: "Atur ulang kata sandi akun tokobagus.com Anda.",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
