import Link from "next/link";
import { Icon } from "@/components/ui/icon";

export function AnnouncementBar() {
  return (
    <div className="bg-ink text-white">
      <div className="container-lume flex h-8 items-center justify-between gap-3 text-[10px] font-medium sm:text-[11px]">
        <div className="flex min-w-0 items-center gap-4">
          <span className="flex items-center gap-1.5 truncate">
            <Icon name="truck" size={13} className="shrink-0 text-brand-300" />
            <span className="truncate">Gratis ongkir min. Rp750.000</span>
          </span>
          <span className="hidden items-center gap-1.5 sm:flex">
            <Icon name="ticket" size={13} className="text-brand-300" />
            Voucher <strong className="font-bold">TOKOBAGUS10</strong>
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-4 text-white/70">
          <Link href="/track-order" className="transition hover:text-white">
            Lacak pesanan
          </Link>
          <Link href="/faq" className="hidden transition hover:text-white sm:inline">
            Bantuan
          </Link>
          <Link href="/vouchers" className="hidden items-center gap-1 font-semibold text-white transition hover:text-brand-200 md:flex">
            <Icon name="sparkles" size={12} /> Klaim voucher
          </Link>
        </div>
      </div>
    </div>
  );
}
