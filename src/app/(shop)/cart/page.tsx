"use client";
import Link from "next/link";
import { useCart } from "@/store/shop";
import { formatIDR, calcDiscount } from "@/lib/utils";
import { Button, Input, Card } from "@/components/ui/primitives";
import { useState } from "react";

export default function CartPage() {
  const { items, updateQty, removeItem, subtotal, setCoupon, couponCode } = useCart();
  const [code, setCode] = useState(couponCode);
  const [msg, setMsg] = useState("");
  const discount = calcDiscount(subtotal(), couponCode || undefined);

  const applyCoupon = () => {
    const c = code.trim().toUpperCase();
    if (["HEMAT10", "POTONGAN20RB", "GRATISONGKIR", ""].includes(c)) {
      setCoupon(c);
      setMsg(c ? `Voucher ${c} diterapkan.` : "Voucher dihapus.");
    } else {
      setMsg("Kode voucher tidak valid.");
    }
  };

  if (items.length === 0)
    return (
      <div className="py-16 text-center">
        <p className="text-4xl">🛒</p>
        <h1 className="mt-2 text-xl font-bold">Keranjang masih kosong</h1>
        <Link href="/products" className="mt-4 inline-block rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white">Mulai Belanja</Link>
      </div>
    );

  return (
    <div className="grid gap-6 py-6 md:grid-cols-[1fr_340px]">
      <div className="space-y-3">
        <h1 className="text-xl font-bold">Keranjang ({items.length})</h1>
        {items.map((i) => (
          <Card key={`${i.productId}-${i.variantId}`} className="flex gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={i.image} alt={i.name} className="h-20 w-20 rounded-xl object-cover" />
            <div className="flex-1">
              <p className="text-sm font-semibold">{i.name}</p>
              {i.variantName && <p className="text-xs text-gray-500">Varian: {i.variantName}</p>}
              <p className="text-sm font-bold text-sky-700">{formatIDR(i.price)}</p>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex items-center rounded-lg border text-sm">
                  <button className="px-2.5 py-1" onClick={() => updateQty(i.productId, i.variantId, i.qty - 1)}>−</button>
                  <span className="w-8 text-center font-bold">{i.qty}</span>
                  <button className="px-2.5 py-1" onClick={() => updateQty(i.productId, i.variantId, i.qty + 1)}>+</button>
                </div>
                <button onClick={() => removeItem(i.productId, i.variantId)} className="text-xs text-red-600 hover:underline">Hapus</button>
              </div>
            </div>
            <b className="text-sm">{formatIDR(i.price * i.qty)}</b>
          </Card>
        ))}
      </div>
      <Card className="h-fit space-y-3">
        <h2 className="font-bold">Ringkasan</h2>
        <div className="flex gap-2">
          <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Kode voucher (HEMAT10)" />
          <Button onClick={applyCoupon} variant="outline">Pakai</Button>
        </div>
        {msg && <p className="text-xs text-gray-600">{msg}</p>}
        <div className="space-y-1 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><b>{formatIDR(subtotal())}</b></div>
          <div className="flex justify-between text-emerald-600"><span>Diskon</span><b>−{formatIDR(discount)}</b></div>
          <div className="flex justify-between text-gray-500"><span>Ongkir</span><span>Dihitung di checkout</span></div>
          <div className="flex justify-between border-t pt-2 text-base"><span>Total</span><b className="text-sky-700">{formatIDR(subtotal() - discount)}</b></div>
        </div>
        <Link href="/checkout" className="block rounded-lg bg-sky-600 py-2.5 text-center text-sm font-bold text-white hover:bg-sky-700">Lanjut ke Checkout</Link>
        <Link href="/products" className="block text-center text-xs text-sky-600 underline">Lanjut belanja</Link>
      </Card>
    </div>
  );
}
