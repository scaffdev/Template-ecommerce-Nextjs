import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { staticPage, staticSlugs } from "@/lib/static";
import { buttonStyles } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/icon";

export function generateStaticParams() {
  return staticSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = staticPage(slug);
  if (!page) return { title: "Halaman tidak ditemukan" };
  return { title: page.title, description: page.description };
}

export default async function StaticPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = staticPage(slug);
  if (!page) notFound();

  return (
    <article className="container-lume py-8 sm:py-10">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[11px] text-ink-muted">
        <Link href="/" className="hover:text-brand-600">
          Home
        </Link>
        <Icon name="chevron-right" size={12} />
        <span className="text-ink">{page.title}</span>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-[220px_1fr] lg:gap-16">
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <p className="eyebrow">Daftar isi</p>
            <nav className="mt-4 space-y-2" aria-label="Daftar isi">
              {page.sections.map((section, index) => (
                <a
                  key={section.heading}
                  href={`#bagian-${index + 1}`}
                  className="block text-[12px] leading-relaxed text-ink-muted transition hover:text-brand-600"
                >
                  {section.heading}
                </a>
              ))}
            </nav>
            <div className="mt-8 rounded-xl bg-white p-4">
              <p className="text-[11px] font-semibold text-ink">Masih ada pertanyaan?</p>
              <p className="mt-1 text-[11px] leading-relaxed text-ink-muted">Tim kami siap membantu setiap hari 9–21 WIB.</p>
              <Link href="/contact" className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold text-brand-700 hover:underline">
                Hubungi kami <Icon name="arrow-up-right" size={12} />
              </Link>
            </div>
          </div>
        </aside>

        <div className="max-w-2xl">
          <p className="eyebrow">Informasi</p>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">{page.title}</h1>
          <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">{page.description}</p>
          <p className="mt-4 text-[11px] uppercase tracking-widest text-ink-muted">Terakhir diperbarui {page.updated}</p>

          <div className="mt-6 space-y-6">
            {page.sections.map((section, index) => (
              <section key={section.heading} id={`bagian-${index + 1}`} className="scroll-mt-24">
                <h2 className="font-extrabold text-xl text-ink">{section.heading}</h2>
                <div className="mt-3 space-y-3">
                  {section.body.map((paragraph) => (
                    <p key={paragraph} className="text-sm leading-[1.8] text-ink-soft">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-white p-6">
            <div>
              <p className="text-sm font-semibold text-ink">Butuh klarifikasi?</p>
              <p className="mt-1 text-xs text-ink-muted">Kami biasanya membalas dalam 2–4 jam pada hari kerja.</p>
            </div>
            <Link href="/contact" className={buttonStyles({ size: "sm" })}>
              Hubungi tokobagus.com <Icon name="arrow-right" size={14} />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
