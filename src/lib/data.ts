import type {
  Banner,
  Category,
  Courier,
  Coupon,
  FaqItem,
  JournalPost,
  NotificationItem,
  Order,
  Product,
  ProductVariant,
  Profile,
  Review,
  SavedAddress,
  StoreSettings,
  Testimonial,
} from "@/types";

const productImage = (name: string) => `/images/products/${name}.webp`;

export const categories: Category[] = [
  {
    id: "c-living",
    name: "Living",
    slug: "living",
    parentId: null,
    image: "/images/categories/living.webp",
    tagline: "Ruang yang menenangkan",
    description:
      "Perabot, pencahayaan, dan objek dekoratif dengan material natural untuk rumah yang terasa personal dan tenang.",
  },
  {
    id: "c-fashion",
    name: "Fashion",
    slug: "fashion",
    parentId: null,
    image: "/images/categories/fashion.webp",
    tagline: "Siluet yang bertahan lama",
    description:
      "Bahan katun organik, linen, dan sutra dengan potongan yang dirancang melampaui musim tren.",
  },
  {
    id: "c-footwear",
    name: "Footwear",
    slug: "footwear",
    parentId: null,
    image: "/images/categories/footwear.webp",
    tagline: "Langkah yang nyaman",
    description:
      "Sepatu dengan konstruksi kulit premium dan sol yang dirancang untuk pemakaian harian bertahun-tahun.",
  },
  {
    id: "c-tech",
    name: "Tech & Audio",
    slug: "tech",
    parentId: null,
    image: "/images/categories/tech.webp",
    tagline: "Teknologi yang menyatu",
    description:
      "Perangkat audio dan kamera pilihan dengan desain bersih yang menyatu dengan interior Anda.",
  },
  {
    id: "c-beauty",
    name: "Beauty",
    slug: "beauty",
    parentId: null,
    image: "/images/categories/beauty.webp",
    tagline: "Ritual harian",
    description:
      "Formulasi sederhana dengan bahan aktif teruji, tanpa aroma berlebihan, untuk ritual perawatan yang jujur.",
  },
  {
    id: "c-accessories",
    name: "Accessories",
    slug: "accessories",
    parentId: null,
    image: "/images/categories/accessories.webp",
    tagline: "Detail yang berarti",
    description:
      "Jam, tas, dan perhiasan yang menjadi penutup sempurna dari setiap tampilan.",
  },
];

function variant(
  productId: string,
  name: string,
  price: number,
  stock: number,
  options: { name: string; value: string }[],
  imageUrl?: string
): ProductVariant {
  return {
    id: `${productId}-${name.toLowerCase().replace(/\s+/g, "-")}`,
    sku: `TBG-${productId.replace("p-", "").toUpperCase()}-${name.toUpperCase().replace(/[^A-Z0-9]/g, "")}`,
    name,
    price,
    stock,
    imageUrl,
    options,
  };
}

