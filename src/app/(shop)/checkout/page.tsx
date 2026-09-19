"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart, useAuth, saveOrder } from "@/store/shop";
import { couriers, paymentMethods } from "@/lib/data";
import { formatIDR, calcDiscount, freeShipping } from "@/lib/utils";
import { Button, Input, Card } from "@/components/ui/primitives";

export default function CheckoutPage() {
  const { items, subtotal, couponCode, setCoupon, clear } = useCart();
  const user = useAuth((s) => s.user);
  const router = useRouter();
  const [form, setForm] = useState({
    recipient: user?.name ?? "", phone: "", province: "Jawa Barat", city: "Bandung",
    district: "Coblong", postalCode: "40132", detail: "",
    courier: "jne-reg", paymentMethod: "qris", coupon: couponCode, notes: "",
  });
  const [err, setErr] = useState("");

  const ship = useMemo(() => couriers.find((c) => c.id === form.courier), [form.courier]);
  const discount = calcDiscount(subtotal(), form.coupon || undefined);
  const shipCost = form.coupon && freeShipping(form.coupon) ? 0 : ship?.cost ?? 0;
  const total = Math.max(0, subtotal() - discount + shipCost);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) { setErr("Keranjang kosong."); return; }
    if (form.recipient.length < 3 || form.phone.length < 9 || form.detail.length < 10) {
      setErr("Lengkapi alamat: nama (min 3), telepon valid, dan alamat detail (min 10 karakter).");
      return;
    }
    setCoupon((form.coupon ?? "").toUpperCase());
    const orderId = `ORD-${Date.now().toString().slice(-8)}`;
    const order = {
      id: orderId, orderNumber: `#${orderId}`, items, subtotal: subtotal(),
      discount, shippingCost: shipCost, total, status: "pending",
      paymentMethod: paymentMethods.find((m) => m.id === form.paymentMethod)?.name ?? form.paymentMethod,
      courier: ship?.name ?? form.courier, createdAt: new Date().toISOString(),
      address: { recipient: form.recipient, phone: form.phone, city: form.city, detail: form.detail },
      couponCode: form.coupon,
    };
    saveOrder(order);
    clear();
    router.push(`/checkout/${orderId}/payment?total=${total}&method=${form.paymentMethod}`);
  };

  return (
    <div className="py-6">
      <h1 className="text-xl font-bold">Checkout</h1>
      <div className="mt-1 flex gap-2 text-xs font-semibold">
        <span className="rounded-full bg-sky-600 px-3 py-1 text-white">1 Alamat</span>
        <span className="rounded-full bg-gray-200 px-3 py-1">2 Pengiriman</span>
        <span className="rounded-full bg-gray-200 px-3 py-1">3 Pembayaran</span>
      </div>
      {!user && <p className="mt-3 rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs">Anda checkout sebagai <b>tamu</b>. <a href="/login" className="text-sky-600 underline">Masuk</a> untuk alamat tersimpan & lacak pesanan lebih mudah.</p>}
      <form onSubmit={submit} className="mt-4 grid gap-6 md:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          <Card>
            <h2 className="font-bold">Alamat Pengiriman</h2>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <label className="text-xs">Nama penerima<Input value={form.recipient} onChange={(e) => set("recipient", e.target.value)} placeholder="Nama lengkap" /></label>
              <label className="text-xs">Telepon<Input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="08xx" /></label>
              <label className="text-xs">Provinsi<Input value={form.province} onChange={(e) => set("province", e.target.value)} /></label>
              <label className="text-xs">Kota<Input value={form.city} onChange={(e) => set("city", e.target.value)} /></label>
              <label className="text-xs">Kecamatan<Input value={form.district} onChange={(e) => set("district", e.target.value)} /></label>
              <label className="text-xs">Kode pos<Input value={form.postalCode} onChange={(e) => set("postalCode", e.target.value)} /></label>
              <label className="text-xs md:col-span-2">Alamat lengkap<Input value={form.detail} onChange={(e) => set("detail", e.target.value)} placeholder="Jalan, nomor rumah, patokan" /></label>
              <label className="text-xs md:col-span-2">Catatan untuk penjual (opsional)<Input value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Titip di satpam, dsb." /></label>
            </div>
          </Card>
          <Card>
            <h2 className="font-bold">Kurir & Ongkir</h2>
            <div className="mt-2 space-y-2">
              {couriers.map((c) => (
                <label key={c.id} className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 text-sm ${form.courier === c.id ? "border-sky-600 bg-sky-50" : ""}`}>
                  <span><input type="radio" name="courier" checked={form.courier === c.id} onChange={() => set("courier", c.id)} className="mr-2" />{c.name} <span className="text-xs text-gray-500">({c.etd})</span></span>
                  <b>{formatIDR(c.cost)}</b>
                </label>
              ))}
            </div>
          </Card>
          <Card>
            <h2 className="font-bold">Metode Pembayaran</h2>
            <div className="mt-2 space-y-2">
              {paymentMethods.map((m) => (
                <label key={m.id} className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 text-sm ${form.paymentMethod === m.id ? "border-sky-600 bg-sky-50" : ""}`}>
                  <span><input type="radio" name="pay" checked={form.paymentMethod === m.id} onChange={() => set("paymentMethod", m.id)} className="mr-2" />{m.name}</span>
                  <span className="text-xs text-gray-500">{m.desc}</span>
                </label>
              ))}
            </div>
          </Card>
        </div>
        <Card className="h-fit space-y-3">
          <h2 className="font-bold">Ringkasan Pesanan</h2>
          {items.map((i) => (
            <div key={`${i.productId}-${i.variantId}`} className="flex justify-between text-xs">
              <span>{i.name} {i.variantName ? `(${i.variantName})` : ""} × {i.qty}</span>
              <b>{formatIDR(i.price * i.qty)}</b>
            </div>
          ))}
          <label className="block text-xs">Voucher<Input value={form.coupon} onChange={(e) => set("coupon", e.target.value.toUpperCase())} placeholder="HEMAT10 / GRATISONGKIR" /></label>
          <div className="space-y-1 border-t pt-2 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><b>{formatIDR(subtotal())}</b></div>
            <div className="flex justify-between text-emerald-600"><span>Diskon</span><b>−{formatIDR(discount)}</b></div>
            <div className="flex justify-between"><span>Ongkir ({ship?.name})</span><b>{shipCost === 0 ? "GRATIS" : formatIDR(shipCost)}</b></div>
            <div className="flex justify-between border-t pt-2 text-base"><span>Total</span><b className="text-sky-700">{formatIDR(total)}</b></div>
          </div>
          {err && <p className="text-xs text-red-600">{err}</p>}
          <Button type="submit" className="w-full">Buat Pesanan & Bayar</Button>
        </Card>
      </form>
    </div>
  );
}
