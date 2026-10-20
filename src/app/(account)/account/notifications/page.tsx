"use client";

import Link from "next/link";
import { useState } from "react";
import { useNotifications } from "@/store/account";
import { useToast } from "@/components/ui/toast";
import { formatRelative } from "@/lib/utils";
import { buttonStyles } from "@/components/ui/button-styles";
import { Icon, type IconName } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

type Tab = "all" | "unread" | "order" | "promo" | "restock" | "system";

const tabs: { id: Tab; label: string }[] = [
  { id: "all", label: "Semua" },
  { id: "unread", label: "Belum dibaca" },
  { id: "order", label: "Pesanan" },
  { id: "promo", label: "Promo" },
  { id: "restock", label: "Restock" },
  { id: "system", label: "Sistem" },
];

const iconMap: Record<string, IconName> = {
  order: "package",
  promo: "ticket",
  restock: "bell",
  system: "info",
};

const typeLabel: Record<string, string> = {
  order: "Pesanan",
  promo: "Promo",
  restock: "Restock",
  system: "Sistem",
};

export default function NotificationsPage() {
  const notifications = useNotifications((state) => state.notifications);
  const markRead = useNotifications((state) => state.markRead);
  const markAllRead = useNotifications((state) => state.markAllRead);
  const remove = useNotifications((state) => state.remove);
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>("all");

  const unreadCount = notifications.filter((notification) => !notification.read).length;
  const filtered = notifications.filter((notification) => {
    if (tab === "all") return true;
    if (tab === "unread") return !notification.read;
    return (notification.type ?? "system") === tab;
  });

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Pusat notifikasi</p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-ink">Notifikasi</h1>
          <p className="mt-1 text-[12px] text-ink-muted">Update pesanan, promo, dan kabar restock produk favoritmu.</p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button
              onClick={() => {
                markAllRead();
                toast({ title: "Semua notifikasi ditandai dibaca", tone: "success" });
              }}
              className={buttonStyles({ variant: "outline", size: "sm" })}
            >
              <Icon name="check-circle" size={14} /> Tandai semua dibaca
            </button>
          )}
          <Link href="/account" className={buttonStyles({ size: "sm" })}>
            Kembali ke akun
          </Link>
        </div>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="no-scrollbar flex gap-1 overflow-x-auto rounded-lg border border-sand-200 bg-white p-1">
          {tabs.map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={cn(
                "shrink-0 rounded-md px-2.5 py-1.5 text-[10px] font-bold transition sm:text-[11px]",
                tab === item.id ? "bg-brand-50 text-brand-600" : "text-ink-soft hover:bg-sand-50"
              )}
            >
              {item.label}
              {item.id === "unread" && unreadCount > 0 && (
                <span className="ml-1 rounded bg-brand-600 px-1 py-0.5 text-[8px] text-white">{unreadCount}</span>
              )}
            </button>
          ))}
        </div>
        <p className="text-[10px] text-ink-muted">{filtered.length} notifikasi</p>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-sand-200 bg-white py-16 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-sand-50 text-sand-400">
            <Icon name="bell" size={25} />
          </span>
          <p className="mt-4 text-sm font-bold text-ink">Belum ada notifikasi di sini</p>
          <p className="mt-1 text-[12px] text-ink-muted">Notifikasi baru akan muncul otomatis saat ada update.</p>
          <Link href="/products" className={buttonStyles({ className: "mt-4", size: "sm" })}>
            Jelajahi produk <Icon name="arrow-right" size={13} />
          </Link>
        </div>
      ) : (
        <ul className="overflow-hidden rounded-xl border border-sand-200 bg-white">
          {filtered.map((notification) => {
            const type = notification.type ?? "system";
            return (
              <li key={notification.id} className={cn("border-b border-sand-200 last:border-0", !notification.read && "bg-brand-50/35")}>
                <div className="flex items-start gap-3 p-3.5 sm:p-4">
                  <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-lg", !notification.read ? "bg-brand-600 text-white" : "bg-sand-100 text-ink-muted")}>
                    <Icon name={iconMap[type] ?? "info"} size={16} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <p className="text-[12px] font-bold text-ink">{notification.title}</p>
                      <span className="rounded bg-sand-100 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-ink-muted">{typeLabel[type]}</span>
                      {!notification.read && <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />}
                    </div>
                    <p className="mt-1 text-[11px] leading-relaxed text-ink-soft">{notification.description}</p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-3 text-[10px] text-ink-muted">
                      <span>{formatRelative(notification.date)}</span>
                      {notification.href && (
                        <Link
                          href={notification.href}
                          onClick={() => markRead(notification.id)}
                          className="inline-flex items-center gap-1 font-bold text-brand-600 hover:underline"
                        >
                          Lihat detail <Icon name="arrow-right" size={11} />
                        </Link>
                      )}
                      {!notification.read && (
                        <button onClick={() => markRead(notification.id)} className="font-semibold text-ink-soft hover:text-brand-600">
                          Tandai dibaca
                        </button>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      remove(notification.id);
                      toast({ title: "Notifikasi dihapus", tone: "info" });
                    }}
                    aria-label="Hapus notifikasi"
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-ink-muted transition hover:bg-sand-100 hover:text-danger"
                  >
                    <Icon name="trash" size={14} />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
