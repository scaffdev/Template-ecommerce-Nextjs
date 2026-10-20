"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import { cn } from "@/lib/cn";
import { estimateDelivery, formatDateTime, formatIDR } from "@/lib/utils";
import { useOrders } from "@/store/orders";
import { useCountdown, useHydrated } from "@/components/ui/hooks";
import { useToast } from "@/components/ui/toast";
import { Button, EmptyState } from "@/components/ui/primitives";
import { buttonStyles } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/icon";

function generateToken(seed: string) {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) | 0;
  }
  const digits = Math.abs(hash).toString().padStart(12, "0").slice(0, 12);
  return `8808 ${digits.slice(0, 4)} ${digits.slice(4, 8)} ${digits.slice(8, 12)}`;
}

function FakeQr({ seed }: { seed: string }) {
  const size = 21;
  const cells = useMemo(() => {
    let hash = 7;
    for (let index = 0; index < seed.length; index += 1) hash = (hash * 17 + seed.charCodeAt(index)) % 2147483647;
    const random = () => {
      hash = (hash * 48271) % 2147483647;
      return hash / 2147483647;
    };
    const grid: boolean[][] = Array.from({ length: size }, () => Array.from({ length: size }, () => false));
    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) grid[y][x] = random() > 0.52;
    }
    const finder = (ox: number, oy: number) => {
      for (let y = 0; y < 7; y += 1) {
        for (let x = 0; x < 7; x += 1) {
          const edge = y === 0 || y === 6 || x === 0 || x === 6;
          const core = y >= 2 && y <= 4 && x >= 2 && x <= 4;
          grid[oy + y][ox + x] = edge || core;
        }
      }
      for (let y = -1; y < 8; y += 1) {
        for (let x = -1; x < 8; x += 1) {
          const gy = oy + y;
          const gx = ox + x;
          if (gy < 0 || gx < 0 || gy >= size || gx >= size) continue;
          if (y === -1 || y === 7 || x === -1 || x === 7) grid[gy][gx] = false;
        }
      }
    };
    finder(0, 0);
    finder(size - 7, 0);
    finder(0, size - 7);
    return grid;
  }, [seed]);

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="h-44 w-44" role="img" aria-label="Kode QRIS demo">
      <rect width={size} height={size} fill="#FFFFFF" />
      {cells.map((row, y) =>
        row.map((cell, x) => (cell ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="#18181B" /> : null))
      )}
    </svg>
  );
}

