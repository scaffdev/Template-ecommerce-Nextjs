import { NextResponse } from "next/server";
import { couriers } from "@/lib/data";

// POST /api/shipping/rates { destination, weight } — fallback tarif flat jika provider down
export async function POST(req: Request) {
  try {
    await req.json();
  } catch {}
  // Simulasi: coba provider (Biteship/RajaOngkir), fallback ke tarif mock
  return NextResponse.json({ data: couriers, fallback: false });
}
