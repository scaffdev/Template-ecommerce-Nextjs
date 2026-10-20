import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { journalPosts } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { JournalShare, ReadingProgress } from "@/components/journal/share-row";
import { buttonStyles } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/icon";

export function generateStaticParams() {
  return journalPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = journalPosts.find((item) => item.slug === slug);
  if (!post) return { title: "Artikel tidak ditemukan" };
  return { title: post.title, description: post.excerpt };
}

export default async function JournalPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = journalPosts.find((item) => item.slug === slug);
  if (!post) notFound();

  const related = journalPosts.filter((item) => item.slug !== post.slug).slice(0, 2);

  return (
    <>
      <ReadingProgress />
      <article className="container-lume py-8 sm:py-10">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[11px] text-ink-muted">
          <Link href="/" className="hover:text-brand-600">
            Home
          </Link>
          <Icon name="chevron-right" size={12} />
          <Link href="/journal" className="hover:text-brand-600">
            Journal
          </Link>
          <Icon name="chevron-right" size={12} />
          <span className="line-clamp-1 text-ink">{post.title}</span>
        </nav>

        <header className="mx-auto mt-8 max-w-3xl text-center">
          <div className="flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-wider text-ink-muted">
            <span className="text-brand-600">{post.category}</span>
            <span className="h-1 w-1 rounded-full bg-sand-400" />
            {post.readTime}
            <span className="h-1 w-1 rounded-full bg-sand-400" />
            {formatDate(post.date)}
          </div>
          <h1 className="mt-3 text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">{post.title}</h1>
          <p className="mx-auto mt-3 max-w-2xl text-[13px] leading-relaxed text-ink-muted">{post.excerpt}</p>
          <div className="mt-6 flex justify-center">
            <JournalShare title={post.title} slug={post.slug} />
          </div>
        </header>

        <div className="relative mx-auto mt-10 aspect-[16/9] max-w-4xl overflow-hidden rounded-xl">
          <Image src={post.image} alt={post.title} fill priority sizes="(max-width: 1024px) 100vw, 900px" className="object-cover" />
        </div>

        <div className="mx-auto mt-8 max-w-2xl">
          <p className="border-l-2 border-brand-500 pl-5 text-lg font-semibold leading-relaxed text-ink">{post.intro}</p>

          <div className="mt-7 space-y-7">
            {post.sections.map((section, index) => (
              <section key={section.heading} id={`bagian-${index + 1}`} className="scroll-mt-24">
                <h2 className="text-xl font-extrabold text-ink">{section.heading}</h2>
                <div className="mt-4 space-y-4">
                  {section.body
                    .split(/\n\n+/)
                    .filter(Boolean)
                    .map((paragraph) => (
                      <p key={paragraph} className="text-[14px] leading-[1.8] text-ink-soft">
                        {paragraph}
                      </p>
                    ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-12 flex flex-col gap-4 rounded-xl border border-sand-200 bg-white p-6 sm:flex-row sm:items-center">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand-50 font-extrabold text-lg text-brand-600">L</span>
            <div className="flex-1">
              <p className="text-[13px] font-semibold text-ink">Ditulis oleh Tim tokobagus.com</p>
              <p className="mt-1 text-xs leading-relaxed text-ink-muted">
                Tim kecil di Jakarta yang mengurasi produk, menulis, dan memotret semuanya sendiri.
              </p>
            </div>
            <Link href="/about" className={buttonStyles({ variant: "outline", size: "sm" })}>
              Kenali kami
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-sand-200 pt-6">
            <JournalShare title={post.title} slug={post.slug} />
            <Link href="/journal" className="inline-flex items-center gap-2 text-xs font-semibold text-ink-soft transition hover:text-brand-600">
              <Icon name="arrow-left" size={14} /> Semua artikel
            </Link>
          </div>
        </div>
      </article>

      <section className="border-t border-sand-200 bg-sand-50 py-10 sm:py-12">
        <div className="container-lume">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-xl font-extrabold sm:text-2xl">Bacaan berikutnya</h2>
            <Link href="/journal" className="text-xs font-semibold text-brand-700 hover:underline">
              Lihat semua
            </Link>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {related.map((item) => (
              <Link key={item.slug} href={`/journal/${item.slug}`} className="group grid gap-4 rounded-xl border border-sand-200 bg-white p-3 sm:grid-cols-[160px_1fr]">
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                  <Image src={item.image} alt={item.title} fill sizes="200px" className="object-cover transition duration-700 group-hover:scale-105" />
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600">{item.category}</span>
                  <h3 className="mt-1 text-[14px] font-bold leading-snug transition group-hover:text-brand-700">{item.title}</h3>
                  <span className="mt-2 text-[11px] text-ink-muted">{item.readTime}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
