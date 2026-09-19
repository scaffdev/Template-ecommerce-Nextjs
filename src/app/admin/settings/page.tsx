import { Card, Input } from "@/components/ui/primitives";

export default function AdminSettings() {
  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-bold">Pengaturan Toko</h1>
      <Card className="mt-3 space-y-3">
        <label className="block text-xs">Nama toko<Input defaultValue="TokoKita" /></label>
        <label className="block text-xs">Alamat asal pengiriman<Input defaultValue="Bandung, Jawa Barat" /></label>
        <label className="block text-xs">Pajak PPN (%)<Input defaultValue="11" /></label>
        <label className="block text-xs">Metode pembayaran aktif<Input defaultValue="QRIS, VA BCA, GoPay, COD" /></label>
      </Card>
    </div>
  );
}
