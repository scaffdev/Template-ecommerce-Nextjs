import { Navbar, Footer } from "@/components/layout/chrome";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="mx-auto min-h-[60vh] max-w-7xl px-4">{children}</main>
      <Footer />
    </>
  );
}
