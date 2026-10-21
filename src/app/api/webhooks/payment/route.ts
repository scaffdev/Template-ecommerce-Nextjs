import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";

export async function POST(req: Request) {
  const secret = process.env.PAYMENT_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "webhook not configured" }, { status: 503 });
  }

  const raw = await req.text();
  let payload: Record<string, unknown> = {};
  try { payload = JSON.parse(raw); } catch { /* invalid JSON */ }

  const signature = req.headers.get("x-signature") ?? "";
  try {
    const a = Buffer.from(signature);
    const b = Buffer.from(secret);
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      return NextResponse.json({ error: "invalid signature" }, { status: 401 });
    }
  } catch {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  const eventId = String(payload.order_id ?? payload.id ?? raw.slice(0, 32));

  // ponytail: persistent idempotency (DB unique constraint); add when DB ready
  return NextResponse.json({ ok: true, event: eventId });
}
