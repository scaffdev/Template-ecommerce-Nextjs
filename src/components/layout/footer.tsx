"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { Button, Input } from "@/components/ui/primitives";
import { useToast } from "@/components/ui/toast";
import { Logo } from "./logo";

const columns = [
  {
    title: "Layanan Pelanggan",
    links: [
      { label: "Lacak pesanan", href: "/track-order" },
      { label: "Pusat bantuan", href: "/faq" },
      { label: "Pengiriman", href: "/shipping-policy" },
      { label: "Pengembalian", href: "/return-policy" },
      { label: "Hubungi kami", href: "/contact" },
    ],
  },
  {
    title: "Jelajahi tokobagus.com",
    links: [
      { label: "Semua produk", href: "/products" },
      { label: "Flash sale", href: "/flash-sale" },
      { label: "Voucher center", href: "/vouchers" },
      { label: "Terbaru", href: "/products?sort=new" },
      { label: "Terlaris", href: "/products?sort=best" },
    ],
  },
  {
    title: "Tentang Kami",
    links: [
      { label: "Profil tokobagus.com", href: "/about" },
      { label: "Journal", href: "/journal" },
      { label: "Syarat & ketentuan", href: "/terms" },
      { label: "Kebijakan privasi", href: "/privacy" },
      { label: "Admin panel", href: "/admin" },
    ],
  },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  return (
    <footer className="mt-12 bg-white">
      <div className="border-y border-sand-200 bg-sand-50">
        <div className="container-lume grid gap-5 py-7 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: "truck" as const, title: "Gratis ongkir", desc: "Min. belanja Rp750.000" },
            { icon: "refresh" as const, title: "Pengembalian 30 hari", desc: "Proses mudah & cepat" },
            { icon: "shield" as const, title: "Pembayaran aman", desc: "QRIS, transfer, kartu" },
            { icon: "headset" as const, title: "Bantuan 9–21", desc: "Siap membantu setiap hari" },
          ].map((item) => (
            <div key={item.title} className="flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600">
                <Icon name={item.icon} size={19} />
              </span>
              <div>
                <p className="text-[13px] font-bold text-ink">{item.title}</p>
                <p className="text-[11px] text-ink-muted">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container-lume">
        <div className="grid gap-8 border-b border-sand-200 py-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_repeat(3,1fr)]">
          <div>
            <Logo />
            <p className="mt-3 max-w-xs text-[12px] leading-relaxed text-ink-muted">
              Belanja online untuk fashion, living, tech, beauty, dan aksesori pilihan. Harga terbaik, pengiriman cepat ke seluruh Indonesia.
            </p>
            <div className="mt-4 space-y-2 text-[12px] text-ink-soft">
              <p className="flex items-center gap-2">
                <Icon name="mail" size={14} className="text-brand-600" /> hello@tokobagus.com
              </p>
              <p className="flex items-center gap-2">
                <Icon name="phone" size={14} className="text-brand-600" /> +62 812 3456 7890
              </p>
              <p className="flex items-center gap-2">
                <Icon name="map-pin" size={14} className="text-brand-600" /> Jakarta, Indonesia
              </p>
            </div>
            <div className="mt-4 flex gap-2">
              {(["instagram", "tiktok", "facebook", "whatsapp"] as const).map((social) => (
                <a
                  key={social}
                  href={social === "whatsapp" ? "https://wa.me/6281234567890" : "#"}
                  target={social === "whatsapp" ? "_blank" : undefined}
                  rel={social === "whatsapp" ? "noreferrer" : undefined}
                  aria-label={social}
                  className="grid h-8 w-8 place-items-center rounded-lg border border-sand-200 text-ink-muted transition hover:border-brand-500 hover:text-brand-600"
                >
                  <Icon name={social} size={14} />
                </a>
              ))}
            </div>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink">{column.title}</p>
              <ul className="mt-3 space-y-2">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-[12px] text-ink-muted transition hover:text-brand-600">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="grid gap-6 border-b border-sand-200 py-7 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <p className="text-[13px] font-bold text-ink">Dapatkan promo & produk baru lebih dulu</p>
            <p className="mt-0.5 text-[11px] text-ink-muted">Voucher eksklusif dan info flash sale, maksimal satu email per minggu.</p>
          </div>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (!email.includes("@")) {
                toast({ title: "Email belum valid", description: "Masukkan alamat email yang benar.", tone: "danger" });
                return;
              }
              toast({ title: "Berhasil berlangganan", description: "Cek inbox Anda untuk voucher selamat datang.", tone: "success" });
              setEmail("");
            }}
            className="flex flex-col gap-2 sm:flex-row"
          >
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Alamat email Anda"
              className="min-h-[42px]"
              aria-label="Alamat email newsletter"
            />
            <Button type="submit" className="min-h-[42px] shrink-0">
              Berlangganan <Icon name="arrow-right" size={15} />
            </Button>
          </form>
        </div>

        <div className="flex flex-col gap-4 py-6 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-[11px] text-ink-muted">© 2026 tokobagus.com Store. Template e-commerce Next.js.</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">Pembayaran</span>
            {["BCA", "QRIS", "GoPay", "OVO", "VISA", "Mastercard", "COD"].map((payment) => (
              <span key={payment} className="rounded border border-sand-200 bg-white px-2 py-1 text-[9px] font-bold text-ink-soft">
                {payment}
              </span>
            ))}
            <span className="hidden h-4 w-px bg-sand-200 sm:block" />
            <span className="flex items-center gap-2 text-[10px] text-ink-muted">
              <Icon name="shield" size={13} className="text-olive-600" /> Transaksi terenkripsi
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