export const products: Product[] = [
  {
    id: "p-arc-sneakers",
    name: "Arc Low-Top Sneakers",
    slug: "arc-low-top-sneakers",
    brand: "tokobagus.com Studio",
    tagline: "Sneakers kulit lembut dengan sol karet daur ulang",
    description:
      "Arc dibuat dari kulit napa lembut yang menyesuaikan bentuk kaki setelah beberapa kali pemakaian. Sol karet daur ulang memberi traksi ringan, sementara bantalan karet alam menjaga kenyamanan sepanjang hari.",
    story:
      "Diproduksi di Bandung oleh pengrajin generasi ketiga dengan standar konstruksi Goodyear welt, sehingga sepatu dapat disol ulang dan dipakai bertahun-tahun.",
    categoryId: "c-footwear",
    tags: ["sneakers", "kulit", "unisex"],
    basePrice: 1249000,
    comparePrice: 1599000,
    weight: 780,
    status: "active",
    isFeatured: true,
    isBestSeller: true,
    rating: 4.8,
    reviewCount: 214,
    sold: 1860,
    images: [
      { id: "p-arc-1", url: productImage("sneakers-arc"), alt: "Arc Low-Top Sneakers tampak samping" },
      { id: "p-arc-2", url: productImage("sneaker-detail"), alt: "Detail jahitan sneakers" },
      { id: "p-arc-3", url: productImage("shoe-rack"), alt: "Arc sneakers dalam koleksi" },
    ],
    variants: [
      variant("p-arc", "36", 1249000, 8, [{ name: "Ukuran", value: "36" }]),
      variant("p-arc", "37", 1249000, 12, [{ name: "Ukuran", value: "37" }]),
      variant("p-arc", "38", 1249000, 21, [{ name: "Ukuran", value: "38" }]),
      variant("p-arc", "39", 1249000, 16, [{ name: "Ukuran", value: "39" }]),
      variant("p-arc", "40", 1249000, 9, [{ name: "Ukuran", value: "40" }]),
      variant("p-arc", "41", 1249000, 4, [{ name: "Ukuran", value: "41" }]),
    ],
    highlights: ["Kulit napa bersertifikat LWG", "Sol karet daur ulang", "Bisa disol ulang", "Insole memory foam"],
    specs: [
      { label: "Material", value: "Kulit napa premium" },
      { label: "Sol", value: "Karet daur ulang" },
      { label: "Berat", value: "390 gram per sepatu" },
      { label: "Perawatan", value: "Bersihkan dengan kain lembap" },
    ],
    createdAt: "2026-08-24T00:00:00Z",
  },
  {
    id: "p-linen-shirt",
    name: "Atelier Linen Shirt",
    slug: "atelier-linen-shirt",
    brand: "tokobagus.com Atelier",
    tagline: "Kemeja linen 100% dengan potongan relaxed",
    description:
      "Ditenun dari linen Eropa 100%, kemeja ini ringan, breathable, dan menjadi lebih lembut setiap kali dicuci. Potongan relaxed dengan kancing kerang membuatnya tepat untuk iklim tropis.",
    story:
      "Setiap kemeja dijahit dalam batch kecil di studio kami di Yogyakarta, menggunakan sisa kain yang dikelola untuk meminimalkan limbah.",
    categoryId: "c-fashion",
    tags: ["kemeja", "linen", "pria", "wanita"],
    basePrice: 649000,
    comparePrice: 849000,
    weight: 300,
    status: "active",
    isFeatured: true,
    isNew: true,
    rating: 4.7,
    reviewCount: 96,
    sold: 720,
    images: [
      { id: "p-linen-1", url: productImage("linen-shirt"), alt: "Atelier Linen Shirt" },
      { id: "p-linen-2", url: productImage("fashion-rail"), alt: "Koleksi kemeja linen" },
      { id: "p-linen-3", url: productImage("wardrobe"), alt: "Kemeja linen di lemari" },
    ],
    variants: [
      variant("p-linen", "Ivory-S", 649000, 14, [{ name: "Warna", value: "Ivory" }, { name: "Ukuran", value: "S" }]),
      variant("p-linen", "Ivory-M", 649000, 22, [{ name: "Warna", value: "Ivory" }, { name: "Ukuran", value: "M" }]),
      variant("p-linen", "Ivory-L", 649000, 16, [{ name: "Warna", value: "Ivory" }, { name: "Ukuran", value: "L" }]),
      variant("p-linen", "Olive-M", 649000, 12, [{ name: "Warna", value: "Olive" }, { name: "Ukuran", value: "M" }]),
      variant("p-linen", "Olive-L", 649000, 7, [{ name: "Warna", value: "Olive" }, { name: "Ukuran", value: "L" }]),
    ],
    highlights: ["Linen Eropa 100%", "Kancing kerang alami", "Diproduksi batch kecil", "Pre-shrunk"],
    specs: [
      { label: "Material", value: "100% linen" },
      { label: "Potongan", value: "Relaxed fit" },
      { label: "Perawatan", value: "Cuci mesin 30°C" },
      { label: "Asal", value: "Yogyakarta, Indonesia" },
    ],
    createdAt: "2026-09-18T00:00:00Z",
  },
  {
    id: "p-silk-dress",
    name: "Solstice Silk Dress",
    slug: "solstice-silk-dress",
    brand: "tokobagus.com Atelier",
    tagline: "Dress midi sutra dengan drape lembut",
    description:
      "Dress midi dengan lapisan sutra yang jatuh mengikuti bentuk tubuh. Siluet A-line, tanpa lengan, dengan resleting tersembunyi dan saku dalam di kedua sisi.",
    story:
      "Sutra diperoleh dari pemasok yang mempekerjakan penenun lokal dengan upah adil, lalu dicelup menggunakan pewarna alami.",
    categoryId: "c-fashion",
    tags: ["dress", "sutra", "wanita"],
    basePrice: 1890000,
    weight: 320,
    status: "active",
    isFeatured: true,
    rating: 4.9,
    reviewCount: 64,
    sold: 410,
    images: [
      { id: "p-dress-1", url: productImage("silk-dress"), alt: "Solstice Silk Dress" },
      { id: "p-dress-2", url: productImage("fashion-store"), alt: "Dress dalam editorial" },
      { id: "p-dress-3", url: productImage("wardrobe"), alt: "Detail kain sutra" },
    ],
    variants: [
      variant("p-silk", "Champagne-S", 1890000, 6, [{ name: "Warna", value: "Champagne" }, { name: "Ukuran", value: "S" }]),
      variant("p-silk", "Champagne-M", 1890000, 9, [{ name: "Warna", value: "Champagne" }, { name: "Ukuran", value: "M" }]),
      variant("p-silk", "Champagne-L", 1890000, 5, [{ name: "Warna", value: "Champagne" }, { name: "Ukuran", value: "L" }]),
      variant("p-silk", "Ink-M", 1890000, 4, [{ name: "Warna", value: "Ink" }, { name: "Ukuran", value: "M" }]),
    ],
    highlights: ["Sutra mulberry", "Pewarna alami", "Saku dalam", "Dijahit tangan bagian tepi"],
    specs: [
      { label: "Material", value: "100% sutra mulberry" },
      { label: "Potongan", value: "A-line midi" },
      { label: "Perawatan", value: "Dry clean" },
      { label: "Asal", value: "Yogyakarta, Indonesia" },
    ],
    createdAt: "2026-07-30T00:00:00Z",
  },
  {
    id: "p-leather-tote",
    name: "Noir Leather Tote",
    slug: "noir-leather-tote",
    brand: "tokobagus.com Studio",
    tagline: "Tote kulit full-grain dengan usia yang cantik",
    description:
      "Tote harian berkapasitas laptop 14 inci, dibuat dari kulit full-grain yang menua dengan patina indah. Dilengkapi kantong dalam, gantungan kunci, dan jahitan rangkap pada titik tarik.",
    story:
      "Kulit disamak nabati selama 30 hari tanpa krom, menjadikannya lebih aman bagi pengrajin dan lingkungan.",
    categoryId: "c-accessories",
    tags: ["tas", "kulit", "tote"],
    basePrice: 2450000,
    comparePrice: 2890000,
    weight: 900,
    status: "active",
    isFeatured: true,
    isBestSeller: true,
    rating: 4.8,
    reviewCount: 132,
    sold: 980,
    images: [
      { id: "p-tote-1", url: productImage("leather-tote"), alt: "Noir Leather Tote" },
      { id: "p-tote-2", url: productImage("tote-detail"), alt: "Detail kulit tote" },
      { id: "p-tote-3", url: productImage("fashion-store"), alt: "Tote dalam tampilan harian" },
    ],
    variants: [
      variant("p-tote", "Black", 2450000, 18, [{ name: "Warna", value: "Black" }]),
      variant("p-tote", "Espresso", 2450000, 11, [{ name: "Warna", value: "Espresso" }]),
      variant("p-tote", "Tan", 2450000, 6, [{ name: "Warna", value: "Tan" }]),
    ],
    highlights: ["Kulit full-grain", "Samak nabati", "Muat laptop 14 inci", "Garansi jahitan 2 tahun"],
    specs: [
      { label: "Material", value: "Kulit full-grain" },
      { label: "Dimensi", value: "38 × 30 × 12 cm" },
      { label: "Berat", value: "900 gram" },
      { label: "Asal", value: "Bandung, Indonesia" },
    ],
    createdAt: "2026-06-11T00:00:00Z",
  },
  {
    id: "p-orbit-watch",
    name: "Orbit Analog Watch",
    slug: "orbit-analog-watch",
    brand: "tokobagus.com Horology",
    tagline: "Jam tangan quartz dengan dial minimalis",
    description:
      "Jam tangan dengan dial bersih, indeks tipis, dan jarum baja yang presisi. Mesin quartz Jepang, kaca sapphire anti gores, dan tali kulit yang dapat diganti tanpa alat.",
    story:
      "Dirancang di studio kami, dirakit di fasilitas mitra dengan sertifikasi kualitas dua tahap.",
    categoryId: "c-accessories",
    tags: ["jam", "kulit", "minimalis"],
    basePrice: 3200000,
    weight: 250,
    status: "active",
    isFeatured: true,
    rating: 4.9,
    reviewCount: 58,
    sold: 310,
    images: [
      { id: "p-watch-1", url: productImage("watch-orbit"), alt: "Orbit Analog Watch" },
      { id: "p-watch-2", url: productImage("watch-detail"), alt: "Detail dial jam" },
      { id: "p-watch-3", url: productImage("watch-alt"), alt: "Jam dengan tali kulit" },
    ],
    variants: [
      variant("p-watch", "Tan Strap", 3200000, 12, [{ name: "Tali", value: "Tan" }]),
      variant("p-watch", "Black Strap", 3200000, 9, [{ name: "Tali", value: "Black" }]),
      variant("p-watch", "Steel Bracelet", 3450000, 5, [{ name: "Tali", value: "Steel" }]),
    ],
    highlights: ["Mesin quartz Jepang", "Kaca sapphire", "Tahan air 5 ATM", "Quick-release strap"],
    specs: [
      { label: "Diameter", value: "38 mm" },
      { label: "Ketebalan", value: "8,4 mm" },
      { label: "Mesin", value: "Miyota Quartz" },
      { label: "Water resistance", value: "5 ATM" },
    ],
    createdAt: "2026-05-02T00:00:00Z",
  },
  {
    id: "p-lumen-headphones",
    name: "Lumen Wireless Headphones",
    slug: "lumen-wireless-headphones",
    brand: "tokobagus.com Sound",
    tagline: "Headphone over-ear dengan ANC adaptif",
    description:
      "Headphone over-ear dengan driver 40 mm, ANC adaptif, dan transparansi alami. Baterai 48 jam, pengisian cepat 10 menit untuk 5 jam pemakaian, dan bantalan protein leather yang lembut.",
    categoryId: "c-tech",
    tags: ["audio", "headphone", "anc"],
    basePrice: 2890000,
    comparePrice: 3490000,
    weight: 660,
    status: "active",
    isFeatured: true,
    isBestSeller: true,
    rating: 4.7,
    reviewCount: 187,
    sold: 1420,
    images: [
      { id: "p-lumen-1", url: productImage("headphones-lumen"), alt: "Lumen Wireless Headphones" },
      { id: "p-lumen-2", url: productImage("headphone-detail"), alt: "Detail earcup" },
      { id: "p-lumen-3", url: productImage("camera-detail"), alt: "Setup meja kerja" },
    ],
    variants: [
      variant("p-lumen", "Sand", 2890000, 24, [{ name: "Warna", value: "Sand" }]),
      variant("p-lumen", "Ink", 2890000, 19, [{ name: "Warna", value: "Ink" }]),
    ],
    highlights: ["ANC adaptif", "Baterai 48 jam", "Multipoint Bluetooth 5.3", "Bantalan protein leather"],
    specs: [
      { label: "Driver", value: "40 mm dynamic" },
      { label: "Bluetooth", value: "5.3 multipoint" },
      { label: "Baterai", value: "48 jam (ANC on)" },
      { label: "Berat", value: "268 gram" },
    ],
    createdAt: "2026-04-12T00:00:00Z",
  },
  {
    id: "p-echo-earbuds",
    name: "Echo ANC Earbuds",
    slug: "echo-anc-earbuds",
    brand: "tokobagus.com Sound",
    tagline: "TWS ringkas dengan suara hangat",
    description:
      "Earbuds dengan tuning hangat, ANC hybrid, dan tiga mikrofon untuk panggilan jernih. Casing pengisi daya nirkabel dengan baterai total 36 jam.",
    categoryId: "c-tech",
    tags: ["tws", "earbuds", "audio"],
    basePrice: 1590000,
    weight: 120,
    status: "active",
    isNew: true,
    rating: 4.6,
    reviewCount: 203,
    sold: 2680,
    images: [
      { id: "p-echo-1", url: productImage("earbuds-echo"), alt: "Echo ANC Earbuds" },
      { id: "p-echo-2", url: productImage("headphone-detail"), alt: "Detail casing earbuds" },
    ],
    variants: [
      variant("p-echo", "Ivory", 1590000, 42, [{ name: "Warna", value: "Ivory" }]),
      variant("p-echo", "Midnight", 1590000, 36, [{ name: "Warna", value: "Midnight" }]),
    ],
    highlights: ["ANC hybrid", "3 mikrofon", "Baterai 36 jam", "IPX5"],
    specs: [
      { label: "Driver", value: "10 mm" },
      { label: "Bluetooth", value: "5.3" },
      { label: "Baterai", value: "8 jam + 28 jam casing" },
      { label: "Proteksi", value: "IPX5" },
    ],
    createdAt: "2026-09-05T00:00:00Z",
  },
  {
    id: "p-studio-camera",
    name: "Studio Instant Camera",
    slug: "studio-instant-camera",
    brand: "tokobagus.com Studio",
    tagline: "Kamera instan bergaya klasik",
    description:
      "Kamera instan dengan lensa 60 mm, flash otomatis, dan mode eksposur ganda untuk hasil kreatif. Desain klasik dengan body metalik yang nyaman digenggam.",
    categoryId: "c-tech",
    tags: ["kamera", "analog", "hobi"],
    basePrice: 5750000,
    weight: 1100,
    status: "active",
    rating: 4.8,
    reviewCount: 41,
    sold: 180,
    images: [
      { id: "p-camera-1", url: productImage("camera-studio"), alt: "Studio Instant Camera" },
      { id: "p-camera-2", url: productImage("camera-detail"), alt: "Detail kamera instan" },
    ],
    variants: [
      variant("p-camera", "Graphite", 5750000, 8, [{ name: "Warna", value: "Graphite" }]),
      variant("p-camera", "Cream", 5750000, 5, [{ name: "Warna", value: "Cream" }]),
    ],
    highlights: ["Lensa 60 mm", "Mode double exposure", "Flash otomatis", "Body metalik"],
    specs: [
      { label: "Lensa", value: "60 mm f/12" },
      { label: "Fokus", value: "0,3 m ke atas" },
      { label: "Baterai", value: "2× AA" },
      { label: "Berat", value: "1,1 kg" },
    ],
    createdAt: "2026-03-15T00:00:00Z",
  },
  {
    id: "p-botanical-serum",
    name: "Botanical Glow Serum",
    slug: "botanical-glow-serum",
    brand: "tokobagus.com Botanica",
    tagline: "Serum niacinamide & centella untuk kulit lelah",
    description:
      "Serum ringan dengan niacinamide 5%, centella asiatica, dan hyaluronic acid multi-molekul. Menyamarkan pori, menenangkan kemerahan, dan menjaga hidrasi sepanjang hari.",
    story:
      "Diformulasikan tanpa alkohol, tanpa fragrance sintetis, dan diuji dermatologis pada panel kulit sensitif.",
    categoryId: "c-beauty",
    tags: ["skincare", "serum", "niacinamide"],
    basePrice: 329000,
    comparePrice: 399000,
    weight: 150,
    status: "active",
    isBestSeller: true,
    rating: 4.8,
    reviewCount: 512,
    sold: 6400,
    images: [
      { id: "p-serum-1", url: productImage("serum-botanical"), alt: "Botanical Glow Serum" },
      { id: "p-serum-2", url: productImage("beauty-flatlay"), alt: "Flatlay produk botanica" },
    ],
    variants: [
      variant("p-serum", "30 ml", 329000, 120, [{ name: "Ukuran", value: "30 ml" }]),
      variant("p-serum", "50 ml", 449000, 64, [{ name: "Ukuran", value: "50 ml" }]),
    ],
    highlights: ["Niacinamide 5%", "Centella asiatica", "Fragrance-free", "Dermatologically tested"],
    specs: [
      { label: "Volume", value: "30 ml / 50 ml" },
      { label: "Kulit", value: "Semua jenis kulit" },
      { label: "Kandungan aktif", value: "Niacinamide, centella, HA" },
      { label: "Sertifikasi", value: "BPOM & cruelty-free" },
    ],
    createdAt: "2026-08-02T00:00:00Z",
  },
  {
    id: "p-santal-parfum",
    name: "Santal Eau de Parfum",
    slug: "santal-eau-de-parfum",
    brand: "tokobagus.com Parfums",
    tagline: "Sandalwood hangat dengan vetiver dan amber",
    description:
      "Parfum dengan pembukaan bergamot yang lembut, jantung sandalwood creamy, dan basis vetiver serta amber. Konsentrasi 18% eau de parfum dengan ketahanan 8–10 jam.",
    story:
      "Dirancang bersama perfumer lokal, menggunakan bahan alami bersertifikat dan botol kaca daur ulang.",
    categoryId: "c-beauty",
    tags: ["parfum", "unisex", "sandalwood"],
    basePrice: 1150000,
    weight: 400,
    status: "active",
    isFeatured: true,
    rating: 4.9,
    reviewCount: 144,
    sold: 860,
    images: [
      { id: "p-santal-1", url: productImage("parfum-santal"), alt: "Santal Eau de Parfum" },
      { id: "p-santal-2", url: productImage("perfume-detail"), alt: "Detail botol parfum" },
      { id: "p-santal-3", url: productImage("beauty-flatlay"), alt: "Santal dalam flatlay" },
    ],
    variants: [
      variant("p-santal", "50 ml", 1150000, 34, [{ name: "Ukuran", value: "50 ml" }]),
      variant("p-santal", "100 ml", 1690000, 18, [{ name: "Ukuran", value: "100 ml" }]),
    ],
    highlights: ["Konsentrasi 18%", "Ketahanan 8–10 jam", "Bahan alami bersertifikat", "Botol daur ulang"],
    specs: [
      { label: "Notes", value: "Bergamot, sandalwood, vetiver" },
      { label: "Konsentrasi", value: "Eau de parfum 18%" },
      { label: "Ketahanan", value: "8–10 jam" },
      { label: "Volume", value: "50 ml / 100 ml" },
    ],
    createdAt: "2026-06-20T00:00:00Z",
  },
  {
    id: "p-amber-candle",
    name: "Amber & Cedar Candle",
    slug: "amber-cedar-candle",
    brand: "tokobagus.com Botanica",
    tagline: "Lilin kedelai dengan aroma kayu hangat",
    description:
      "Lilin kedelai murni dengan sumbu katun, aroma amber, cedar, dan sedikit tembakau manis. Waktu bakar 55 jam dalam wadah keramik yang dapat digunakan kembali.",
    categoryId: "c-living",
    tags: ["lilin", "dekorasi", "aroma"],
    basePrice: 389000,
    weight: 600,
    status: "active",
    isNew: true,
    rating: 4.7,
    reviewCount: 88,
    sold: 940,
    images: [
      { id: "p-candle-1", url: productImage("candle-amber"), alt: "Amber & Cedar Candle" },
      { id: "p-candle-2", url: productImage("candle-detail"), alt: "Lilin menyala" },
      { id: "p-candle-3", url: productImage("interior-detail"), alt: "Lilin dalam interior" },
    ],
    variants: [
      variant("p-candle", "220 g", 389000, 56, [{ name: "Ukuran", value: "220 g" }]),
      variant("p-candle", "450 g", 589000, 28, [{ name: "Ukuran", value: "450 g" }]),
    ],
    highlights: ["Lilin kedelai 100%", "Sumbu katun", "55 jam waktu bakar", "Wadah keramik reusable"],
    specs: [
      { label: "Material", value: "Soy wax, cotton wick" },
      { label: "Aroma", value: "Amber, cedar, tobacco" },
      { label: "Waktu bakar", value: "±55 jam" },
      { label: "Berat", value: "220 g / 450 g" },
    ],
    createdAt: "2026-09-12T00:00:00Z",
  },
  {
    id: "p-sculpt-chair",
    name: "Sculpt Lounge Chair",
    slug: "sculpt-lounge-chair",
    brand: "tokobagus.com Living",
    tagline: "Kursi lounge kayu solid dengan anyaman rotan",
    description:
      "Kursi lounge dengan rangka kayu jati solid dan sandaran anyaman rotan alami. Sudut sandaran 105° yang nyaman untuk membaca atau berbincang.",
    story:
      "Dibuat oleh pengrajin rotan di Cirebon dengan teknik anyam yang diwariskan turun-temurun.",
    categoryId: "c-living",
    tags: ["kursi", "furnitur", "rotan"],
    basePrice: 4900000,
    comparePrice: 5750000,
    weight: 9500,
    status: "active",
    isFeatured: true,
    rating: 4.8,
    reviewCount: 37,
    sold: 120,
    images: [
      { id: "p-chair-1", url: productImage("chair-sculpt"), alt: "Sculpt Lounge Chair" },
      { id: "p-chair-2", url: productImage("living-room"), alt: "Kursi dalam ruang keluarga" },
      { id: "p-chair-3", url: productImage("interior-detail"), alt: "Detail anyaman rotan" },
    ],
    variants: [
      variant("p-chair", "Natural", 4900000, 6, [{ name: "Finishing", value: "Natural" }]),
      variant("p-chair", "Walnut", 5150000, 4, [{ name: "Finishing", value: "Walnut" }]),
    ],
    highlights: ["Kayu jati solid", "Rotan alami", "Busa kepadatan tinggi", "Garansi rangka 3 tahun"],
    specs: [
      { label: "Material", value: "Jati solid & rotan" },
      { label: "Dimensi", value: "72 × 80 × 76 cm" },
      { label: "Berat", value: "9,5 kg" },
      { label: "Asal", value: "Cirebon, Indonesia" },
    ],
    createdAt: "2026-05-28T00:00:00Z",
  },
  {
    id: "p-linen-bedding",
    name: "Washed Linen Bedding Set",
    slug: "washed-linen-bedding-set",
    brand: "tokobagus.com Living",
    tagline: "Set sprei linen stone-washed",
    description:
      "Set sprei dari linen yang telah dicuci batu sehingga lembut sejak pemakaian pertama. Termasuk duvet cover, fitted sheet, dan dua sarung bantal.",
    categoryId: "c-living",
    tags: ["sprei", "linen", "kamar"],
    basePrice: 1750000,
    weight: 2200,
    status: "active",
    rating: 4.7,
    reviewCount: 73,
    sold: 480,
    images: [
      { id: "p-bedding-1", url: productImage("bedding-linen"), alt: "Washed Linen Bedding Set" },
      { id: "p-bedding-2", url: productImage("interior-detail"), alt: "Detail kain linen" },
    ],
    variants: [
      variant("p-bedding", "Queen — Sand", 1750000, 14, [{ name: "Ukuran", value: "Queen" }, { name: "Warna", value: "Sand" }]),
      variant("p-bedding", "King — Sand", 1980000, 9, [{ name: "Ukuran", value: "King" }, { name: "Warna", value: "Sand" }]),
      variant("p-bedding", "Queen — Olive", 1750000, 11, [{ name: "Ukuran", value: "Queen" }, { name: "Warna", value: "Olive" }]),
    ],
    highlights: ["Linen stone-washed", "OEKO-TEX certified", "Makin lembut tiap cuci", "Set 4 item"],
    specs: [
      { label: "Material", value: "100% linen" },
      { label: "Isi set", value: "Duvet cover, fitted sheet, 2 sarung bantal" },
      { label: "Ukuran", value: "Queen / King" },
      { label: "Perawatan", value: "Cuci mesin 40°C" },
    ],
    createdAt: "2026-07-08T00:00:00Z",
  },
  {
    id: "p-halo-lamp",
    name: "Halo Table Lamp",
    slug: "halo-table-lamp",
    brand: "tokobagus.com Living",
    tagline: "Lampu meja dengan cahaya hangat tiga tingkat",
    description:
      "Lampu meja dengan body keramik matte dan shade linen. Tiga tingkat kehangatan cahaya yang dapat diatur dengan sentuhan pada base.",
    categoryId: "c-living",
    tags: ["lampu", "dekorasi", "keramik"],
    basePrice: 1290000,
    weight: 1800,
    status: "active",
    isNew: true,
    rating: 4.6,
    reviewCount: 45,
    sold: 320,
    images: [
      { id: "p-lamp-1", url: productImage("lamp-halo"), alt: "Halo Table Lamp" },
      { id: "p-lamp-2", url: productImage("interior-detail"), alt: "Lampu dalam ruangan" },
    ],
    variants: [
      variant("p-lamp", "Ivory", 1290000, 16, [{ name: "Warna", value: "Ivory" }]),
      variant("p-lamp", "Terracotta", 1290000, 10, [{ name: "Warna", value: "Terracotta" }]),
    ],
    highlights: ["Dimmer sentuh 3 tingkat", "Body keramik", "Shade linen", "Kabel anyaman 1,8 m"],
    specs: [
      { label: "Material", value: "Keramik & linen" },
      { label: "Tinggi", value: "38 cm" },
      { label: "Bohlam", value: "E27 LED (termasuk)" },
      { label: "Daya", value: "9 W" },
    ],
    createdAt: "2026-09-20T00:00:00Z",
  },
  {
    id: "p-terra-vase",
    name: "Terra Ceramic Vase",
    slug: "terra-ceramic-vase",
    brand: "tokobagus.com Living",
    tagline: "Vas keramik handmade dengan glasir matte",
    description:
      "Vas keramik dengan bentuk organik dan glasir matte yang lembut. Setiap vas sedikit berbeda karena dibentuk dengan tangan.",
    categoryId: "c-living",
    tags: ["vas", "keramik", "dekorasi"],
    basePrice: 549000,
    weight: 1400,
    status: "active",
    rating: 4.5,
    reviewCount: 39,
    sold: 260,
    images: [
      { id: "p-vase-1", url: productImage("vase-terra"), alt: "Terra Ceramic Vase" },
      { id: "p-vase-2", url: productImage("interior-detail"), alt: "Vas di meja kayu" },
    ],
    variants: [
      variant("p-vase", "Small", 549000, 22, [{ name: "Ukuran", value: "Small" }]),
      variant("p-vase", "Tall", 749000, 13, [{ name: "Ukuran", value: "Tall" }]),
    ],
    highlights: ["Handmade", "Glasir matte food-safe", "Waterproof", "Dibuat di Kasongan"],
    specs: [
      { label: "Material", value: "Stoneware" },
      { label: "Tinggi", value: "24 cm / 34 cm" },
      { label: "Berat", value: "1,4 kg" },
      { label: "Asal", value: "Kasongan, Yogyakarta" },
    ],
    createdAt: "2026-04-22T00:00:00Z",
  },
  {
    id: "p-pour-coffee",
    name: "Pour Over Coffee Set",
    slug: "pour-over-coffee-set",
    brand: "tokobagus.com Living",
    tagline: "Set seduh manual dengan dripper keramik",
    description:
      "Set lengkap untuk menyeduh kopi manual: dripper keramik, server kaca borosilikat, dan filter stainless steel yang dapat dipakai berulang.",
    categoryId: "c-living",
    tags: ["kopi", "seduh", "keramik"],
    basePrice: 890000,
    comparePrice: 1050000,
    weight: 1600,
    status: "active",
    isBestSeller: true,
    rating: 4.8,
    reviewCount: 118,
    sold: 1450,
    images: [
      { id: "p-coffee-1", url: productImage("coffee-pour"), alt: "Pour Over Coffee Set" },
      { id: "p-coffee-2", url: productImage("interior-detail"), alt: "Set kopi di meja" },
    ],
    variants: [
      variant("p-coffee", "Sand", 890000, 26, [{ name: "Warna", value: "Sand" }]),
      variant("p-coffee", "Charcoal", 890000, 18, [{ name: "Warna", value: "Charcoal" }]),
    ],
    highlights: ["Dripper keramik", "Server borosilikat", "Filter steel reusable", "Panduan seduh"],
    specs: [
      { label: "Material", value: "Keramik, kaca borosilikat" },
      { label: "Kapasitas", value: "600 ml" },
      { label: "Isi set", value: "Dripper, server, filter" },
      { label: "Perawatan", value: "Cuci tangan" },
    ],
    createdAt: "2026-06-30T00:00:00Z",
  },
  {
    id: "p-lune-sunglasses",
    name: "Lune Acetate Sunglasses",
    slug: "lune-acetate-sunglasses",
    brand: "tokobagus.com Studio",
    tagline: "Kacamata acetate dengan lensa polarized",
    description:
      "Bingkai acetate Italia dengan lensa polarized UV400. Bentuk bulat lembut yang pas untuk berbagai bentuk wajah, dilengkapi hard case kulit.",
    categoryId: "c-accessories",
    tags: ["kacamata", "acetate", "unisex"],
    basePrice: 1050000,
    weight: 180,
    status: "active",
    rating: 4.6,
    reviewCount: 52,
    sold: 380,
    images: [
      { id: "p-lune-1", url: productImage("sunglasses-lune"), alt: "Lune Acetate Sunglasses" },
      { id: "p-lune-2", url: productImage("fashion-store"), alt: "Kacamata dalam tampilan" },
    ],
    variants: [
      variant("p-lune", "Tortoise", 1050000, 20, [{ name: "Warna", value: "Tortoise" }]),
      variant("p-lune", "Black", 1050000, 15, [{ name: "Warna", value: "Black" }]),
    ],
    highlights: ["Lensa polarized UV400", "Acetate Italia", "Hard case kulit", "Unisex fit"],
    specs: [
      { label: "Material", value: "Acetate" },
      { label: "Lensa", value: "Polarized UV400" },
      { label: "Lebar", value: "145 mm" },
      { label: "Include", value: "Hard case & kain pembersih" },
    ],
    createdAt: "2026-08-15T00:00:00Z",
  },
  {
    id: "p-aura-ring",
    name: "Aura Gold Ring",
    slug: "aura-gold-ring",
    brand: "tokobagus.com Fine",
    tagline: "Cincin perak berlapis emas 18K",
    description:
      "Cincin minimalis dari perak sterling 925 dengan lapisan emas 18K setebal 2,5 mikron. Dirancang untuk dipakai setiap hari, sendiri atau ditumpuk.",
    story:
      "Diproduksi di Bali oleh perajin perak dengan sertifikasi fair trade.",
    categoryId: "c-accessories",
    tags: ["perhiasan", "cincin", "emas"],
    basePrice: 2250000,
    weight: 60,
    status: "active",
    isNew: true,
    rating: 4.9,
    reviewCount: 29,
    sold: 190,
    images: [
      { id: "p-ring-1", url: productImage("ring-aura"), alt: "Aura Gold Ring" },
      { id: "p-ring-2", url: productImage("ring-detail"), alt: "Detail cincin emas" },
    ],
    variants: [
      variant("p-ring", "Size 12", 2250000, 8, [{ name: "Ukuran", value: "12" }]),
      variant("p-ring", "Size 14", 2250000, 11, [{ name: "Ukuran", value: "14" }]),
      variant("p-ring", "Size 16", 2250000, 6, [{ name: "Ukuran", value: "16" }]),
    ],
    highlights: ["Perak 925 lapis emas 18K", "Fair trade", "Hypoallergenic", "Garansi lapisan 1 tahun"],
    specs: [
      { label: "Material", value: "Sterling silver 925" },
      { label: "Plating", value: "Emas 18K, 2,5 mikron" },
      { label: "Berat", value: "±4 gram" },
      { label: "Perawatan", value: "Hindari parfum langsung" },
    ],
    createdAt: "2026-09-28T00:00:00Z",
  },
];

