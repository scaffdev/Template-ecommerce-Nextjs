"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useCatalog } from "@/store/catalog";
import { useToast } from "@/components/ui/toast";
import { AdminCard } from "@/components/admin/ui";
import { Button, Field, Input, Select, Textarea } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { formatIDR, generateId, slugify } from "@/lib/utils";
import type { Product, ProductImage, ProductSpec, ProductStatus, ProductVariant } from "@/types";

const FALLBACK_IMAGES = [
  "/images/products/chair-sculpt.webp",
  "/images/products/lamp-halo.webp",
  "/images/products/vase-terra.webp",
  "/images/products/linen-shirt.webp",
  "/images/products/silk-dress.webp",
  "/images/products/sneakers-arc.webp",
  "/images/products/headphones-lumen.webp",
  "/images/products/serum-botanical.webp",
  "/images/products/leather-tote.webp",
  "/images/products/watch-orbit.webp",
  "/images/products/parfum-santal.webp",
  "/images/products/ring-aura.webp",
];

interface VariantDraft {
  id: string;
  name: string;
  sku: string;
  price: string;
  stock: string;
}

function toDraft(variant?: ProductVariant): VariantDraft {
  return {
    id: variant?.id ?? generateId("v"),
    name: variant?.name ?? "Default",
    sku: variant?.sku ?? "",
    price: String(variant?.price ?? ""),
    stock: String(variant?.stock ?? 0),
  };
}

