"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import type { Order } from "@/types";
import { ORDER_STATUS_FLOW, ORDER_STATUS_LABEL, estimateDelivery, formatDateTime, formatIDR } from "@/lib/utils";
import { useOrders } from "@/store/orders";
import { useHydrated } from "@/components/ui/hooks";
import { useToast } from "@/components/ui/toast";
import { Button, EmptyState, Field, Input, Skeleton } from "@/components/ui/primitives";
import { buttonStyles } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

function TrackFallback() {
  return (
    <div className="container-lume max-w-3xl py-10">
      <Skeleton className="h-10 w-72" />
      <Skeleton className="mt-4 h-4 w-96" />
      <Skeleton className="mt-8 h-14 w-full" />
    </div>
  );
}

function TrackContent() {
  const searchParams = useSearchParams();
  const hydrated = useHydrated();
  const { toast } = useToast();
  const orders = useOrders((state) => state.orders);
  const initialOrderId = searchParams.get("order") ?? "";
  const [input, setInput] = useState("");
  const [lookupId, setLookupId] = useState<string | null>(initialOrderId || null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (!initialOrderId) return;
    const order = orders.find((item) => item.id === initialOrderId);
    if (order) {
      setInput(order.orderNumber);
      setLookupId(order.id);
      setSearched(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialOrderId, hydrated]);

  const order: Order | null = useMemo(() => {
    if (!lookupId) return null;
    return orders.find((item) => item.id === lookupId) ?? null;
  }, [orders, lookupId]);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const normalized = input.trim().toLowerCase().replace(/^#/, "");
    if (!normalized) {
      toast({ title: "Masukkan nomor pesanan dulu", tone: "danger" });
      return;
    }
    const found = orders.find(
      (item) =>
        item.orderNumber.toLowerCase().replace(/^#/, "") === normalized ||
        item.id.toLowerCase() === normalized ||
        item.trackingNumber?.toLowerCase() === normalized
    );
    setLookupId(found?.id ?? null);
    setSearched(true);
    if (!found) toast({ title: "Pesanan tidak ditemukan", description: "Periksa kembali nomor pesanan Anda.", tone: "danger" });
  };

  const flowIndex = order ? ORDER_STATUS_FLOW.indexOf(order.status) : -1;
  const timelineByStatus = useMemo(() => {
    const map = new Map<string, { at: string; note?: string }>();
    order?.timeline.forEach((event) => map.set(event.status, { at: event.at, note: event.note }));
    return map;
  }, [order]);

  return (
    <div className="container-lume py-8 sm:py-10">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[11px] text-ink-muted">
        <Link href="/" className="hover:text-brand-600">
          Home
        </Link>
        <Icon name="chevron-right" size={12} />
        <span className="text-ink">Lacak pesanan</span>
      </nav>

      <div className="mt-4 max-w-2xl">
        <p className="eyebrow">Pelacakan</p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">Di mana paket saya?</h1>
        <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">
          Masukkan nomor pesanan (format <span className="font-semibold text-ink">TBG-XXXX-XXXX</span>) atau nomor resi yang kami kirim
          melalui email.
        </p>
      </div>

      <form onSubmit={submit} className="mt-5 flex max-w-2xl flex-col gap-3 sm:flex-row sm:items-end">
        <Field label="Nomor pesanan / resi" className="flex-1">
          <Input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="TBG-2609-1182"
            aria-label="Nomor pesanan atau resi"
          />
        </Field>
        <Button type="submit" size="lg" className="sm:min-w-[140px]">
          <Icon name="search" size={16} /> Lacak
        </Button>
      </form>
      <button
        onClick={() => {
          setInput("TBG-2609-1182");
          setLookupId(null);
          setSearched(false);
        }}
        className="mt-3 text-[11px] font-semibold text-brand-700 underline decoration-brand-300 underline-offset-4 hover:decoration-brand-700"
      >
        Gunakan contoh nomor pesanan demo
      </button>

      {searched && !order && (
        <EmptyState
          className="mt-6 max-w-2xl"
          icon="alert"
          title="Pesanan tidak ditemukan"
          description="Pastikan nomor yang Anda masukkan benar, atau lacak melalui halaman pesanan di akun Anda."
          action={
            <Link href="/account/orders" className={buttonStyles({})}>
              Buka pesanan saya
            </Link>
          }
        />
      )}

      {order && (
        <div className="mt-6 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <section className="rounded-xl border border-sand-200 bg-white p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[13px] font-bold text-ink">{order.orderNumber}</p>
                <p className="mt-0.5 text-[11px] text-ink-muted">Dibuat {formatDateTime(order.createdAt)}</p>
              </div>
              <Link href={`/account/orders/${order.id}`} className="text-xs font-semibold text-brand-700 hover:underline">
                Detail lengkap
              </Link>
            </div>

            {order.status === "cancelled" || order.status === "returned" ? (
              <div className="mt-6 flex items-center gap-3 rounded-xl bg-[#f6e4df] p-4 text-sm text-danger">
                <Icon name="alert" size={17} /> Pesanan ini {ORDER_STATUS_LABEL[order.status].toLowerCase()}.
              </div>
            ) : (
              <>
                <ol className="mt-8 grid grid-cols-5 gap-2">
                  {ORDER_STATUS_FLOW.map((status, index) => (
                    <li key={status} className="relative flex flex-col items-center gap-2 text-center">
                      {index > 0 && (
                        <span
                          className={cn(
                            "absolute right-1/2 top-4 -z-0 h-0.5 w-full",
                            index <= flowIndex ? "bg-olive-600" : "bg-sand-200"
                          )}
                          aria-hidden
                        />
                      )}
                      <span
                        className={cn(
                          "z-10 grid h-8 w-8 place-items-center rounded-full border-2 bg-surface",
                          index <= flowIndex ? "border-olive-600 text-olive-700" : "border-sand-300 text-ink-muted"
                        )}
                      >
                        <Icon name={index < flowIndex ? "check" : index === flowIndex ? "clock" : "chevron-right"} size={13} />
                      </span>
                      <span className={cn("text-[10px] font-semibold leading-tight", index <= flowIndex ? "text-ink" : "text-ink-muted")}>
                        {ORDER_STATUS_LABEL[status]}
                      </span>
                      {timelineByStatus.get(status) && (
                        <span className="text-[9px] text-ink-muted">
                          {new Date(timelineByStatus.get(status)!.at).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                        </span>
                      )}
                    </li>
                  ))}
                </ol>

                <div className="mt-8 rounded-xl bg-white p-4">
                  <p className="text-xs leading-relaxed text-ink-soft">
                    {order.status === "shipped"
                      ? `Paket sedang dalam perjalanan via ${order.courier}. Estimasi tiba ${estimateDelivery(order.etd)}.`
                      : order.status === "completed"
                        ? "Paket sudah diterima. Terima kasih telah berbelanja di tokobagus.com."
                        : order.status === "pending"
                          ? "Kami menunggu pembayaran Anda. Setelah terverifikasi, pesanan langsung kami siapkan."
                          : `Pesanan Anda sedang ${ORDER_STATUS_LABEL[order.status].toLowerCase()} di studio kami.`}
                  </p>
                </div>
              </>
            )}

            <dl className="mt-8 grid gap-x-8 gap-y-4 border-t border-sand-200 pt-6 sm:grid-cols-2">
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">Kurir</dt>
                <dd className="mt-1 text-sm font-semibold text-ink">{order.courier}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">Nomor resi</dt>
                <dd className="mt-1 font-mono text-sm font-semibold text-ink">{order.trackingNumber ?? "Belum tersedia"}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">Tujuan</dt>
                <dd className="mt-1 text-sm text-ink-soft">
                  {order.address.recipient} — {order.address.city}, {order.address.province}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">Total</dt>
                <dd className="mt-1 text-sm font-semibold text-ink">{formatIDR(order.total)}</dd>
              </div>
            </dl>
          </section>

          <aside className="space-y-4">
            <div className="rounded-xl border border-sand-200 bg-white p-6">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-ink">Isi paket</h2>
              <ul className="mt-4 space-y-3">
                {order.items.map((item) => (
                  <li key={`${item.productId}-${item.variantId}`} className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt={item.name} className="h-14 w-12 rounded-lg object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-[12px] font-semibold text-ink">{item.name}</p>
                      <p className="text-[10px] text-ink-muted">{item.qty} barang</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl bg-white p-5">
              <p className="text-[13px] font-semibold text-ink">Paket terlambat?</p>
              <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">
                Jika paket melewati estimasi lebih dari 3 hari, hubungi kami — kami akan mengecek langsung ke kurir.
              </p>
              <a
                href={`https://wa.me/6281234567890?text=Halo%20LUM%C3%89%2C%20paket%20${order.orderNumber}%20belum%20sampai`}
                target="_blank"
                rel="noreferrer"
                className={buttonStyles({ size: "sm", className: "mt-4 w-full" })}
              >
                <Icon name="whatsapp" size={15} /> Chat tim kami
              </a>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<TrackFallback />}>
      <TrackContent />
    </Suspense>
  );
}