export const coupons: Coupon[] = [
  {
    id: "k-welcome",
    code: "TOKOBAGUS10",
    type: "percent",
    value: 10,
    minPurchase: 500000,
    maxDiscount: 250000,
    isActive: true,
    description: "Diskon 10% untuk pesanan pertama",
    expiresAt: "2026-12-31T23:59:59Z",
  },
  {
    id: "k-freeship",
    code: "GRATISONGKIR",
    type: "freeship",
    value: 0,
    minPurchase: 750000,
    isActive: true,
    description: "Gratis ongkir nasional",
    expiresAt: "2026-12-31T23:59:59Z",
  },
  {
    id: "k-ritual",
    code: "RITUAL50",
    type: "fixed",
    value: 50000,
    minPurchase: 300000,
    isActive: true,
    description: "Potongan Rp50.000 untuk kategori Beauty",
  },
];

export const couriers: Courier[] = [
  { id: "jne-reg", name: "JNE Reguler", etd: "2–3 hari", cost: 18000 },
  { id: "sicepat-best", name: "SiCepat BEST", etd: "1–2 hari", cost: 26000 },
  { id: "anteraja", name: "AnterAja Reguler", etd: "2–4 hari", cost: 16000 },
  { id: "gosend-same", name: "GoSend Same Day", etd: "6–8 jam (Jabodetabek)", cost: 42000 },
];

