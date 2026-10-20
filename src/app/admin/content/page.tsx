"use client";

import Image from "next/image";
import { useState } from "react";
import { useCatalog } from "@/store/catalog";
import { useToast } from "@/components/ui/toast";
import { AdminPageHeader, statusPill } from "@/components/admin/ui";
import { Button, Field, Input, Textarea } from "@/components/ui/primitives";
import { Modal } from "@/components/ui/overlay";
import { Icon } from "@/components/ui/icon";
import type { Banner } from "@/types";

const IMAGE_OPTIONS = [
  "/images/editorial/hero.webp",
  "/images/editorial/story.webp",
  "/images/editorial/lookbook.webp",
  "/images/categories/living.webp",
  "/images/categories/fashion.webp",
  "/images/categories/beauty.webp",
];

interface Draft {
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  image: string;
  isActive: boolean;
}

const emptyDraft: Draft = {
  title: "",
  subtitle: "",
  ctaLabel: "Jelajahi koleksi",
  ctaHref: "/products",
  image: IMAGE_OPTIONS[0],
  isActive: true,
};

export default function AdminContentPage() {
  const { toast } = useToast();
  const banners = useCatalog((state) => state.banners);
  const addBanner = useCatalog((state) => state.addBanner);
  const updateBanner = useCatalog((state) => state.updateBanner);
  const deleteBanner = useCatalog((state) => state.deleteBanner);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [confirming, setConfirming] = useState<Banner | null>(null);

  const startCreate = () => {
    setEditing(null);
    setDraft(emptyDraft);
    setOpen(true);
  };

  const startEdit = (banner: Banner) => {
    setEditing(banner);
    setDraft({
      title: banner.title,
      subtitle: banner.subtitle,
      ctaLabel: banner.ctaLabel,
      ctaHref: banner.ctaHref,
      image: banner.image,
      isActive: banner.isActive,
    });
    setOpen(true);
  };

  const save = (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft.title.trim()) return toast({ title: "Judul banner wajib diisi", tone: "danger" });
    const payload = {
      title: draft.title.trim(),
      subtitle: draft.subtitle.trim(),
      ctaLabel: draft.ctaLabel.trim() || "Lihat",
      ctaHref: draft.ctaHref.trim() || "/products",
      image: draft.image,
      isActive: draft.isActive,
    };
    if (editing) {
      updateBanner(editing.id, payload);
      toast({ title: "Banner diperbarui", description: payload.title, tone: "success" });
    } else {
      addBanner(payload);
      toast({ title: "Banner ditambahkan", description: payload.title, tone: "success" });
    }
    setOpen(false);
  };

  return (
    <div className="space-y-5">
      <AdminPageHeader
        eyebrow="Pemasaran"
        title="Banner & konten"
        description="Atur kampanye hero, pengumuman, dan materi editorial yang tampil di storefront."
        actions={
          <Button size="sm" onClick={startCreate}>
            <Icon name="plus" size={14} /> Banner baru
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {banners.map((banner) => (
          <div key={banner.id} className="card-surface group overflow-hidden">
            <div className="relative aspect-[16/8] overflow-hidden">
              <Image src={banner.image} alt={banner.title} fill sizes="(max-width: 1024px) 100vw, 520px" className="object-cover transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <div className="flex items-center gap-2">
                  {statusPill(banner.isActive)}
                </div>
                <h2 className="display mt-2 text-xl text-surface">{banner.title}</h2>
                <p className="mt-1 line-clamp-1 text-[11px] text-surface/70">{banner.subtitle}</p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-2 px-4 py-3">
              <span className="truncate text-[10px] text-ink-muted">
                CTA: {banner.ctaLabel} → {banner.ctaHref}
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    updateBanner(banner.id, { isActive: !banner.isActive });
                    toast({ title: banner.isActive ? "Banner disembunyikan" : "Banner diaktifkan", description: banner.title, tone: "info" });
                  }}
                  className="grid h-8 w-8 place-items-center rounded-lg text-ink-muted transition hover:bg-canvas hover:text-ink"
                  aria-label="Ubah status banner"
                >
                  <Icon name={banner.isActive ? "eye-off" : "eye"} size={14} />
                </button>
                <button
                  onClick={() => startEdit(banner)}
                  className="grid h-8 w-8 place-items-center rounded-lg text-ink-muted transition hover:bg-canvas hover:text-ink"
                  aria-label="Edit banner"
                >
                  <Icon name="edit" size={14} />
                </button>
                <button
                  onClick={() => setConfirming(banner)}
                  className="grid h-8 w-8 place-items-center rounded-lg text-ink-muted transition hover:bg-canvas hover:text-danger"
                  aria-label="Hapus banner"
                >
                  <Icon name="trash" size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit banner" : "Banner baru"}>
        <form onSubmit={save} className="space-y-4">
          <Field label="Judul">
            <Input value={draft.title} onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))} placeholder="Musim Baru, Ritme Baru" required />
          </Field>
          <Field label="Subjudul">
            <Textarea value={draft.subtitle} onChange={(event) => setDraft((current) => ({ ...current, subtitle: event.target.value }))} placeholder="Deskripsi singkat kampanye…" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Label tombol">
              <Input value={draft.ctaLabel} onChange={(event) => setDraft((current) => ({ ...current, ctaLabel: event.target.value }))} placeholder="Jelajahi koleksi" />
            </Field>
            <Field label="Tautan tombol">
              <Input value={draft.ctaHref} onChange={(event) => setDraft((current) => ({ ...current, ctaHref: event.target.value }))} placeholder="/products" />
            </Field>
          </div>
          <div>
            <p className="label">Gambar latar</p>
            <div className="grid grid-cols-3 gap-2">
              {IMAGE_OPTIONS.map((image) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setDraft((current) => ({ ...current, image }))}
                  className={`relative aspect-[16/10] overflow-hidden rounded-lg border-2 transition ${
                    draft.image === image ? "border-olive-700" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image src={image} alt="" fill sizes="140px" className="object-cover" />
                </button>
              ))}
            </div>
          </div>
          <label className="flex cursor-pointer items-center gap-2 text-xs text-ink-soft">
            <input
              type="checkbox"
              checked={draft.isActive}
              onChange={(event) => setDraft((current) => ({ ...current, isActive: event.target.checked }))}
              className="h-4 w-4 accent-[#26301F]"
            />
            Tampilkan banner di storefront
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button type="submit">{editing ? "Simpan" : "Tambah banner"}</Button>
          </div>
        </form>
      </Modal>

      <Modal open={confirming !== null} onClose={() => setConfirming(null)} title="Hapus banner?">
        <p className="text-sm leading-relaxed text-ink-soft">
          Banner <strong className="text-ink">{confirming?.title}</strong> akan dihapus dari daftar konten.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setConfirming(null)}>
            Batal
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              if (!confirming) return;
              deleteBanner(confirming.id);
              toast({ title: "Banner dihapus", description: confirming.title, tone: "success" });
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
