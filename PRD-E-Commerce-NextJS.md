# PRD: Website E-Commerce dengan Next.js

**Versi:** 1.0
**Status:** Draft
**Tanggal:** September 2026

---

## 1. Ringkasan Eksekutif

Dokumen ini mendefinisikan kebutuhan produk untuk membangun platform e-commerce berbasis Next.js (App Router) dengan arsitektur full-stack modern. Platform mencakup dua sisi utama:

1. **Storefront (customer-facing)** — tempat pengunjung menjelajah produk, menambah ke keranjang, checkout, membayar, dan melacak pesanan.
2. **Admin Panel (internal)** — tempat tim mengelola produk, stok, pesanan, pelanggan, promo, dan melihat laporan penjualan.

Fokus utama: **konversi tinggi, performa cepat, SEO kuat, dan keamanan transaksi**.

---

## 2. Latar Belakang & Tujuan

### 2.1 Masalah
- Penjualan masih bergantung pada marketplace pihak ketiga (komisi tinggi, tidak punya data pelanggan, branding terbatas).
- Tidak ada kontrol penuh atas pengalaman belanja dan strategi promosi.

### 2.2 Tujuan Bisnis
| Tujuan | Indikator |
|---|---|
| Membangun channel penjualan mandiri | Transaksi via website sendiri |
| Meningkatkan margin | Mengurangi ketergantungan komisi marketplace |
| Memiliki data pelanggan | Database customer untuk retensi & remarketing |
| Meningkatkan konversi | Conversion rate ≥ 2% (baseline industri) |

### 2.3 Tujuan Teknis
- Halaman produk cepat dan terindeks baik oleh mesin pencari.
- Checkout yang mulus dengan minimal friction.
- Arsitektur yang scalable untuk pertumbuhan katalog dan trafik.
- Keamanan data pelanggan dan transaksi.

---

## 3. Target Pengguna & Persona

| Persona | Deskripsi | Kebutuhan Utama |
|---|---|---|
| **Pembeli Baru (Guest)** | Datang dari iklan/organik, belum punya akun | Browsing cepat, checkout tanpa harus daftar |
| **Pembeli Terdaftar** | Pelanggan berulang | Riwayat pesanan, alamat tersimpan, checkout cepat |
| **Admin/Owner** | Pemilik toko | Kelola produk, lihat laporan penjualan |
| **Staff Gudang** | Pemroses pesanan | Lihat pesanan masuk, update status & resi |
| **Customer Service** | Menangani keluhan | Cari pesanan pelanggan, ubah status, proses refund |

---

## 4. Scope

### 4.1 In Scope
- Storefront lengkap (katalog → checkout → tracking).
- Admin panel untuk manajemen operasional.
- Integrasi payment gateway dan ekspedisi.
- Sistem akun pelanggan.
- Sistem promo/voucher.
- Notifikasi email & WhatsApp (opsional).

### 4.2 Out of Scope (Fase Awal)
- Multi-vendor / marketplace (banyak seller dalam satu platform).
- Aplikasi mobile native (website sudah responsive/PWA-ready).
- Multi-currency & multi-language.
- Sistem afiliasi/reseller.
- Subscription / recurring billing.
- Integrasi ERP/akuntansi kompleks.

---

## 5. Struktur Halaman & Routing

### 5.1 Storefront