export const storeSettings: StoreSettings = {
  storeName: "tokobagus.com",
  tagline: "Curated living, considered.",
  email: "hello@tokobagus.com",
  phone: "0812-3456-7890",
  whatsapp: "6281234567890",
  address: "Jl. Cikini Raya No. 24, Jakarta Pusat",
  shippingOrigin: "Jakarta Pusat, DKI Jakarta",
  taxPercent: 11,
  freeShippingThreshold: 750000,
  paymentMethods: [
    { id: "va-bca", name: "Virtual Account BCA", description: "Verifikasi otomatis", isActive: true },
    { id: "qris", name: "QRIS", description: "Semua e-wallet & m-banking", isActive: true },
    { id: "gopay", name: "GoPay", description: "Bayar dengan saldo GoPay", isActive: true },
    { id: "card", name: "Kartu Kredit / Debit", description: "3D Secure", isActive: true },
    { id: "cod", name: "COD", description: "Bayar saat paket tiba", isActive: false },
  ],
};

export const banners: Banner[] = [
  {
    id: "b-hero-1",
    title: "Musim Baru, Ritme Baru",
    subtitle: "Koleksi Autumn dengan material alami pilihan, dibuat terbatas di Indonesia.",
    ctaLabel: "Jelajahi koleksi",
    ctaHref: "/products",
    image: "/images/editorial/hero.webp",
    isActive: true,
  },
  {
    id: "b-hero-2",
    title: "Gratis Ongkir Seluruh Indonesia",
    subtitle: "Untuk pesanan mulai Rp750.000. Tidak perlu kode khusus.",
    ctaLabel: "Mulai belanja",
    ctaHref: "/products?sort=new",
    image: "/images/editorial/story.webp",
    isActive: true,
  },
];

