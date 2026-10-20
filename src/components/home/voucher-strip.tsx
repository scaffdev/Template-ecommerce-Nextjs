"use client";

import Link from "next/link";
import { useCatalog } from "@/store/catalog";
import { useCart, useClaimedVouchers } from "@/store/commerce";
import { useToast } from "@/components/ui/toast";
import { Icon } from "@/components/ui/icon";
import { formatIDR } from "@/lib/utils";
import { cn } from "@/lib/cn";

export function VoucherStrip({ compact = false }: { compact?: boolean }) {
  const coupons = useCatalog((state) => state.coupons);
  const claimed = useClaimedVouchers((state) => state.codes);
  const claim = useClaimedVouchers((state) => state.claim);
  const setCoupon = useCart((state) => state.setCoupon);
  const { toast } = useToast();

  const active = coupons.filter((coupon) => coupon.isActive).slice(0, compact ? 3 : 6);

  const voucherValue = (type: string, value: number) => {
    if (type === "percent") return `${value}%`;
    if (type === "freeship") return "Gratis ongkir";
    return formatIDR(value);
  };

  return (
    <section className="rounded-xl border border-sand-200 bg-white p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-brand-50 text-brand-600">
            <Icon name="ticket" size={15} />
          </span>
          <h2 className="text-sm font-extrabold text-ink sm:text-base">Voucher hari ini</h2>
        </div>
        <Link href="/vouchers" className="text-[11px] font-bold text-brand-600 hover:underline">
          Lihat semua
        </Link>
      </div>

      <div className={cn("grid gap-2.5", compact ? "sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3")}>
        {active.map((coupon) => {
          const isClaimed = claimed.includes(coupon.code);
          return (
            <div key={coupon.id} className="relative flex items-center gap-3 overflow-hidden rounded-lg border border-dashed border-brand-300 bg-brand-50/60 p-3">
              <span className="absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-white" />
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-extrabold text-brand-700">{voucherValue(coupon.type, coupon.value)}</p>
                <p className="mt-0.5 truncate text-[10px] text-ink-muted">{coupon.description}</p>
                <p className="mt-0.5 text-[9px] text-ink-muted">Min. belanja {formatIDR(coupon.minPurchase)}</p>
              </div>
              <button
                onClick={async () => {
                  claim(coupon.code);
                  setCoupon(coupon.code);
                  try {
                    await navigator.clipboard.writeText(coupon.code);
                  } catch {}
                  toast({ title: `Voucher ${coupon.code} siap dipakai`, description: coupon.description, tone: "success" });
                }}
                className={cn(
                  "shrink-0 rounded-md px-2.5 py-1.5 text-[10px] font-bold transition",
                  isClaimed ? "bg-white text-brand-700 ring-1 ring-brand-200" : "bg-brand-600 text-white hover:bg-brand-700"
                )}
              >
                {isClaimed ? "Dipakai" : "Klaim"}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
