import type { Category, Coupon, Product, Review } from "@/types";

const img = (seed: string) =>
  `https://picsum.photos/seed/${seed}/800/800`;

export const categories: Category[] = [
  { id: "c1", name: "Fashion Pria", slug: "fashion-pria", parentId: null, image: img("cat-pria") },
  { id: "c2", name: "Fashion Wanita", slug: "fashion-wanita", parentId: null, image: img("cat-wanita") },
  { id: "c3", name: "Sepatu", slug: "sepatu", parentId: null, image: img("cat-sepatu") },
  { id: "c4", name: "Tas & Aksesoris", slug: "tas-aksesoris", parentId: null, image: img("cat-tas") },
  { id: "c5", name: "Elektronik", slug: "elektronik", parentId: null, image: img("cat-elek") },
  { id: "c6", name: "Kecantikan", slug: "kecantikan", parentId: null, image: img("cat-beauty") },
  { id: "c7", name: "Kemeja", slug: "kemeja", parentId: "c1", image: img("cat-kemeja") },
  { id: "c8", name: "Dress", slug: "dress", parentId: "c2", image: img("cat-dress") },
];

function variant(
  pid: string,
  name: string,
  priceDelta: number,
  stock: number,
  options: { name: string; value: string }[],
  base: number,
  seed: string
) {
  return {
    id: `${pid}-${name.toLowerCase().replace(/\s+/g, "-")}`,
    sku: `SKU-${pid.toUpperCase()}-${name.toUpperCase().replace(/\s+/g, "")}`,
    name,
    price: base + priceDelta,
    stock,
    imageUrl: img(seed),
    options,
  };
}