| Halaman | Route | Rendering | Deskripsi |
|---|---|---|---|
| Home | `/` | ISR | Hero, produk unggulan, kategori, promo aktif |
| Katalog / Semua Produk | `/products` | SSR / ISR | Grid produk + filter + sorting + pagination |
| Kategori | `/category/[slug]` | ISR | Produk per kategori |
| Detail Produk | `/products/[slug]` | ISR | Galeri, varian, harga, stok, deskripsi, review |
| Hasil Pencarian | `/search?q=` | SSR | Hasil pencarian produk |
| Keranjang | `/cart` | CSR | Ringkasan item, ubah qty, hapus item |
| Checkout | `/checkout` | CSR (protected-ish) | Alamat, ekspedisi, pembayaran |
| Status Pembayaran | `/checkout/[orderId]/payment` | CSR | Instruksi bayar / redirect gateway |
| Konfirmasi Pesanan | `/checkout/success` | CSR | Ringkasan pesanan berhasil |
| Login / Register | `/login`, `/register` | CSR | Autentikasi |
| Lupa Password | `/forgot-password`, `/reset-password` | CSR | Reset password |
| Dashboard Akun | `/account` | SSR (protected) | Ringkasan akun |
| Riwayat Pesanan | `/account/orders` | SSR (protected) | Daftar pesanan |
| Detail Pesanan | `/account/orders/[id]` | SSR (protected) | Detail + tracking resi |
| Alamat Tersimpan | `/account/addresses` | SSR (protected) | CRUD alamat pengiriman |
| Profil | `/account/profile` | SSR (protected) | Edit data diri & password |
| Wishlist | `/account/wishlist` | SSR (protected) | Produk favorit |
| Halaman Statis | `/about`, `/contact`, `/faq`, `/terms`, `/privacy`, `/shipping-policy`, `/return-policy` | SSG | Informasi & legal |
| 404 | `not-found.tsx` | Static | Halaman tidak ditemukan |

### 5.2 Admin Panel

| Halaman | Route | Deskripsi |
|---|---|---|
| Login Admin | `/admin/login` | Autentikasi admin |
| Dashboard | `/admin` | Ringkasan penjualan, pesanan baru, stok menipis |
| Daftar Produk | `/admin/products` | Tabel produk + filter + bulk action |
| Tambah/Edit Produk | `/admin/products/new`, `/admin/products/[id]` | Form produk & varian |
| Kategori | `/admin/categories` | CRUD kategori (mendukung sub-kategori) |
| Inventori | `/admin/inventory` | Kelola stok per SKU/varian |
| Pesanan | `/admin/orders` | Daftar pesanan + filter status |
| Detail Pesanan | `/admin/orders/[id]` | Detail, update status, input resi, refund |
| Pelanggan | `/admin/customers` | Daftar & detail pelanggan |
| Promo/Voucher | `/admin/promotions` | CRUD kupon & diskon |
| Banner/Konten | `/admin/content` | Kelola banner homepage |
| Laporan | `/admin/reports` | Laporan penjualan, produk terlaris |
| Pengaturan | `/admin/settings` | Info toko, ongkir, pajak, metode bayar |
| User & Role | `/admin/users` | Manajemen akun admin & hak akses |

---

## 6. Functional Requirements — Detail Fitur

### 6.1 Katalog Produk

| ID | Requirement | Prioritas |
|---|---|---|
| CAT-1 | Produk memiliki: nama, slug, deskripsi (rich text), harga, harga coret, SKU, stok, berat, dimensi, kategori, tag, status (aktif/draft) | Must |
| CAT-2 | Mendukung **multi-gambar** per produk dengan gambar utama (thumbnail) | Must |
| CAT-3 | Mendukung **varian produk** (ukuran, warna, dll) dengan harga & stok per varian | Must |
| CAT-4 | Kategori bersifat hierarkis (kategori → sub-kategori) | Should |
| CAT-5 | Produk dapat ditandai sebagai "Unggulan", "Terbaru", "Best Seller" | Should |
| CAT-6 | Produk habis stok tetap tampil namun tombol beli dinonaktifkan (dengan label "Stok Habis") | Should |
| CAT-7 | Mendukung produk bundling/paket | Could |

### 6.2 Pencarian, Filter & Sorting

| ID | Requirement | Prioritas |
|---|---|---|
| SRC-1 | Pencarian berdasarkan nama & deskripsi produk | Must |
| SRC-2 | Filter berdasarkan: kategori, rentang harga, ketersediaan stok, rating | Must |
| SRC-3 | Filter berdasarkan atribut varian (ukuran, warna, brand) | Should |
| SRC-4 | Sorting: terbaru, harga terendah, harga tertinggi, terlaris, rating tertinggi | Must |
| SRC-5 | State filter tersimpan di URL query params (shareable & bookmarkable) | Must |
| SRC-6 | Pagination atau infinite scroll pada daftar produk | Must |
| SRC-7 | Autocomplete/suggestion saat mengetik di search bar | Should |
| SRC-8 | Pencarian full-text yang lebih canggih (typo-tolerant) via Algolia/Meilisearch | Could |

