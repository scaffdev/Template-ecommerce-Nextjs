import { NextResponse } from "next/server";

// POST /api/webhooks/payment — verifikasi signature + idempotency, balas 200 cepat
const seen = new Set<string>();

export async function POST(req: Request) {
  const raw = await req.text();
  let payload: Record<string, unknown> = {};
  try { payload = JSON.parse(raw); } catch {}
  const signature = req.headers.get("x-signature") ?? "";

  // 1. Verifikasi signature (bandingkan HMAC di produksi — Midtrans/Xendit)
  if (process.env.PAYMENT_WEBHOOK_SECRET && signature !== process.env.PAYMENT_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  // 2. Idempotency — jangan proses event yang sama dua kali
  const eventId = String(payload.order_id ?? payload.id ?? raw.slice(0, 32));
  if (seen.has(eventId)) return NextResponse.json({ ok: true, deduped: true });
  seen.add(eventId);

  // 3. Simpan raw payload untuk audit (tabel Payment.rawPayload), proses asinkron:
  //    - update Payment.status + Order.status (transaksi DB, kurangi stok permanen)
  console.log("[webhook:payment]", eventId, payload);

  return NextResponse.json({ ok: true });
}
