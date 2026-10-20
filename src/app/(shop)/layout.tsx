import { StoreShell } from "@/components/layout/store-shell";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <StoreShell withSidebars>{children}</StoreShell>;
}
