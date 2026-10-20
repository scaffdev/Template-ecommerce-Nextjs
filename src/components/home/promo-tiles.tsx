import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";

const promos = [
  {
    href: "/category/beauty",
    eyebrow: "Beauty week",
    title: "Ritual perawatan, harga lebih ringan.",
    description: "Diskon hingga 30% untuk serum, parfum, dan perawatan tubuh pilihan.",
    image: "/images/categories/beauty.webp",
    tone: "from-ink/80 via-ink/30 to-transparent",
  },
  {
    href: "/category/tech",
    eyebrow: "Tech & audio",
    title: "Upgrade setup kerja kamu.",
    description: "Headphone, kamera, dan aksesori pilihan.",
    image: "/images/categories/tech.webp",
    tone: "from-brand-900/80 via-brand-900/20 to-transparent",
  },
  {
    href: "/category/living",
    eyebrow: "Living",
    title: "Ruang nyaman, mulai dari sini.",
    description: "Perabot dan dekorasi dengan material alami.",
    image: "/images/categories/living.webp",
    tone: "from-olive-900/80 via-olive-900/20 to-transparent",
  },
];

export function PromoTiles() {
  return (
    <section className="grid gap-3 md:grid-cols-3">
      {promos.map((promo, index) => (
        <Link
          key={promo.href}
          href={promo.href}
          className={`group relative overflow-hidden rounded-xl ${index === 0 ? "md:col-span-2" : ""}`}
        >
          <div className={`relative ${index === 0 ? "aspect-[16/9] md:aspect-[2.2/1]" : "aspect-[16/9]"}`}>
            <Image src={promo.image} alt={promo.title} fill sizes="(max-width: 768px) 100vw, 640px" className="object-cover transition duration-700 group-hover:scale-105" />
            <div className={`absolute inset-0 bg-gradient-to-r ${promo.tone}`} />
            <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-5">
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/70">{promo.eyebrow}</p>
              <h3 className="mt-1 max-w-sm text-lg font-extrabold leading-tight text-white sm:text-xl">{promo.title}</h3>
              <p className="mt-1 hidden max-w-sm text-[11px] text-white/70 sm:block">{promo.description}</p>
              <span className="mt-3 inline-flex w-fit items-center gap-1 rounded-lg bg-white/95 px-3 py-1.5 text-[10px] font-bold text-ink transition group-hover:bg-white">
                Belanja sekarang <Icon name="arrow-right" size={12} />
              </span>
            </div>
          </div>
        </Link>
      ))}
    </section>
  );
}
