import { products } from "@/lib/data";
import { Card } from "@/components/ui/primitives";

export default function AdminInventory() {
  const rows = products.flatMap((p) => p.variants.map((v) => ({ p: p.name, ...v })));
  return (
    <div>
      <h1 className="text-xl font-bold">Inventori ({rows.length} SKU)</h1>
      <p className="text-xs text-gray-500">Stok di-reserve saat pesanan dibuat, dikembalikan jika kedaluwarsa/dibatalkan, dikurangi permanen saat pembayaran terkonfirmasi — dalam transaksi DB + row locking.</p>
      <Card className="mt-3 overflow-x-auto p-0">
        <table className="w-full text-left text-xs">
          <thead><tr className="border-b bg-gray-50"><th className="p-3">SKU</th><th className="p-3">Produk — Varian</th><th className="p-3">Stok</th><th className="p-3">Riwayat</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b"><td className="p-3 font-mono">{r.sku}</td><td className="p-3">{r.p} — {r.name}</td><td className={`p-3 font-bold ${r.stock < 10 ? "text-red-600" : ""}`}>{r.stock}</td><td className="p-3 text-sky-600 underline">Lihat log</td></tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
