import { NextResponse } from "next/server";
import { products } from "@/lib/data";

// GET /api/products?q=&category=&sort= — SSR/ISR katalog (cache Redis di produksi)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").toLowerCase();
  let list = [...products];
  if (q) list = list.filter((p) => (p.name + " " + p.tags.join(" ")).toLowerCase().includes(q));
  return NextResponse.json({ data: list, total: list.length });
}