### 6.3 Halaman Detail Produk (PDP)

| ID | Requirement | Prioritas |
|---|---|---|
| PDP-1 | Galeri gambar dengan zoom & thumbnail navigation | Must |
| PDP-2 | Pemilihan varian memperbarui harga, stok, dan gambar secara dinamis | Must |
| PDP-3 | Input jumlah (quantity) dengan validasi terhadap stok tersedia | Must |
| PDP-4 | Tombol "Tambah ke Keranjang" dan "Beli Sekarang" (langsung ke checkout) | Must |
| PDP-5 | Informasi pengiriman (estimasi ongkir berdasarkan lokasi) | Should |
| PDP-6 | Tab: Deskripsi, Spesifikasi, Ulasan, Kebijakan Pengembalian | Should |
| PDP-7 | Rekomendasi "Produk Serupa" / "Sering Dibeli Bersama" | Should |
| PDP-8 | Tombol Wishlist & Share ke sosial media | Should |
| PDP-9 | Breadcrumb navigasi | Should |

### 6.4 Keranjang Belanja (Cart)

| ID | Requirement | Prioritas |
|---|---|---|
| CRT-1 | Tambah, ubah jumlah, dan hapus item dari keranjang | Must |
| CRT-2 | Keranjang persisten untuk guest (localStorage) dan tersinkron ke database saat login | Must |
| CRT-3 | Validasi stok real-time saat masuk ke checkout | Must |
| CRT-4 | Tampilan ringkasan: subtotal, diskon, ongkir (estimasi), total | Must |
| CRT-5 | Mini-cart/drawer yang muncul saat item ditambahkan | Should |
| CRT-6 | Input kode voucher di halaman keranjang | Should |
| CRT-7 | Notifikasi jika harga/stok item berubah sejak dimasukkan ke keranjang | Should |
| CRT-8 | "Simpan untuk nanti" (move to wishlist) | Could |

### 6.5 Checkout

| ID | Requirement | Prioritas |
|---|---|---|
| CHK-1 | **Guest checkout** (tanpa wajib membuat akun) | Must |
| CHK-2 | Form alamat pengiriman: nama penerima, telepon, provinsi, kota, kecamatan, kode pos, alamat lengkap | Must |
| CHK-3 | Pengguna terdaftar dapat memilih dari alamat tersimpan | Must |
| CHK-4 | Pemilihan kurir & layanan pengiriman dengan **kalkulasi ongkir otomatis** | Must |
| CHK-5 | Pemilihan metode pembayaran | Must |
| CHK-6 | Ringkasan pesanan final sebelum konfirmasi (item, ongkir, diskon, total) | Must |
| CHK-7 | Penerapan voucher/kode promo dengan validasi (min. belanja, masa berlaku, kuota) | Must |
| CHK-8 | Checkout multi-step atau single-page dengan progress indicator | Should |
| CHK-9 | Opsi "Alamat penagihan berbeda dari alamat pengiriman" | Could |
| CHK-10 | Catatan untuk penjual | Could |

### 6.6 Pembayaran

| ID | Requirement | Prioritas |
|---|---|---|
| PAY-1 | Integrasi payment gateway (Midtrans / Xendit / Doku) | Must |
| PAY-2 | Metode: Transfer Bank / Virtual Account, E-wallet (GoPay, OVO, DANA, ShopeePay), QRIS, Kartu Kredit/Debit | Must |
| PAY-3 | Halaman instruksi pembayaran dengan **countdown batas waktu** | Must |
| PAY-4 | **Webhook handler** untuk update status pembayaran otomatis dari gateway | Must |
| PAY-5 | Pesanan otomatis dibatalkan jika melewati batas waktu pembayaran (stok dikembalikan) | Must |
| PAY-6 | Idempotency pada pemrosesan webhook (mencegah double-processing) | Must |
| PAY-7 | COD (Cash on Delivery) | Could |
| PAY-8 | Paylater / cicilan | Could |

