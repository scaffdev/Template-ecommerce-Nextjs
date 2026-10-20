import Link from "next/link";
import { cn } from "@/lib/cn";

export function Logo({ className, light = false }: { className?: string; light?: boolean }) {
  return (
    <Link href="/" aria-label="tokobagus.com — Beranda" className={cn("group inline-flex items-center gap-2", className)}>
      <span
        className={cn(
          "grid h-9 w-9 place-items-center rounded-lg text-white shadow-sm transition group-hover:scale-105",
          light ? "bg-white text-brand-600" : "bg-brand-600"
        )}
        aria-hidden
      >
        <svg viewBox="0 0 32 32" className="h-5 w-5" fill="none">
          <path d="M7 11h18l-1.5 15H8.5L7 11Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <path d="M11.5 12V9a4.5 4.5 0 0 1 9 0v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M12 18h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>
      <span className="leading-none">
        <span className={cn("block text-[18px] font-extrabold tracking-[-0.05em] sm:text-[19px]", light ? "text-white" : "text-ink")}>tokobagus.com</span>
        <span className={cn("mt-0.5 block text-[8px] font-bold uppercase tracking-[0.24em]", light ? "text-white/60" : "text-ink-muted")}>
          Online Store
        </span>
      </span>
    </Link>
  );
}
