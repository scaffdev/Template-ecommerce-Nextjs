import { Card } from "@/components/ui/primitives";

const customers = [
  { name: "Andini P.", email: "andini@mail.com", orders: 5, total: 1250000 },
  { name: "Budi S.", email: "budi@mail.com", orders: 3, total: 890000 },
  { name: "Citra", email: "citra@mail.com", orders: 8, total: 3120000 },
];

export default function AdminCustomers() {
  return (
    <div>
      <h1 className="text-xl font-bold">Pelanggan</h1>
      <div className="mt-3 space-y-2">
        {customers.map((c) => (
          <Card key={c.email} className="flex items-center gap-3">
            <div className="flex-1"><p className="text-sm font-bold">{c.name}</p><p className="text-xs text-gray-500">{c.email} • {c.orders} pesanan</p></div>
            <b className="text-sm">Rp{c.total.toLocaleString("id-ID")}</b>
          </Card>
        ))}
      </div>
    </div>
  );
}