### 6.7 Manajemen Pesanan (Sisi Pelanggan)

| ID | Requirement | Prioritas |
|---|---|---|
| ORD-1 | Riwayat pesanan dengan filter status | Must |
| ORD-2 | Detail pesanan: item, total, alamat, status, nomor resi | Must |
| ORD-3 | Status pesanan yang jelas: `Menunggu Pembayaran → Dibayar → Diproses → Dikirim → Selesai` (+ `Dibatalkan`, `Dikembalikan`) | Must |
| ORD-4 | Tracking resi (link ke ekspedisi atau embed tracking) | Should |
| ORD-5 | Tombol "Batalkan Pesanan" (hanya sebelum status Diproses) | Should |
| ORD-6 | Tombol "Beli Lagi" (menambahkan item pesanan lama ke keranjang) | Could |
| ORD-7 | Pengajuan komplain/pengembalian barang | Could |

### 6.8 Akun Pelanggan

| ID | Requirement | Prioritas |
|---|---|---|
| ACC-1 | Registrasi dengan email & password | Must |
| ACC-2 | Login, logout, session management | Must |
| ACC-3 | Lupa password & reset via email | Must |
| ACC-4 | Verifikasi email saat registrasi | Should |
| ACC-5 | Login sosial (Google) | Should |
| ACC-6 | CRUD alamat tersimpan dengan penanda alamat utama | Must |
| ACC-7 | Edit profil & ganti password | Must |
| ACC-8 | Wishlist produk | Should |

### 6.9 Ulasan & Rating

| ID | Requirement | Prioritas |
|---|---|---|
| REV-1 | Pelanggan dapat memberi rating (1–5) & ulasan **hanya untuk produk yang sudah dibeli & selesai** | Should |
| REV-2 | Tampilkan rata-rata rating & distribusi bintang di PDP | Should |
| REV-3 | Upload foto pada ulasan | Could |
| REV-4 | Moderasi ulasan oleh admin (approve/reject) | Should |
| REV-5 | Balasan penjual terhadap ulasan | Could |

### 6.10 Promo & Voucher

| ID | Requirement | Prioritas |
|---|---|---|
| PRM-1 | Kupon dengan tipe: potongan nominal tetap, persentase, gratis ongkir | Must |
| PRM-2 | Aturan kupon: minimum belanja, masa berlaku, kuota total, limit per pengguna, berlaku untuk produk/kategori tertentu | Must |
| PRM-3 | Diskon otomatis pada produk (harga coret) tanpa perlu kode | Should |
| PRM-4 | Flash sale dengan countdown timer | Could |
| PRM-5 | Promo "Beli X Gratis Y" / bundling | Could |

### 6.11 Admin Panel

| ID | Requirement | Prioritas |
|---|---|---|
| ADM-1 | CRUD produk lengkap dengan upload multi-gambar & manajemen varian | Must |
| ADM-2 | CRUD kategori & tag | Must |
| ADM-3 | Manajemen stok per SKU dengan riwayat perubahan stok | Must |
| ADM-4 | Daftar pesanan dengan filter (status, tanggal, pelanggan) & pencarian | Must |
| ADM-5 | Update status pesanan & input nomor resi | Must |
| ADM-6 | Proses pembatalan & refund | Should |
| ADM-7 | Daftar pelanggan dengan riwayat pembelian & total belanja | Should |
| ADM-8 | CRUD voucher & promo | Must |
| ADM-9 | Dashboard: total penjualan (harian/mingguan/bulanan), jumlah pesanan, AOV, produk terlaris, stok menipis | Must |
| ADM-10 | Export laporan ke CSV/Excel | Should |
| ADM-11 | Role-based access control: Owner, Admin, Staff Gudang, Customer Service | Should |
| ADM-12 | Audit log aktivitas admin (siapa mengubah apa & kapan) | Should |
| ADM-13 | Pengaturan toko: info toko, alamat asal pengiriman, pajak, metode pembayaran aktif | Must |
| ADM-14 | Kelola banner homepage | Should |

