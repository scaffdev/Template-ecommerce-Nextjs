export interface StaticSection {
  heading: string;
  body: string[];
}

export interface StaticPageContent {
  title: string;
  description: string;
  updated: string;
  sections: StaticSection[];
}

const pages: Record<string, StaticPageContent> = {
  terms: {
    title: "Syarat & Ketentuan",
    description: "Aturan penggunaan situs dan layanan belanja tokobagus.com Studio.",
    updated: "1 Oktober 2026",
    sections: [
      {
        heading: "1. Ketentuan umum",
        body: [
          "Dengan mengakses dan berbelanja di situs tokobagus.com, Anda dianggap telah membaca, memahami, dan menyetujui seluruh syarat dan ketentuan yang berlaku.",
          "tokobagus.com berhak memperbarui syarat dan ketentuan ini kapan pun. Perubahan akan diumumkan melalui halaman ini dan berlaku sejak tanggal pembaruan.",
        ],
      },
      {
        heading: "2. Produk & ketersediaan",
        body: [
          "Seluruh harga tercantum dalam Rupiah (IDR) dan sudah termasuk PPN 11%. Harga dapat berubah tanpa pemberitahuan, namun harga saat pesanan dibuat tetap berlaku.",
          "Karena banyak produk dibuat dalam batch kecil, ketersediaan stok dapat berubah cepat. Jika produk yang Anda pesan ternyata tidak tersedia, kami akan menghubungi Anda untuk menawarkan alternatif atau pengembalian dana penuh.",
        ],
      },
      {
        heading: "3. Pesanan & pembayaran",
        body: [
          "Pesanan dianggap sah setelah pembayaran terverifikasi. Untuk transfer bank dan QRIS, batas waktu pembayaran adalah 24 jam sejak pesanan dibuat.",
          "Jika pembayaran tidak diterima dalam batas waktu tersebut, pesanan akan dibatalkan otomatis dan stok dikembalikan ke katalog.",
          "Kami tidak pernah meminta data kartu melalui email, telepon, atau WhatsApp. Semua transaksi diproses melalui payment gateway bersertifikat PCI-DSS.",
        ],
      },
      {
        heading: "4. Pengiriman",
        body: [
          "Pengiriman dilakukan dari Jakarta Pusat melalui kurir mitra kami. Estimasi waktu tiba bersifat perkiraan dan dapat berubah karena kondisi cuaca, hari libur, atau kendala operasional kurir.",
          "Risiko kehilangan atau kerusakan barang selama pengiriman ditanggung bersama sesuai ketentuan kurir. Laporkan segera jika paket diterima dalam kondisi rusak.",
        ],
      },
      {
        heading: "5. Pengembalian & pembatalan",
        body: [
          "Anda dapat membatalkan pesanan dalam 2 jam setelah checkout dengan pengembalian dana penuh. Setelah pesanan diproses, pembatalan tunduk pada kebijakan pengembalian.",
          "Produk dapat dikembalikan dalam 30 hari setelah diterima, dengan syarat belum dipakai dan kemasan lengkap. Produk custom atau produk perawatan yang sudah dibuka tidak dapat dikembalikan.",
        ],
      },
      {
        heading: "6. Kekayaan intelektual",
        body: [
          "Seluruh konten di situs ini — termasuk foto, tulisan, logo, dan desain — merupakan milik tokobagus.com Studio dan tidak boleh digunakan tanpa izin tertulis.",
        ],
      },
    ],
  },
  privacy: {
    title: "Kebijakan Privasi",
    description: "Bagaimana tokobagus.com mengumpulkan, menggunakan, dan melindungi data Anda.",
    updated: "1 Oktober 2026",
    sections: [
      {
        heading: "1. Data yang kami kumpulkan",
        body: [
          "Nama, alamat email, nomor telepon, dan alamat pengiriman yang Anda berikan saat membuat akun atau checkout.",
          "Riwayat pesanan, preferensi komunikasi, dan interaksi Anda dengan situs untuk meningkatkan layanan.",
        ],
      },
      {
        heading: "2. Penggunaan data",
        body: [
          "Kami menggunakan data Anda untuk memproses pesanan, mengirim pembaruan pengiriman, menangani pengembalian, dan — jika Anda menyetujui — mengirim surat bulanan tentang koleksi baru.",
          "Kami tidak menjual atau menyewakan data pribadi Anda kepada pihak ketiga untuk tujuan pemasaran.",
        ],
      },
      {
        heading: "3. Berbagi dengan pihak ketiga",
        body: [
          "Data pengiriman dibagikan kepada kurir mitra hanya sebatas yang diperlukan untuk mengantar pesanan.",
          "Pembayaran diproses oleh payment gateway bersertifikat. tokobagus.com tidak menyimpan nomor kartu atau kredensial perbankan Anda.",
        ],
      },
      {
        heading: "4. Penyimpanan & keamanan",
        body: [
          "Data disimpan pada server yang dilindungi enkripsi. Kata sandi disimpan dalam bentuk hash dan tidak dapat dibaca oleh tim kami.",
          "Dalam demo template ini, seluruh data belanja disimpan di localStorage perangkat Anda dan tidak dikirim ke server mana pun.",
        ],
      },
      {
        heading: "5. Hak Anda",
        body: [
          "Anda dapat meminta salinan, koreksi, atau penghapusan data pribadi kapan pun melalui hello@tokobagus.com.",
          "Anda dapat berhenti menerima email pemasaran melalui tautan berhenti berlangganan di setiap email atau melalui halaman preferensi akun.",
        ],
      },
    ],
  },
  "shipping-policy": {
    title: "Kebijakan Pengiriman",
    description: "Cara pesanan Anda dikemas, dikirim, dan dilacak.",
    updated: "1 Oktober 2026",
    sections: [
      {
        heading: "Waktu proses",
        body: [
          "Pesanan yang pembayarannya terverifikasi sebelum pukul 14.00 WIB akan diproses pada hari yang sama. Pesanan setelah jam tersebut diproses pada hari kerja berikutnya.",
          "Produk yang memerlukan pengecekan khusus (misalnya perhiasan atau barang pecah belah) dapat memerlukan waktu tambahan 1–2 hari kerja.",
        ],
      },
      {
        heading: "Opsi kurir & tarif",
        body: [
          "JNE Reguler (2–3 hari) — Rp18.000, SiCepat BEST (1–2 hari) — Rp26.000, AnterAja Reguler (2–4 hari) — Rp16.000, dan GoSend Same Day (6–8 jam, Jabodetabek) — Rp42.000.",
          "Gratis ongkir otomatis berlaku untuk pesanan mulai Rp750.000 tanpa perlu kode khusus.",
        ],
      },
      {
        heading: "Pelacakan",
        body: [
          "Nomor resi dikirim melalui email dan tersedia di halaman detail pesanan begitu paket diserahkan ke kurir.",
          "Anda dapat melacak pesanan kapan pun melalui halaman Lacak Pesanan dengan memasukkan nomor pesanan.",
        ],
      },
      {
        heading: "Kemasan",
        body: [
          "Semua pesanan dikemas dengan bahan daur ulang dan bebas plastik sekali pakai. Produk pecah belah dilindungi lapisan kertas ganda dan diberi label khusus.",
          "Untuk hadiah, kami menyediakan kartu ucapan gratis dan bungkus kertas bebas plastik. Tambahkan catatan saat checkout.",
        ],
      },
    ],
  },
  "return-policy": {
    title: "Kebijakan Pengembalian",
    description: "Pengembalian dan penukaran yang mudah dalam 30 hari.",
    updated: "1 Oktober 2026",
    sections: [
      {
        heading: "Jangka waktu",
        body: [
          "Anda memiliki 30 hari kalender sejak paket diterima untuk mengajukan pengembalian atau penukaran.",
          "Produk harus dalam kondisi belum dipakai, belum dicuci, dengan label dan kemasan asli lengkap.",
        ],
      },
      {
        heading: "Cara mengajukan",
        body: [
          "Buka halaman detail pesanan di akun Anda, pilih produk yang ingin dikembalikan, lalu hubungi tim kami melalui WhatsApp atau email.",
          "Sertakan foto produk dan alasan pengembalian. Tim kami akan merespons dalam 1–2 hari kerja dengan instruksi pengiriman balik.",
        ],
      },
      {
        heading: "Biaya pengembalian",
        body: [
          "Biaya kirim pengembalian ditanggung tokobagus.com jika produk cacat, rusak saat pengiriman, atau salah kirim.",
          "Untuk pengembalian karena perubahan pikiran, biaya kirim balik ditanggung pelanggan.",
        ],
      },
      {
        heading: "Pengembalian dana",
        body: [
          "Dana dikembalikan ke metode pembayaran awal maksimal 7 hari kerja setelah produk retur diterima dan diperiksa.",
          "Untuk pembayaran COD, pengembalian dana dilakukan melalui transfer bank yang akan kami konfirmasi melalui email.",
        ],
      },
      {
        heading: "Pengecualian",
        body: [
          "Produk perawatan tubuh yang sudah dibuka, produk custom, dan barang pre-order tertentu tidak dapat dikembalikan kecuali cacat produksi.",
        ],
      },
    ],
  },
};

export function staticPage(slug: string) {
  return pages[slug];
}

export function staticSlugs() {
  return Object.keys(pages);
}
