# tokobagus.com — Template E-Commerce Editorial Next.js

Template storefront + admin panel bergaya editorial warm-luxury. Seluruh demo berjalan di sisi klien
(Zustand + localStorage) tanpa database, cocok untuk presentasi, portofolio, atau titik awal proyek.

## Jalankan

```bash
npm install
npm run dev   # http://localhost:3000
```

- Storefront: `http://localhost:3000`
- Admin panel: `http://localhost:3000/admin` — login dengan email apa pun + kata sandi min. 6 karakter
  (tersedia tombol "Isi kredensial demo").
- Akun pelanggan demo: `alya@example.com` (kata sandi bebas, min. 6 karakter).

## Fitur demo

- **Katalog**: filter kategori/harga/rating/diskon/stok, sort, tampilan grid/list, pagination, quick view.
- **PDP**: galeri multi-gambar (hover swap), varian, tabs deskripsi/spesifikasi/pengiriman/ulasan,
  distribusi rating, tulis ulasan (terverifikasi dari pesanan), related & recently viewed.
- **Keranjang & checkout**: voucher, progress gratis ongkir, 3 langkah checkout, pembayaran palsu
  (VA/QRIS/e-wallet/kartu/COD) dengan countdown & halaman sukses.
- **Akun**: pesanan + timeline, lacak kirim, wishlist, alamat (CRUD), profil & preferensi.
- **Konten**: about, contact, FAQ, journal (daftar + detail), 4 halaman kebijakan dengan TOC,
  lacak pesanan.
- **Admin**: dashboard, produk (CRUD + varian), kategori, inventori, pesanan (status + resi),
  pelanggan, voucher, banner, laporan (CSV export + reset demo), tim & akses, pengaturan toko.

## Voucher demo

- `TOKOBAGUS10` — diskon 10% (maks Rp250.000, min Rp500.000)
- `GRATISONGKIR` — gratis ongkir (min Rp750.000)
- `RITUAL50` — potongan Rp50.000 (min Rp300.000)

## Persistensi lokal

Semua state disimpan dengan prefix `tokobagus-*` (katalog, cart, wishlist, orders, akun, dsb.). Guna
mengulang demo dari nol, gunakan **Admin → Laporan → Reset katalog & pesanan**, atau tombol reset di
halaman **Akun → Profil**.

## API (simulasi)

`/api/products`, `/api/checkout`, `/api/shipping/rates`, `/api/upload`, dan
`/api/webhooks/payment` tersedia sebagai kerangka integrasi (validasi, signature, idempotency);
implementasi database masih berupa komentar di masing-masing route.

## Catatan produksi

- Ganti persistensi localStorage dengan API/database (skema contoh tersedia di `prisma/schema.prisma`).
- Perkuat admin: autentikasi nyata + role-check di server, rate limit login, audit server-side.
- Pembayaran: webhook dengan verifikasi signature, idempotency, dan row locking saat mengurangi stok.
- SEO: metadata per halaman, JSON-LD produk, `sitemap.ts`/`robots.ts` sudah tersedia — sesuaikan domain.
