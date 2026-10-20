"use client";

import { useState } from "react";
import type { SavedAddress } from "@/types";
import { useAddresses } from "@/store/account";
import { useToast } from "@/components/ui/toast";
import { Modal } from "@/components/ui/overlay";
import { Badge, Button, Checkbox, EmptyState, Field, Input, Textarea } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";

type FormState = Omit<SavedAddress, "id">;

const emptyForm: FormState = {
  label: "Rumah",
  recipient: "",
  phone: "",
  province: "",
  city: "",
  district: "",
  postalCode: "",
  detail: "",
  isDefault: false,
};

export default function AddressesPage() {
  const { toast } = useToast();
  const addresses = useAddresses((state) => state.addresses);
  const addAddress = useAddresses((state) => state.addAddress);
  const updateAddress = useAddresses((state) => state.updateAddress);
  const deleteAddress = useAddresses((state) => state.deleteAddress);
  const setDefault = useAddresses((state) => state.setDefault);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<SavedAddress | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<SavedAddress | null>(null);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, isDefault: addresses.length === 0 });
    setOpen(true);
  };

  const openEdit = (address: SavedAddress) => {
    setEditing(address);
    const rest = { ...address } as Partial<SavedAddress>;
    delete rest.id;
    setForm(rest as FormState);
    setOpen(true);
  };

  const submit = () => {
    if (
      form.recipient.trim().length < 2 ||
      !/^[0-9+\-\s]{9,16}$/.test(form.phone.trim()) ||
      form.province.trim().length < 2 ||
      form.city.trim().length < 2 ||
      form.district.trim().length < 2 ||
      !/^\d{5}$/.test(form.postalCode.trim()) ||
      form.detail.trim().length < 5
    ) {
      toast({ title: "Lengkapi semua kolom dengan benar", description: "Kode pos 5 digit dan telepon 9–16 angka.", tone: "danger" });
      return;
    }
    if (editing) {
      updateAddress(editing.id, form);
      toast({ title: "Alamat diperbarui", tone: "success" });
    } else {
      addAddress(form);
      toast({ title: "Alamat ditambahkan", tone: "success" });
    }
    setOpen(false);
  };

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-600">Alamat</p>
          <h1 className="mt-1 text-xl font-extrabold tracking-tight text-ink sm:text-2xl">Alamat pengiriman Anda.</h1>
          <p className="mt-2 text-sm text-ink-soft">Simpan beberapa alamat dan pilih saat checkout tanpa mengetik ulang.</p>
        </div>
        <Button size="sm" onClick={openCreate}>
          <Icon name="plus" size={14} /> Tambah alamat
        </Button>
      </header>

      {addresses.length === 0 ? (
        <EmptyState
          className="mt-8"
          icon="map-pin"
          title="Belum ada alamat tersimpan"
          description="Tambahkan alamat pertama Anda agar checkout berikutnya lebih cepat."
          action={<Button onClick={openCreate}>Tambah alamat</Button>}
        />
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <article
              key={address.id}
              className={cn(
                "rounded-xl border border-sand-200 bg-white p-5",
                address.isDefault && "border-olive-300 ring-1 ring-olive-200"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="flex items-center gap-2 text-[13px] font-bold text-ink">
                    {address.label ?? "Alamat"}
                    {address.isDefault && <Badge tone="olive">Utama</Badge>}
                  </p>
                  <p className="mt-2 text-[13px] font-semibold text-ink-soft">
                    {address.recipient} · {address.phone}
                  </p>
                </div>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-ink-muted">
                {address.detail}
                <br />
                {address.district}, {address.city}, {address.province} {address.postalCode}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-sand-200 pt-4">
                <Button size="sm" variant="outline" onClick={() => openEdit(address)}>
                  <Icon name="edit" size={13} /> Ubah
                </Button>
                {!address.isDefault && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setDefault(address.id);
                      toast({ title: "Alamat utama diperbarui", tone: "success" });
                    }}
                  >
                    Jadikan utama
                  </Button>
                )}
                <button
                  onClick={() => setDeleteTarget(address)}
                  className="ml-auto text-xs font-semibold text-ink-muted transition hover:text-danger"
                >
                  Hapus
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? "Ubah alamat" : "Tambah alamat baru"}
        description="Pastikan penulisan alamat sesuai agar kurir tidak kesulitan menemukan lokasi."
      >
        <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
          <Field label="Label alamat">
            <Input value={form.label ?? ""} onChange={(event) => setForm({ ...form, label: event.target.value })} placeholder="Rumah / Kantor" />
          </Field>
          <Field label="Nama penerima">
            <Input value={form.recipient} onChange={(event) => setForm({ ...form, recipient: event.target.value })} placeholder="Nama lengkap" />
          </Field>
          <Field label="Nomor telepon">
            <Input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="08xxxxxxxxxx" inputMode="tel" />
          </Field>
          <Field label="Kode pos">
            <Input value={form.postalCode} onChange={(event) => setForm({ ...form, postalCode: event.target.value })} placeholder="12345" maxLength={5} inputMode="numeric" />
          </Field>
          <Field label="Provinsi">
            <Input value={form.province} onChange={(event) => setForm({ ...form, province: event.target.value })} placeholder="DKI Jakarta" />
          </Field>
          <Field label="Kota / kabupaten">
            <Input value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} placeholder="Jakarta Selatan" />
          </Field>
          <Field label="Kecamatan" className="sm:col-span-2">
            <Input value={form.district} onChange={(event) => setForm({ ...form, district: event.target.value })} placeholder="Kebayoran Baru" />
          </Field>
          <Field label="Detail alamat" className="sm:col-span-2" hint="Nama jalan, nomor rumah, RT/RW, patokan.">
            <Textarea value={form.detail} onChange={(event) => setForm({ ...form, detail: event.target.value })} placeholder="Jl. Melati No. 12, RT 04 / RW 02" />
          </Field>
          <div className="sm:col-span-2">
            <Checkbox
              checked={form.isDefault}
              onChange={(checked) => setForm({ ...form, isDefault: checked })}
              label="Jadikan alamat utama"
              description="Alamat utama dipakai otomatis saat checkout."
            />
          </div>
          <div className="flex gap-3 sm:col-span-2">
            <Button variant="outline" className="flex-1" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button className="flex-1" onClick={submit}>
              {editing ? "Simpan perubahan" : "Tambahkan alamat"}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} size="sm" title="Hapus alamat?">
        <div className="p-5 sm:p-6">
          <p className="text-sm leading-relaxed text-ink-soft">
            Alamat <span className="font-semibold text-ink">{deleteTarget?.label}</span> — {deleteTarget?.recipient} akan dihapus permanen
            dari daftar Anda.
          </p>
          <div className="mt-5 flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setDeleteTarget(null)}>
              Batal
            </Button>
            <Button
              variant="danger"
              className="flex-1"
              onClick={() => {
                if (deleteTarget) {
                  deleteAddress(deleteTarget.id);
                  toast({ title: "Alamat dihapus", tone: "info" });
                }
                setDeleteTarget(null);
              }}
            >
              <Icon name="trash" size={14} /> Hapus
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
