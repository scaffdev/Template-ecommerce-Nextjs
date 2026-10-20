"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAdminAuth } from "@/store/admin";
import { useCatalog } from "@/store/catalog";
import { useOrders } from "@/store/orders";
import { useHydrated } from "@/components/ui/hooks";
import { useToast } from "@/components/ui/toast";
import { Drawer } from "@/components/ui/overlay";
import { Logo } from "@/components/layout/logo";
import { Icon, type IconName } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

const sections: { label: string; links: { href: string; label: string; icon: IconName }[] }[] = [
  {
    label: "Utama",
    links: [
      { href: "/admin", label: "Dashboard", icon: "layout-grid" },
      { href: "/admin/orders", label: "Pesanan", icon: "package" },
      { href: "/admin/reports", label: "Laporan", icon: "chart" },
    ],
  },
  {
    label: "Katalog",
    links: [
      { href: "/admin/products", label: "Produk", icon: "box" },
      { href: "/admin/categories", label: "Kategori", icon: "grid" },
      { href: "/admin/inventory", label: "Inventori", icon: "tag" },
    ],
  },
  {
    label: "Pemasaran",
    links: [
      { href: "/admin/promotions", label: "Voucher", icon: "ticket" },
      { href: "/admin/content", label: "Banner", icon: "image" },
    ],
  },
  {
    label: "Lainnya",
    links: [
      { href: "/admin/customers", label: "Pelanggan", icon: "users" },
      { href: "/admin/users", label: "Tim & akses", icon: "shield" },
      { href: "/admin/settings", label: "Pengaturan", icon: "settings" },
    ],
  },
];

function SidebarContent({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="px-5 py-5">
        <Logo light />
        <p className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-surface/15 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-brass-300">
          <span className="h-1.5 w-1.5 rounded-full bg-brass-400" /> Admin panel
        </p>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        {sections.map((section) => (
          <div key={section.label} className="mb-5">
            <p className="px-3 text-[9px] font-bold uppercase tracking-widest2 text-surface/30">{section.label}</p>
            <div className="mt-2 space-y-0.5">
              {section.links.map((link) => {
                const active = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={onNavigate}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[12px] font-medium transition",
                      active ? "bg-surface/10 text-surface" : "text-surface/55 hover:bg-surface/5 hover:text-surface"
                    )}
                  >
                    <Icon name={link.icon} size={16} className={active ? "text-brass-300" : ""} />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="border-t border-surface/10 p-4">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[12px] font-medium text-surface/55 transition hover:bg-surface/5 hover:text-surface"
        >
          <Icon name="external" size={16} /> Lihat toko
        </Link>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const hydrated = useHydrated();
  const { toast } = useToast();
  const admin = useAdminAuth((state) => state.admin);
  const logout = useAdminAuth((state) => state.logout);
  const products = useCatalog((state) => state.products);
  const orders = useOrders((state) => state.orders);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    if (isLogin || !hydrated) return;
    if (!admin) router.replace("/admin/login");
  }, [admin, hydrated, isLogin, router]);

  const pendingOrders = orders.filter((order) => order.status === "pending" || order.status === "paid").length;
  const lowStock = products.reduce(
    (total, product) => total + product.variants.filter((variant) => variant.stock > 0 && variant.stock <= 3).length,
    0
  );

  if (isLogin) return <>{children}</>;

  if (!hydrated) {
    return (
      <div className="grid min-h-screen place-items-center bg-ink text-sm text-surface/60">
        <span className="animate-pulse-soft">Memuat admin panel…</span>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="grid min-h-screen place-items-center bg-ink">
        <div className="text-center text-surface/60">
          <Icon name="lock" size={28} className="mx-auto text-brass-300" />
          <p className="mt-3 text-sm">Mengalihkan ke halaman masuk…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas-soft">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 bg-ink lg:block">
        <SidebarContent pathname={pathname} />
      </aside>

      <Drawer open={mobileOpen} onClose={() => setMobileOpen(false)} title="Menu admin" side="left" width="max-w-[280px]">
        <div className="min-h-full bg-ink">
          <SidebarContent pathname={pathname} onNavigate={() => setMobileOpen(false)} />
        </div>
      </Drawer>

      <div className="lg:pl-60">
        <header className="sticky top-0 z-30 border-b border-sand-200 bg-surface/90 backdrop-blur-xl">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Buka menu admin"
              className="grid h-9 w-9 place-items-center rounded-full text-ink-soft transition hover:bg-canvas lg:hidden"
            >
              <Icon name="menu" size={19} />
            </button>
            <div className="hidden items-center gap-2 rounded-full border border-sand-200 bg-canvas-soft px-3 py-2 sm:flex">
              <Icon name="search" size={14} className="text-ink-muted" />
              <span className="w-40 text-[11px] text-ink-muted">Cari di admin…</span>
              <kbd className="rounded border border-sand-300 px-1 text-[9px] text-ink-muted">/</kbd>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <Link
                href="/admin/orders"
                className="relative hidden h-9 w-9 place-items-center rounded-full text-ink-soft transition hover:bg-canvas sm:grid"
                aria-label="Pesanan masuk"
              >
                <Icon name="bell" size={18} />
                {pendingOrders > 0 && (
                  <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-brass-500 px-1 text-[9px] font-bold text-ink">
                    {pendingOrders}
                  </span>
                )}
              </Link>
              <Link
                href="/admin/inventory"
                className="hidden items-center gap-1.5 rounded-full border border-sand-200 px-3 py-2 text-[10px] font-semibold text-ink-soft transition hover:border-ink sm:flex"
              >
                <Icon name="tag" size={13} /> {lowStock} stok rendah
              </Link>
              <div className="mx-1 hidden h-6 w-px bg-sand-200 sm:block" />
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-olive-100 font-display text-xs text-olive-800">
                  {admin.name.slice(0, 1)}
                </span>
                <div className="hidden sm:block">
                  <p className="text-[11px] font-semibold leading-tight text-ink">{admin.name}</p>
                  <p className="text-[9px] uppercase tracking-widest text-ink-muted">{admin.role}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  logout();
                  toast({ title: "Keluar dari admin panel", tone: "info" });
                  router.push("/admin/login");
                }}
                aria-label="Keluar dari admin"
                className="grid h-9 w-9 place-items-center rounded-full text-ink-muted transition hover:bg-canvas hover:text-danger"
              >
                <Icon name="logout" size={16} />
              </button>
            </div>
          </div>
        </header>

        <main id="main-content" className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
          <footer className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-sand-200 pt-5 text-[10px] text-ink-muted">
            <span>tokobagus.com Admin — demo template. Semua data tersimpan lokal di browser.</span>
            <span className="flex items-center gap-1.5">
              <Icon name="lock" size={11} /> Local demo environment
            </span>
          </footer>
        </main>
      </div>
    </div>
  );
}
