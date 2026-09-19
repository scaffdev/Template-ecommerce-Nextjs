import Link from "next/link";
import { formatIDR } from "@/lib/utils";
import { Card } from "@/components/ui/primitives";

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ order?: string; total?: string }> }) {
  const { order = "ORD-", total = "0" } = await searchParams;
  return (
    <div className="mx-auto max-w-lg py-12 text-center">
      <p className="text-5xl">✅</p>
      <h1 className="mt-2 text-2xl font-black">Pesanan Berhasil Dibuat!</h1>
      <p className="mt-1 text-sm text-gray-600">Nomor pesanan <b>{order}</b> • Total <b className="text-sky-700">{formatIDR(Number(total))}</b></p>
      <Card className="mt-4 text-left text-sm">
        <p className="font-bold">Langkah selanjutnya</p>
        <ol className="mt-1 list-decimal space-y-1 pl-5 text-gray-700">
          <li>Email konfirmasi pesanan dikirim (simulasi Resend).</li>
          <li>Selesaikan pembayaran sebelum batas waktu.</li>
          <li>Admin memproses → input resi → email “Pesanan Dikirim”.</li>
          <li>Setelah paket diterima, beri ulasan produk.</li>
        </ol>
      </Card>
      <div className="mt-4 flex justify-center gap-2">
        <Link href="/account/orders" className="rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-bold text-white">Lacak Pesanan</Link>
        <Link href="/products" className="rounded-lg border px-5 py-2.5 text-sm font-semibold">Belanja Lagi</Link>
      </div>
    </div>
  );
}
