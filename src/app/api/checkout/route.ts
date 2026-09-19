import { NextResponse } from "next/server";

// POST /api/checkout — validasi stok real-time + reserve stok dalam transaksi DB
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const items = body.items ?? [];
  if (items.length === 0) return NextResponse.json({ error: "Keranjang kosong" }, { status: 400 });
  // Produksi: cek stok per SKU dengan SELECT ... FOR UPDATE, reserve, buat Order+Payment,
  // kirim email konfirmasi (Resend), jadwalkan auto-cancel jika tidak dibayar.
  const orderId = `ORD-${Date.now().toString().slice(-8)}`;
  return NextResponse.json({ orderId, total: body.total ?? 0 });
}
