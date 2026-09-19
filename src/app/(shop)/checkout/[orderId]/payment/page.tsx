"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { formatIDR } from "@/lib/utils";
import { Card, Button } from "@/components/ui/primitives";

const VA_NUM = "88000 1234 5678 90";

export default function PaymentPage() {
  const params = useParams<{ orderId: string }>();
  const sp = useSearchParams();
  const router = useRouter();
  const total = Number(sp.get("total") ?? 0);
  const method = sp.get("method") ?? "qris";
  const [secs, setSecs] = useState(23 * 3600 + 59 * 60);

  useEffect(() => {
    const t = setInterval(() => setSecs((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const h = Math.floor(secs / 3600), m = Math.floor((secs % 3600) / 60), s = secs % 60;

  return (
    <div className="mx-auto max-w-xl py-8">
      <Card className="text-center">
        <p className="text-xs text-gray-500">Menunggu pembayaran • {params.orderId}</p>
        <h1 className="mt-1 text-2xl font-black text-sky-700">{formatIDR(total)}</h1>
        <p className="mt-2 inline-block rounded-full bg-amber-100 px-4 py-1 text-sm font-bold text-amber-800">
          Batas waktu: {String(h).padStart(2, "0")}:{String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}
        </p>
        <div className="mt-4 rounded-xl bg-gray-50 p-4 text-left text-sm">
          {method === "qris" && <><p className="font-bold">Scan QRIS</p><div className="mx-auto my-3 grid h-40 w-40 place-items-center rounded-xl bg-white text-5xl">◧</div><p className="text-xs text-gray-500">Gunakan GoPay / OVO / DANA / m-banking apapun.</p></>}
          {method === "cod" && <p className="font-bold">COD — siapkan uang tunai {formatIDR(total)} saat kurir tiba.</p>}
          {method !== "qris" && method !== "cod" && <><p className="font-bold">Transfer ke Virtual Account</p><p className="mt-1 font-mono text-xl font-black tracking-widest">{VA_NUM}</p><p className="text-xs text-gray-500">a.n. TokoKita • Cek otomatis via webhook Midtrans/Xendit (simulasi).</p></>}
        </div>
        <div className="mt-4 flex gap-2">
          <Button variant="outline" className="flex-1" onClick={() => router.push("/checkout")}>Kembali</Button>
          <Button className="flex-1" onClick={() => router.push(`/checkout/success?order=${params.orderId}&total=${total}`)}>
            {method === "cod" ? "Buat Pesanan COD" : "Saya Sudah Bayar (Simulasi)"}
          </Button>
        </div>
        <p className="mt-3 text-[11px] text-gray-500">Webhook <code>/api/webhooks/payment</code> memverifikasi signature & idempotency sebelum mengubah status → stok dikurangi permanen. Jika kedaluwarsa, stok dikembalikan otomatis.</p>
      </Card>
      <p className="mt-3 text-center text-xs"><Link href="/account/orders" className="text-sky-600 underline">Lihat riwayat pesanan</Link></p>
    </div>
  );
}
