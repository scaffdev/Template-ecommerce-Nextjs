# 🛍️ Tokobagus — Template E-Commerce & Admin Panel Editorial (Next.js 16)

Template toko daring (*E-Commerce Storefront*) dan panel administrasi (*Admin Backoffice*) komprehensif bergaya *warm-luxury editorial* berbasis **Next.js 16**, **React 19**, **TypeScript**, **Tailwind CSS**, dan **Zustand**. Seluruh fungsionalitas demo berjalan lancar secara instan tanpa membutuhkan konfigurasi database eksternal (menggunakan *client-side persistence* dengan Zustand & localStorage), menjadikannya basis terbaik untuk prototipe, portofolio, presentasi, atau fondasi toko skala produksi.

---

## ✨ Fitur Lengkap

### 🛒 Toko Daring (Storefront Experience)
- **Katalog Produk Dinamis**: Filter multikriteria (kategori, rentang harga, rating minimum, produk diskon, status stok), sorting cerdas (terbaru, harga, popularitas), toggle tampilan grid/list, paginasi, dan *Quick View modal*.
- **Halaman Detail Produk (PDP)**: Galeri multi-gambar dengan preview hover instan, pemilih varian (ukuran, warna, material), kalkulator stok sisa, tab deskripsi/spesifikasi/pengiriman/ulasan, distribusi rating bintang, ulasan terverifikasi, serta rekomendasi produk serupa dan yang baru saja dilihat.
- **Keranjang & Checkout**: Penukaran voucher kupon, indikator progress gratis ongkir otomatis, alur checkout 3 langkah terstruktur (Pengiriman -> Metode Pembayaran -> Konfirmasi), simulasi pembayaran (Virtual Account, QRIS, E-Wallet, Kartu Kredit, COD) lengkap dengan timer countdown dan invoice pesanan.
- **Portal Akun Pelanggan**: Daftar pesanan interaktif dengan lini masa pelacakan resi, daftar keinginan (*wishlist*), manajemen buku alamat kirim (CRUD), pengaturan profil dan preferensi akun.
- **Konten Editorial & Edukasi**: Halaman Tentang Kami, Kontak, FAQ interaktif, Journal/Blog artikel editorial (daftar artikel + single post), dan halaman kebijakan retur/privasi dengan daftar isi otomatis.

### 💼 Panel Administrasi (`/admin`)
- **Dashboard Ringkasan**: Kartu metrik omzet, jumlah pesanan, produk terlaris, dan grafik aktivitas harian.
- **Manajemen Produk & Varian**: Tambah/edit produk, unggah foto, atur varian SKU, kelola harga jual & harga coret, serta status visibilitas.
- **Inventori & Stok**: Monitor stok kritis dan peringatan habis pakai.
- **Pesanan & Pengiriman**: Pembaruan status pesanan (Menunggu Pembayaran -> Diproses -> Dikirim -> Selesai), pengisian nomor resi kurir, dan rincian transaksi pelanggan.
- **Promosi & Voucher**: Buat dan kelola kode kupon diskon dengan limit kuota, minimal belanja, dan masa kedaluwarsa.
- **Manajemen Pelanggan**: Direktori data pelanggan terdaftar dan riwayat belanja.
- **Laporan & Ekspor**: Ekspor data laporan penjualan ke format CSV dan fitur *Reset Demo* instan.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16.3.8 (App Router, Server & Client Components)
- **UI & Design**: React 19, Tailwind CSS, Lucide Icons, Custom Manrope Typography
- **State Management**: Zustand 5 dengan middleware `persist` (localStorage)
- **Validation**: Zod 3.x
- **Language**: TypeScript 5

---

## 📁 Struktur Folder Utama

