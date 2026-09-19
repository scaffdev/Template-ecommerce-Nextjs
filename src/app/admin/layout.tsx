import Link from "next/link";

const links = [
  ["/admin", "Dashboard"],
  ["/admin/products", "Produk"],
  ["/admin/categories", "Kategori"],
  ["/admin/inventory", "Inventori"],
  ["/admin/orders", "Pesanan"],
  ["/admin/customers", "Pelanggan"],
  ["/admin/promotions", "Promo"],
  ["/admin/content", "Banner"],
  ["/admin/reports", "Laporan"],
  ["/admin/settings", "Pengaturan"],
  ["/admin/users", "User & Role"],
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b bg-slate-900 text-white">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
          <Link href="/admin" className="font-extrabold">TokoKita Admin</Link>
          <span className="rounded bg-emerald-500 px-2 py-0.5 text-[11px] font-bold">OWNER</span>
          <Link href="/" className="ml-auto text-xs underline">← Lihat Toko</Link>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 md:grid-cols-[220px_1fr]">
        <aside className="h-fit rounded-2xl border bg-white p-3 text-sm">
          {links.map(([href, label]) => (
            <Link key={href} href={href} className="block rounded-lg px-3 py-2 hover:bg-gray-100">{label}</Link>
          ))}
        </aside>
        <div>{children}</div>
      </div>
    </div>
  );
}