export default function PaymentPage() {
  const params = useParams<{ orderId: string }>();
  const router = useRouter();
  const hydrated = useHydrated();
  const { toast } = useToast();
  const orders = useOrders((state) => state.orders);
  const markPaid = useOrders((state) => state.markPaid);
  const cancelOrder = useOrders((state) => state.cancelOrder);
  const order = orders.find((item) => item.id === params.orderId);
  const countdown = useCountdown(order?.status === "pending" ? order.expiresAt : null);

  if (hydrated && !order) {
    return (
      <div className="container-lume py-16">
        <EmptyState
          icon="clock"
          title="Pesanan tidak ditemukan"
          description="Tautan pembayaran mungkin sudah kedaluwarsa atau pesanan telah dibatalkan."
          action={
            <Link href="/products" className={buttonStyles({})}>
              Kembali belanja
            </Link>
          }
        />
      </div>
    );
  }

  if (!order) {
    return <div className="container-lume py-24 text-center text-sm text-ink-muted">Memuat pesanan…</div>;
  }

  const vaNumber = generateToken(order.id);
  const paid = order.status !== "pending";
  const methodIcon = order.paymentMethodId === "qris" ? "qr" : order.paymentMethodId === "card" ? "credit-card" : order.paymentMethodId === "cod" ? "wallet" : "bank";

  const countdownText = countdown.expired
    ? "Kedaluwarsa"
    : `${String(countdown.days * 24 + countdown.hours).padStart(2, "0")}:${String(countdown.minutes).padStart(2, "0")}:${String(countdown.seconds).padStart(2, "0")}`;

  const completePayment = () => {
    markPaid(order.id);
    toast({ title: "Pembayaran diterima", description: "Terima kasih! Pesanan Anda segera kami siapkan.", tone: "success" });
    router.push(`/checkout/success?order=${order.id}`);
  };

  return (
    <div className="container-lume py-5 sm:py-7">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] text-ink-muted">
        <Link href="/" className="hover:text-brand-600">
          Beranda
        </Link>
        <Icon name="chevron-right" size={11} />
        <Link href="/products" className="hover:text-brand-600">
          Produk
        </Link>
        <Icon name="chevron-right" size={11} />
        <span className="text-ink">Pembayaran</span>
      </nav>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1fr] lg:gap-6">
        <div>
          <div className="rounded-xl border border-sand-200 bg-white p-5 text-center sm:p-7">
            {paid ? (
              <>
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-olive-100 text-olive-700">
                  <Icon name="check-circle" size={26} />
                </span>
                <h1 className="mt-4 text-xl font-extrabold text-ink">Pembayaran sudah diterima</h1>
                <p className="mt-2 text-sm text-ink-soft">
                  Pesanan {order.orderNumber} sedang kami siapkan. Kami akan mengabari via email saat kurir menjemput paket.
                </p>
                <Link href={`/account/orders/${order.id}`} className={buttonStyles({ className: "mt-6" })}>
                  Lihat pesanan <Icon name="arrow-right" size={15} />
                </Link>
              </>
            ) : (
              <>
                <p className="eyebrow">Menunggu pembayaran</p>
                <p className="mt-2 text-3xl font-extrabold text-brand-600">{formatIDR(order.total)}</p>
                <p className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-brand-50 px-3 py-1.5 text-[11px] font-bold text-brand-700">
                  <Icon name="clock" size={13} /> Selesaikan dalam {countdownText}
                </p>

                <div className="mt-5 rounded-xl border border-sand-200 bg-sand-50 p-4 text-left sm:p-5">
                  <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-ink">
                    <Icon name={methodIcon} size={15} className="text-brand-600" /> {order.paymentMethod}
                  </p>

                  {order.paymentMethodId === "qris" && (
                    <div className="mt-4 flex flex-col items-center gap-3">
                      <div className="rounded-xl border border-sand-200 bg-white p-3">
                        <FakeQr seed={order.id} />
                      </div>
                      <p className="text-center text-xs leading-relaxed text-ink-muted">
                        Scan dengan aplikasi apa pun yang mendukung QRIS — GoPay, OVO, DANA, atau m-banking.
                      </p>
                    </div>
                  )}

                  {order.paymentMethodId === "cod" && (
                    <div className="mt-4 rounded-lg bg-white p-3.5 text-[12px] leading-relaxed text-ink-soft">
                      Siapkan uang tunai <span className="font-bold text-ink">{formatIDR(order.total)}</span> saat kurir tiba.
                      Kurir akan menghubungi {order.customer.phone} sebelum datang.
                    </div>
                  )}

                  {order.paymentMethodId !== "qris" && order.paymentMethodId !== "cod" && (
                    <div className="mt-4">
                      <p className="text-xs text-ink-muted">
                        {order.paymentMethodId === "card" ? "Nomor referensi transaksi" : "Nomor Virtual Account"}
                      </p>
                      <div className="mt-2 flex items-center justify-between gap-3 rounded-lg border border-dashed border-sand-400 bg-white px-3 py-2.5">
                        <span className="font-mono text-lg font-bold tracking-widest text-ink">{vaNumber}</span>
                        <button
                          onClick={async () => {
                            await navigator.clipboard.writeText(vaNumber.replace(/\s/g, ""));
                            toast({ title: "Nomor disalin", tone: "info" });
                          }}
                          className="inline-flex items-center gap-1.5 rounded-md border border-sand-300 px-3 py-1.5 text-[11px] font-semibold text-ink-soft transition hover:border-brand-400 hover:text-brand-600"
                        >
                          <Icon name="copy" size={13} /> Salin
                        </button>
                      </div>
                      <p className="mt-2 text-[11px] text-ink-muted">
                        a.n. {orders.length > 0 ? "tokobagus.com" : "tokobagus.com"} · verifikasi otomatis dalam 1–3 menit (simulasi).
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Button className="flex-1" size="lg" onClick={completePayment}>
                    Saya sudah bayar
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => {
                      cancelOrder(order.id);
                      toast({ title: "Pesanan dibatalkan", description: "Stok dikembalikan otomatis.", tone: "info" });
                      router.push("/products");
                    }}
                  >
                    Batalkan
                  </Button>
                </div>
                <p className="mt-3 text-[11px] leading-relaxed text-ink-muted">
                  Tombol “Saya sudah bayar” adalah simulasi untuk demo template ini.
                </p>
              </>
            )}
          </div>

          <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
            {[
              { icon: "shield" as const, label: "Pembayaran aman" },
              { icon: "refresh" as const, label: "Garansi 30 hari" },
              { icon: "headset" as const, label: "Bantuan 9–21" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 rounded-lg border border-sand-200 bg-white px-3 py-2.5 text-[10px] font-semibold text-ink-soft">
                <Icon name={item.icon} size={15} className="text-brand-600" /> {item.label}
              </div>
            ))}
          </div>
        </div>

        <aside>
          <div className="overflow-hidden rounded-xl border border-sand-200 bg-white">
            <div className="flex items-center justify-between border-b border-sand-200 px-4 py-3.5 sm:px-5">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest2 text-ink">{order.orderNumber}</p>
                <p className="mt-1 text-[11px] text-ink-muted">Dibuat {formatDateTime(order.createdAt)}</p>
              </div>
              <span className={cn("rounded px-2 py-1 text-[9px] font-bold uppercase tracking-wide", "bg-brand-50 text-brand-700")}>
                Menunggu bayar
              </span>
            </div>
            <ul className="space-y-3 px-4 py-4 sm:px-5">
              {order.items.map((item) => (
                <li key={`${item.productId}-${item.variantId}`} className="flex items-center gap-3">
                  <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-sand-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-[12px] font-semibold leading-snug text-ink">{item.name}</p>
                    <p className="mt-0.5 text-[10px] text-ink-muted">
                      {item.variantName ? `${item.variantName} · ` : ""}
                      {item.qty}× {formatIDR(item.price)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="space-y-2.5 border-t border-sand-200 px-4 py-4 text-[12px] sm:px-5">
              <div className="flex justify-between gap-3">
                <span className="text-ink-soft">Subtotal</span>
                <span className="font-semibold text-ink">{formatIDR(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between gap-3">
                  <span className="text-ink-soft">Diskon</span>
                  <span className="font-semibold text-success">−{formatIDR(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between gap-3">
                <span className="text-ink-soft">Pengiriman — {order.courier}</span>
                <span className="font-semibold text-ink">{order.shippingCost === 0 ? "Gratis" : formatIDR(order.shippingCost)}</span>
              </div>
              <div className="flex justify-between gap-3 border-t border-sand-200 pt-3">
                <span className="font-semibold text-ink">Total</span>
                <span className="font-bold text-ink">{formatIDR(order.total)}</span>
              </div>
            </div>
            <div className="border-t border-sand-200 bg-sand-50 px-4 py-4 text-[10px] leading-relaxed text-ink-muted sm:px-5">
              <p className="font-semibold text-ink">Dikirim ke</p>
              <p className="mt-1">
                {order.address.recipient} · {order.address.phone}
                <br />
                {order.address.detail}, {order.address.district}, {order.address.city}, {order.address.province}{" "}
                {order.address.postalCode}
              </p>
              <p className="mt-3 font-semibold text-ink">Estimasi tiba</p>
              <p className="mt-1">
                {estimateDelivery(order.etd)} · {order.courier}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
