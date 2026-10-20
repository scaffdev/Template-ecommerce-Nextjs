"use client";

import Link from "next/link";
import { useState } from "react";
import { useToast } from "@/components/ui/toast";
import { Button, Field, Input, Select, Textarea } from "@/components/ui/primitives";
import { buttonStyles } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/icon";

const contactChannels = [
  {
    icon: "whatsapp" as const,
    title: "WhatsApp",
    value: "+62 812 3456 7890",
    description: "Respons tercepat, 9.00–21.00 WIB",
    href: "https://wa.me/6281234567890",
  },
  {
    icon: "mail" as const,
    title: "Email",
    value: "hello@tokobagus.com",
    description: "Untuk pertanyaan detail & kerja sama",
    href: "mailto:hello@tokobagus.com",
  },
  {
    icon: "phone" as const,
    title: "Telepon studio",
    value: "021-3912-8800",
    description: "Senin–Jumat, 10.00–18.00 WIB",
    href: "tel:02139128800",
  },
];

export default function ContactPage() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", orderNumber: "", topic: "Pertanyaan umum", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (form.name.trim().length < 2) {
      toast({ title: "Nama belum diisi", tone: "danger" });
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      toast({ title: "Email belum valid", tone: "danger" });
      return;
    }
    if (form.message.trim().length < 15) {
      toast({ title: "Ceritakan lebih detail", description: "Minimal 15 karakter agar kami bisa membantu.", tone: "danger" });
      return;
    }
    setSending(true);
    window.setTimeout(() => {
      setSending(false);
      setSent(true);
      toast({ title: "Pesan terkirim", description: "Kami akan membalas ke email Anda dalam 2–4 jam kerja.", tone: "success" });
    }, 700);
  };

  return (
    <>
      <section className="border-b border-sand-200 bg-white">
        <div className="container-lume py-8 sm:py-10">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[11px] text-ink-muted">
            <Link href="/" className="hover:text-brand-600">
              Home
            </Link>
            <Icon name="chevron-right" size={12} />
            <span className="text-ink">Kontak</span>
          </nav>
          <p className="eyebrow mt-4">Hubungi kami</p>
          <h1 className="mt-2 max-w-2xl text-2xl font-extrabold tracking-tight sm:text-3xl">
            Kami manusia sungguhan di balik layar ini.
          </h1>
          <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-ink-muted">
            Ada pertanyaan tentang produk, pesanan, atau sekadar ingin berdiskusi soal ruang? Kirim pesan — kami
            membalas setiap hari kerja dalam 2–4 jam.
          </p>
        </div>
      </section>

      <div className="container-lume grid gap-6 py-8 lg:grid-cols-[1.3fr_1fr] lg:gap-10 lg:py-10">
        <div>
          {sent ? (
            <div className="rounded-xl border border-sand-200 bg-white p-8 text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-olive-100 text-olive-700">
                <Icon name="check-circle" size={26} />
              </span>
              <h2 className="mt-4 text-xl font-extrabold">Pesan Anda sudah masuk.</h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-soft">
                Terima kasih, {form.name.split(" ")[0]}. Tim kami akan membalas ke <span className="font-semibold text-ink">{form.email}</span>{" "}
                dalam 2–4 jam kerja.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSent(false);
                    setForm({ name: "", email: "", orderNumber: "", topic: "Pertanyaan umum", message: "" });
                  }}
                >
                  Kirim pesan lain
                </Button>
                <Link href="/faq" className={buttonStyles({})}>
                  Lihat FAQ
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} className="rounded-xl border border-sand-200 bg-white p-5 sm:p-6">
              <h2 className="text-xl font-extrabold">Kirim pesan</h2>
              <p className="mt-2 text-sm text-ink-soft">Semua kolom bertanda wajib harus diisi.</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field label="Nama lengkap">
                  <Input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Nama Anda" required />
                </Field>
                <Field label="Alamat email">
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(event) => setForm({ ...form, email: event.target.value })}
                    placeholder="nama@email.com"
                    required
                  />
                </Field>
                <Field label="Nomor pesanan (opsional)">
                  <Input
                    value={form.orderNumber}
                    onChange={(event) => setForm({ ...form, orderNumber: event.target.value })}
                    placeholder="TBG-2610-1234"
                  />
                </Field>
                <Field label="Topik">
                  <Select value={form.topic} onChange={(event) => setForm({ ...form, topic: event.target.value })}>
                    {["Pertanyaan umum", "Status pesanan", "Pengembalian / penukaran", "Kerja sama & wholesale", "Lainnya"].map((topic) => (
                      <option key={topic} value={topic}>
                        {topic}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="Pesan" className="sm:col-span-2" hint="Sertakan nomor pesanan bila pertanyaan Anda terkait transaksi tertentu.">
                  <Textarea
                    value={form.message}
                    onChange={(event) => setForm({ ...form, message: event.target.value })}
                    placeholder="Ceritakan kebutuhan atau kendala Anda…"
                    className="min-h-[150px]"
                    required
                  />
                </Field>
              </div>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <p className="flex items-center gap-2 text-[11px] text-ink-muted">
                  <Icon name="lock" size={13} /> Data Anda aman dan tidak dibagikan.
                </p>
                <Button type="submit" size="lg" loading={sending}>
                  Kirim pesan <Icon name="arrow-right" size={16} />
                </Button>
              </div>
            </form>
          )}
        </div>

        <aside className="space-y-4">
          {contactChannels.map((channel) => (
            <a
              key={channel.title}
              href={channel.href}
              target={channel.href.startsWith("http") ? "_blank" : undefined}
              rel={channel.href.startsWith("http") ? "noreferrer" : undefined}
              className="rounded-xl border border-sand-200 bg-white group flex items-start gap-4 p-5 transition hover:border-brand-300 hover:shadow-soft"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-700">
                <Icon name={channel.icon} size={18} />
              </span>
              <span className="min-w-0">
                <span className="block text-[13px] font-bold text-ink">{channel.title}</span>
                <span className="mt-0.5 block text-sm font-semibold text-brand-600">{channel.value}</span>
                <span className="mt-1 block text-[11px] text-ink-muted">{channel.description}</span>
              </span>
              <Icon name="arrow-up-right" size={15} className="ml-auto shrink-0 text-ink-muted transition group-hover:text-brand-600" />
            </a>
          ))}

          <div className="rounded-xl border border-sand-200 bg-white overflow-hidden">
            <div className="relative h-40 bg-ink">
              <div className="absolute inset-0 opacity-25" style={{ backgroundImage: "linear-gradient(#FFFCF7 1px, transparent 1px), linear-gradient(90deg, #FFFCF7 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
              <span className="absolute left-1/2 top-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-brand-500 text-ink">
                <Icon name="map-pin" size={18} />
              </span>
            </div>
            <div className="p-5">
              <p className="text-[13px] font-bold text-ink">tokobagus.com Showroom</p>
              <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">
                Jl. Cikini Raya No. 24, Jakarta Pusat 10330
                <br />
                Selasa–Sabtu, 10.00–19.00 WIB
              </p>
              <a
                href="https://maps.google.com/?q=Cikini+Raya+Jakarta"
                target="_blank"
                rel="noreferrer"
                className={buttonStyles({ variant: "outline", size: "sm", className: "mt-4 w-full" })}
              >
                <Icon name="external" size={14} /> Buka di Google Maps
              </a>
            </div>
          </div>

          <div className="rounded-xl border border-sand-200 bg-white p-4">
            <p className="text-[13px] font-bold text-ink">Pertanyaan sering diajukan</p>
            <ul className="mt-3 space-y-2.5">
              {["Berapa lama pengiriman?", "Bagaimana cara mengembalikan produk?", "Apakah bisa bayar di tempat?"].map((question) => (
                <li key={question}>
                  <Link href="/faq" className="flex items-center gap-2 text-xs text-ink-soft transition hover:text-brand-600">
                    <Icon name="chevron-right" size={13} className="text-brand-600" /> {question}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </>
  );
}
