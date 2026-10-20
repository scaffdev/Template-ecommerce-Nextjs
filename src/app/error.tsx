"use client";

import Link from "next/link";
import { useEffect } from "react";
import { buttonStyles } from "@/components/ui/button-styles";
import { Icon } from "@/components/ui/icon";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[tokobagus]", error);
  }, [error]);

  return (
    <div className="grid min-h-[70vh] place-items-center bg-canvas px-5 py-16">
      <div className="w-full max-w-lg text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#f6e4df] text-danger">
          <Icon name="alert" size={26} />
        </span>
        <p className="eyebrow mt-6">Terjadi kesalahan</p>
        <h1 className="display mt-3 text-3xl">Ada yang tidak berjalan sesuai rencana.</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          Coba muat ulang bagian ini. Jika masalah berlanjut, kembalikan data demo dari halaman akun →
          profil.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button onClick={reset} className={buttonStyles({})}>
            <Icon name="refresh" size={15} /> Coba lagi
          </button>
          <Link href="/" className={buttonStyles({ variant: "outline" })}>
            Kembali ke beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
