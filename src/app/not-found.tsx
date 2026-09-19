import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <p className="text-6xl font-black text-sky-200">404</p>
      <h1 className="mt-2 text-xl font-bold">Halaman tidak ditemukan</h1>
      <p className="mt-1 text-sm text-gray-600">Tautan mungkin sudah berubah atau produk sudah tidak tersedia.</p>
      <Link href="/" className="mt-6 rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white">Kembali ke Beranda</Link>
    </div>
  );
}