const reviewSeed: { user: string; rating: number; title: string; comment: string; date: string }[] = [
  {
    user: "Alya R.",
    rating: 5,
    title: "Kualitasnya terasa mahal",
    comment:
      "Packaging rapi sekali dan materialnya sesuai deskripsi. Sudah dipakai seminggu dan masih terlihat seperti baru.",
    date: "2026-09-28",
  },
  {
    user: "Bramantyo",
    rating: 5,
    title: "Worth it",
    comment:
      "Awalnya ragu belanja online, tapi kualitasnya melebihi ekspektasi. Pengiriman juga cepat, hanya 2 hari ke Surabaya.",
    date: "2026-09-21",
  },
  {
    user: "Citra M.",
    rating: 4,
    title: "Bagus, kemasan bisa lebih baik",
    comment:
      "Produknya cantik dan sesuai foto. Hanya saja dus luar sedikit penyok saat tiba, tapi isinya aman.",
    date: "2026-09-12",
  },
  {
    user: "Dewangga",
    rating: 5,
    title: "Sudah repeat order",
    comment: "Ini pembelian kedua saya. Konsisten dan customer service-nya responsif saat saya tanya soal perawatan.",
    date: "2026-08-30",
  },
  {
    user: "Elena P.",
    rating: 4,
    title: "Sesuai ekspektasi",
    comment: "Detail finishing rapi. Saya suka pendekatan brand yang tidak berlebihan dan fokus ke kualitas.",
    date: "2026-08-18",
  },
];

