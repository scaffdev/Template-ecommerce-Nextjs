"use client";

import Link from "next/link";
import { useState } from "react";
import type { Coupon } from "@/types";
import { useCatalog } from "@/store/catalog";
import { useCart, useClaimedVouchers } from "@/store/commerce";
import { useToast } from "@/components/ui/toast";
import { useHydrated } from "@/components/ui/hooks";
import { formatDate, formatIDR } from "@/lib/utils";
import { buttonStyles } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

type Tab = "all" | "available" | "claimed";

function voucherValue(coupon: Coupon) {
  if (coupon.type === "percent") return `${coupon.value}%`;
  if (coupon.type === "freeship") return "Gratis Ongkir";
  return formatIDR(coupon.value);
}

function voucherLabel(coupon: Coupon) {
  if (coupon.type === "percent") return "Diskon persen";
  if (coupon.type === "freeship") return "Gratis pengiriman";
  return "Potongan langsung";
}

export default function VouchersPage() {
  const coupons = useCatalog((state) => state.coupons);
  const claimedCodes = useClaimedVouchers((state) => state.codes);
  const claimVoucher = useClaimedVouchers((state) => state.claim);
  const setCoupon = useCart((state) => state.setCoupon);
  const hydrated = useHydrated();
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>("all");

  const activeCoupons = coupons.filter((coupon) => coupon.isActive);
  const claimed = hydrated ? claimedCodes : [];
  const filtered = activeCoupons.filter((coupon) => {
    if (tab === "available") return !claimed.includes(coupon.code);
    if (tab === "claimed") return claimed.includes(coupon.code);
    return true;
  });

  const handleClaim = async (coupon: Coupon) => {
    if (claimed.includes(coupon.code)) {
      setCoupon(coupon.code);
      toast({ title: `Voucher ${coupon.code} siap dipakai`, description: "Kode sudah diterapkan ke keranjang Anda.", tone: "success" });
      return;
    }
    claimVoucher(coupon.code);
    setCoupon(coupon.code);
    try {
      await navigator.clipboard.writeText(coupon.code);
    } catch {}
    toast({ title: `Voucher ${coupon.code} berhasil diklaim`, description: coupon.description, tone: "success" });
  };

  return (
    <div className="container-lume py-5 sm:py-7">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] text-ink-muted">
        <Link href="/" className="hover:text-brand-600">
          Beranda
        </Link>
        <Icon name="chevron-right" size={11} />
        <span className="text-ink">Voucher</span>
      </nav>

      <div className="mt-3 overflow-hidden rounded-xl bg-gradient-to-r from-brand-600 to-accent-500 p-5 text-white sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-md bg-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide backdrop-blur">
              <Icon name="ticket" size={12} /> Voucher center
            </span>
            <h1 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">Hemat lebih banyak, setiap hari.</h1>
            <p className="mt-2 max-w-lg text-[12px] leading-relaxed text-white/80 sm:text-sm">
              Klaim voucher favoritmu, lalu pakai kodenya saat checkout. Voucher bisa dipakai untuk produk sale sekalipun.
            </p>
          </div>
          <div className="rounded-lg bg-white/10 px-4 py-3 backdrop-blur">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-white/70">Voucher tersimpan</p>
            <p className="mt-1 text-2xl font-extrabold">{claimed.length}</p>
            <p className="text-[10px] text-white/70">dari {activeCoupons.length} voucher aktif</p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 overflow-x-auto rounded-lg border border-sand-200 bg-white p-1">
          {(
            [
              ["all", "Semua voucher"],
              ["available", "Belum diklaim"],
              ["claimed", "Tersimpan"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={cn(
                "shrink-0 rounded-md px-3 py-1.5 text-[11px] font-bold transition",
                tab === id ? "bg-brand-50 text-brand-600" : "text-ink-soft hover:bg-sand-50"
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="text-[11px] text-ink-muted">
          <span className="font-bold text-brand-600">{filtered.length}</span> voucher tersedia
        </p>
      </div>

      {filtered.length > 0 ? (
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((coupon) => {
            const isClaimed = claimed.includes(coupon.code);
            return (
              <article key={coupon.id} className="overflow-hidden rounded-xl border border-sand-200 bg-white">
                <div className="relative flex items-center gap-3 bg-gradient-to-r from-brand-50 to-accent-50 p-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-white text-brand-600 shadow-soft">
                    <Icon name={coupon.type === "freeship" ? "truck" : "ticket"} size={22} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xl font-extrabold leading-none text-brand-600">{voucherValue(coupon)}</p>
                    <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-ink-muted">{voucherLabel(coupon)}</p>
                  </div>
                  {isClaimed && (
                    <span className="ml-auto inline-flex items-center gap-1 rounded bg-olive-100 px-2 py-1 text-[9px] font-bold text-olive-700">
                      <Icon name="check" size={10} /> Tersimpan
                    </span>
                  )}
                </div>
                <div className="border-t border-dashed border-sand-300 p-4">
                  <p className="text-[12px] font-bold text-ink">{coupon.description}</p>
                  <div className="mt-2 space-y-1 text-[10px] text-ink-muted">
                    <p>Min. belanja {formatIDR(coupon.minPurchase)}</p>
                    {coupon.maxDiscount && <p>Maks. potongan {formatIDR(coupon.maxDiscount)}</p>}
                    {coupon.expiresAt && <p>Berlaku hingga {formatDate(coupon.expiresAt)}</p>}
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(coupon.code);
                          toast({ title: `Kode ${coupon.code} disalin`, tone: "info" });
                        } catch {
                          toast({ title: coupon.code, description: "Salin kode secara manual.", tone: "info" });
                        }
                      }}
                      className="flex h-9 flex-1 items-center justify-between rounded-md border border-dashed border-brand-300 bg-brand-50/50 px-2.5 text-[11px] font-extrabold tracking-wide text-brand-700"
                    >
                      {coupon.code} <Icon name="copy" size={13} />
                    </button>
                    <button
                      onClick={() => handleClaim(coupon)}
                      className={cn(
                        "h-9 shrink-0 rounded-md px-3 text-[11px] font-bold transition",
                        isClaimed ? "border border-brand-200 bg-white text-brand-600 hover:bg-brand-50" : "bg-brand-600 text-white hover:bg-brand-700"
                      )}
                    >
                      {isClaimed ? "Pakai" : "Klaim"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="mt-3 rounded-xl border border-sand-200 bg-white py-16 text-center">
          <Icon name="ticket" size={28} className="mx-auto text-sand-300" />
          <p className="mt-3 text-sm font-bold text-ink">Belum ada voucher di tab ini</p>
          <p className="mt-1 text-xs text-ink-muted">Coba lihat semua voucher atau mulai belanja dulu.</p>
          <Link href="/products" className={buttonStyles({ className: "mt-4", size: "sm" })}>
            Mulai belanja <Icon name="arrow-right" size={14} />
          </Link>
        </div>
      )}

      <div className="mt-4 rounded-xl border border-sand-200 bg-white p-4">
        <p className="text-[11px] font-bold text-ink">Cara pakai voucher</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {[
            ["1", "Klaim voucher", "Pilih voucher dan klik klaim. Kode otomatis tersimpan."],
            ["2", "Belanja produk", "Masukkan produk ke keranjang, pastikan min. belanja terpenuhi."],
            ["3", "Pakai saat checkout", "Kode voucher otomatis terpakai di halaman checkout."],
          ].map(([number, title, description]) => (
            <div key={number} className="flex gap-2.5">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-50 text-[10px] font-extrabold text-brand-600">{number}</span>
              <div>
                <p className="text-[11px] font-semibold text-ink">{title}</p>
                <p className="mt-0.5 text-[10px] leading-relaxed text-ink-muted">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
