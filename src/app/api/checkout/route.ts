import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const items = body.items ?? [];
  if (items.length === 0) return NextResponse.json({ error: "Keranjang kosong" }, { status: 400 });

  // ponytail: server-side price lookup + stock check; add when DB ready
  const orderId = `ORD-${Date.now().toString().slice(-8)}`;
  return NextResponse.json({ orderId, items: items.length });
}
