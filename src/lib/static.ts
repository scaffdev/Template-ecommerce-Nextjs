const pages: Record<string, { title: string; body: string[] }> = {
  about: { title: "Tentang TokoKita", body: ["TokoKita adalah template e-commerce Next.js single-vendor untuk penjualan ritel Indonesia.", "Fokus: konversi tinggi, performa cepat (ISR), SEO kuat, dan keamanan transaksi."] },
  contact: { title: "Hubungi Kami", body: ["Email: halo@tokokita.id", "WhatsApp: 0812-0000-0000 (Senin–Sabtu 09.00–17.00 WIB)", "Alamat: Jl. Merdeka No. 10, Bandung."] },
  faq: { title: "FAQ", body: ["Q: Apakah bisa checkout tanpa daftar? A: Bisa (guest checkout).", "Q: Metode bayar apa saja? A: VA bank, QRIS, e-wallet, kartu, dan COD.", "Q: Berapa lama pengiriman? A: 1–3 hari tergantung kurir.", "Q: Bagaimana pengembalian? A: Maks. 7 hari setelah paket diterima, syarat & ketentuan berlaku."] },
  terms: { title: "Syarat & Ketentuan", body: ["Harga dalam Rupiah (IDR). Stok di-reserve saat pesanan dibuat dan dikembalikan jika pembayaran kedaluwarsa.", "Data kartu tidak pernah disimpan; pembayaran diproses gateway PCI-DSS."] },
  privacy: { title: "Kebijakan Privasi", body: ["Kami menyimpan nama, alamat, dan riwayat pesanan untuk fulfillment & retensi.", "Data tidak dijual ke pihak ketiga. Password di-hash bcrypt/argon2."] },
  "shipping-policy": { title: "Kebijakan Pengiriman", body: ["Pengiriman seluruh Indonesia via JNE, J&T, SiCepat, GoSend.", "Jika API ongkir down, tarif flat fallback berlaku dengan pemberitahuan jelas."] },
  "return-policy": { title: "Kebijakan Pengembalian", body: ["Pengajuan komplain maks. 7 hari setelah status Selesai.", "Refund diproses setelah barang retur diterima & diperiksa gudang."] },
};

export function staticPage(slug: string) {
  return pages[slug] ?? { title: slug, body: ["Konten segera hadir."] };
}
