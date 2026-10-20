"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { StoreShell } from "@/components/layout/store-shell";
import { useAuth, useNotifications } from "@/store/account";
import { useHydrated } from "@/components/ui/hooks";
import { useToast } from "@/components/ui/toast";
import { EmptyState } from "@/components/ui/primitives";
import { buttonStyles } from "@/components/ui/button-styles";
import { Icon, type IconName } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

const links: { href: string; label: string; icon: IconName }[] = [
  { href: "/account", label: "Ringkasan", icon: "layout-grid" },
  { href: "/account/orders", label: "Pesanan", icon: "package" },
  { href: "/account/wishlist", label: "Wishlist", icon: "heart" },
  { href: "/account/notifications", label: "Notifikasi", icon: "bell" },
  { href: "/account/addresses", label: "Alamat", icon: "map-pin" },
  { href: "/account/profile", label: "Profil & preferensi", icon: "user" },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const hydrated = useHydrated();
  const { toast } = useToast();
  const user = useAuth((state) => state.user);
  const logout = useAuth((state) => state.logout);
  const unread = useNotifications((state) => state.unread());

  return (
    <StoreShell>
      <div className="container-lume py-5 sm:py-7">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] text-ink-muted">
          <Link href="/" className="hover:text-brand-600">
            Beranda
          </Link>
          <Icon name="chevron-right" size={12} />
          <span className="text-ink">Akun</span>
        </nav>

        {!hydrated ? (
          <div className="py-24 text-center text-sm text-ink-muted">Memuat akun…</div>
        ) : !user ? (
          <EmptyState
            className="mt-10"
            icon="lock"
            title="Masuk untuk membuka halaman akun"
            description="Dashboard pesanan, wishlist, dan alamat tersimpan hanya tersedia setelah Anda masuk. Gunakan akun demo untuk mencoba semua fitur."
            action={
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/login?redirect=/account" className={buttonStyles({})}>
                  Masuk sekarang <Icon name="arrow-right" size={15} />
                </Link>
                <Link href="/register" className={buttonStyles({ variant: "outline" })}>
                  Buat akun
                </Link>
              </div>
            }
          />
        ) : (
          <div className="mt-4 grid gap-4 lg:grid-cols-[240px_1fr] lg:gap-6">
            <aside>
              <div className="rounded-xl border border-sand-200 bg-white p-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-50 text-lg font-bold text-brand-600">
                    {user.name.slice(0, 1).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">{user.name}</p>
                    <p className="truncate text-[11px] text-ink-muted">{user.email}</p>
                  </div>
                </div>
                <p className="mt-3 rounded-md bg-sand-50 px-2.5 py-1.5 text-[10px] font-semibold text-ink-muted">
                  Member sejak {new Date(user.joinedAt).getFullYear()}
                </p>
              </div>

              <nav className="mt-2 rounded-xl border border-sand-200 bg-white p-1.5 hidden lg:block" aria-label="Menu akun">
                {links.map((link) => {
                  const active = link.href === "/account" ? pathname === "/account" : pathname.startsWith(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[12px] font-semibold transition",
                        active ? "bg-brand-50 text-brand-700" : "text-ink-soft hover:bg-sand-50"
                      )}
                    >
                      <Icon name={link.icon} size={16} />
                      {link.label}
                      {link.href === "/account/notifications" && unread > 0 && (
                        <span className="ml-auto grid h-4 min-w-4 place-items-center rounded-full bg-brand-600 px-1 text-[9px] font-bold text-white">
                          {unread}
                        </span>
                      )}
                    </Link>
                  );
                })}
                <div className="mt-2 border-t border-sand-200 pt-2">
                  <Link
                    href="/track-order"
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[12px] font-semibold text-ink-soft transition hover:bg-sand-50"
                  >
                    <Icon name="truck" size={16} /> Lacak pesanan
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      toast({ title: "Anda telah keluar", tone: "info" });
                      router.push("/");
                    }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[12px] font-semibold text-ink-soft transition hover:bg-sand-50 hover:text-danger"
                  >
                    <Icon name="logout" size={16} /> Keluar
                  </button>
                </div>
              </nav>

              <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 lg:hidden">
                {links.map((link) => {
                  const active = link.href === "/account" ? pathname === "/account" : pathname.startsWith(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-semibold transition",
                        active ? "border-brand-600 bg-brand-50 text-brand-600" : "border-sand-300 text-ink-soft"
                      )}
                    >
                      <Icon name={link.icon} size={12} /> {link.label}
                      {link.href === "/account/notifications" && unread > 0 && (
                        <span className="grid h-3.5 min-w-3.5 place-items-center rounded-full bg-brand-600 px-0.5 text-[8px] text-white">{unread}</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </aside>

            <div className="min-w-0">{children}</div>
          </div>
        )}
      </div>
    </StoreShell>
  );
}