export const products: Product[] = [
  {
    id: "p1",
    name: "Sepatu Lari Pria AirZoom Hitam",
    slug: "sepatu-lari-pria-hitam",
    description:
      "Sepatu lari ringan dengan bantalan responsif untuk kenyamanan harian. Material mesh breathable, sol anti-slip, cocok untuk lari dan aktivitas kasual.\n\nSpesifikasi:\n- Material: Mesh + sintetis\n- Sol: EVA + rubber\n- Berat: 280 gram/sepatu\n- Perawatan: cuci manual, jemur angin",
    categoryId: "c3",
    tags: ["sepatu", "lari", "pria", "sport"],
    basePrice: 499000,
    comparePrice: 699000,
    weight: 800,
    status: "active",
    isFeatured: true,
    isBestSeller: true,
    rating: 4.8,
    reviewCount: 1243,
    sold: 5200,
    images: [
      { id: "p1-1", url: img("sepatu1a"), alt: "Sepatu tampak depan" },
      { id: "p1-2", url: img("sepatu1b"), alt: "Sepatu tampak samping" },
      { id: "p1-3", url: img("sepatu1c"), alt: "Detail sol sepatu" },
    ],
    variants: [
      variant("p1", "39", 0, 12, [{ name: "Ukuran", value: "39" }], 499000, "sep39"),
      variant("p1", "40", 0, 20, [{ name: "Ukuran", value: "40" }], 499000, "sep40"),
      variant("p1", "41", 0, 0, [{ name: "Ukuran", value: "41" }], 499000, "sep41"),
      variant("p1", "42", 0, 8, [{ name: "Ukuran", value: "42" }], 499000, "sep42"),
      variant("p1", "43", 0, 15, [{ name: "Ukuran", value: "43" }], 499000, "sep43"),
    ],
    createdAt: "2026-06-01T00:00:00Z",
  },
  {
    id: "p2",
    name: "Kemeja Flanel Pria Premium",
    slug: "kemeja-flanel-pria-premium",
    description: "Kemeja flanel katun premium, adem dan tidak mudah kusut. Potongan regular fit cocok untuk kasual maupun semi-formal.",
    categoryId: "c1",
    tags: ["kemeja", "pria", "flanel"],
    basePrice: 189000,
    comparePrice: 259000,
    weight: 300,
    status: "active",
    isFeatured: true,
    isNew: true,
    rating: 4.7,
    reviewCount: 486,
    sold: 2100,
    images: [
      { id: "p2-1", url: img("kemeja1"), alt: "Kemeja flanel" },
      { id: "p2-2", url: img("kemeja2"), alt: "Detail kain" },
    ],
    variants: [
      variant("p2", "Merah-M", 0, 30, [{ name: "Warna", value: "Merah" }, { name: "Ukuran", value: "M" }], 189000, "kem1"),
      variant("p2", "Merah-L", 0, 25, [{ name: "Warna", value: "Merah" }, { name: "Ukuran", value: "L" }], 189000, "kem2"),
      variant("p2", "Biru-M", 0, 18, [{ name: "Warna", value: "Biru" }, { name: "Ukuran", value: "M" }], 189000, "kem3"),
      variant("p2", "Biru-L", 10000, 10, [{ name: "Warna", value: "Biru" }, { name: "Ukuran", value: "L" }], 189000, "kem4"),
    ],
    createdAt: "2026-08-10T00:00:00Z",
  },
  {
    id: "p3",
    name: "Dress Midi Wanita Floral",
    slug: "dress-midi-wanita-floral",
    description: "Dress midi motif floral dengan bahan rayon premium yang jatuh dan adem. Dilengkapi resleting belakang dan kantong samping.",
    categoryId: "c2",
    tags: ["dress", "wanita", "floral"],
    basePrice: 229000,
    weight: 350,
    status: "active",
    isFeatured: true,
    isNew: true,
    rating: 4.9,
    reviewCount: 812,
    sold: 3400,
    images: [
      { id: "p3-1", url: img("dress1"), alt: "Dress floral" },
      { id: "p3-2", url: img("dress2"), alt: "Detail motif" },
    ],
    variants: [
      variant("p3", "S", 0, 22, [{ name: "Ukuran", value: "S" }], 229000, "dress-s"),
      variant("p3", "M", 0, 30, [{ name: "Ukuran", value: "M" }], 229000, "dress-m"),
      variant("p3", "L", 0, 14, [{ name: "Ukuran", value: "L" }], 229000, "dress-l"),
    ],
    createdAt: "2026-07-20T00:00:00Z",
  },
  {
    id: "p4",
    name: "Tas Selempang Kulit Sintetis",
    slug: "tas-selempang-kulit-sintetis",
    description: "Tas selempang unisex berbahan kulit sintetis premium, jahitan rapi, tali adjustable. Muat dompet, HP, dan powerbank.",
    categoryId: "c4",
    tags: ["tas", "selempang"],
    basePrice: 159000,
    comparePrice: 219000,
    weight: 400,
    status: "active",
    isBestSeller: true,
    rating: 4.6,
    reviewCount: 654,
    sold: 4800,
    images: [{ id: "p4-1", url: img("tas1"), alt: "Tas selempang" }],
    variants: [
      variant("p4", "Hitam", 0, 40, [{ name: "Warna", value: "Hitam" }], 159000, "tas-hitam"),
      variant("p4", "Coklat", 0, 35, [{ name: "Warna", value: "Coklat" }], 159000, "tas-coklat"),
    ],
    createdAt: "2026-05-11T00:00:00Z",
  },
  {
    id: "p5",
    name: "TWS Earbuds Pro Noise Cancelling",
    slug: "tws-earbuds-pro-nc",
    description: "TWS dengan Active Noise Cancelling, baterai 36 jam dengan casing, Bluetooth 5.3, dan mode low-latency untuk gaming.",
    categoryId: "c5",
    tags: ["tws", "audio", "elektronik"],
    basePrice: 349000,
    comparePrice: 599000,
    weight: 200,
    status: "active",
    isFeatured: true,
    isBestSeller: true,
    rating: 4.7,
    reviewCount: 2105,
    sold: 8900,
    images: [
      { id: "p5-1", url: img("tws1"), alt: "TWS earbuds" },
      { id: "p5-2", url: img("tws2"), alt: "Charging case" },
    ],
    variants: [
      variant("p5", "Putih", 0, 60, [{ name: "Warna", value: "Putih" }], 349000, "tws-putih"),
      variant("p5", "Hitam", 0, 55, [{ name: "Warna", value: "Hitam" }], 349000, "tws-hitam"),
    ],
    createdAt: "2026-04-02T00:00:00Z",
  },
  {
    id: "p6",
    name: "Serum Wajah Niacinamide 10%",
    slug: "serum-wajah-niacinamide",
    description: "Serum niacinamide 10% + zinc untuk mencerahkan dan mengontrol minyak. Cocok untuk semua jenis kulit, BPOM certified.",
    categoryId: "c6",
    tags: ["skincare", "serum"],
    basePrice: 99000,
    weight: 100,
    status: "active",
    isNew: true,
    rating: 4.8,
    reviewCount: 3320,
    sold: 15000,
    images: [{ id: "p6-1", url: img("serum1"), alt: "Serum wajah" }],
    variants: [variant("p6", "30ml", 0, 200, [{ name: "Ukuran", value: "30ml" }], 99000, "serum30")],
    createdAt: "2026-08-01T00:00:00Z",
  },
  {
    id: "p7",
    name: "Sneakers Putih Unisex Classic",
    slug: "sneakers-putih-unisex",
    description: "Sneakers putih klasik yang mudah dipadukan dengan outfit apapun. Sol karet empuk dan awet.",
    categoryId: "c3",
    tags: ["sneakers", "sepatu"],
    basePrice: 279000,
    comparePrice: 349000,
    weight: 750,
    status: "active",
    rating: 4.5,
    reviewCount: 321,
    sold: 1200,
    images: [{ id: "p7-1", url: img("sneak1"), alt: "Sneakers putih" }],
    variants: [
      variant("p7", "40", 0, 0, [{ name: "Ukuran", value: "40" }], 279000, "snk40"),
      variant("p7", "41", 0, 9, [{ name: "Ukuran", value: "41" }], 279000, "snk41"),
      variant("p7", "42", 0, 11, [{ name: "Ukuran", value: "42" }], 279000, "snk42"),
    ],
    createdAt: "2026-03-15T00:00:00Z",
  },
  {
    id: "p8",
    name: "Jam Tangan Analog Minimalis",
    slug: "jam-tangan-analog-minimalis",
    description: "Jam tangan analog dengan desain minimalis, tali kulit asli, dan mesin quartz Jepang. Tahan cipratan air.",
    categoryId: "c4",
    tags: ["jam", "aksesoris"],
    basePrice: 429000,
    weight: 250,
    status: "active",
    isFeatured: true,
    rating: 4.9,
    reviewCount: 187,
    sold: 640,
    images: [{ id: "p8-1", url: img("jam1"), alt: "Jam tangan" }],
    variants: [
      variant("p8", "Coklat", 0, 16, [{ name: "Warna", value: "Coklat" }], 429000, "jam-coklat"),
      variant("p8", "Hitam", 0, 12, [{ name: "Warna", value: "Hitam" }], 429000, "jam-hitam"),
    ],
    createdAt: "2026-02-20T00:00:00Z",
  },
];

