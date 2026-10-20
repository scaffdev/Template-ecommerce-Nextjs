"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { maskEmail } from "@/lib/utils";
import { useAuth, usePreferences } from "@/store/account";
import { useToast } from "@/components/ui/toast";
import { Modal } from "@/components/ui/overlay";
import { Button, Divider, Field, Input, Toggle } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/icon";

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const user = useAuth((state) => state.user);
  const updateProfile = useAuth((state) => state.updateProfile);
  const logout = useAuth((state) => state.logout);
  const { newsletter, orderUpdates, promotions, setPreference } = usePreferences();

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [birthday, setBirthday] = useState(user?.birthday ?? "");
  const [saving, setSaving] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    setName(user.name);
    setEmail(user.email);
    setPhone(user.phone);
    setBirthday(user.birthday ?? "");
  }, [user]);

  const save = () => {
    if (name.trim().length < 2) {
      toast({ title: "Nama terlalu pendek", tone: "danger" });
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast({ title: "Email belum valid", tone: "danger" });
      return;
    }
    if (phone && !/^[0-9+\-\s]{9,16}$/.test(phone)) {
      toast({ title: "Nomor telepon belum valid", tone: "danger" });
      return;
    }
    setSaving(true);
    window.setTimeout(() => {
      updateProfile({ name: name.trim(), email, phone, birthday: birthday || undefined });
      setSaving(false);
      toast({ title: "Profil tersimpan", description: "Perubahan Anda sudah diterapkan.", tone: "success" });
    }, 500);
  };

  return (
    <div className="space-y-8">
      <header>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-600">Profil</p>
        <h1 className="mt-1 text-xl font-extrabold tracking-tight text-ink sm:text-2xl">Data diri & preferensi.</h1>
        <p className="mt-2 text-sm text-ink-soft">Kelola informasi akun dan bagaimana kami menghubungi Anda.</p>
      </header>

      <section className="rounded-xl border border-sand-200 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-brand-50 font-extrabold text-2xl text-brand-600">
              {user?.name.slice(0, 1).toUpperCase()}
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">{user?.name}</p>
              <p className="text-xs text-ink-muted">{user ? maskEmail(user.email) : ""}</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-brand-600">Member tokobagus.com</p>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              toast({ title: "Anda telah keluar", tone: "info" });
              router.push("/");
            }}
            className="inline-flex items-center gap-2 rounded-full border border-sand-300 px-4 py-2 text-xs font-semibold text-ink-soft transition hover:border-ink hover:text-brand-600"
          >
            <Icon name="logout" size={14} /> Keluar dari akun
          </button>
        </div>

        <Divider className="my-6" />

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Nama lengkap">
            <Input value={name} onChange={(event) => setName(event.target.value)} />
          </Field>
          <Field label="Alamat email">
            <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          </Field>
          <Field label="Nomor telepon">
            <Input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="08xxxxxxxxxx" inputMode="tel" />
          </Field>
          <Field label="Tanggal lahir" hint="Kami kirim voucher ulang tahun spesial.">
            <Input type="date" value={birthday} onChange={(event) => setBirthday(event.target.value)} />
          </Field>
        </div>
        <div className="mt-6 flex justify-end">
          <Button onClick={save} loading={saving}>
            Simpan perubahan
          </Button>
        </div>
      </section>

      <section className="rounded-xl border border-sand-200 bg-white p-6">
        <h2 className="text-[11px] font-bold uppercase tracking-widest2 text-ink">Preferensi komunikasi</h2>
        <div className="mt-5 divide-y divide-sand-200">
          {[
            {
              key: "newsletter" as const,
              title: "Surat dari tokobagus.com",
              description: "Cerita studio, koleksi baru, dan catatan perawatan — sebulan sekali.",
              value: newsletter,
            },
            {
              key: "orderUpdates" as const,
              title: "Update pesanan",
              description: "Konfirmasi pembayaran dan status pengiriman via email.",
              value: orderUpdates,
            },
            {
              key: "promotions" as const,
              title: "Promo & voucher",
              description: "Penawaran terbatas dan akses awal untuk member.",
              value: promotions,
            },
          ].map((preference) => (
            <div key={preference.key} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
              <div>
                <p className="text-[13px] font-semibold text-ink">{preference.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-ink-muted">{preference.description}</p>
              </div>
              <Toggle
                checked={preference.value}
                onChange={(checked) => setPreference(preference.key, checked)}
                label={preference.title}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-sand-200 bg-white border-danger/20 p-6">
        <h2 className="text-[11px] font-bold uppercase tracking-widest2 text-danger">Zona demo</h2>
        <p className="mt-3 text-xs leading-relaxed text-ink-muted">
          Semua data demo — pesanan, wishlist, alamat, dan perubahan katalog — disimpan di localStorage perangkat ini.
          Atur ulang untuk kembali ke kondisi awal template.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button variant="danger" size="sm" onClick={() => setResetOpen(true)}>
            <Icon name="refresh" size={14} /> Atur ulang data demo
          </Button>
        </div>
      </section>

      <Modal open={resetOpen} onClose={() => setResetOpen(false)} size="sm" title="Atur ulang data demo?">
        <div className="p-5 sm:p-6">
          <p className="text-sm leading-relaxed text-ink-soft">
            Semua perubahan lokal akan dihapus dan halaman dimuat ulang dengan data awal. Tindakan ini tidak dapat
            dibatalkan.
          </p>
          <div className="mt-5 flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setResetOpen(false)}>
              Batal
            </Button>
            <Button
              variant="danger"
              className="flex-1"
              onClick={() => {
                try {
                  Object.keys(localStorage)
                    .filter((key) => key.startsWith("tokobagus-"))
                    .forEach((key) => localStorage.removeItem(key));
                } catch {}
                window.location.href = "/";
              }}
            >
              Ya, atur ulang
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
