import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { journalPosts } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { buttonStyles } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/icon";

export const metadata: Metadata = {
  title: "Journal tokobagus.com",
  description: "Catatan tentang desain, material, dan seni hidup yang lebih lambat dari tokobagus.com di Jakarta.",
};

export default function JournalPage() {
  const [featured, ...rest] = journalPosts;

  return (
    <>
      <section className="border-b border-sand-200 bg-white">
        <div className="container-lume py-8 sm:py-10">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[11px] text-ink-muted">
            <Link href="/" className="hover:text-brand-600">
              Home
            </Link>
            <Icon name="chevron-right" size={12} />
            <span className="text-ink">Journal</span>
          </nav>
          <p className="eyebrow mt-4">Journal tokobagus.com</p>
          <h1 className="mt-2 max-w-2xl text-2xl font-extrabold tracking-tight sm:text-3xl">
            Catatan tentang benda, ruang, dan hidup yang lebih lambat.
          </h1>
          <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-ink-muted">
            Kami menulis tentang material, proses di balik koleksi, dan cara-cara kecil untuk membuat rumah terasa
            lebih tenang.
          </p>
        </div>
      </section>

      {featured && (
        <section className="container-lume py-8 sm:py-10">
          <Link href={`/journal/${featured.slug}`} className="group grid gap-5 lg:grid-cols-2 lg:items-center lg:gap-10">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image
                src={featured.image}
                alt={featured.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 620px"
                className="object-cover transition duration-700 group-hover:scale-105"
              />
              <span className="absolute left-4 top-4 rounded-full bg-surface/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-ink backdrop-blur">
                Artikel pilihan
              </span>
            </div>
            <div>
              <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                <span className="text-brand-600">{featured.category}</span>
                <span className="h-1 w-1 rounded-full bg-sand-400" />
                {featured.readTime}
                <span className="h-1 w-1 rounded-full bg-sand-400" />
                {formatDate(featured.date)}
              </div>
              <h2 className="mt-3 text-2xl font-extrabold leading-tight tracking-tight transition group-hover:text-brand-700 sm:text-3xl">
                {featured.title}
              </h2>
              <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-ink-muted">{featured.excerpt}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-ink hover:underline">
                Baca artikel <Icon name="arrow-right" size={14} />
              </span>
            </div>
          </Link>
        </section>
      )}

      <section className="border-t border-sand-200">
        <div className="container-lume py-8 sm:py-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Semua tulisan</p>
              <h2 className="mt-1 text-xl font-extrabold sm:text-2xl">Arsip Journal</h2>
            </div>
            <span className="text-xs text-ink-muted">{journalPosts.length} artikel</span>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <Link key={post.slug} href={`/journal/${post.slug}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 420px"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="mt-4 flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                  <span className="text-brand-600">{post.category}</span>
                  <span className="h-1 w-1 rounded-full bg-sand-400" />
                  {post.readTime}
                </div>
                <h3 className="mt-1.5 line-clamp-2 text-base font-bold leading-snug transition group-hover:text-brand-700">{post.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-soft">{post.excerpt}</p>
                <p className="mt-3 text-[11px] text-ink-muted">{formatDate(post.date)}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-lume pb-12">
        <div className="flex flex-wrap items-center justify-between gap-5 rounded-xl bg-ink p-6 text-surface sm:p-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-brand-300">Surat bulanan</p>
            <h2 className="mt-1 text-xl font-extrabold text-surface sm:text-2xl">Satu email, satu cerita, sebulan sekali.</h2>
            <p className="mt-2 max-w-md text-sm text-surface/60">
              Bergabung dengan 8.400 pembaca yang membangun rumah dan lemari dengan lebih sengaja.
            </p>
          </div>
          <Link href="/products" className={buttonStyles({ variant: "brass" })}>
            Mulai dari koleksi <Icon name="arrow-right" size={15} />
          </Link>
        </div>
      </section>
    </>
  );
}
