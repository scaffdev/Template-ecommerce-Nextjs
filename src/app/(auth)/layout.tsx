import type { ReactNode } from "react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <Link href="/" className="text-xl font-extrabold text-sky-700">TokoKita<span className="text-amber-500">.</span></Link>
      </div>
      {children}
    </div>
  );
}
