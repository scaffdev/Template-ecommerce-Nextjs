"use client";

import Link from "next/link";
import { useRef } from "react";
import type { Product } from "@/types";
import { Icon } from "@/components/ui/icon";
import { ProductCard } from "./product-card";
import { cn } from "@/lib/cn";

export function ProductRail({
  eyebrow,
  title,
  description,
  products,
  href,
  tone = "light",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  products: Product[];
  href?: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  const scroller = useRef<HTMLDivElement>(null);

  const scroll = (direction: 1 | -1) => {
    scroller.current?.scrollBy({ left: direction * 340, behavior: "smooth" });
  };

  return (
    <section className={cn("container-lume", className)}>
      <div className={cn("overflow-hidden rounded-xl border border-sand-200 bg-white", tone === "dark" && "border-ink bg-ink")}>
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-sand-200 px-4 py-4 sm:px-5">
          <div>
            {eyebrow && <p className={cn("eyebrow mb-1", tone === "dark" && "text-brand-300")}>{eyebrow}</p>}
            <h2 className={cn("text-lg font-extrabold tracking-tight text-ink sm:text-xl", tone === "dark" && "text-white")}>{title}</h2>
            {description && (
              <p className={cn("mt-1 max-w-xl text-[11px] leading-relaxed text-ink-muted sm:text-xs", tone === "dark" && "text-white/60")}>
                {description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {href && (
              <Link
                href={href}
                className={cn(
                  "inline-flex items-center gap-1 rounded-lg border border-sand-200 px-3 py-2 text-[11px] font-bold transition hover:border-brand-500 hover:text-brand-600",
                  tone === "dark" ? "border-white/20 text-white hover:border-white/60 hover:text-white" : "text-ink-soft"
                )}
              >
                Lihat semua <Icon name="arrow-right" size={13} />
              </Link>
            )}
            <div className="hidden gap-1 sm:flex">
              <button
                onClick={() => scroll(-1)}
                aria-label="Geser ke kiri"
                className={cn(
                  "grid h-8 w-8 place-items-center rounded-md border transition hover:border-brand-500 hover:text-brand-600",
                  tone === "dark" ? "border-white/20 text-white" : "border-sand-200 text-ink-soft"
                )}
              >
                <Icon name="chevron-left" size={15} />
              </button>
              <button
                onClick={() => scroll(1)}
                aria-label="Geser ke kanan"
                className={cn(
                  "grid h-8 w-8 place-items-center rounded-md border transition hover:border-brand-500 hover:text-brand-600",
                  tone === "dark" ? "border-white/20 text-white" : "border-sand-200 text-ink-soft"
                )}
              >
                <Icon name="chevron-right" size={15} />
              </button>
            </div>
          </div>
        </div>

        <div
          ref={scroller}
          className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto p-3 sm:gap-4 sm:p-4"
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              className={cn("w-[46%] shrink-0 snap-start border-sand-100 sm:w-[31%] lg:w-[23.2%]", tone === "dark" && "border-white/10")}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