### 6.12 Notifikasi

| ID | Requirement | Prioritas |
|---|---|---|
| NOT-1 | Email: konfirmasi pesanan dibuat | Must |
| NOT-2 | Email: pembayaran berhasil | Must |
| NOT-3 | Email: pesanan dikirim + nomor resi | Must |
| NOT-4 | Email: reset password & verifikasi akun | Must |
| NOT-5 | Notifikasi admin saat ada pesanan baru | Should |
| NOT-6 | Notifikasi WhatsApp (via API) | Could |
| NOT-7 | Email pengingat keranjang terbengkalai (abandoned cart) | Could |

---

## 7. Tech Stack

| Layer | Pilihan | Alasan |
|---|---|---|
| Framework | **Next.js 15 (App Router)** | Hybrid rendering, Server Actions, SEO, performa |
| Bahasa | **TypeScript** | Type-safety krusial untuk logic transaksi |
| Styling | **Tailwind CSS** | Konsisten & cepat |
| Komponen UI | **shadcn/ui** | Accessible, dapat dikustomisasi |
| Database | **PostgreSQL** | Relasional, cocok untuk data transaksional |
| ORM | **Prisma** | Type-safe query & migrasi terstruktur |
| Autentikasi | **Auth.js (NextAuth v5)** | Session, OAuth, credential provider |
| State Keranjang | **Zustand** (+ sync ke DB) | Ringan, mudah dipersist |
| Form & Validasi | **React Hook Form + Zod** | Validasi konsisten di client & server |
| Payment | **Midtrans / Xendit** | Dukungan lengkap metode bayar Indonesia |
| Ekspedisi | **Biteship / RajaOngkir** | Kalkulasi ongkir & tracking multi-kurir |
| Storage Gambar | **Cloudinary / UploadThing / S3** | CDN + transformasi gambar otomatis |
| Email | **Resend + React Email** | Template email berbasis komponen |
| Cache / Rate Limit | **Redis (Upstash)** | Cache katalog & rate limiting API |
| Search (opsional) | **Meilisearch / Algolia** | Pencarian cepat & typo-tolerant |
| Deployment | **Vercel** | Native Next.js, edge network |
| Database Hosting | **Neon / Supabase / Railway** | PostgreSQL managed |
| Monitoring | **Sentry** | Error tracking produksi |
| Analytics | **GA4 + Vercel Analytics** | Funnel & perilaku pengguna |
| Testing | **Vitest + Playwright** | Unit test & E2E test alur kritis |
| Code Quality | **ESLint + Prettier + Husky** | Konsistensi & pre-commit check |

---

## 8. Model Data (Ringkasan)

```
User            — id, email, password_hash, name, phone, role, emailVerified, createdAt
Address         — id, userId, recipientName, phone, province, city, district, postalCode, detail, isDefault
Category        — id, name, slug, parentId, image, sortOrder
Product         — id, name, slug, description, categoryId, basePrice, comparePrice,
                  weight, status, isFeatured, metaTitle, metaDescription, createdAt
ProductImage    — id, productId, url, altText, sortOrder, isPrimary
ProductVariant  — id, productId, sku, name, price, stock, weight, imageUrl
VariantOption   — id, variantId, optionName (misal "Warna"), optionValue (misal "Merah")
Cart            — id, userId | sessionId, createdAt, updatedAt
CartItem        — id, cartId, productId, variantId, quantity, priceSnapshot
Order           — id, orderNumber, userId | guestEmail, status, paymentStatus,
                  subtotal, discountAmount, shippingCost, totalAmount,
                  couponId, shippingAddress (JSON snapshot), notes, createdAt
OrderItem       — id, orderId, productId, variantId, productNameSnapshot, priceSnapshot, quantity
Payment         — id, orderId, provider, method, externalId, amount, status, paidAt, rawPayload
Shipment        — id, orderId, courier, service, trackingNumber, cost, status, shippedAt
Coupon          — id, code, type, value, minPurchase, maxDiscount, startsAt, expiresAt,
                  usageLimit, usageCount, perUserLimit, isActive
CouponUsage     — id, couponId, userId, orderId, usedAt
Review          — id, productId, userId, orderItemId, rating, comment, status, createdAt
Wishlist        — id, userId, productId, createdAt
InventoryLog    — id, variantId, changeType, quantityChange, referenceId, note, createdAt
AuditLog        — id, adminUserId, action, entity, entityId, metadata, createdAt
```

