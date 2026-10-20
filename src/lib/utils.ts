import type { Coupon, OrderStatus, PaymentStatus, Product } from "@/types";

export function formatIDR(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("id-ID").format(value);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days <= 0) return "Hari ini";
  if (days === 1) return "Kemarin";
  if (days < 30) return `${days} hari lalu`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} bulan lalu`;
  return `${Math.floor(months / 12)} tahun lalu`;
}

export function discountPercent(price: number, compareAt?: number) {
  if (!compareAt || compareAt <= price) return 0;
  return Math.round((1 - price / compareAt) * 100);
}

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Menunggu Pembayaran",
  paid: "Dibayar",
  processing: "Diproses",
  shipped: "Dikirim",
  completed: "Selesai",
  cancelled: "Dibatalkan",
  returned: "Dikembalikan",
};

export const ORDER_STATUS_COLOR: Record<OrderStatus, string> = {
  pending: "bg-brass-100 text-brass-800",
  paid: "bg-[#e3ebf0] text-[#3a5a6b]",
  processing: "bg-olive-100 text-olive-800",
  shipped: "bg-[#e6ece2] text-success",
  completed: "bg-[#e0e9dd] text-[#3f5a3a]",
  cancelled: "bg-[#f6e4df] text-danger",
  returned: "bg-sand-100 text-ink-soft",
};

export const ORDER_STATUS_FLOW: OrderStatus[] = ["pending", "paid", "processing", "shipped", "completed"];

export const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  unpaid: "Belum dibayar",
  paid: "Lunas",
  refunded: "Dana dikembalikan",
  cod: "Bayar di tempat",
};

export function calcCouponDiscount(subtotal: number, coupon?: Coupon | null) {
  if (!coupon || !coupon.isActive || subtotal < coupon.minPurchase) return 0;
  if (coupon.type === "percent") {
    const raw = Math.round((subtotal * coupon.value) / 100);
    return coupon.maxDiscount ? Math.min(raw, coupon.maxDiscount) : raw;
  }
  if (coupon.type === "fixed") return Math.min(coupon.value, subtotal);
  return 0;
}

export function isFreeShipping(subtotal: number, coupon?: Coupon | null, threshold = 0) {
  if (threshold > 0 && subtotal >= threshold) return true;
  return Boolean(coupon && coupon.type === "freeship" && coupon.isActive && subtotal >= coupon.minPurchase);
}

export function couponRejectionReason(subtotal: number, coupon?: Coupon | null) {
  if (!coupon) return "Kode voucher tidak ditemukan.";
  if (!coupon.isActive) return "Voucher sudah tidak aktif.";
  if (coupon.expiresAt && new Date(coupon.expiresAt).getTime() < Date.now()) return "Voucher sudah kedaluwarsa.";
  if (subtotal < coupon.minPurchase) {
    return `Minimal belanja Rp${coupon.minPurchase.toLocaleString("id-ID")} untuk memakai voucher ini.`;
  }
  return null;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function generateOrderId() {
  const now = new Date();
  const stamp = `${String(now.getFullYear()).slice(2)}${String(now.getMonth() + 1).padStart(2, "0")}`;
  const random = Math.floor(1000 + Math.random() * 9000);
  return `TBG-${stamp}-${random}`;
}

export function generateId(prefix = "id") {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function maskEmail(email: string) {
  const [name, domain] = email.split("@");
  if (!domain) return email;
  const visible = name.slice(0, 2);
  return `${visible}${"*".repeat(Math.max(1, name.length - 2))}@${domain}`;
}

export function estimateDelivery(etd?: string) {
  const days = etd?.match(/\d+/g)?.map(Number) ?? [2, 4];
  const start = new Date(Date.now() + (days[0] ?? 2) * 86400000);
  const end = new Date(Date.now() + (days[days.length - 1] ?? 4) * 86400000);
  const format = (date: Date) => date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
  return `${format(start)} – ${format(end)}`;
}

export function readingTime(text: string) {
  const words = text.split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 200))} menit`;
}

export function productStock(product: Product) {
  return product.variants.reduce((total, variant) => total + variant.stock, 0);
}

export function soldPercent(product: Product) {
  const stock = productStock(product);
  const total = stock + product.sold;
  if (total <= 0) return 0;
  return Math.min(96, Math.max(12, Math.round((product.sold / total) * 100)));
}

export function recommendProducts(
  products: Product[],
  seedIds: string[],
  limit = 8
) {
  const active = products.filter((product) => product.status === "active");
  const seeds = seedIds
    .map((id) => active.find((product) => product.id === id))
    .filter((product): product is Product => Boolean(product));
  const seedCategories = new Set(seeds.map((product) => product.categoryId));
  const seedBrands = new Set(seeds.map((product) => product.brand));
  const seedTags = new Set(seeds.flatMap((product) => product.tags));

  return [...active]
    .filter((product) => !seedIds.includes(product.id))
    .map((product) => {
      let score = product.rating * 2 + Math.min(product.sold, 3000) / 400;
      if (seedCategories.has(product.categoryId)) score += 14;
      if (seedBrands.has(product.brand)) score += 6;
      score += product.tags.filter((tag) => seedTags.has(tag)).length * 3;
      if (product.comparePrice && product.comparePrice > product.basePrice) score += 2;
      return { product, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.product);
}
