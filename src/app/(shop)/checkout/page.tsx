"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { SavedAddress, ShippingAddress } from "@/types";
import { couriers } from "@/lib/data";
import { cn } from "@/lib/cn";
import { calcCouponDiscount, formatIDR, isFreeShipping } from "@/lib/utils";
import { findCouponByCode, useCatalog } from "@/store/catalog";
import { useCart } from "@/store/commerce";
import { useOrders } from "@/store/orders";
import { useAddresses, useAuth } from "@/store/account";
import { useHydrated } from "@/components/ui/hooks";
import { useToast } from "@/components/ui/toast";
import { Button, Checkbox, Divider, EmptyState, Field, Input, Textarea } from "@/components/ui/primitives";
import { buttonStyles } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/icon";

type Step = 0 | 1 | 2;

const steps = [
  { title: "Alamat", description: "Tujuan pengiriman" },
  { title: "Pengiriman", description: "Kurir & catatan" },
  { title: "Pembayaran", description: "Metode bayar" },
];

const emptyAddress: ShippingAddress = {
  recipient: "",
  phone: "",
  province: "",
  city: "",
  district: "",
  postalCode: "",
  detail: "",
};

export default function CheckoutPage() {
  const router = useRouter();
  const hydrated = useHydrated();
  const { toast } = useToast();
  const items = useCart((state) => state.items);
  const subtotal = useCart((state) => state.subtotal());
  const couponCode = useCart((state) => state.couponCode);
  const clearCart = useCart((state) => state.clear);
  const settings = useCatalog((state) => state.settings);
  const createOrder = useOrders((state) => state.createOrder);
  const user = useAuth((state) => state.user);
  const addresses = useAddresses((state) => state.addresses);

  const defaultAddress = addresses.find((address) => address.isDefault) ?? addresses[0];
  const [step, setStep] = useState<Step>(0);
  const [selectedAddressId, setSelectedAddressId] = useState<string | "new">(defaultAddress?.id ?? "new");
  const [form, setForm] = useState<ShippingAddress>(emptyAddress);
  const [notes, setNotes] = useState("");
  const [courierId, setCourierId] = useState(couriers[0].id);
  const [paymentMethodId, setPaymentMethodId] = useState(settings.paymentMethods.find((method) => method.isActive)?.id ?? "va-bca");
  const [agree, setAgree] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (defaultAddress) setSelectedAddressId(defaultAddress.id);
  }, [defaultAddress]);

  useEffect(() => {
    if (user) {
      setForm((current) => ({
        ...current,
        recipient: current.recipient || user.name,
        phone: current.phone || user.phone,
      }));
    }
  }, [user]);

  const coupon = useMemo(() => (couponCode ? findCouponByCode(couponCode) : null), [couponCode]);
  const discount = coupon ? calcCouponDiscount(subtotal, coupon) : 0;
  const courier = couriers.find((item) => item.id === courierId) ?? couriers[0];
  const freeShipping = isFreeShipping(subtotal, coupon, settings.freeShippingThreshold);
  const shippingCost = freeShipping ? 0 : courier.cost;
  const total = Math.max(0, subtotal - discount) + shippingCost;
  const paymentMethod = settings.paymentMethods.find((method) => method.id === paymentMethodId) ?? settings.paymentMethods[0];
  const activeMethods = settings.paymentMethods.filter((method) => method.isActive);

  const selectedAddress: ShippingAddress | null = useMemo(() => {
    if (selectedAddressId !== "new") {
      const saved = addresses.find((address) => address.id === selectedAddressId);
      if (saved) {
        const { id, isDefault, ...rest } = saved as SavedAddress;
        return rest;
      }
    }
    return null;
  }, [selectedAddressId, addresses]);

  const resolveAddress = (): ShippingAddress | null => (selectedAddressId === "new" ? form : selectedAddress);

  const validateAddress = (address: ShippingAddress | null) => {
    if (!address) return false;
    return (
      address.recipient.trim().length > 1 &&
      /^[0-9+\-\s]{9,16}$/.test(address.phone.trim()) &&
      address.province.trim().length > 1 &&
      address.city.trim().length > 1 &&
      address.district.trim().length > 1 &&
      /^\d{5}$/.test(address.postalCode.trim()) &&
      address.detail.trim().length > 4
    );
  };

  const next = () => {
    if (step === 0) {
      const address = resolveAddress();
      if (!validateAddress(address)) {
        toast({
          title: "Alamat belum lengkap",
          description: "Periksa nama, nomor telepon, kota, kode pos 5 digit, dan detail alamat.",
          tone: "danger",
        });
        return;
      }
    }
    setStep((current) => Math.min(2, current + 1) as Step);
  };

  const placeOrder = () => {
    const address = resolveAddress();
    if (!validateAddress(address)) {
      setStep(0);
      toast({ title: "Alamat belum lengkap", tone: "danger" });
      return;
    }
    if (!agree) {
      toast({ title: "Setujui syarat & ketentuan dulu", tone: "danger" });
      return;
    }
    setProcessing(true);
    const order = createOrder({
      items,
      subtotal,
      discount,
      shippingCost,
      total,
      couponCode: coupon?.code,
      courierId: courier.id,
      courier: courier.name,
      etd: courier.etd,
      paymentMethodId: paymentMethod.id,
      paymentMethod: paymentMethod.name,
      address: address!,
      customer: {
        name: address!.recipient,
        email: user?.email ?? "tamu@tokobagus.com",
        phone: address!.phone,
      },
      notes: notes.trim() || undefined,
    });
    clearCart();
    toast({ title: "Pesanan dibuat", description: `Nomor pesanan ${order.orderNumber}`, tone: "success" });
    router.push(`/checkout/${order.id}/payment`);
  };

  if (hydrated && items.length === 0) {
    return (
      <div className="container-lume py-16">
        <EmptyState
          icon="bag"
          title="Keranjang kosong"
          description="Tambahkan produk terlebih dahulu sebelum melanjutkan ke checkout."
          action={
            <Link href="/products" className={buttonStyles({})}>
              Belanja sekarang <Icon name="arrow-right" size={15} />
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="container-lume py-5 sm:py-7">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] text-ink-muted">
        <Link href="/cart" className="hover:text-brand-600">
          Keranjang
        </Link>
        <Icon name="chevron-right" size={11} />
        <span className="text-ink">Checkout</span>
      </nav>
      <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">Checkout</h1>

      <ol className="mt-4 flex items-center gap-2 rounded-xl border border-sand-200 bg-white p-3 sm:gap-4 sm:p-4">
        {steps.map((item, index) => (
          <li key={item.title} className="flex flex-1 items-center gap-2 sm:gap-3">
            <button
              onClick={() => index < step && setStep(index as Step)}
              className={cn(
                "flex items-center gap-2.5 rounded-lg py-1 pr-2 text-left transition sm:pr-4",
                index < step && "cursor-pointer hover:bg-sand-50"
              )}
            >
              <span
                className={cn(
                  "grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold transition",
                  index < step
                    ? "bg-olive-600 text-white"
                    : index === step
                      ? "bg-brand-600 text-white"
                      : "border border-sand-300 text-ink-muted"
                )}
              >
                {index < step ? <Icon name="check" size={13} /> : index + 1}
              </span>
              <span className="hidden sm:block">
                <span className={cn("block text-[12px] font-semibold", index <= step ? "text-ink" : "text-ink-muted")}>{item.title}</span>
                <span className="block text-[10px] text-ink-muted">{item.description}</span>
              </span>
            </button>
            {index < steps.length - 1 && <span className={cn("h-px flex-1", index < step ? "bg-olive-400" : "bg-sand-300")} />}
          </li>
        ))}
      </ol>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.5fr_1fr] lg:gap-6">
        <div>
          {step === 0 && (
            <section aria-labelledby="step-address">
              <h2 id="step-address" className="text-lg font-extrabold text-ink">
                Alamat pengiriman
              </h2>
              {addresses.length > 0 && (
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {addresses.map((address) => (
                    <button
                      key={address.id}
                      onClick={() => setSelectedAddressId(address.id)}
                      className={cn(
                        "rounded-xl border p-3.5 text-left transition",
                        selectedAddressId === address.id ? "border-brand-600 bg-brand-50/50 shadow-soft" : "border-sand-200 bg-white hover:border-brand-300"
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[13px] font-bold text-ink">{address.label ?? "Alamat"}</p>
                        {address.isDefault && <span className="rounded bg-brand-600 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">Utama</span>}
                      </div>
                      <p className="mt-2 text-[13px] font-semibold text-ink-soft">{address.recipient} · {address.phone}</p>
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink-muted">
                        {address.detail}, {address.district}, {address.city}, {address.province} {address.postalCode}
                      </p>
                    </button>
                  ))}
                  <button
                    onClick={() => setSelectedAddressId("new")}
                    className={cn(
                      "flex min-h-[120px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed p-4 text-[12px] font-semibold transition",
                      selectedAddressId === "new" ? "border-brand-600 bg-brand-50/50 text-brand-700" : "border-sand-300 text-ink-muted hover:border-brand-400 hover:text-brand-600"
                    )}
                  >
                    <Icon name="plus" size={18} /> Alamat baru
                  </button>
                </div>
              )}

              {selectedAddressId === "new" && (
                <div className="mt-4 grid gap-3 rounded-xl border border-sand-200 bg-white p-4 sm:grid-cols-2 sm:p-5">
                  <Field label="Nama penerima" className="sm:col-span-2">
                    <Input value={form.recipient} onChange={(event) => setForm({ ...form, recipient: event.target.value })} placeholder="Nama lengkap" />
                  </Field>
                  <Field label="Nomor telepon">
                    <Input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="08xxxxxxxxxx" inputMode="tel" />
                  </Field>
                  <Field label="Kode pos">
                    <Input value={form.postalCode} onChange={(event) => setForm({ ...form, postalCode: event.target.value })} placeholder="12345" inputMode="numeric" maxLength={5} />
                  </Field>
                  <Field label="Provinsi">
                    <Input value={form.province} onChange={(event) => setForm({ ...form, province: event.target.value })} placeholder="DKI Jakarta" />
                  </Field>
                  <Field label="Kota / kabupaten">
                    <Input value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} placeholder="Jakarta Selatan" />
                  </Field>
                  <Field label="Kecamatan">
                    <Input value={form.district} onChange={(event) => setForm({ ...form, district: event.target.value })} placeholder="Kebayoran Baru" />
                  </Field>
                  <Field label="Detail alamat" className="sm:col-span-2" hint="Nama jalan, nomor rumah, RT/RW, patokan.">
                    <Textarea value={form.detail} onChange={(event) => setForm({ ...form, detail: event.target.value })} placeholder="Jl. Melati No. 12, RT 04 / RW 02" />
                  </Field>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <Button size="lg" onClick={next}>
                  Lanjut ke pengiriman <Icon name="arrow-right" size={16} />
                </Button>
              </div>
            </section>
          )}

          {step === 1 && (
            <section aria-labelledby="step-shipping">
              <h2 id="step-shipping" className="text-lg font-extrabold text-ink">
                Metode pengiriman
              </h2>
              <p className="mt-2 text-sm text-ink-soft">
                Dikirim dari {settings.shippingOrigin}. Pilih layanan yang paling sesuai.
              </p>
              <div className="mt-5 space-y-3">
                {couriers.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setCourierId(option.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl border p-3.5 text-left transition",
                      courierId === option.id ? "border-brand-600 bg-brand-50/40 shadow-soft" : "border-sand-200 bg-white hover:border-brand-300"
                    )}
                  >
                    <span
                      className={cn(
                        "grid h-10 w-10 shrink-0 place-items-center rounded-full",
                        courierId === option.id ? "bg-brand-600 text-white" : "bg-sand-100 text-ink-soft"
                      )}
                    >
                      <Icon name="truck" size={17} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[13px] font-bold text-ink">{option.name}</span>
                      <span className="block text-xs text-ink-muted">Estimasi {option.etd}</span>
                    </span>
                    <span className="text-right text-sm font-semibold text-ink">
                      {freeShipping ? (
                        <>
                          <span className="text-ink-muted line-through">{formatIDR(option.cost)}</span>
                          <span className="ml-2 text-success">Gratis</span>
                        </>
                      ) : (
                        formatIDR(option.cost)
                      )}
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-5">
                <Field label="Catatan untuk penjual (opsional)">
                  <Textarea
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    placeholder="Misal: titip ke resepsionis, bungkus tanpa nota harga."
                  />
                </Field>
              </div>

              <div className="mt-6 flex justify-between gap-3">
                <Button size="lg" variant="outline" onClick={() => setStep(0)}>
                  <Icon name="arrow-left" size={16} /> Kembali
                </Button>
                <Button size="lg" onClick={next}>
                  Lanjut ke pembayaran <Icon name="arrow-right" size={16} />
                </Button>
              </div>
            </section>
          )}

          {step === 2 && (
            <section aria-labelledby="step-payment">
              <h2 id="step-payment" className="text-lg font-extrabold text-ink">
                Metode pembayaran
              </h2>
              <p className="mt-2 text-sm text-ink-soft">Semua transaksi diproses melalui gateway bersertifikat PCI-DSS.</p>
              <div className="mt-5 space-y-3">
                {activeMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethodId(method.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl border p-3.5 text-left transition",
                      paymentMethodId === method.id ? "border-brand-600 bg-brand-50/40 shadow-soft" : "border-sand-200 bg-white hover:border-brand-300"
                    )}
                  >
                    <span
                      className={cn(
                        "grid h-10 w-10 shrink-0 place-items-center rounded-full",
                        paymentMethodId === method.id ? "bg-brand-600 text-white" : "bg-sand-100 text-ink-soft"
                      )}
                    >
                      <Icon name={method.id === "qris" ? "qr" : method.id === "card" ? "credit-card" : method.id === "cod" ? "wallet" : "bank"} size={17} />
                    </span>
                    <span className="flex-1">
                      <span className="block text-[13px] font-bold text-ink">{method.name}</span>
                      <span className="block text-xs text-ink-muted">{method.description}</span>
                    </span>
                    <span
                      className={cn(
                        "grid h-5 w-5 place-items-center rounded-full border",
                        paymentMethodId === method.id ? "border-brand-600 bg-brand-600 text-white" : "border-sand-300"
                      )}
                    >
                      {paymentMethodId === method.id && <Icon name="check" size={11} />}
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-4 rounded-xl border border-sand-200 bg-white p-4">
                <Checkbox
                  checked={agree}
                  onChange={setAgree}
                  label="Saya menyetujui syarat & ketentuan serta kebijakan privasi tokobagus.com."
                  description="Pesanan akan diproses setelah pembayaran terverifikasi. Anda dapat membatalkan dalam 2 jam."
                />
              </div>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                <Button size="lg" variant="outline" onClick={() => setStep(1)}>
                  <Icon name="arrow-left" size={16} /> Kembali
                </Button>
                <Button size="lg" loading={processing} onClick={placeOrder}>
                  Buat pesanan — {formatIDR(total)}
                </Button>
              </div>
            </section>
          )}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="overflow-hidden rounded-xl border border-sand-200 bg-white">
            <div className="border-b border-sand-200 px-4 py-3.5 sm:px-5">
              <h2 className="text-[12px] font-extrabold text-ink">Ringkasan pesanan</h2>
            </div>
            <ul className="max-h-72 space-y-3 overflow-y-auto px-4 py-4 sm:px-5">
              {items.map((item) => (
                <li key={`${item.productId}-${item.variantId}`} className="flex gap-3">
                  <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-sand-50">
                    <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
                    <span className="absolute right-0 top-0 grid h-5 min-w-5 place-items-center rounded-bl-lg bg-brand-600 px-1 text-[9px] font-bold text-white">
                      {item.qty}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-[12px] font-semibold leading-snug text-ink">{item.name}</p>
                    {item.variantName && <p className="mt-0.5 text-[10px] text-ink-muted">{item.variantName}</p>}
                  </div>
                  <span className="text-[12px] font-bold text-brand-600">{formatIDR(item.price * item.qty)}</span>
                </li>
              ))}
            </ul>
            <Divider />
            <dl className="space-y-2.5 px-4 py-4 text-[12px] sm:px-5">
              <div className="flex justify-between gap-3">
                <dt className="text-ink-soft">Subtotal</dt>
                <dd className="font-semibold text-ink">{formatIDR(subtotal)}</dd>
              </div>
              {discount > 0 && (
                <div className="flex justify-between gap-3">
                  <dt className="text-ink-soft">Voucher {coupon?.code}</dt>
                  <dd className="font-semibold text-success">−{formatIDR(discount)}</dd>
                </div>
              )}
              <div className="flex justify-between gap-3">
                <dt className="text-ink-soft">Pengiriman — {courier.name}</dt>
                <dd className="font-semibold text-ink">{shippingCost === 0 ? "Gratis" : formatIDR(shippingCost)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-ink-soft">PPN {settings.taxPercent}%</dt>
                <dd className="text-xs text-ink-muted">Termasuk</dd>
              </div>
            </dl>
            <div className="flex items-end justify-between gap-3 border-t border-sand-200 bg-sand-50 px-4 py-4 sm:px-5">
              <span className="text-[12px] font-semibold text-ink-soft">Total bayar</span>
              <span className="text-xl font-extrabold text-brand-600">{formatIDR(total)}</span>
            </div>
          </div>

          <div className="mt-3 space-y-2 rounded-xl bg-sand-50 p-3.5 text-[10px] leading-relaxed text-ink-muted">
            <p className="flex items-start gap-2">
              <Icon name="lock" size={14} className="mt-0.5 shrink-0 text-brand-600" /> Data Anda dienkripsi dan tidak dibagikan ke pihak ketiga.
            </p>
            <p className="flex items-start gap-2">
              <Icon name="headset" size={14} className="mt-0.5 shrink-0 text-brand-600" /> Butuh bantuan? Hubungi kami di {settings.phone}.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