export const reviews: Review[] = products.flatMap((product, index) =>
  reviewSeed
    .filter((_, reviewIndex) => (index + reviewIndex) % 2 === 0)
    .slice(0, 3)
    .map((seed, reviewIndex) => ({
      id: `${product.id}-rev-${reviewIndex}`,
      productId: product.id,
      user: seed.user,
      rating: reviewIndex === 2 && index % 3 === 0 ? 4 : seed.rating,
      title: seed.title,
      comment: seed.comment,
      date: seed.date,
      photos: reviewIndex === 0 && product.images[1] ? [product.images[1].url] : undefined,
      verified: true,
      helpful: 4 + ((index + reviewIndex) % 12),
    }))
);

export const testimonials: Testimonial[] = [
  {
    name: "Amanda Kusuma",
    role: "Interior Designer",
    location: "Jakarta",
    quote:
      "tokobagus.com adalah satu-satunya toko online yang saya rekomendasikan ke klien. Kurasinya konsisten dan detail produknya jujur.",
    rating: 5,
  },
  {
    name: "Ricky Halim",
    role: "Founder Studio Kopi",
    location: "Bandung",
    quote:
      "Pengalaman belanjanya terasa tenang—tidak ada pop-up berlebihan, informasi jelas, dan paketnya datang lebih cepat dari estimasi.",
    rating: 5,
  },
  {
    name: "Sarah Wijaya",
    role: "Content Creator",
    location: "Bali",
    quote:
      "Kualitas materialnya benar-benar bisa dirasakan. Sudah beli tiga kali dan tidak pernah kecewa dengan finishing-nya.",
    rating: 5,
  },
  {
    name: "Dimas Prasetyo",
    role: "Architect",
    location: "Yogyakarta",
    quote: "Bagian terbaiknya adalah after-sales. Saya minta panduan perawatan dan dibalas detail dalam hitungan menit.",
    rating: 4,
  },
];

