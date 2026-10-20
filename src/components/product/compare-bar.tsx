"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCompare } from "@/store/commerce";
import { useCatalog } from "@/store/catalog";
import { Icon } from "@/components/ui/icon";
import { buttonStyles } from "@/components/ui/button-styles";
import type { Product } from "@/types";

export function CompareBar() {
  const pathname = usePathname();
  const ids = useCompare((state) => state.ids);
  const remove = useCompare((state) => state.remove);
  const clear = useCompare((state) => state.clear);
  const products = useCatalog((state) => state.products);

  if (ids.length === 0 || pathname === "/compare") return null;

  const selected = ids
    .map((id) => products.find((product) => product.id === id))
    .filter((product): product is Product => Boolean(product));

  return (
    <div className="fixed inset-x-0 bottom-14 z-30 border-t border-sand-200 bg-white/98 px-3 py-2 shadow-[0_-8px_30px_-20px_rgba(0,0,0,0.35)] backdrop-blur md:bottom-0 md:px-6 md:py-3">
      <div className="mx-auto flex max-w-[1440px] items-center gap-3">
        <span className="hidden shrink-0 items-center gap-1.5 text-xs font-bold text-ink sm:flex">
          <Icon name="compare" size={15} className="text-brand-600" /> Bandingkan ({selected.length}/4)
        </span>
        <div className="no-scrollbar flex min-w-0 flex-1 items-center gap-2 overflow-x-auto">
          {selected.map((product) => (
            <div key={product.id} className="relative flex shrink-0 items-center gap-2 rounded-lg border border-sand-200 bg-white p-1.5 pr-2">
              <div className="relative h-9 w-9 overflow-hidden rounded-md bg-canvas">
                <Image src={product.images[0].url} alt={product.name} fill sizes="36px" className="object-cover" />
              </div>
              <span className="hidden max-w-[100px] truncate text-[11px] font-semibold text-ink lg:block">{product.name}</span>
              <button onClick={() => remove(product.id)} aria-label={`Hapus ${product.name} dari perbandingan`} className="text-ink-muted hover:text-danger">
                <Icon name="close" size={12} />
              </button>
            </div>
          ))}
        </div>
        <button onClick={clear} className="hidden shrink-0 text-[11px] font-semibold text-ink-muted hover:text-danger sm:block">
          Hapus semua
        </button>
        <Link href="/compare" className={buttonStyles({ size: "sm", className: "shrink-0" })}>
          Bandingkan <Icon name="arrow-right" size={14} />
        </Link>
      </div>
    </div>
  );
}
