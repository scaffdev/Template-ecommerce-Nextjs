"use client";

import { useState } from "react";
import { useCatalog } from "@/store/catalog";
import { useToast } from "@/components/ui/toast";
import { AdminCard, AdminPageHeader } from "@/components/admin/ui";
import { Button, Field, Input, Textarea } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { formatIDR } from "@/lib/utils";

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const settings = useCatalog((state) => state.settings);
  const updateSettings = useCatalog((state) => state.updateSettings);
  const logAudit = useCatalog((state) => state.logAudit);
  const [form, setForm] = useState({
    storeName: settings.storeName,
    tagline: settings.tagline,
    email: settings.email,
    phone: settings.phone,
    whatsapp: settings.whatsapp,
    address: settings.address,
    shippingOrigin: settings.shippingOrigin,
    taxPercent: String(settings.taxPercent),
    freeShippingThreshold: String(settings.freeShippingThreshold),
  });

  const patch = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));

  const save = (event: React.FormEvent) => {
    event.preventDefault();
    updateSettings({
      storeName: form.storeName.trim() || "tokobagus.com",
      tagline: form.tagline.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      whatsapp: form.whatsapp.trim(),
      address: form.address.trim(),
      shippingOrigin: form.shippingOrigin.trim(),
      taxPercent: Math.min(100, Math.max(0, Number(form.taxPercent) || 0)),
      freeShippingThreshold: Math.max(0, Number(form.freeShippingThreshold) || 0),
    });
    logAudit({ action: "Memperbarui pengaturan toko", entity: "Settings" });
    toast({ title: "Pengaturan disimpan", description: "Perubahan langsung berlaku di storefront", tone: "success" });
  };

  const togglePayment = (id: string, isActive: boolean) => {
    updateSettings({
      paymentMethods: settings.paymentMethods.map((method) => (method.id === id ? { ...method, isActive } : method)),
    });
    toast({ title: isActive ? "Metode diaktifkan" : "Metode dinonaktifkan", description: settings.paymentMethods.find((method) => method.id === id)?.name, tone: "info" });
  };

  return (
    <div className="space-y-5">
      <AdminPageHeader
        eyebrow="Sistem"
        title="Pengaturan"
        description="Identitas toko, operasional pengiriman, pajak, dan metode pembayaran demo."
        actions={
          <Button size="sm" type="submit" form="settings-form">
            <Icon name="check" size={14} /> Simpan perubahan
          </Button>
        }
      />

      <form id="settings-form" onSubmit={save} className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <div className="space-y-5">
          <AdminCard title="Identitas toko" description="Tampil di storefront, invoice, dan halaman kontak">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nama toko">
                <Input value={form.storeName} onChange={(event) => patch("storeName", event.target.value)} required />
              </Field>
              <Field label="Tagline">
                <Input value={form.tagline} onChange={(event) => patch("tagline", event.target.value)} />
              </Field>
              <Field label="Email">
                <Input type="email" value={form.email} onChange={(event) => patch("email", event.target.value)} />
              </Field>
              <Field label="Telepon">
                <Input value={form.phone} onChange={(event) => patch("phone", event.target.value)} />
              </Field>
              <Field label="WhatsApp" hint="Format internasional, mis. 6281234567890.">
                <Input value={form.whatsapp} onChange={(event) => patch("whatsapp", event.target.value)} />
              </Field>
              <Field label="Origin pengiriman">
                <Input value={form.shippingOrigin} onChange={(event) => patch("shippingOrigin", event.target.value)} />
              </Field>
            </div>
            <Field label="Alamat studio" className="mt-4">
              <Textarea value={form.address} onChange={(event) => patch("address", event.target.value)} />
            </Field>
          </AdminCard>

          <AdminCard title="Metode pembayaran" description="Aktifkan metode yang bisa dipilih pelanggan saat checkout">
            <div className="space-y-2">
              {settings.paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border px-4 py-3 transition",
                    method.isActive ? "border-olive-200 bg-olive-50/50" : "border-sand-200"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => togglePayment(method.id, !method.isActive)}
                    aria-label={`Toggle ${method.name}`}
                    className={cn("relative h-5 w-9 shrink-0 rounded-full transition", method.isActive ? "bg-olive-700" : "bg-sand-300")}
                  >
                    <span
                      className={cn(
                        "absolute top-0.5 h-4 w-4 rounded-full bg-surface transition-all",
                        method.isActive ? "left-[18px]" : "left-0.5"
                      )}
                    />
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-ink">{method.name}</p>
                    <p className="mt-0.5 text-[10px] text-ink-muted">{method.description}</p>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-2 py-1 text-[9px] font-bold uppercase",
                      method.isActive ? "bg-[#e6ece2] text-success" : "bg-sand-100 text-ink-muted"
                    )}
                  >
                    {method.isActive ? "Aktif" : "Nonaktif"}
                  </span>
                </div>
              ))}
            </div>
          </AdminCard>
        </div>

        <div className="space-y-5">
          <AdminCard title="Pajak & ongkir" description="Dipakai pada perhitungan checkout">
            <div className="space-y-4">
              <Field label="PPN (%)" hint="Diterapkan ke subtotal setelah diskon.">
                <Input type="number" min={0} max={100} value={form.taxPercent} onChange={(event) => patch("taxPercent", event.target.value)} />
              </Field>
              <Field label="Batas gratis ongkir (Rp)" hint="Pesanan di atas nilai ini otomatis gratis ongkir.">
                <Input
                  type="number"
                  min={0}
                  value={form.freeShippingThreshold}
                  onChange={(event) => patch("freeShippingThreshold", event.target.value)}
                />
              </Field>
              <div className="rounded-xl bg-canvas-soft p-3.5 text-[11px] leading-relaxed text-ink-soft">
                <p className="flex justify-between">
                  <span>Gratis ongkir mulai</span>
                  <span className="font-semibold text-ink">{formatIDR(Number(form.freeShippingThreshold) || 0)}</span>
                </p>
                <p className="mt-1 flex justify-between">
                  <span>PPN</span>
                  <span className="font-semibold text-ink">{Number(form.taxPercent) || 0}%</span>
                </p>
              </div>
            </div>
          </AdminCard>

          <AdminCard title="Kontak cepat" description="Muncul di footer dan halaman bantuan">
            <ul className="space-y-2.5 text-[11px] text-ink-soft">
              <li className="flex items-center gap-2">
                <Icon name="mail" size={13} className="text-ink-muted" /> {form.email || "—"}
              </li>
              <li className="flex items-center gap-2">
                <Icon name="phone" size={13} className="text-ink-muted" /> {form.phone || "—"}
              </li>
              <li className="flex items-center gap-2">
                <Icon name="whatsapp" size={13} className="text-ink-muted" /> {form.whatsapp || "—"}
              </li>
              <li className="flex items-start gap-2">
                <Icon name="map-pin" size={13} className="mt-0.5 text-ink-muted" /> {form.address || "—"}
              </li>
            </ul>
          </AdminCard>

          <AdminCard title="Catatan demo" description="Semua perubahan tersimpan di localStorage browser">
            <p className="text-[11px] leading-relaxed text-ink-soft">
              Template ini berjalan sepenuhnya di sisi klien. Kembalikan data contoh kapan pun dari halaman{" "}
              <a href="/admin/reports" className="font-semibold text-brass-700">
                Laporan → Zona demo
              </a>
              .
            </p>
          </AdminCard>
        </div>
      </form>
    </div>
  );
}
