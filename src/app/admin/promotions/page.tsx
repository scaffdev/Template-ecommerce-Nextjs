import { coupons } from "@/lib/data";
import { formatIDR } from "@/lib/utils";
import { Card } from "@/components/ui/primitives";

export default function AdminPromos() {
  return (
    <div>
      <h1 className="text-xl font-bold">Promo / Voucher</h1>
      <div className="mt-3 space-y-2">
        {coupons.map((k) => (
          <Card key={k.id} className="flex items-center gap-3">
            <div className="flex-1"><p className="font-mono font-black">{k.code}</p><p className="text-xs text-gray-500">{k.type} • min {formatIDR(k.minPurchase)} • {k.isActive ? "aktif" : "nonaktif"}</p></div>
            <button className="rounded-lg border px-3 py-1.5 text-xs">Edit</button>
          </Card>
        ))}
      </div>
    </div>
  );
}