export const coupons: Coupon[] = [
  { id: "k1", code: "HEMAT10", type: "percent", value: 10, minPurchase: 100000, maxDiscount: 50000, isActive: true },
  { id: "k2", code: "POTONGAN20RB", type: "fixed", value: 20000, minPurchase: 150000, isActive: true },
  { id: "k3", code: "GRATISONGKIR", type: "freeship", value: 0, minPurchase: 50000, isActive: true },
];

export const reviews: Review[] = [
  { id: "r1", productId: "p1", user: "Andini P.", rating: 5, comment: "Nyaman banget dipakai lari pagi, ukuran pas!", date: "2026-09-01" },
  { id: "r2", productId: "p1", user: "Budi S.", rating: 4, comment: "Bagus, pengiriman cepat. Cuma box agak penyok.", date: "2026-08-28" },
  { id: "r3", productId: "p5", user: "Citra", rating: 5, comment: "ANC-nya mantap untuk harga segini.", date: "2026-09-05" },
];

export const couriers = [
  { id: "jne-reg", name: "JNE REG", etd: "2-3 hari", cost: 12000 },
  { id: "jnt-ez", name: "J&T Express", etd: "1-2 hari", cost: 14000 },
  { id: "sicepat", name: "SiCepat REG", etd: "2 hari", cost: 11000 },
  { id: "gosend", name: "GoSend SameDay", etd: "6-8 jam", cost: 25000 },
];

export const paymentMethods = [
  { id: "va-bca", name: "Virtual Account BCA", desc: "Cek otomatis via webhook" },
  { id: "qris", name: "QRIS", desc: "Semua e-wallet & m-banking" },
  { id: "gopay", name: "GoPay", desc: "Saldo GoPay" },
  { id: "cod", name: "COD", desc: "Bayar tunai saat paket tiba" },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug || p.id === slug);
}

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug || c.id === slug);
}
