"use client";
import Link from "next/link";
import { products } from "@/lib/data";
import { formatIDR } from "@/lib/utils";
import { Card, Button } from "@/components/ui/primitives";
import { useState } from "react";

export default function AdminProducts() {
  const [q, setQ] = useState("");
  const list = products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Produk ({list.length})</h1>
        <Link href="/admin/products/new" className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-bold text-white">+ Tambah</Link>
      </div>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari produk…" className="mt-3 w-full rounded-lg border px-3 py-2 text-sm" />
      <div className="mt-3 space-y-2">
        {list.map((p) => (
          <Card key={p.id} className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.images[0]?.url} alt="" className="h-12 w-12 rounded-lg object-cover" />
            <div className="flex-1">
              <p className="text-sm font-bold">{p.name}</p>
              <p className="text-xs text-gray-500">{p.slug} • {formatIDR(p.basePrice)} • {p.status} • {p.variants.length} varian</p>
            </div>
            <Link href={`/admin/products/${p.id}`} className="rounded-lg border px-3 py-1.5 text-xs font-semibold">Edit</Link>
            <Button variant="ghost" onClick={() => alert("Bulk action: nonaktifkan / hapus (simulasi + audit log)")}>•••</Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