**Catatan penting:**
- `OrderItem` dan `Order.shippingAddress` menyimpan **snapshot** data (nama produk, harga, alamat) agar riwayat pesanan tetap akurat meskipun produk/alamat diubah atau dihapus di kemudian hari.
- Semua nilai uang disimpan sebagai **integer (satuan terkecil, misal rupiah penuh)** atau `Decimal`, **bukan float**, untuk menghindari galat pembulatan.

---

## 9. Alur Kritis (Critical Flows)

### 9.1 Alur Pembelian
```
Browse Katalog → Detail Produk → Pilih Varian & Qty → Tambah ke Keranjang
→ Lihat Keranjang → Checkout → Isi/Pilih Alamat → Pilih Kurir (ongkir dihitung)
→ Terapkan Voucher (opsional) → Pilih Metode Bayar → Buat Pesanan
→ Redirect ke Gateway / Instruksi Bayar → Bayar
→ Webhook Update Status → Email Konfirmasi → Admin Proses → Input Resi
→ Email "Pesanan Dikirim" → Pelanggan Terima → Status Selesai → Ulasan
```

### 9.2 Aturan Stok (Krusial)
- Stok **di-reserve** saat pesanan dibuat (status: Menunggu Pembayaran).
- Stok **dikembalikan otomatis** jika pembayaran kedaluwarsa atau pesanan dibatalkan.
- Stok **dikurangi permanen** saat pembayaran terkonfirmasi.
- Pengurangan stok harus dilakukan dalam **transaksi database** untuk mencegah race condition/overselling saat trafik tinggi.

### 9.3 Aturan Webhook Pembayaran
- Verifikasi **signature** dari payment gateway sebelum memproses.
- Terapkan **idempotency** — webhook yang sama tidak boleh diproses dua kali.
- Selalu balas `200 OK` setelah diterima; proses berat dilakukan asinkron.
- Simpan raw payload untuk keperluan audit & debugging.

---

## 10. Non-Functional Requirements

### 10.1 Performance
- **LCP < 2.5s**, **INP < 200ms**, **CLS < 0.1** pada halaman utama & PDP.
- Lighthouse score ≥ 90 (Performance, Accessibility, Best Practices, SEO).
- Strategi rendering:
  - Homepage & PDP → **ISR** (revalidate 60–300 detik) untuk keseimbangan kecepatan & kesegaran data.
  - Daftar produk dengan filter → **SSR** atau ISR + client-side filtering.
  - Cart/Checkout/Account → **client-side / dynamic** (data personal, tidak boleh di-cache).
- Optimasi gambar wajib via `next/image` (format WebP/AVIF, lazy loading).
- Code splitting & dynamic import untuk komponen berat.
- Cache query katalog di Redis untuk mengurangi beban database.

### 10.2 SEO
- Meta title & description unik per produk & kategori (dapat diatur dari admin).
- **JSON-LD structured data**: `Product` (harga, ketersediaan, rating), `BreadcrumbList`, `Organization`.
- URL deskriptif berbasis slug (`/products/sepatu-lari-pria-hitam`).
- `sitemap.xml` dinamis (mencakup semua produk & kategori) + `robots.txt`.
- Canonical URL untuk mencegah duplicate content akibat parameter filter.
- Open Graph & Twitter Card untuk setiap produk.

