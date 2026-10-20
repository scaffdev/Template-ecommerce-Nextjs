"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ORDER_STATUS_COLOR, ORDER_STATUS_FLOW, ORDER_STATUS_LABEL, formatDate, formatIDR, formatRelative } from "@/lib/utils";
import { useOrders } from "@/store/orders";
import { useWishlist } from "@/store/commerce";
import { useAddresses, useAuth, useNotifications } from "@/store/account";
import { useCatalog } from "@/store/catalog";
import { useToast } from "@/components/ui/toast";
import { Badge, Divider, EmptyState } from "@/components/ui/primitives";
import { buttonStyles } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

const NOTIFICATION_ICON = {
  order: "package",
  promo: "ticket",
  restock: "bell",
  system: "info",
} as const;

export default function AccountDashboardPage() {
  const { toast } = useToast();
  const user = useAuth((state) => state.user);
  const orders = useOrders((state) => state.orders);
  const wishlist = useWishlist((state) => state.ids);
  const addresses = useAddresses((state) => state.addresses);
  const notifications = useNotifications((state) => state.notifications);
  const markRead = useNotifications((state) => state.markRead);
  const coupons = useCatalog((state) => state.coupons);

  const stats = useMemo(() => {
    const valid = orders.filter((order) => order.status !== "cancelled");
    return {
      total: orders.length,
      active: orders.filter((order) => ["pending", "paid", "processing", "shipped"].includes(order.status)).length,
      spent: valid.reduce((sum, order) => sum + order.total, 0),
    };
  }, [orders]);

  const defaultAddress = addresses.find((address) => address.isDefault) ?? addresses[0];
  const role = user?.role ?? "Pelanggan";

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-600">Ringkasan akun</p>
          <h1 className="mt-1 text-xl font-extrabold tracking-tight text-ink sm:text-2xl">Halo, {user?.name.split(" ")[0]}.</h1>
          <p className="mt-1 text-[12px] text-ink-muted">Berikut ringkasan aktivitas akun Anda bersama tokobagus.com.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/products" className={buttonStyles({ variant: "outline", size: "sm" })}>
            <Icon name="bag" size={14} /> Belanja lagi
          </Link>
          <Link href="/track-order" className={buttonStyles({ size: "sm" })}>
            <Icon name="truck" size={14} /> Lacak paket
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
        {[
          { label: "Total pesanan", value: String(stats.total), icon: "package" as const, hint: "sejak bergabung" },
          { label: "Sedang berjalan", value: String(stats.active), icon: "truck" as const, hint: "menunggu atau dikirim" },
          { label: "Total belanja", value: formatIDR(stats.spent), icon: "credit-card" as const, hint: "tidak termasuk yang dibatalkan" },
          { label: "Wishlist", value: String(wishlist.length), icon: "heart" as const, hint: "produk tersimpan" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-sand-200 bg-white p-4">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-50 text-brand-700">
              <Icon name={stat.icon} size={16} />
            </span>
            <p className="mt-2.5 text-[10px] font-semibold uppercase tracking-wide text-ink-muted">{stat.label}</p>
            <p className="mt-0.5 text-xl font-extrabold text-ink">{stat.value}</p>
            <p className="mt-0.5 text-[9px] text-ink-muted">{stat.hint}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <section>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-[12px] font-extrabold text-ink">Pesanan terbaru</h2>
            <Link href="/account/orders" className="text-xs font-semibold text-brand-700 hover:underline">
              Lihat semua
            </Link>
          </div>
          {orders.length === 0 ? (
            <EmptyState
              className="mt-4"
              icon="package"
              title="Belum ada pesanan"
              description="Pesanan pertama Anda akan muncul di sini beserta status pengirimannya."
              action={
                <Link href="/products" className={buttonStyles({})}>
                  Mulai belanja
                </Link>
              }
            />
          ) : (
            <ul className="mt-4 space-y-3">
              {orders.slice(0, 3).map((order) => {
                const flowIndex = ORDER_STATUS_FLOW.indexOf(order.status);
                return (
                  <li key={order.id} className="rounded-xl border border-sand-200 bg-white p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-[13px] font-bold text-ink">{order.orderNumber}</p>
                        <p className="mt-0.5 text-[11px] text-ink-muted">
                          {formatDate(order.createdAt)} · {order.items.length} produk
                        </p>
                      </div>
                      <Badge tone="neutral" className={cn(ORDER_STATUS_COLOR[order.status])}>
                        {ORDER_STATUS_LABEL[order.status]}
                      </Badge>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      {order.items.slice(0, 3).map((item) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          key={`${item.productId}-${item.variantId}`}
                          src={item.image}
                          alt={item.name}
                          className="h-12 w-10 rounded-lg object-cover"
                        />
                      ))}
                      <span className="ml-auto text-sm font-bold text-ink">{formatIDR(order.total)}</span>
                    </div>
                    {flowIndex >= 0 && order.status !== "cancelled" && order.status !== "returned" && (
                      <div className="mt-4 flex items-center gap-1.5">
                        {ORDER_STATUS_FLOW.map((status, index) => (
                          <span
                            key={status}
                            className={cn(
                              "h-1 flex-1 rounded-full",
                              index <= flowIndex ? "bg-olive-600" : "bg-sand-200"
                            )}
                            title={ORDER_STATUS_LABEL[status]}
                          />
                        ))}
                      </div>
                    )}
                    <div className="mt-4 flex gap-2">
                      <Link href={`/account/orders/${order.id}`} className={buttonStyles({ variant: "outline", size: "sm" })}>
                        Detail pesanan
                      </Link>
                      {order.status === "pending" && order.paymentStatus === "unpaid" && (
                        <Link href={`/checkout/${order.id}/payment`} className={buttonStyles({ size: "sm" })}>
                          Bayar sekarang
                        </Link>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <div className="space-y-3">
          <section className="rounded-xl border border-sand-200 bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-[12px] font-extrabold text-ink">Notifikasi</h2>
              <Link href="/account/notifications" className="text-[11px] font-semibold text-brand-600 hover:underline">
                Lihat semua
              </Link>
            </div>
            <ul className="mt-4 space-y-2">
              {notifications.slice(0, 4).map((notification) => (
                <li key={notification.id}>
                  <Link
                    href={notification.href ?? "/account/notifications"}
                    onClick={() => markRead(notification.id)}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-lg p-3 text-left transition hover:bg-sand-50",
                      !notification.read && "bg-brand-50/60"
                    )}
                  >
                    <span className={cn("mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full", !notification.read ? "bg-brand-600 text-white" : "bg-sand-100 text-ink-muted")}>
                      <Icon name={NOTIFICATION_ICON[notification.type ?? "order"] ?? "bell"} size={14} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="truncate text-[12px] font-semibold text-ink">{notification.title}</span>
                        {!notification.read && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" />}
                      </span>
                      <span className="mt-0.5 block text-[11px] leading-relaxed text-ink-muted">{notification.description}</span>
                      <span className="mt-1 block text-[10px] text-ink-muted">{formatRelative(notification.date)}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {defaultAddress && (
            <section className="rounded-xl border border-sand-200 bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-[12px] font-extrabold text-ink">Alamat utama</h2>
                <Link href="/account/addresses" className="text-[11px] font-semibold text-brand-700 hover:underline">
                  Kelola
                </Link>
              </div>
              <p className="mt-4 text-[13px] font-semibold text-ink">
                {defaultAddress.label} · {defaultAddress.recipient}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-ink-muted">
                {defaultAddress.detail}, {defaultAddress.district}, {defaultAddress.city}, {defaultAddress.province}{" "}
                {defaultAddress.postalCode}
              </p>
            </section>
          )}

          <section className="rounded-xl border border-sand-200 bg-white p-4">
            <h2 className="text-[12px] font-extrabold text-ink">Voucher tersedia</h2>
            <ul className="mt-4 space-y-2.5">
              {coupons.filter((coupon) => coupon.isActive).slice(0, 3).map((coupon) => (
                <li key={coupon.id} className="flex items-center justify-between gap-3 rounded-xl border border-dashed border-brand-300 bg-brand-50/50 p-3">
                  <div className="min-w-0">
                    <p className="text-[12px] font-bold tracking-wide text-brand-800">{coupon.code}</p>
                    <p className="truncate text-[10px] text-ink-muted">{coupon.description}</p>
                  </div>
                  <button
                    onClick={async () => {
                      await navigator.clipboard.writeText(coupon.code);
                      toast({ title: `Kode ${coupon.code} disalin`, tone: "info" });
                    }}
                    className="shrink-0 rounded-full border border-brand-300 px-2.5 py-1 text-[10px] font-bold text-brand-800 transition hover:bg-brand-100"
                  >
                    Salin
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-xl bg-ink p-5 text-surface">
            <p className="text-[10px] font-bold uppercase tracking-widest2 text-brand-300">Status akun</p>
            <p className="mt-2 text-sm font-semibold">Anda masuk sebagai {role.toLowerCase()}.</p>
            <p className="mt-1 text-xs leading-relaxed text-surface/60">
              Data demo tersimpan di perangkat Anda. Atur ulang kapan pun dari halaman profil.
            </p>
            <Divider className="my-4 bg-surface/10" />
            <Link href="/account/profile" className={buttonStyles({ variant: "brass", size: "sm", className: "w-full" })}>
              Buka preferensi <Icon name="arrow-right" size={14} />
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