export const faqs: FaqItem[] = [
  {
    category: "Pesanan",
    question: "Bagaimana cara melacak pesanan saya?",
    answer:
      "Buka halaman Lacak Pesanan, masukkan nomor pesanan dan email yang Anda gunakan saat checkout. Status akan diperbarui otomatis setiap kali kurir memindai paket.",
  },
  {
    category: "Pesanan",
    question: "Bisakah saya membatalkan pesanan?",
    answer:
      "Pesanan dapat dibatalkan selama status masih Menunggu Pembayaran atau Dibayar. Setelah masuk proses pengemasan, pembatalan dilakukan melalui proses pengembalian.",
  },
  {
    category: "Pengiriman",
    question: "Berapa lama estimasi pengiriman?",
    answer:
      "Jabodetabek 1–2 hari kerja, Pulau Jawa 2–3 hari kerja, dan luar Jawa 3–6 hari kerja. Opsi same-day tersedia untuk area tertentu.",
  },
  {
    category: "Pengiriman",
    question: "Apakah ongkir dihitung otomatis?",
    answer:
      "Ya. Ongkir dihitung berdasarkan berat, kota tujuan, dan kurir yang Anda pilih saat checkout. Gratis ongkir untuk pesanan mulai Rp750.000.",
  },
  {
    category: "Pembayaran",
    question: "Metode pembayaran apa saja yang tersedia?",
    answer:
      "Virtual account BCA, QRIS, GoPay, dan kartu kredit/debit. Semua transaksi diproses oleh payment gateway dengan standar PCI-DSS.",
  },
  {
    category: "Pembayaran",
    question: "Apakah data kartu saya aman?",
    answer:
      "Kami tidak pernah menyimpan data kartu Anda. Seluruh proses pembayaran kartu berlangsung di lingkungan payment gateway yang tersertifikasi PCI-DSS.",
  },
  {
    category: "Pengembalian",
    question: "Bagaimana kebijakan pengembalian?",
    answer:
      "Anda dapat mengajukan pengembalian maksimal 7 hari setelah paket diterima, selama produk belum digunakan dan kemasan lengkap. Biaya pengiriman retur ditanggung tokobagus.com untuk produk cacat.",
  },
  {
    category: "Produk",
    question: "Apakah produk tersedia dalam varian lain?",
    answer:
      "Pilih varian pada halaman produk untuk melihat stok, harga, dan estimasi pengiriman per varian. Jika varian yang Anda cari habis, aktifkan notifikasi restock.",
  },
];

export const journalPosts: JournalPost[] = [
  {
    slug: "slow-living-ritme-harian",
    title: "Slow Living dan Seni Menata Ritme Harian",
    excerpt: "Bagaimana memilih objek yang sedikit tetapi tepat, lalu membiarkannya menemani rutinitas Anda bertahun-tahun.",
    category: "Living",
    readTime: "6 menit",
    date: "2026-09-18",
    image: "/images/journal/slow-living.webp",
    intro:
      "Slow living bukan tentang memperlambat segalanya, tetapi tentang memberi ruang bagi hal-hal yang benar-benar berarti. Salah satu caranya adalah memilih objek yang tidak hanya indah, tetapi juga tahan lama.",
    sections: [
      {
        heading: "Mulai dari apa yang Anda sentuh setiap hari",
        body:
          "Gelas, kursi, atau selimut yang Anda gunakan setiap pagi membentuk kualitas hari Anda. Mulailah dari sana: pilih material yang nyaman di kulit, mudah dirawat, dan tidak lekang oleh tren.",
      },
      {
        heading: "Kurangi, bukan tambah",
        body:
          "Setiap objek baru sebaiknya menggantikan sesuatu, bukan menumpuk. Dengan begitu, ruang Anda bernapas dan setiap benda punya fungsi yang jelas.",
      },
      {
        heading: "Rayakan proses menua",
        body:
          "Kulit yang bercak, linen yang makin lembut, dan kayu yang berubah warna adalah tanda bahwa objek tersebut hidup bersama Anda. Pilih barang yang justru semakin cantik seiring waktu.",
      },
    ],
  },
  {
    slug: "meja-kerja-yang-menghasilkan",
    title: "Merancang Meja Kerja yang Membuat Anda Fokus",
    excerpt: "Tiga prinsip sederhana untuk ruang kerja rumahan: cahaya, tekstur, dan sedikit kekosongan.",
    category: "Workspace",
    readTime: "5 menit",
    date: "2026-09-05",
    image: "/images/journal/workspace.webp",
    intro:
      "Ruang kerja yang baik tidak harus besar. Yang penting adalah bagaimana cahaya jatuh, bagaimana tangan bergerak, dan apa yang terlihat saat Anda mengangkat kepala.",
    sections: [
      {
        heading: "Cahaya lebih dulu",
        body:
          "Tempatkan meja tegak lurus dengan jendela agar layar tidak memantulkan cahaya. Tambahkan lampu meja dengan cahaya hangat untuk sore hari.",
      },
      {
        heading: "Satu tekstur alami",
        body:
          "Satu elemen kayu, keramik, atau linen cukup untuk menyeimbangkan permukaan keras di sekitar Anda tanpa membuat ruangan terasa berantakan.",
      },
      {
        heading: "Sisakan ruang kosong",
        body:
          "Area kosong di meja bukan pemborosan. Ruang itu adalah tempat ide baru muncul dan tempat kepala Anda beristirahat.",
      },
    ],
  },
  {
    slug: "di-balik-layar-tokobagus",
    title: "Di Balik Layar: Bagaimana Kurasi tokobagus.com Dibuat",
    excerpt: "Proses kami memilih satu dari dua puluh produk, dan mengapa kami menolak lebih banyak daripada menerima.",
    category: "Di Balik Layar",
    readTime: "7 menit",
    date: "2026-08-22",
    image: "/images/journal/craft.webp",
    intro:
      "Setiap produk yang masuk katalog tokobagus.com melewati proses kurasi yang panjang: mulai dari mengunjungi bengkel pengrajin, menguji material, hingga memastikan kemasannya tidak berlebihan.",
    sections: [
      {
        heading: "Kunjungi pembuatnya",
        body:
          "Kami percaya kualitas dimulai dari orang yang membuatnya. Kami mengunjungi setiap mitra, melihat kondisi kerja, dan berbicara tentang standar upah yang adil.",
      },
      {
        heading: "Uji sebelum dijual",
        body:
          "Produk dipakai oleh tim kami minimal dua minggu sebelum diputuskan masuk katalog. Kami mencatat kenyamanan, ketahanan, dan kemudahan perawatan.",
      },
      {
        heading: "Kemasan seminimal mungkin",
        body:
          "Kami menggunakan kemasan yang dapat didaur ulang, tanpa plastik berlapis, dan memastikan paket tetap aman selama pengiriman.",
      },
    ],
  },
];