```
├── public/images/              # Koleksi foto produk, editorial, avatar
├── src/
│   ├── app/
│   │   ├── (shop)/             # Rute storefront (katalog, produk, cart, checkout)
│   │   ├── admin/              # Rute panel administrasi (dashboard, produk, order)
│   │   ├── api/                # Endpoint simulasi (checkout, webhook, upload)
│   │   ├── layout.tsx          # Root layout toko & penyedia font Manrope
│   │   ├── robots.ts           # Konfigurasi robots SEO
│   │   └── sitemap.ts          # Generator sitemap otomatis
│   ├── components/
│   │   ├── cart/               # Drawer keranjang & item checkout
│   │   ├── home/               # Carousel hero, flash sale rail, promo tiles
│   │   ├── product/            # Card produk, galeri PDP, modal ulasan
│   │   └── ui/                 # Toast provider, icon, form controls
│   ├── lib/
│   │   ├── data.ts             # Data mock produk awal, kategori, dan artikel
│   │   └── format.ts           # Format mata uang Rupiah & tanggal
│   └── store/                  # Store Zustand (catalog, cart, wishlist, orders, admin)
├── next.config.mjs             # Konfigurasi Next.js, remotePatterns, & headers
└── scaff.template.json         # Manifest integrasi Scaffdev
```

---

## 🚀 Panduan Instalasi Cepat

### Prasyarat
- Node.js >= 20.9.0
- npm / pnpm / yarn

### Langkah Instalasi

```bash
# 1. Clone repository
git clone https://github.com/scaffdev/Template-ecommerce-Nextjs.git
cd Template-ecommerce-Nextjs

# 2. Install dependensi
npm ci

# 3. Setup Environment Variables
cp .env.example .env.local

# 4. Jalankan development server
npm run dev
```

Aplikasi dapat langsung diakses di browser:
- **Toko Daring (Storefront)**: [http://localhost:3000](http://localhost:3000)
- **Panel Administrasi**: [http://localhost:3000/admin](http://localhost:3000/admin)

Untuk membuat build produksi:
```bash
npm run build
npm run start
```

---

## 🔑 Kredensial & Voucher Demo

### Akses Login Demo
- **Admin Backoffice**: Buka `/admin/login`, masukkan email apa pun dengan kata sandi minimal 6 karakter (tersedia tombol cepat *"Isi kredensial demo"*).
- **Pelanggan Demo**: `alya@example.com` (kata sandi bebas, minimal 6 karakter).

### Kode Voucher Bawaan
- `TOKOBAGUS10` — Diskon 10% (maks. Rp250.000, min. belanja Rp500.000)
- `GRATISONGKIR` — Bebas ongkos kirim (min. belanja Rp750.000)
- `RITUAL50` — Potongan langsung Rp50.000 (min. belanja Rp300.000)

### Mereset Data Demo
Semua perubahan (pesanan baru, edit produk, alamat) disimpan di localStorage browser dengan awalan `tokobagus-*`. Untuk mengembalikan data ke kondisi awal:
1. Masuk ke **Admin → Laporan → Reset katalog & pesanan**, atau
2. Klik tombol **Reset data demo** di halaman **Akun → Profil**.

---

## ⚙️ Variabel Environment (`.env.local`)

| Variabel | Deskripsi | Default |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Domain toko untuk metadata dan canonical | `https://example.com` |
| `PAYMENT_WEBHOOK_SECRET` | Secret token untuk verifikasi webhook pembayaran di `/api/webhooks/payment` | - |

---

## 🛡️ Keamanan & Integrasi Produksi

- **Hardened Webhook Handler**: Route `/api/webhooks/payment` memverifikasi header `x-signature` terhadap `PAYMENT_WEBHOOK_SECRET` menggunakan `crypto.timingSafeEqual` guna mencegah serangan *timing attack*, serta menolak request saat secret belum dikonfigurasi.
- **Checkout Total Sanitization**: Endpoint `/api/checkout` tidak mempercayai nilai total yang dikirimkan client. Pada implementasi produksi, hitung ulang seluruh subtotal, ongkos kirim, dan diskon secara server-side dari database.
- **Restricted Remote Patterns**: Gambar eksternal dibatasi pada domain CDN terpercaya di `next.config.mjs` untuk mengeliminasi celah SSRF.
- **HTTP Security Headers**: Konfigurasi header standar (CSP, HSTS, `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`).

---

## 🧪 Verifikasi & Pengujian

Untuk panduan instruksi otomatis bagi AI agent testing, lihat file [`VERIFY.md`](./VERIFY.md).

```bash
# Build aplikasi Next.js
npm run build

# Validasi linter TypeScript & ESLint
npm run lint

# Audit dependensi keamanan
npm audit --omit=dev
```

---

## 📄 Lisensi

Didistribusikan di bawah lisensi MIT. Lihat [`LICENSE`](./LICENSE) untuk rincian lengkap. Hak Cipta © 2026 Scaffdev.
