# TokoKita — Template E-Commerce Next.js (PRD v1.0)

Storefront + Admin Panel sesuai `PRD-E-Commerce-NextJS.md` (Fase 1 MVP + fondasi Fase 2).

## Jalankan

```bash
npm install
npm run dev   # http://localhost:3000
```

Demo tanpa database: katalog, keranjang (Zustand + localStorage), checkout, dan pesanan memakai data mock di `src/lib/data.ts`. Skema produksi (PostgreSQL + Prisma) tersedia di `prisma/schema.prisma`.

## Rute

| Area | Rute |
|---|---|
| Home | `/` |
| Katalog + filter/sort/pagination (query params) | `/products` |
| Kategori | `/category/[slug]` |
| Detail produk + varian + ulasan + JSON-LD | `/products/[slug]` |
| Pencarian + saran | `/search?q=` |
| Keranjang + voucher | `/cart` |
| Checkout (tamu/terdaftar, ongkir, voucher) | `/checkout` |
| Pembayaran + countdown | `/checkout/[orderId]/payment` |
| Sukses | `/checkout/success` |
| Auth | `/login`, `/register`, `/forgot-password` |
| Akun | `/account`, `/account/orders`, `/account/orders/[id]`, `/account/addresses`, `/account/profile`, `/account/wishlist` |
| Statis (SSG) | `/about`, `/contact`, `/faq`, `/terms`, `/privacy`, `/shipping-policy`, `/return-policy` |
| Admin | `/admin/*` (dashboard, produk, kategori, inventori, pesanan, pelanggan, promo, konten, laporan, pengaturan, user) |
| API | `/api/products`, `/api/checkout`, `/api/shipping/rates`, `/api/upload`, `/api/webhooks/payment` |

## Voucher demo

- `HEMAT10` — diskon 10% (maks Rp50rb, min Rp100rb)
- `POTONGAN20RB` — potongan Rp20rb (min Rp150rb)
- `GRATISONGKIR` — gratis ongkir (min Rp50rb)

## Catatan produksi (PRD §9–10)

- Stok: reserve saat order dibuat → kembalikan jika kedaluwarsa/batal → kurangi permanen saat webhook terkonfirmasi, dalam transaksi DB + row locking.
- Webhook: verifikasi signature, idempotency, balas 200 cepat, simpan raw payload.
- SEO: metadata per produk, JSON-LD Product, `sitemap.ts` + `robots.ts`, canonical via slug.
- Keamanan: hash bcrypt/argon2, validasi server (Zod), rate limit login/checkout, role-check admin, ownership check per query.
