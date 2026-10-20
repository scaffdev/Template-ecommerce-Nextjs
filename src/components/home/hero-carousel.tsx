"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Banner } from "@/types";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

export function HeroCarousel({ banners }: { banners: Banner[] }) {
  const slides = banners.filter((banner) => banner.isActive);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) return null;
  const current = slides[Math.min(active, slides.length - 1)];

  const go = (direction: 1 | -1) => {
    setActive((value) => (value + direction + slides.length) % slides.length);
  };

  return (
    <div className="group relative overflow-hidden rounded-xl border border-sand-200 bg-ink">
      <div className="relative aspect-[16/10] sm:aspect-[2/1] lg:aspect-[2.35/1]">
        {slides.map((banner, index) => (
          <div
            key={banner.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-700",
              index === active ? "opacity-100" : "pointer-events-none opacity-0"
            )}
          >
            <Image src={banner.image} alt={banner.title} fill priority={index === 0} sizes="(max-width: 1024px) 100vw, 860px" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/55 to-ink/10" />
          </div>
        ))}

        <div className="relative z-10 flex h-full flex-col justify-center p-5 sm:p-8 lg:p-10">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-md bg-brand-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
            <Icon name="bolt" size={12} /> Promo spesial
          </span>
          <h1 className="mt-3 max-w-xl text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl">
            {current.title}
          </h1>
          <p className="mt-2 max-w-lg text-[12px] leading-relaxed text-white/75 sm:text-sm">{current.subtitle}</p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            <Link href={current.ctaHref} className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-5 py-2.5 text-[13px] font-bold text-white transition hover:bg-brand-700">
              {current.ctaLabel} <Icon name="arrow-right" size={15} />
            </Link>
            <Link href="/vouchers" className="inline-flex items-center gap-1.5 rounded-lg border border-white/30 bg-white/10 px-5 py-2.5 text-[13px] font-bold text-white backdrop-blur transition hover:bg-white/20">
              <Icon name="ticket" size={15} /> Klaim voucher
            </Link>
          </div>
        </div>

        {slides.length > 1 && (
          <>
            <div className="absolute bottom-4 left-5 z-10 flex gap-1.5 sm:left-8 lg:left-10">
              {slides.map((banner, index) => (
                <button
                  key={banner.id}
                  onClick={() => setActive(index)}
                  aria-label={`Tampilkan banner ${index + 1}`}
                  className={cn("h-1.5 rounded-full transition-all", index === active ? "w-6 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80")}
                />
              ))}
            </div>
            <button
              onClick={() => go(-1)}
              aria-label="Banner sebelumnya"
              className="absolute left-2 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/20 text-white backdrop-blur transition hover:bg-white/35 sm:grid"
            >
              <Icon name="chevron-left" size={17} />
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Banner berikutnya"
              className="absolute right-2 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/20 text-white backdrop-blur transition hover:bg-white/35 sm:grid"
            >
              <Icon name="chevron-right" size={17} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