### 10.3 Keamanan
- **Jangan pernah menyimpan data kartu kredit** — seluruh pemrosesan kartu didelegasikan ke payment gateway (PCI-DSS compliance ditangani provider).
- Password di-hash dengan **bcrypt/argon2**.
- Validasi & sanitasi seluruh input di **sisi server** (jangan hanya mengandalkan validasi client).
- Proteksi terhadap OWASP Top 10: SQL injection (dicegah via ORM), XSS (sanitasi rich text), CSRF (token pada form sensitif).
- **Rate limiting** pada endpoint login, register, reset password, dan checkout.
- Verifikasi signature pada semua webhook.
- HTTPS wajib; set security headers (CSP, HSTS, X-Frame-Options).
- Otorisasi ketat: pengguna hanya bisa mengakses pesanan/alamat miliknya sendiri (cek `ownership` di setiap query).
- Endpoint admin dilindungi middleware role-check.

### 10.4 Reliability
- Uptime target ≥ 99.5%.
- Backup database otomatis harian.
- Error monitoring via Sentry dengan alerting untuk error kritis (gagal bayar, gagal buat pesanan).
- Graceful degradation: jika API ongkir down, tampilkan pesan yang jelas & tawarkan tarif flat sebagai fallback.

### 10.5 Accessibility
- Kontras warna WCAG AA.
- Seluruh alur checkout dapat diselesaikan menggunakan keyboard.
- Label form eksplisit & pesan error yang dapat dibaca screen reader.
- `alt` text deskriptif pada seluruh gambar produk.

### 10.6 Responsiveness
- Mobile-first (mayoritas trafik e-commerce Indonesia dari mobile).
- Breakpoint: mobile (<640px), tablet (640–1024px), desktop (>1024px).
- Target sentuh minimal 44×44px pada elemen interaktif.
- Sticky "Tambah ke Keranjang" pada PDP versi mobile.

---

## 11. Struktur Folder

```
/src
  /app
    /(shop)
      page.tsx                      → Home
      /products/page.tsx            → Katalog
      /products/[slug]/page.tsx     → PDP
      /category/[slug]/page.tsx
      /search/page.tsx
      /cart/page.tsx
      /checkout/page.tsx
      layout.tsx                    → Navbar + Footer storefront
    /(auth)
      /login, /register, /forgot-password
    /(account)
      /account/**                   → Protected
    /admin
      /**                           → Protected + role check
    /api
      /webhooks/payment/route.ts
      /shipping/rates/route.ts
      /upload/route.ts
    sitemap.ts
    robots.ts
  /components
    /ui                             → shadcn components
    /product                        → ProductCard, Gallery, VariantSelector
    /cart                           → CartDrawer, CartItem
    /checkout                       → AddressForm, ShippingSelector
    /layout                         → Navbar, Footer
  /lib
    /db                             → Prisma client
    /auth                           → Auth config & helpers
    /payment                        → Integrasi gateway
    /shipping                       → Integrasi ekspedisi
    /validations                    → Skema Zod
    /utils                          → Formatter harga, tanggal, dll
  /server
    /actions                        → Server Actions
    /services                       → Business logic (order, inventory, pricing)
  /store                            → Zustand store
  /types
/prisma
  schema.prisma
  /migrations
/public
```

**Prinsip:** business logic (perhitungan harga, validasi stok, penerapan voucher) diletakkan di layer `services` — **bukan di dalam komponen** — agar dapat diuji secara independen dan digunakan ulang oleh Server Action maupun API Route.

---

## 12. Success Metrics

| Metrik | Target Awal |
|---|---|
| Conversion Rate | ≥ 2% |
| Cart Abandonment Rate | ≤ 70% (baseline industri ~70%) |
| Average Order Value (AOV) | Ditentukan sesuai kategori produk |
| Checkout Completion Rate | ≥ 50% dari yang memulai checkout |
| Payment Success Rate | ≥ 95% dari pesanan yang dibuat |
| LCP (Homepage & PDP) | < 2.5 detik |
| Error Rate (5xx) | < 0.5% |
| Halaman Produk Terindeks Google | ≥ 90% dari total katalog |

