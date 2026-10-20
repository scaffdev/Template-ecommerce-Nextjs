import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { testimonials } from "@/lib/data";
import { Icon, StarRow } from "@/components/ui/icon";
import { buttonStyles } from "@/components/ui/button-styles";

export const metadata: Metadata = {
  title: "Tentang tokobagus.com",
  description:
    "tokobagus.com adalah studio kurasi asal Jakarta yang menghadirkan objek, pakaian, dan ritual harian dengan material alami buatan pengrajin Indonesia.",
};

const values = [
  {
    icon: "leaf" as const,
    title: "Material yang jujur",
    description: "Linen Belgia, katun organik, kayu jati bersertifikat, dan kuningan padat — dipilih karena menua dengan indah, bukan karena murah.",
  },
  {
    icon: "users" as const,
    title: "Tangan yang dibayar pantas",
    description: "Kami bekerja langsung dengan 48 pengrajin di sembilan kota, tanpa perantara, dengan upah di atas standar industri.",
  },
  {
    icon: "award" as const,
    title: "Sedikit, tapi tepat",
    description: "Setiap musim kami hanya merilis 12–18 produk. Lebih lama di studio, lebih sedikit di rak — supaya tidak ada yang sia-sia.",
  },
];

const milestones = [
  { year: "2019", title: "Dimulai dari satu meja", description: "Alya dan dua teman membuka studio kecil di Cikini dengan 14 produk keramik dari Klaten." },
  { year: "2021", title: "Bermitra dengan pengrajin", description: "Program kemitraan pertama diluncurkan, menghubungkan 12 pengrajin langsung ke pelanggan." },
  { year: "2023", title: "Rumah pertama", description: "Showroom pertama dibuka di Jakarta — ruang untuk melihat, meraba, dan berdiskusi." },
  { year: "2026", title: "Tetap kecil, lebih baik", description: "48 pengrajin mitra, 6 kategori kurasi, dan satu janji yang sama: barang yang pantas tinggal lama." },
];

export default function AboutPage() {
  return (
    <>
      <section className="grain relative overflow-hidden border-b border-sand-200">
        <div className="container-lume grid items-center gap-10 py-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12 lg:py-12">
          <div>
            <p className="eyebrow">Tentang tokobagus.com</p>
            <h1 className="mt-2 text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">
              Studio kecil dengan keyakinan besar pada benda yang dibuat pelan.
            </h1>
            <p className="mt-3 max-w-xl text-[13px] leading-relaxed text-ink-muted">
              tokobagus.com lahir dari keinginan sederhana: menghadirkan barang yang tidak perlu diganti setiap musim.
              Kami mengurasi objek dan pakaian dari pengrajin Indonesia, dengan material yang menua bersama Anda.
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <Link href="/products" className={buttonStyles({ size: "lg" })}>
                Jelajahi koleksi <Icon name="arrow-right" size={16} />
              </Link>
              <Link href="/contact" className={buttonStyles({ variant: "outline", size: "lg" })}>
                Kunjungi studio
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl">
              <Image src="/images/editorial/story.webp" alt="Pengrajin tokobagus.com bekerja di studio" fill priority sizes="(max-width: 1024px) 100vw, 560px" className="object-cover" />
            </div>
            <div className="absolute -bottom-5 left-5 rounded-xl border border-sand-200 bg-surface/95 p-4 shadow-lift backdrop-blur">
              <p className="font-extrabold text-3xl text-brand-600">48</p>
              <p className="text-[11px] text-ink-muted">pengrajin mitra di 9 kota</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-lume py-10 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="eyebrow">Yang kami percaya</p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">Tiga prinsip yang tidak kami tawar.</h2>
            <p className="mt-3 text-[13px] leading-relaxed text-ink-muted">
              Kami tidak mengejar tren cepat. Kami mengejar benda yang akan Anda gunakan sepuluh tahun dari sekarang — dan tetap terasa benar.
            </p>
          </div>
          <div className="space-y-6">
            {values.map((value, index) => (
              <div key={value.title} className="flex gap-5 border-b border-sand-200 pb-6 last:border-0 last:pb-0">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-700">
                  <Icon name={value.icon} size={20} />
                </span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">0{index + 1}</p>
                  <h3 className="mt-1 font-extrabold text-xl text-ink">{value.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-sand-200 bg-sand-50 py-10 sm:py-14">
        <div className="container-lume">
          <p className="eyebrow">Perjalanan</p>
          <h2 className="font-extrabold mt-4 max-w-2xl text-3xl sm:text-4xl">Dibangun pelan, satu keputusan kecil setiap kali.</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {milestones.map((milestone) => (
              <div key={milestone.year} className="border-t border-sand-300 pt-5">
                <p className="font-extrabold text-2xl text-brand-600">{milestone.year}</p>
                <p className="mt-3 text-sm font-semibold text-ink">{milestone.title}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">{milestone.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-lume py-10 sm:py-14">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative order-2 aspect-[4/3] overflow-hidden rounded-xl lg:order-1">
            <Image src="/images/editorial/lookbook.webp" alt="Koleksi tokobagus.com di showroom Jakarta" fill sizes="(max-width: 1024px) 100vw, 620px" className="object-cover" />
          </div>
          <div className="order-1 lg:order-2">
            <p className="eyebrow">Studio & showroom</p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">Mampir dan rasakan sendiri.</h2>
            <p className="mt-3 text-[13px] leading-relaxed text-ink-muted">
              Showroom kami di Cikini terbuka untuk siapa saja yang ingin melihat material, mencoba ukuran, atau
              sekadar minum kopi dan berbincang tentang ruang.
            </p>
            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex gap-3">
                <dt className="w-24 shrink-0 text-ink-muted">Alamat</dt>
                <dd className="text-ink-soft">Jl. Cikini Raya No. 24, Jakarta Pusat</dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-24 shrink-0 text-ink-muted">Jam buka</dt>
                <dd className="text-ink-soft">Selasa–Sabtu, 10.00–19.00 WIB</dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-24 shrink-0 text-ink-muted">Kontak</dt>
                <dd className="text-ink-soft">hello@tokobagus.com · +62 812 3456 7890</dd>
              </div>
            </dl>
            <Link href="/contact" className={buttonStyles({ className: "mt-6" })}>
              Buat janji kunjungan <Icon name="arrow-right" size={15} />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-sand-200 bg-ink py-10 text-surface sm:py-14">
        <div className="container-lume">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow text-brand-300">Kata pelanggan</p>
              <h2 className="mt-2 max-w-xl text-2xl font-extrabold tracking-tight text-surface sm:text-3xl">Alasan mereka kembali.</h2>
            </div>
            <div className="flex items-center gap-2 text-sm text-surface/70">
              <StarRow value={4.9} size={14} /> 4.9 dari 12.480 ulasan
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.slice(0, 3).map((testimonial) => (
              <figure key={testimonial.name} className="rounded-xl border border-surface/10 bg-surface/5 p-6">
                <Icon name="quote" size={20} className="text-brand-300" />
                <blockquote className="mt-3 text-sm leading-relaxed text-surface/75">“{testimonial.quote}”</blockquote>
                <figcaption className="mt-4 border-t border-surface/10 pt-3">
                  <p className="text-[13px] font-semibold text-surface">{testimonial.name}</p>
                  <p className="text-[11px] text-surface/50">
                    {testimonial.role} — {testimonial.location}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
