"use client";
import { categories } from "@/lib/data";
import { Card } from "@/components/ui/primitives";

export default function AdminCategories() {
  return (
    <div>
      <h1 className="text-xl font-bold">Kategori</h1>
      <div className="mt-3 space-y-2">
        {categories.map((c) => (
          <Card key={c.id} className="flex items-center gap-3">
            <div className="flex-1">
              <p className="text-sm font-bold">{c.parentId ? "└ " : ""}{c.name}</p>
              <p className="text-xs text-gray-500">/{c.slug} {c.parentId ? `• induk: ${c.parentId}` : "• induk"}</p>
            </div>
            <button className="rounded-lg border px-3 py-1.5 text-xs" onClick={() => {}}>Edit</button>
          </Card>
        ))}
      </div>
    </div>
  );
}
