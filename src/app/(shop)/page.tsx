"use client";

import Image from "next/image";
import Link from "next/link";
import { useCatalog } from "@/store/catalog";
import { journalPosts } from "@/lib/data";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { CategoryQuickNav } from "@/components/home/category-quick-nav";
import { VoucherStrip } from "@/components/home/voucher-strip";
import { FlashSaleRail } from "@/components/home/flash-sale-rail";
import { PromoTiles } from "@/components/home/promo-tiles";
import { ProductFeed } from "@/components/home/product-feed";
import { Icon } from "@/components/ui/icon";

export default function HomePage() {
  const banners = useCatalog((state) => state.banners);

  return (
    <div className="container-lume space-y-3 py-3 sm:space-y-4 sm:py-4">
      <div className="grid gap-3 2xl:grid-cols-[1fr_300px]">
        <HeroCarousel banners={banners} />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 2xl:grid-cols-1">
          <Link href="/products" className="relative overflow-hidden rounded-xl bg-brand-600 p-4 text-white transition hover:bg-brand-700">
            <Icon name="truck" size={22} className="text-white/80" />
            <p className="mt-2 text-sm font-extrabold">Gratis ongkir</p>
            <p className="mt-0.5 text-[10px] text-white/75">Belanja min. Rp750.000 ke seluruh Indonesia</p>
            <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold">
              Mulai belanja <Icon name="arrow-right" size={12} />
            </span>
            <Icon name="truck" size={72} className="absolute -bottom-4 -right-3 text-white/10" />
          </Link>

          <Link href="/vouchers" className="relative overflow-hidden rounded-xl border border-accent-200 bg-accent-50 p-4 text-ink transition hover:border-accent-400">
            <Icon name="ticket" size={22} className="text-accent-600" />
            <p className="mt-2 text-sm font-extrabold">Voucher hingga 10%</p>
            <p className="mt-0.5 text-[10px] text-ink-muted">Klaim sekarang sebelum kedaluwarsa</p>
            <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold text-accent-700">
              Klaim voucher <Icon name="arrow-right" size={12} />
            </span>
            <Icon name="ticket" size={72} className="absolute -bottom-4 -right-3 text-accent-200/70" />
          </Link>

          <Link href="/track-order" className="relative col-span-2 overflow-hidden rounded-xl bg-ink p-4 text-white transition hover:bg-ink-soft sm:col-span-1">
            <Icon name="package" size={22} className="text-white/80" />
            <p className="mt-2 text-sm font-extrabold">Lacak pesanan</p>
            <p className="mt-0.5 text-[10px] text-white/70">Cek status pengiriman paket Anda</p>
            <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold">
              Cek sekarang <Icon name="arrow-right" size={12} />
            </span>
            <Icon name="package" size={72} className="absolute -bottom-4 -right-3 text-white/10" />
          </Link>
        </div>
      </div>

      <CategoryQuickNav />
      <VoucherStrip compact />
      <FlashSaleRail />
      <PromoTiles />
      <ProductFeed />

      <section className="rounded-xl border border-sand-200 bg-white p-4 sm:p-5">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="eyebrow">Journal tokobagus.com</p>
            <h2 className="mt-1 text-lg font-extrabold text-ink sm:text-xl">Inspirasi & tips sebelum belanja</h2>
          </div>
          <Link href="/journal" className="flex items-center gap-1 text-[11px] font-bold text-brand-600 hover:underline">
            Semua artikel <Icon name="arrow-right" size={13} />
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {journalPosts.slice(0, 3).map((post) => (
            <Link key={post.slug} href={`/journal/${post.slug}`} className="group overflow-hidden rounded-lg border border-sand-200">
              <div className="relative aspect-[16/9] overflow-hidden bg-sand-50">
                <Image src={post.image} alt={post.title} fill sizes="(max-width: 768px) 100vw, 360px" className="object-cover transition duration-500 group-hover:scale-105" />
              </div>
              <div className="p-3">
                <p className="text-[9px] font-bold uppercase tracking-wider text-brand-600">{post.category}</p>
                <h3 className="mt-1 line-clamp-2 text-[13px] font-bold leading-snug text-ink group-hover:text-brand-600">{post.title}</h3>
                <p className="mt-1 text-[10px] text-ink-muted">{post.readTime}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
