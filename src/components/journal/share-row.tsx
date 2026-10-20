"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/toast";
import { Icon } from "@/components/ui/icon";

export function JournalShare({ title, slug }: { title: string; slug: string }) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const url = typeof window !== "undefined" ? `${window.location.origin}/journal/${slug}` : `/journal/${slug}`;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-[10px] font-bold uppercase tracking-widest2 text-ink-muted">Bagikan</span>
      <button
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            toast({ title: "Tautan disalin", tone: "info" });
            window.setTimeout(() => setCopied(false), 2000);
          } catch {
            toast({ title: "Tidak dapat menyalin tautan", tone: "danger" });
          }
        }}
        className="inline-flex items-center gap-1.5 rounded-full border border-sand-300 px-3 py-1.5 text-[11px] font-semibold text-ink-soft transition hover:border-ink hover:text-ink"
      >
        <Icon name={copied ? "check" : "copy"} size={12} /> {copied ? "Tersalin" : "Salin tautan"}
      </button>
      <a
        href={`https://wa.me/?text=${encodeURIComponent(`${title} — ${url}`)}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Bagikan ke WhatsApp"
        className="inline-flex items-center gap-1.5 rounded-full border border-sand-300 px-3 py-1.5 text-[11px] font-semibold text-ink-soft transition hover:border-ink hover:text-ink"
      >
        <Icon name="whatsapp" size={12} /> WhatsApp
      </a>
      <a
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Bagikan ke X"
        className="inline-flex items-center gap-1.5 rounded-full border border-sand-300 px-3 py-1.5 text-[11px] font-semibold text-ink-soft transition hover:border-ink hover:text-ink"
      >
        <Icon name="external" size={12} /> X
      </a>
    </div>
  );
}

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const listener = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? Math.min(100, (window.scrollY / total) * 100) : 0);
    };
    listener();
    window.addEventListener("scroll", listener, { passive: true });
    return () => window.removeEventListener("scroll", listener);
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-0.5 bg-transparent" aria-hidden>
      <div className="h-full bg-brass-500 transition-[width] duration-150" style={{ width: `${progress}%` }} />
    </div>
  );
}