function FlagRow({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-sand-200 px-3 py-2.5 transition hover:border-sand-300">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 h-4 w-4 accent-[#26301F]"
      />
      <span>
        <span className="block text-xs font-semibold text-ink">{label}</span>
        <span className="mt-0.5 block text-[10px] leading-relaxed text-ink-muted">{hint}</span>
      </span>
    </label>
  );
}

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const { toast } = useToast();
  const products = useCatalog((state) => state.products);
  const categories = useCatalog((state) => state.categories);
  const addProduct = useCatalog((state) => state.addProduct);
  const updateProduct = useCatalog((state) => state.updateProduct);

  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(product));
  const [brand, setBrand] = useState(product?.brand ?? "tokobagus.com");
  const [tagline, setTagline] = useState(product?.tagline ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [story, setStory] = useState(product?.story ?? "");
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? categories[0]?.id ?? "");
  const [tags, setTags] = useState(product?.tags.join(", ") ?? "");
  const [basePrice, setBasePrice] = useState(String(product?.basePrice ?? ""));
  const [comparePrice, setComparePrice] = useState(product?.comparePrice ? String(product.comparePrice) : "");
  const [weight, setWeight] = useState(String(product?.weight ?? 500));
  const [status, setStatus] = useState<ProductStatus>(product?.status ?? "active");
  const [featured, setFeatured] = useState(Boolean(product?.isFeatured));
  const [isNew, setIsNew] = useState(Boolean(product?.isNew));
  const [bestSeller, setBestSeller] = useState(Boolean(product?.isBestSeller));
  const [images, setImages] = useState<ProductImage[]>(
    product?.images ?? []
  );
  const [imageUrl, setImageUrl] = useState("");
  const [variants, setVariants] = useState<VariantDraft[]>(
    product?.variants.length ? product.variants.map(toDraft) : [toDraft()]
  );
  const [highlights, setHighlights] = useState(product?.highlights.join("\n") ?? "");
  const [specs, setSpecs] = useState<ProductSpec[]>(product?.specs ?? [{ label: "", value: "" }]);
  const [saving, setSaving] = useState(false);

  const library = useMemo(() => {
    const urls = new Set<string>(FALLBACK_IMAGES);
    products.forEach((item) => item.images.forEach((image) => urls.add(image.url)));
    return Array.from(urls);
  }, [products]);

  const uniqueSlug = (value: string) =>
    products.some((item) => item.slug === value && item.id !== product?.id);

  const handleName = (value: string) => {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  };

  const toggleImage = (url: string) => {
    setImages((current) => {
      const exists = current.some((image) => image.url === url);
      if (exists) return current.filter((image) => image.url !== url);
      if (current.length >= 4) {
        toast({ title: "Maksimal 4 gambar per produk", tone: "info" });
        return current;
      }
      return [...current, { id: generateId("img"), url, alt: name || "Foto produk" }];
    });
  };

  const addVariant = () =>
    setVariants((current) => [
      ...current,
      { id: generateId("v"), name: "", sku: "", price: basePrice, stock: "0" },
    ]);

  const updateVariant = (id: string, patch: Partial<VariantDraft>) =>
    setVariants((current) => current.map((variant) => (variant.id === id ? { ...variant, ...patch } : variant)));

  const removeVariant = (id: string) =>
    setVariants((current) => (current.length > 1 ? current.filter((variant) => variant.id !== id) : current));

  const submit = (event: React.FormEvent) => {
    event.preventDefault();

    const price = Number(basePrice);
    const finalSlug = slugify(slug || name);

    if (!name.trim()) return toast({ title: "Nama produk wajib diisi", tone: "danger" });
    if (!finalSlug) return toast({ title: "Slug produk wajib diisi", tone: "danger" });
    if (uniqueSlug(finalSlug)) return toast({ title: "Slug sudah dipakai produk lain", tone: "danger" });
    if (!categoryId) return toast({ title: "Pilih kategori produk", tone: "danger" });
    if (!Number.isFinite(price) || price <= 0) return toast({ title: "Harga dasar belum valid", tone: "danger" });
    if (images.length === 0) return toast({ title: "Tambahkan minimal satu gambar", tone: "danger" });

    const cleanVariants = variants.filter((variant) => variant.name.trim());
    if (cleanVariants.length === 0) return toast({ title: "Tambahkan minimal satu varian", tone: "danger" });

    const parsedVariants: ProductVariant[] = cleanVariants.map((variant, index) => {
      const variantPrice = Number(variant.price) || price;
      const sku = variant.sku.trim() || `TBG-${finalSlug.slice(0, 10).toUpperCase()}-${index + 1}`;
      return {
        id: variant.id,
        sku,
        name: variant.name.trim(),
        price: variantPrice,
        stock: Math.max(0, Number(variant.stock) || 0),
        imageUrl: images[index % images.length]?.url,
        options: [{ name: "Varian", value: variant.name.trim() }],
      };
    });

    const payload = {
      name: name.trim(),
      slug: finalSlug,
      brand: brand.trim() || "tokobagus.com",
      tagline: tagline.trim(),
      description: description.trim(),
      story: story.trim() || undefined,
      categoryId,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      basePrice: price,
      comparePrice: Number(comparePrice) > price ? Number(comparePrice) : undefined,
      weight: Math.max(1, Number(weight) || 500),
      status,
      isFeatured: featured,
      isNew,
      isBestSeller: bestSeller,
      images,
      variants: parsedVariants,
      highlights: highlights
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .slice(0, 6),
      specs: specs.filter((spec) => spec.label.trim() && spec.value.trim()),
    };

    setSaving(true);
    window.setTimeout(() => {
      if (product) {
        updateProduct(product.id, payload);
        toast({ title: "Produk diperbarui", description: name, tone: "success" });
      } else {
        addProduct({
          ...payload,
          rating: 0,
          reviewCount: 0,
          sold: 0,
        });
        toast({ title: "Produk ditambahkan", description: name, tone: "success" });
      }
      router.push("/admin/products");
    }, 400);
  };

  const pricePreview = Number(basePrice);

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-[1.65fr_1fr]">
        <div className="space-y-5">
          <AdminCard title="Informasi dasar" description="Nama, cerita, dan deskripsi yang dilihat pelanggan">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nama produk">
                <Input value={name} onChange={(event) => handleName(event.target.value)} placeholder="mis. Halo Table Lamp" required />
              </Field>
              <Field label="Slug URL" hint={`/products/${slug || "slug-produk"}`}>
                <Input
                  value={slug}
                  onChange={(event) => {
                    setSlugTouched(true);
                    setSlug(slugify(event.target.value));
                  }}
                  placeholder="halo-table-lamp"
                  required
                />
              </Field>
              <Field label="Brand / studio">
                <Input value={brand} onChange={(event) => setBrand(event.target.value)} placeholder="tokobagus.com" />
              </Field>
              <Field label="Tagline singkat">
                <Input value={tagline} onChange={(event) => setTagline(event.target.value)} placeholder="Cahaya hangat untuk sudut favorit" />
              </Field>
            </div>
            <div className="mt-4 space-y-4">
              <Field label="Deskripsi" hint="Tampil di kartu produk dan ringkasan PDP.">
                <Textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Jelaskan bahan, ukuran, dan keunggulan utama…" />
              </Field>
              <Field label="Cerita produk (opsional)" hint="Paragraf editorial untuk bagian 'Story' di halaman produk.">
                <Textarea value={story} onChange={(event) => setStory(event.target.value)} placeholder="Bagaimana produk ini dibuat…" />
              </Field>
            </div>
          </AdminCard>

          <AdminCard
            title="Galeri gambar"
            description={`${images.length}/4 dipilih — klik untuk menambah atau melepas`}
            action={
              <div className="flex items-center gap-2">
                <Input
                  value={imageUrl}
                  onChange={(event) => setImageUrl(event.target.value)}
                  placeholder="/images/products/…"
                  className="h-9 w-44 text-xs"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (!imageUrl.trim()) return;
                    setImages((current) =>
                      current.length >= 4
                        ? current
                        : [...current, { id: generateId("img"), url: imageUrl.trim(), alt: name || "Foto produk" }]
                    );
                    setImageUrl("");
                  }}
                >
                  <Icon name="plus" size={13} /> URL
                </Button>
              </div>
            }
          >
            {images.length > 0 && (
              <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
                {images.map((image, index) => (
                  <div key={image.id} className="relative w-24 shrink-0 overflow-hidden rounded-xl border border-sand-200">
                    <div className="relative aspect-square">
                      <Image src={image.url} alt={image.alt} fill sizes="96px" className="object-cover" />
                    </div>
                    <span className="absolute left-1 top-1 rounded bg-ink/80 px-1.5 py-0.5 text-[9px] font-bold text-surface">
                      {index === 0 ? "Utama" : index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleImage(image.url)}
                      aria-label="Hapus gambar"
                      className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-surface/90 text-ink-muted transition hover:text-danger"
                    >
                      <Icon name="close" size={11} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
              {library.map((url) => {
                const active = images.some((image) => image.url === url);
                return (
                  <button
                    key={url}
                    type="button"
                    onClick={() => toggleImage(url)}
                    className={cn(
                      "relative aspect-square overflow-hidden rounded-lg border-2 transition",
                      active ? "border-olive-700" : "border-transparent opacity-70 hover:opacity-100"
                    )}
                  >
                    <Image src={url} alt="" fill sizes="120px" className="object-cover" />
                    {active && (
                      <span className="absolute inset-0 grid place-items-center bg-ink/30">
                        <Icon name="check" size={18} className="text-surface" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </AdminCard>

          <AdminCard
            title="Varian & stok"
            description="Setiap varian punya SKU, harga, dan stok sendiri."
            action={
              <Button type="button" variant="outline" size="sm" onClick={addVariant}>
                <Icon name="plus" size={13} /> Varian
              </Button>
            }
          >
            <div className="space-y-2">
              <div className="hidden grid-cols-[1.4fr_1fr_0.8fr_0.7fr_36px] gap-2 px-1 text-[9px] font-bold uppercase tracking-widest text-ink-muted sm:grid">
                <span>Nama varian</span>
                <span>SKU</span>
                <span>Harga</span>
                <span>Stok</span>
                <span />
              </div>
              {variants.map((variant) => (
                <div key={variant.id} className="grid grid-cols-2 gap-2 rounded-xl border border-sand-200 p-2 sm:grid-cols-[1.4fr_1fr_0.8fr_0.7fr_36px] sm:border-0 sm:p-0">
                  <Input
                    value={variant.name}
                    onChange={(event) => updateVariant(variant.id, { name: event.target.value })}
                    placeholder="mis. Natural / Small"
                    className="text-xs"
                  />
                  <Input
                    value={variant.sku}
                    onChange={(event) => updateVariant(variant.id, { sku: event.target.value })}
                    placeholder="SKU otomatis"
                    className="text-xs"
                  />
                  <Input
                    type="number"
                    min={0}
                    value={variant.price}
                    onChange={(event) => updateVariant(variant.id, { price: event.target.value })}
                    placeholder={basePrice || "Harga"}
                    className="text-xs"
                  />
                  <Input
                    type="number"
                    min={0}
                    value={variant.stock}
                    onChange={(event) => updateVariant(variant.id, { stock: event.target.value })}
                    className="text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => removeVariant(variant.id)}
                    aria-label="Hapus varian"
                    className="col-span-2 grid h-9 place-items-center rounded-lg text-ink-muted transition hover:bg-canvas hover:text-danger sm:col-span-1"
                  >
                    <Icon name="trash" size={15} />
                  </button>
                </div>
              ))}
            </div>
          </AdminCard>

          <AdminCard title="Highlights & spesifikasi" description="Poin singkat dan tabel teknis di halaman produk">
            <Field label="Highlights" hint="Satu poin per baris, maksimal 6.">
              <Textarea value={highlights} onChange={(event) => setHighlights(event.target.value)} placeholder={"Material kayu solid\nDibuat tangan di Jepara"} />
            </Field>
            <div className="mt-4">
              <p className="label">Spesifikasi</p>
              <div className="space-y-2">
                {specs.map((spec, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={spec.label}
                      onChange={(event) =>
                        setSpecs((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, label: event.target.value } : item)))
                      }
                      placeholder="Material"
                      className="text-xs"
                    />
                    <Input
                      value={spec.value}
                      onChange={(event) =>
                        setSpecs((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, value: event.target.value } : item)))
                      }
                      placeholder="Oak solid"
                      className="text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setSpecs((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                      aria-label="Hapus spesifikasi"
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-ink-muted transition hover:text-danger"
                    >
                      <Icon name="close" size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="mt-2"
                onClick={() => setSpecs((current) => [...current, { label: "", value: "" }])}
              >
                <Icon name="plus" size={13} /> Tambah baris
              </Button>
            </div>
          </AdminCard>
        </div>

        <div className="space-y-5">
          <AdminCard title="Publikasi" description="Visibilitas dan penempatan">
            <Field label="Status">
              <Select value={status} onChange={(event) => setStatus(event.target.value as ProductStatus)}>
                <option value="active">Aktif — tampil di toko</option>
                <option value="draft">Draft — sembunyikan</option>
              </Select>
            </Field>
            <div className="mt-4 space-y-2">
              <FlagRow label="Featured" hint="Tampil di rail unggulan beranda." checked={featured} onChange={setFeatured} />
              <FlagRow label="Baru" hint="Badge NEW dan filter new arrivals." checked={isNew} onChange={setIsNew} />
              <FlagRow label="Best seller" hint="Badge best seller dan rail terlaris." checked={bestSeller} onChange={setBestSeller} />
            </div>
            <div className="mt-4 flex gap-2">
              <Button type="submit" loading={saving} className="flex-1">
                {product ? "Simpan perubahan" : "Publikasikan produk"}
              </Button>
              <Link href="/admin/products" className="grid h-[46px] w-[46px] place-items-center rounded-full border border-sand-300 text-ink-muted transition hover:border-ink hover:text-ink" aria-label="Batal">
                <Icon name="close" size={16} />
              </Link>
            </div>
            {product && (
              <Link href={`/products/${product.slug}`} target="_blank" className="mt-3 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-brass-700">
                <Icon name="external" size={12} /> Lihat di toko
              </Link>
            )}
          </AdminCard>

          <AdminCard title="Harga & berat" description="Semua dalam Rupiah">
            <div className="space-y-4">
              <Field label="Harga dasar">
                <Input
                  type="number"
                  min={0}
                  value={basePrice}
                  onChange={(event) => setBasePrice(event.target.value)}
                  placeholder="450000"
                  required
                />
              </Field>
              {pricePreview > 0 && <p className="-mt-2 text-[11px] text-ink-muted">Pratinjau: <span className="font-semibold text-ink">{formatIDR(pricePreview)}</span></p>}
              <Field label="Harga coret (opsional)" hint="Ditampilkan sebagai harga sebelum diskon.">
                <Input
                  type="number"
                  min={0}
                  value={comparePrice}
                  onChange={(event) => setComparePrice(event.target.value)}
                  placeholder="590000"
                />
              </Field>
              <Field label="Berat (gram)">
                <Input type="number" min={1} value={weight} onChange={(event) => setWeight(event.target.value)} />
              </Field>
            </div>
          </AdminCard>

          <AdminCard title="Organisasi" description="Kategori dan tag pencarian">
            <Field label="Kategori">
              <Select value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Tag" hint="Pisahkan dengan koma." className="mt-4">
              <Input value={tags} onChange={(event) => setTags(event.target.value)} placeholder="linen, natural, hadiah" />
            </Field>
            {tags.trim() && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {tags
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter(Boolean)
                  .map((tag) => (
                    <span key={tag} className="rounded-full bg-canvas-deep px-2 py-1 text-[10px] text-ink-soft">
                      #{tag}
                    </span>
                  ))}
              </div>
            )}
          </AdminCard>
        </div>
      </div>
    </form>
  );
}
