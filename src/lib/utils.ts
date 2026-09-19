export function formatIDR(n: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(n);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export const ORDER_STATUS_LABEL: Record<string, string> = {
  pending: "Menunggu Pembayaran",
  paid: "Dibayar",
  processing: "Diproses",
  shipped: "Dikirim",
  completed: "Selesai",
  cancelled: "Dibatalkan",
  returned: "Dikembalikan",
};

export const ORDER_STATUS_COLOR: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  paid: "bg-blue-100 text-blue-800",
  processing: "bg-violet-100 text-violet-800",
  shipped: "bg-sky-100 text-sky-800",
  completed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-800",
  returned: "bg-gray-200 text-gray-700",
};

export function calcDiscount(subtotal: number, couponCode: string | undefined | null): number {
  if (!couponCode) return 0;
  const code = couponCode.trim().toUpperCase();
  if (code === "HEMAT10") return Math.min(Math.round(subtotal * 0.1), 50000);
  if (code === "POTONGAN20RB" && subtotal >= 150000) return 20000;
  if (code === "GRATISONGKIR") return 0;
  return 0;
}

export function freeShipping(couponCode: string | undefined | null): boolean {
  return (couponCode ?? "").trim().toUpperCase() === "GRATISONGKIR";
}
