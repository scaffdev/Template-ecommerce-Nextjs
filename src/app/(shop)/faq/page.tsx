"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { faqs } from "@/lib/data";
import { Accordion } from "@/components/ui/accordion";
import { buttonStyles } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

export default function FaqPage() {
  const categories = useMemo(() => ["Semua", ...Array.from(new Set(faqs.map((faq) => faq.category)))], []);
  const [category, setCategory] = useState("Semua");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return faqs
      .filter((faq) => category === "Semua" || faq.category === category)
      .filter(
        (faq) =>
          !normalized ||
          faq.question.toLowerCase().includes(normalized) ||
          faq.answer.toLowerCase().includes(normalized)
      );
  }, [category, query]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    filtered.forEach((faq) => {
      const list = map.get(faq.category) ?? [];
      list.push(faq);
      map.set(faq.category, list);
    });
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <>
      <section className="border-b border-sand-200 bg-white">
        <div className="container-lume py-8 sm:py-10">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[11px] text-ink-muted">
            <Link href="/" className="hover:text-brand-600">
              Home
            </Link>
            <Icon name="chevron-right" size={12} />
            <span className="text-ink">FAQ</span>
          </nav>
          <p className="eyebrow mt-4">Pusat bantuan</p>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-[2.9rem]">Pertanyaan yang sering diajukan.</h1>
          <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-ink-muted">
            Dari pengiriman sampai pengembalian — semuanya kami jelaskan tanpa bahasa berbelit.
          </p>
          <div className="relative mt-5 max-w-xl">
            <Icon name="search" size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari pertanyaan… misal “ongkir” atau “refund”"
              className="field min-h-[52px] pl-11"
              aria-label="Cari pertanyaan"
            />
          </div>
        </div>
      </section>

      <div className="container-lume grid gap-6 py-8 lg:grid-cols-[200px_1fr] lg:gap-10 lg:py-10">
        <aside>
          <div className="lg:sticky lg:top-24">
            <p className="eyebrow mb-4">Kategori</p>
            <div className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
              {categories.map((item) => (
                <button
                  key={item}
                  onClick={() => setCategory(item)}
                  className={cn(
                    "rounded-md px-3 py-2 text-left text-[12px] font-semibold transition lg:rounded-lg",
                    category === item ? "bg-brand-600 text-white" : "text-ink-soft hover:bg-brand-50 hover:text-brand-600"
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div>
          {filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-sand-300 p-10 text-center">
              <p className="font-extrabold text-xl">Tidak ada hasil untuk pencarian Anda</p>
              <p className="mt-2 text-sm text-ink-muted">Coba kata kunci lain, atau tanyakan langsung ke tim kami.</p>
              <Link href="/contact" className={buttonStyles({ className: "mt-5" })}>
                Hubungi kami
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {grouped.map(([groupName, items]) => (
                <section key={groupName}>
                  <div className="mb-4 flex items-center gap-3">
                    <h2 className="font-extrabold text-2xl text-ink">{groupName}</h2>
                    <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[10px] font-bold text-ink-muted">{items.length}</span>
                  </div>
                  <Accordion
                    items={items.map((faq) => ({
                      id: faq.question,
                      title: faq.question,
                      content: <p>{faq.answer}</p>,
                    }))}
                  />
                </section>
              ))}
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-between gap-5 mt-8 rounded-xl bg-ink p-5 text-surface sm:p-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-brand-300">Masih bingung?</p>
              <h2 className="mt-1.5 text-xl font-extrabold text-surface">Tim kami siap membantu secara personal.</h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-surface/60">
                Hubungi WhatsApp atau kirim email — kami membalas dalam 2–4 jam pada hari kerja.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer" className={buttonStyles({ variant: "brass" })}>
                <Icon name="whatsapp" size={16} /> WhatsApp
              </a>
              <Link href="/contact" className={buttonStyles({ variant: "outline", className: "border-surface/30 text-surface hover:border-surface hover:bg-surface/10" })}>
                Kirim pesan
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