export const notifications: NotificationItem[] = [
  {
    id: "n-1",
    title: "Pesanan Anda dikirim",
    description: "Paket #TBG-2409-1182 sedang dalam perjalanan. Nomor resi JNE1234567890.",
    date: "2026-09-29",
    read: false,
    href: "/account/orders",
  },
  {
    id: "n-2",
    title: "Voucher baru untuk Anda",
    description: "Gunakan kode TOKOBAGUS10 untuk diskon 10% di pesanan berikutnya.",
    date: "2026-09-24",
    read: false,
    href: "/products",
  },
  {
    id: "n-3",
    title: "Ulasan Anda sudah tayang",
    description: "Terima kasih telah mengulas Arc Low-Top Sneakers.",
    date: "2026-09-12",
    read: true,
  },
];

export const savedAddresses: SavedAddress[] = [
  {
    id: "addr-1",
    label: "Rumah",
    recipient: "Alya Rahmania",
    phone: "081234567890",
    province: "DKI Jakarta",
    city: "Jakarta Selatan",
    district: "Kebayoran Baru",
    postalCode: "12110",
    detail: "Jl. Senopati No. 18, Blok B2, patokan seberang taman",
    isDefault: true,
  },
  {
    id: "addr-2",
    label: "Kantor",
    recipient: "Alya Rahmania",
    phone: "081234567891",
    province: "DKI Jakarta",
    city: "Jakarta Pusat",
    district: "Menteng",
    postalCode: "10310",
    detail: "Jl. Cikini Raya No. 24, Gedung tokobagus.com, Lantai 3",
    isDefault: false,
  },
];

export const profile: Profile = {
  id: "user-demo",
  name: "Alya Rahmania",
  email: "alya@example.com",
  phone: "0812-3456-7890",
  role: "Customer",
  birthday: "1996-04-12",
  joinedAt: "2025-11-02",
};

function orderItems(ids: { productId: string; variantIndex?: number; qty: number }[]) {
  return ids.map(({ productId, variantIndex = 0, qty }) => {
    const product = products.find((item) => item.id === productId)!;
    const variant = product.variants[variantIndex] ?? product.variants[0];
    return {
      productId: product.id,
      variantId: variant.id,
      slug: product.slug,
      name: product.name,
      variantName: variant.name,
      image: variant.imageUrl ?? product.images[0].url,
      price: variant.price,
      qty,
      stock: variant.stock,
    };
  });
}

const buildOrder = (
  id: string,
  createdOffsetDays: number,
  status: Order["status"],
  paymentStatus: Order["paymentStatus"],
  items: ReturnType<typeof orderItems>,
  courierId: string,
  trackingNumber?: string
): Order => {
  const courier = couriers.find((item) => item.id === courierId) ?? couriers[0];
  const subtotal = items.reduce((total, item) => total + item.price * item.qty, 0);
  const discount = status === "pending" ? 0 : Math.min(100000, Math.round(subtotal * 0.05));
  const shippingCost = subtotal >= storeSettings.freeShippingThreshold ? 0 : courier.cost;
  const created = new Date(Date.now() - createdOffsetDays * 86400000);
  const timeline: Order["timeline"] = [{ status: "pending", at: created.toISOString(), note: "Pesanan dibuat" }];
  const steps: Order["status"][] = ["paid", "processing", "shipped", "completed"];
  steps.forEach((step, index) => {
    if (steps.indexOf(status) >= index || status === step) {
      timeline.push({
        status: step,
        at: new Date(created.getTime() + (index + 1) * 43200000).toISOString(),
        note:
          step === "paid"
            ? "Pembayaran diterima"
            : step === "processing"
              ? "Sedang dikemas"
              : step === "shipped"
                ? "Paket diserahkan ke kurir"
                : "Paket diterima pelanggan",
      });
    }
  });
  return {
    id,
    orderNumber: `#${id}`,
    items,
    subtotal,
    discount,
    shippingCost,
    total: subtotal - discount + shippingCost,
    status,
    paymentStatus,
    paymentMethodId: "qris",
    paymentMethod: "QRIS",
    courierId: courier.id,
    courier: courier.name,
    etd: courier.etd,
    trackingNumber,
    address: savedAddresses[0],
    customer: { name: profile.name, email: profile.email, phone: profile.phone },
    couponCode: discount > 0 ? "TOKOBAGUS10" : undefined,
    createdAt: created.toISOString(),
    expiresAt: new Date(created.getTime() + 86400000).toISOString(),
    timeline,
  };
};

export const seedOrders: Order[] = [
  buildOrder("TBG-2609-1182", 4, "shipped", "paid", orderItems([{ productId: "p-arc-sneakers", qty: 1 }]), "jne-reg", "JNE1234567890"),
  buildOrder(
    "TBG-2609-1104",
    9,
    "completed",
    "paid",
    orderItems([
      { productId: "p-botanical-serum", variantIndex: 0, qty: 2 },
      { productId: "p-amber-candle", qty: 1 },
    ]),
    "sicepat-best",
    "SC9988776655"
  ),
  buildOrder("TBG-2610-1201", 1, "processing", "paid", orderItems([{ productId: "p-lumen-headphones", qty: 1 }]), "anteraja"),
  buildOrder(
    "TBG-2610-1220",
    0,
    "pending",
    "unpaid",
    orderItems([{ productId: "p-terra-vase", variantIndex: 1, qty: 1 }]),
    "gosend-same"
  ),
];

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug || product.id === slug);
}

export function getCategory(slug: string) {
  return categories.find((category) => category.slug === slug || category.id === slug);
}

export function categoryName(categoryId: string) {
  return categories.find((category) => category.id === categoryId)?.name ?? "Koleksi";
}

export const totalStock = (product: Product) => product.variants.reduce((total, variant) => total + variant.stock, 0);
