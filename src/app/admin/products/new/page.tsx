"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { categories } from "@/lib/data";
import { Card, Button, Input } from "@/components/ui/primitives";

export default function ProductForm() {
  const router = useRouter();
  const [f, setF] = useState({ name: "", basePrice: "100000", stock: "10", categoryId: categories[0]?.id ?? "", status: "active" });
  const set = (k: string, v: string) => setF((s) => ({ ...s, [k]: v }));
  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-xl font-bold">Tambah / Edit Produk</h1>
      <Card className="mt-3 space-y-3">
        <label className="block text-xs">Nama produk<Input value={f.name} onChange={(e) => set("name", e.target.value)} /></label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-xs">Harga (IDR)<Input value={f.basePrice} onChange={(e) => set("basePrice", e.target.value)} /></label>
          <label className="block text-xs">Stok<Input value={f.stock} onChange={(e) => set("stock", e.target.value)} /></label>
        </div>
        <label className="block text-xs">Kategori
          <select value={f.categoryId} onChange={(e) => set("categoryId", e.target.value)} className="w-full rounded-lg border px-3 py-2.5 text-sm">
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </label>
        <label className="block text-xs">Upload gambar (simulasi /api/upload → S3/Cloudinary)
          <input type="file" multiple accept="image/*" className="mt-1 block w-full text-xs" onChange={() => alert("Upload simulasi: file dikirim ke /api/upload lalu URL CDN disimpan.")} />
        </label>
        <label className="block text-xs">Varian (ukuran/warna, harga & stok per varian)
          <Input placeholder="cth: Merah-M | +0 | stok 20" />
        </label>
        <Button onClick={() => { if (f.name.length < 3) { alert("Nama minimal 3 karakter (validasi Zod)."); return; } alert("Produk tersimpan (simulasi Prisma + audit log)."); router.push("/admin/products"); }}>Simpan Produk</Button>
      </Card>
    </div>
  );
}
