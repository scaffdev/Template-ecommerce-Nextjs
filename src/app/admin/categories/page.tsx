"use client";

import Image from "next/image";
import { useState } from "react";
import { useCatalog } from "@/store/catalog";
import { useToast } from "@/components/ui/toast";
import { AdminPageHeader } from "@/components/admin/ui";
import { Button, Field, Input, Textarea } from "@/components/ui/primitives";
import { buttonStyles } from "@/components/ui/button-styles";
import { Modal } from "@/components/ui/overlay";
import { Icon } from "@/components/ui/icon";
import { slugify } from "@/lib/utils";
import type { Category } from "@/types";

const IMAGE_OPTIONS = [
  "/images/categories/living.webp",
  "/images/categories/fashion.webp",
  "/images/categories/footwear.webp",
  "/images/categories/tech.webp",
  "/images/categories/beauty.webp",
  "/images/categories/accessories.webp",
];

interface Draft {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  image: string;
}

const emptyDraft: Draft = { name: "", slug: "", tagline: "", description: "", image: IMAGE_OPTIONS[0] };

export default function AdminCategoriesPage() {
  const { toast } = useToast();
  const categories = useCatalog((state) => state.categories);
  const products = useCatalog((state) => state.products);
  const addCategory = useCatalog((state) => state.addCategory);
  const updateCategory = useCatalog((state) => state.updateCategory);
  const deleteCategory = useCatalog((state) => state.deleteCategory);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [confirming, setConfirming] = useState<Category | null>(null);

  const countFor = (id: string) => products.filter((product) => product.categoryId === id).length;

  const startCreate = () => {
    setEditing(null);
    setDraft(emptyDraft);
    setOpen(true);
  };

  const startEdit = (category: Category) => {
    setEditing(category);
    setDraft({
      name: category.name,
      slug: category.slug,
      tagline: category.tagline,
      description: category.description,
      image: category.image,
    });
    setOpen(true);
  };

  const save = (event: React.FormEvent) => {
    event.preventDefault();
    const slug = slugify(draft.slug || draft.name);
    if (!draft.name.trim() || !slug) return toast({ title: "Nama dan slug wajib diisi", tone: "danger" });
    if (categories.some((category) => category.slug === slug && category.id !== editing?.id)) {
      return toast({ title: "Slug kategori sudah dipakai", tone: "danger" });
    }
    const payload = {
      name: draft.name.trim(),
      slug,
      parentId: null,
      image: draft.image,
      description: draft.description.trim(),
      tagline: draft.tagline.trim(),
    };
    if (editing) {
      updateCategory(editing.id, payload);
      toast({ title: "Kategori diperbarui", description: payload.name, tone: "success" });
    } else {
      addCategory(payload);
      toast({ title: "Kategori ditambahkan", description: payload.name, tone: "success" });
    }
    setOpen(false);
  };

  return (
    <div className="space-y-5">
      <AdminPageHeader
        eyebrow="Katalog"
        title="Kategori"
        description="Susun navigasi katalog. Kategori dengan produk tidak dapat dihapus."
        actions={
          <Button size="sm" onClick={startCreate}>
            <Icon name="plus" size={14} /> Kategori baru
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => {
          const count = countFor(category.id);
          return (
            <div key={category.id} className="card-surface group overflow-hidden">
              <div className="relative aspect-[16/9] overflow-hidden bg-sand-100">
                <Image src={category.image} alt={category.name} fill sizes="(max-width: 640px) 100vw, 360px" className="object-cover transition duration-700 group-hover:scale-105" />
                <span className="absolute left-3 top-3 rounded-full bg-surface/90 px-2.5 py-1 text-[10px] font-bold text-ink backdrop-blur">
                  {count} produk
                </span>
                <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition group-hover:opacity-100">
                  <button
                    onClick={() => startEdit(category)}
                    className="grid h-8 w-8 place-items-center rounded-full bg-surface/90 text-ink transition hover:bg-surface"
                    aria-label={`Edit ${category.name}`}
                  >
                    <Icon name="edit" size={14} />
                  </button>
                  <button
                    onClick={() => setConfirming(category)}
                    className="grid h-8 w-8 place-items-center rounded-full bg-surface/90 text-ink-muted transition hover:text-danger"
                    aria-label={`Hapus ${category.name}`}
                  >
                    <Icon name="trash" size={14} />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="font-display text-lg text-ink">{category.name}</h2>
                  <span className="text-[10px] text-ink-muted">/{category.slug}</span>
                </div>
                <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-ink-muted">
                  {category.tagline || category.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit kategori" : "Kategori baru"}>
        <form onSubmit={save} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nama kategori">
              <Input
                value={draft.name}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    name: event.target.value,
                    slug: editing ? current.slug : slugify(event.target.value),
                  }))
                }
                placeholder="Living"
                required
              />
            </Field>
            <Field label="Slug">
              <Input
                value={draft.slug}
                onChange={(event) => setDraft((current) => ({ ...current, slug: slugify(event.target.value) }))}
                placeholder="living"
                required
              />
            </Field>
          </div>
          <Field label="Tagline">
            <Input
              value={draft.tagline}
              onChange={(event) => setDraft((current) => ({ ...current, tagline: event.target.value }))}
              placeholder="Untuk ruang yang terasa seperti pulang"
            />
          </Field>
          <Field label="Deskripsi">
            <Textarea
              value={draft.description}
              onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))}
              placeholder="Ceritakan karakter koleksi kategori ini…"
            />
          </Field>
          <div>
            <p className="label">Gambar kategori</p>
            <div className="grid grid-cols-3 gap-2">
              {IMAGE_OPTIONS.map((image) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setDraft((current) => ({ ...current, image }))}
                  className={`relative aspect-[4/3] overflow-hidden rounded-lg border-2 transition ${
                    draft.image === image ? "border-olive-700" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image src={image} alt="" fill sizes="140px" className="object-cover" />
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button type="submit">{editing ? "Simpan" : "Tambah kategori"}</Button>
          </div>
        </form>
      </Modal>

      <Modal open={confirming !== null} onClose={() => setConfirming(null)} title="Hapus kategori?">
        {confirming && countFor(confirming.id) > 0 ? (
          <>
            <p className="text-sm leading-relaxed text-ink-soft">
              <strong className="text-ink">{confirming.name}</strong> masih memiliki {countFor(confirming.id)} produk.
              Pindahkan produk tersebut ke kategori lain terlebih dahulu.
            </p>
            <div className="mt-6 flex justify-end">
              <Button variant="outline" onClick={() => setConfirming(null)}>
                Mengerti
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm leading-relaxed text-ink-soft">
              Kategori <strong className="text-ink">{confirming?.name}</strong> akan dihapus dari navigasi toko.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setConfirming(null)}>
                Batal
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  if (!confirming) return;
                  deleteCategory(confirming.id);
                  toast({ title: "Kategori dihapus", description: confirming.name, tone: "success" });
                  setConfirming(null);
                }}
              >
                Ya, hapus
              </Button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