---

## 13. Roadmap Bertahap

### **Fase 1 — MVP (± 6–8 minggu)**
Fokus: pelanggan bisa membeli, admin bisa memproses.
- Katalog, kategori, PDP dengan varian
- Pencarian & filter dasar
- Keranjang & checkout (guest + registered)
- Integrasi 1 payment gateway + kalkulasi ongkir
- Manajemen pesanan (customer & admin)
- Auth dasar + alamat tersimpan
- Admin: produk, stok, pesanan, dashboard sederhana
- Email transaksional inti
- SEO dasar + sitemap

### **Fase 2 — Growth (± 4–6 minggu)**
Fokus: konversi & retensi.
- Voucher & sistem promo lengkap
- Ulasan & rating
- Wishlist
- Rekomendasi produk
- Login Google
- Laporan & export data
- Role-based access control + audit log
- Abandoned cart email

### **Fase 3 — Optimasi (berkelanjutan)**
- Search engine terdedikasi (Meilisearch/Algolia)
- Flash sale & bundling
- PWA / push notification
- A/B testing pada alur checkout
- Notifikasi WhatsApp
- Program loyalitas / poin

> **Estimasi total hingga Fase 2:** ± 10–14 minggu, dengan asumsi tim terdiri dari 1–2 developer full-stack. Estimasi dapat bergeser signifikan tergantung kompleksitas katalog, jumlah integrasi, dan kecepatan penyediaan konten/aset.

---

## 14. Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| **Overselling** akibat race condition pada stok | Tinggi | Gunakan transaksi database + row locking saat pengurangan stok |
| Webhook pembayaran gagal/terlewat | Tinggi | Implementasi retry, reconciliation job berkala, endpoint cek status manual |
| Harga/diskon salah hitung | Tinggi | Sentralisasi logika pricing di satu service + unit test menyeluruh |
| API ekspedisi/gateway down | Sedang | Fallback tarif flat, pesan error informatif, monitoring uptime |
| Performa lambat saat katalog membesar | Sedang | Pagination, indexing database yang tepat, caching Redis |
| Serangan bot/fraud order | Sedang | Rate limiting, CAPTCHA pada checkout, verifikasi email |
| Scope creep | Sedang | Disiplin pada roadmap bertahap; fitur baru masuk backlog, bukan MVP |

---

## 15. Asumsi

- Produk bersifat fisik (memerlukan pengiriman), bukan produk digital.
- Penjualan hanya dalam wilayah Indonesia, mata uang Rupiah (IDR).
- Satu penjual (single-vendor), bukan marketplace.
- Ketentuan pajak/PPN mengikuti konfigurasi sederhana yang dapat diatur di pengaturan toko.
- Konten produk (foto, deskripsi, harga) disediakan oleh pemilik bisnis.

---

## 16. Pertanyaan Terbuka

1. **Katalog**: Berapa perkiraan jumlah SKU? Apakah produk memiliki varian kompleks (misal ukuran × warna × bahan)?
2. **Payment**: Apakah sudah ada preferensi gateway (Midtrans/Xendit)? Apakah COD diperlukan?
3. **Pengiriman**: Kurir apa saja yang digunakan? Apakah ada opsi ambil di tempat (pickup) atau pengiriman instan (same-day)?
4. **Operasional**: Berapa estimasi pesanan per hari? (menentukan kebutuhan otomasi & skala infrastruktur)
5. **Tim**: Siapa yang akan mengoperasikan admin panel, dan berapa banyak level akses yang dibutuhkan?
6. **Integrasi**: Apakah perlu sinkronisasi dengan marketplace lain (Tokopedia/Shopee) atau sistem akuntansi?
7. **Konten**: Apakah aset produk (foto berkualitas, deskripsi) sudah tersedia?
8. **Prioritas**: Jika harus memilih, mana yang lebih mendesak — segera live dengan MVP, atau lengkap dengan fitur promo sejak awal?
