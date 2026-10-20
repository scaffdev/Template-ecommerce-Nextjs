"use client";

import { useState } from "react";
import { useCatalog } from "@/store/catalog";
import { useOrders } from "@/store/orders";
import { useToast } from "@/components/ui/toast";
import { AdminPageHeader, StatCard, statusPill } from "@/components/admin/ui";
import { Button, Field, Input, Select } from "@/components/ui/primitives";
import { Modal } from "@/components/ui/overlay";
import { Icon } from "@/components/ui/icon";
import { formatIDR } from "@/lib/utils";
import type { Coupon, CouponType } from "@/types";

interface Draft {
  code: string;
  type: CouponType;
  value: string;
  minPurchase: string;
  maxDiscount: string;
  description: string;
  expiresAt: string;
  isActive: boolean;
}

const emptyDraft: Draft = {
  code: "",
  type: "percent",
  value: "10",
  minPurchase: "0",
  maxDiscount: "",
  description: "",
  expiresAt: "",
  isActive: true,
};

export default function AdminPromotionsPage() {
  const { toast } = useToast();
  const coupons = useCatalog((state) => state.coupons);
  const addCoupon = useCatalog((state) => state.addCoupon);
  const updateCoupon = useCatalog((state) => state.updateCoupon);
  const deleteCoupon = useCatalog((state) => state.deleteCoupon);
  const orders = useOrders((state) => state.orders);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [confirming, setConfirming] = useState<Coupon | null>(null);

  const usage = (code: string) => orders.filter((order) => order.couponCode?.toUpperCase() === code.toUpperCase()).length;
  const totalUsage = orders.filter((order) => order.couponCode).length;
  const active = coupons.filter((coupon) => coupon.isActive).length;

  const startCreate = () => {
    setEditing(null);
    setDraft(emptyDraft);
    setOpen(true);
  };

  const startEdit = (coupon: Coupon) => {
    setEditing(coupon);
    setDraft({
      code: coupon.code,
      type: coupon.type,
      value: String(coupon.value),
      minPurchase: String(coupon.minPurchase),
      maxDiscount: coupon.maxDiscount ? String(coupon.maxDiscount) : "",
      description: coupon.description,
      expiresAt: coupon.expiresAt ? coupon.expiresAt.slice(0, 10) : "",
      isActive: coupon.isActive,
    });
    setOpen(true);
  };

  const save = (event: React.FormEvent) => {
    event.preventDefault();
    const code = draft.code.trim().toUpperCase();
    if (!code) return toast({ title: "Kode voucher wajib diisi", tone: "danger" });
    if (coupons.some((coupon) => coupon.code.toUpperCase() === code && coupon.id !== editing?.id)) {
      return toast({ title: "Kode voucher sudah ada", tone: "danger" });
    }
    const payload = {
      code,
      type: draft.type,
      value: Math.max(0, Number(draft.value) || 0),
      minPurchase: Math.max(0, Number(draft.minPurchase) || 0),
      maxDiscount: draft.maxDiscount ? Math.max(0, Number(draft.maxDiscount)) : undefined,
      description: draft.description.trim() || "Voucher tokobagus.com",
      expiresAt: draft.expiresAt ? new Date(`${draft.expiresAt}T23:59:59`).toISOString() : undefined,
      isActive: draft.isActive,
    };
    if (editing) {
      updateCoupon(editing.id, payload);
      toast({ title: "Voucher diperbarui", description: code, tone: "success" });
    } else {
      addCoupon(payload);
      toast({ title: "Voucher ditambahkan", description: code, tone: "success" });
    }
    setOpen(false);
  };

  const valueLabel = (coupon: Coupon) =>
    coupon.type === "percent" ? `${coupon.value}%` : coupon.type === "fixed" ? formatIDR(coupon.value) : "Gratis ongkir";

  return (
    <div className="space-y-5">
      <AdminPageHeader
        eyebrow="Pemasaran"
        title="Voucher"
        description="Buat kode diskon, gratis ongkir, dan kampanye musiman."
        actions={
          <Button size="sm" onClick={startCreate}>
            <Icon name="plus" size={14} /> Voucher baru
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Voucher aktif" value={String(active)} hint={`${coupons.length} total kode`} icon="ticket" tone="brass" />
        <StatCard label="Pemakaian" value={String(totalUsage)} hint="Dari seluruh pesanan demo" icon="sparkles" tone="olive" />
        <StatCard
          label="Potensi diskon"
          value={formatIDR(
            coupons.filter((coupon) => coupon.isActive && coupon.type === "fixed").reduce((total, coupon) => total + coupon.value, 0)
          )}
          hint="Voucher nominal aktif"
          icon="tag"
        />
      </div>

      <div className="card-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-xs">
            <thead>
              <tr className="border-b border-sand-200 text-[9px] uppercase tracking-widest text-ink-muted">
                <th className="px-5 py-3 font-semibold">Kode</th>
                <th className="px-3 py-3 font-semibold">Jenis / nilai</th>
                <th className="px-3 py-3 font-semibold">Min. belanja</th>
                <th className="px-3 py-3 font-semibold">Maks. diskon</th>
                <th className="px-3 py-3 font-semibold">Pemakaian</th>
                <th className="px-3 py-3 font-semibold">Kedaluwarsa</th>
                <th className="px-3 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-100">
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="transition hover:bg-canvas-soft">
                  <td className="px-5 py-3">
                    <p className="font-mono text-xs font-bold text-ink">{coupon.code}</p>
                    <p className="mt-0.5 max-w-[200px] truncate text-[10px] text-ink-muted">{coupon.description}</p>
                  </td>
                  <td className="px-3 py-3">
                    <span className="rounded-full bg-brass-50 px-2 py-1 text-[10px] font-bold text-brass-800">{valueLabel(coupon)}</span>
                  </td>
                  <td className="px-3 py-3 text-ink-soft">{coupon.minPurchase ? formatIDR(coupon.minPurchase) : "—"}</td>
                  <td className="px-3 py-3 text-ink-soft">{coupon.maxDiscount ? formatIDR(coupon.maxDiscount) : "—"}</td>
                  <td className="px-3 py-3 text-ink-soft">{usage(coupon.code)}×</td>
                  <td className="px-3 py-3 text-[10px] text-ink-muted">
                    {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "Tanpa batas"}
                  </td>
                  <td className="px-3 py-3">{statusPill(coupon.isActive)}</td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => {
                          updateCoupon(coupon.id, { isActive: !coupon.isActive });
                          toast({ title: coupon.isActive ? "Voucher dinonaktifkan" : "Voucher diaktifkan", description: coupon.code, tone: "info" });
                        }}
                        className="grid h-8 w-8 place-items-center rounded-lg text-ink-muted transition hover:bg-canvas hover:text-ink"
                        aria-label="Ubah status voucher"
                      >
                        <Icon name={coupon.isActive ? "eye-off" : "eye"} size={14} />
                      </button>
                      <button
                        onClick={() => startEdit(coupon)}
                        className="grid h-8 w-8 place-items-center rounded-lg text-ink-muted transition hover:bg-canvas hover:text-ink"
                        aria-label="Edit voucher"
                      >
                        <Icon name="edit" size={14} />
                      </button>
                      <button
                        onClick={() => setConfirming(coupon)}
                        className="grid h-8 w-8 place-items-center rounded-lg text-ink-muted transition hover:bg-canvas hover:text-danger"
                        aria-label="Hapus voucher"
                      >
                        <Icon name="trash" size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {coupons.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-sm text-ink-muted">
                    Belum ada voucher. Buat kode pertama Anda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? `Edit ${editing.code}` : "Voucher baru"}>
        <form onSubmit={save} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Kode voucher">
              <Input
                value={draft.code}
                onChange={(event) => setDraft((current) => ({ ...current, code: event.target.value.toUpperCase() }))}
                placeholder="TOKOBAGUS10"
                required
              />
            </Field>
            <Field label="Jenis">
              <Select value={draft.type} onChange={(event) => setDraft((current) => ({ ...current, type: event.target.value as CouponType }))}>
                <option value="percent">Persentase</option>
                <option value="fixed">Nominal tetap</option>
                <option value="freeship">Gratis ongkir</option>
              </Select>
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={draft.type === "percent" ? "Nilai (%)" : draft.type === "fixed" ? "Nilai (Rp)" : "Nilai (tidak dipakai)"}>
              <Input
                type="number"
                min={0}
                value={draft.value}
                onChange={(event) => setDraft((current) => ({ ...current, value: event.target.value }))}
                disabled={draft.type === "freeship"}
              />
            </Field>
            <Field label="Min. belanja (Rp)">
              <Input
                type="number"
                min={0}
                value={draft.minPurchase}
                onChange={(event) => setDraft((current) => ({ ...current, minPurchase: event.target.value }))}
              />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Maks. diskon (Rp)" hint="Kosongkan bila tanpa batas.">
              <Input
                type="number"
                min={0}
                value={draft.maxDiscount}
                onChange={(event) => setDraft((current) => ({ ...current, maxDiscount: event.target.value }))}
                disabled={draft.type !== "percent"}
              />
            </Field>
            <Field label="Berlaku sampai">
              <Input type="date" value={draft.expiresAt} onChange={(event) => setDraft((current) => ({ ...current, expiresAt: event.target.value }))} />
            </Field>
          </div>
          <Field label="Deskripsi">
            <Input
              value={draft.description}
              onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))}
              placeholder="Diskon 10% untuk semua koleksi"
            />
          </Field>
          <label className="flex cursor-pointer items-center gap-2 text-xs text-ink-soft">
            <input
              type="checkbox"
              checked={draft.isActive}
              onChange={(event) => setDraft((current) => ({ ...current, isActive: event.target.checked }))}
              className="h-4 w-4 accent-[#26301F]"
            />
            Aktifkan voucher setelah disimpan
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button type="submit">{editing ? "Simpan" : "Buat voucher"}</Button>
          </div>
        </form>
      </Modal>

      <Modal open={confirming !== null} onClose={() => setConfirming(null)} title="Hapus voucher?">
        <p className="text-sm leading-relaxed text-ink-soft">
          Voucher <strong className="text-ink">{confirming?.code}</strong> tidak akan bisa digunakan lagi. Riwayat
          pemakaian pada pesanan lama tetap tersimpan.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setConfirming(null)}>
            Batal
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              if (!confirming) return;
              deleteCoupon(confirming.id);
              toast({ title: "Voucher dihapus", description: confirming.code, tone: "success" });
              setConfirming(null);
            }}
          >
            Ya, hapus
          </Button>
        </div>
      </Modal>
    </div>
  );
}
