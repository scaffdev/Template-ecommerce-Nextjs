import Link from "next/link";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const links = [
    ["/account", "Ringkasan"],
    ["/account/orders", "Riwayat Pesanan"],
    ["/account/addresses", "Alamat"],
    ["/account/profile", "Profil"],
    ["/account/wishlist", "Wishlist"],
  ];
  return (
    <div className="grid gap-6 py-6 md:grid-cols-[220px_1fr]">
      <aside className="h-fit rounded-2xl border bg-white p-3 text-sm">
        {links.map(([href, label]) => (
          <Link key={href} href={href} className="block rounded-lg px-3 py-2 hover:bg-gray-100">{label}</Link>
        ))}
      </aside>
      <div>{children}</div>
    </div>
  );
}
