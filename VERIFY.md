# Instruksi Verifikasi Template

File ini berisi prompt untuk AI agent yang menjalankan verifikasi setelah fix audit keamanan.

## Prasyarat
- Node 20+ sudah terinstal.
- Repo sudah di-clone dan berada di root directory.

## Langkah Verifikasi

Jalankan perintah berikut secara berurutan dan laporkan hasilnya:

### 1. Install dependencies
```bash
npm ci
```

### 2. Build
```bash
npm run build
```

### 3. Lint
```bash
npm run lint
```

### 4. Security audit
```bash
npm audit --omit=dev
```

### 5. Smoke test
```bash
npm run start &
sleep 5
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/admin/login
curl -sI http://localhost:3000 | grep -i "x-content-type\|x-frame\|strict-transport"
kill %1
```

### 6. Verifikasi khusus
- POST ke `/api/webhooks/payment` tanpa header `x-signature` — harus return 401 atau 503 (bukan 200).
- POST ke `/api/checkout` dengan `items: []` — harus return 400.
- POST ke `/api/checkout` dengan items valid — response TIDAK boleh mengandung `total` dari client.
- Periksa `.gitignore` mengabaikan `.env` dan `*.tsbuildinfo`.
- Pastikan `tsconfig.tsbuildinfo` dan `prisma/` sudah dihapus.
- Pastikan `PRD-E-Commerce-NextJS.md` sudah dihapus.
- Periksa security headers di response.

## Yang Perlu Dilaporkan
- Apakah build dan lint berhasil?
- Hasil `npm audit`: ada advisory tersisa?
- HTTP status code smoke test (harus 200).
- Security headers ada di response?
- Hasil verifikasi endpoint webhook dan checkout.
