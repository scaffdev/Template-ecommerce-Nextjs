"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { Icon, type IconName } from "./icon";
import { cn } from "@/lib/cn";

type ToastTone = "default" | "success" | "danger" | "info";

type ToastInput = {
  title: string;
  description?: string;
  tone?: ToastTone;
  icon?: IconName;
  duration?: number;
};

type ToastItem = ToastInput & { id: number };

const ToastContext = createContext<{ toast: (input: ToastInput) => void } | null>(null);

const toneStyles: Record<ToastTone, { icon: IconName; className: string }> = {
  default: { icon: "check-circle", className: "bg-ink text-surface" },
  success: { icon: "check-circle", className: "bg-olive-700 text-surface" },
  danger: { icon: "alert", className: "bg-danger text-surface" },
  info: { icon: "info", className: "bg-surface text-ink" },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const counter = useRef(0);

  const dismiss = useCallback((id: number) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback(
    (input: ToastInput) => {
      const id = ++counter.current;
      setItems((current) => [...current.slice(-2), { ...input, id }]);
      window.setTimeout(() => dismiss(id), input.duration ?? 4200);
    },
    [dismiss]
  );

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-20 right-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2 sm:bottom-6 sm:right-6">
        {items.map((item) => {
          const tone = toneStyles[item.tone ?? "default"];
          return (
            <div
              key={item.id}
              role="status"
              className={cn(
                "pointer-events-auto flex items-start gap-3 rounded-xl border border-sand-200 p-4 shadow-lift animate-scale-in",
                tone.className
              )}
            >
              <span className="mt-0.5">
                <Icon name={item.icon ?? tone.icon} size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold leading-snug">{item.title}</p>
                {item.description && (
                  <p className={cn("mt-0.5 text-xs leading-relaxed", item.tone === "info" ? "text-ink-muted" : "opacity-75")}>
                    {item.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => dismiss(item.id)}
                aria-label="Tutup notifikasi"
                className="rounded-full p-1 opacity-60 transition hover:bg-white/10 hover:opacity-100"
              >
                <Icon name="close" size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      toast: (input: ToastInput) => {
        if (typeof window !== "undefined") window.alert(input.title);
      },
    };
  }
  return context;
}
