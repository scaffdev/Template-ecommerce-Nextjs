"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";
import { Icon } from "./icon";

function useLockBody(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [active]);
}

function useEscape(active: boolean, onClose: () => void) {
  useEffect(() => {
    if (!active) return;
    const listener = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [active, onClose]);
}

function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  size = "md",
  className,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const mounted = useMounted();
  const closeRef = useRef<HTMLButtonElement>(null);
  useLockBody(open);
  useEscape(open, onClose);

  useEffect(() => {
    if (open) window.setTimeout(() => closeRef.current?.focus(), 50);
  }, [open]);

  if (!mounted || !open) return null;

  const widths = {
    sm: "max-w-md",
    md: "max-w-xl",
    lg: "max-w-3xl",
    xl: "max-w-5xl",
  };

  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-end justify-center p-0 sm:items-center sm:p-6">
      <button
        aria-label="Tutup dialog"
        className="absolute inset-0 bg-ink/50 backdrop-blur-[2px] animate-fade-in"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "relative z-10 max-h-[92vh] w-full overflow-y-auto rounded-t-2xl border border-sand-200 bg-surface shadow-lift animate-slide-in-bottom sm:rounded-2xl sm:animate-scale-in",
          widths[size],
          className
        )}
      >
        {(title || description) && (
          <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-sand-200 bg-surface/95 px-5 py-4 backdrop-blur sm:px-6">
            <div>
              {title && <h2 className="display text-xl">{title}</h2>}
              {description && <p className="mt-1 text-xs leading-relaxed text-ink-muted">{description}</p>}
            </div>
            <button
              ref={closeRef}
              onClick={onClose}
              aria-label="Tutup"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-sand-200 text-ink-soft transition hover:bg-sand-100"
            >
              <Icon name="close" size={16} />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>,
    document.body
  );
}

export function Drawer({
  open,
  onClose,
  title,
  children,
  side = "right",
  width = "max-w-md",
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  side?: "right" | "left" | "bottom";
  width?: string;
  footer?: React.ReactNode;
}) {
  const mounted = useMounted();
  useLockBody(open);
  useEscape(open, onClose);

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[90]">
      <button
        aria-label="Tutup panel"
        className="absolute inset-0 bg-ink/50 backdrop-blur-[2px] animate-fade-in"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "absolute flex flex-col border-sand-200 bg-surface shadow-lift",
          side === "right" && cn("inset-y-0 right-0 w-full border-l animate-slide-in-right", width),
          side === "left" && cn("inset-y-0 left-0 w-full border-r animate-slide-in-right", width),
          side === "bottom" && "inset-x-0 bottom-0 max-h-[90vh] rounded-t-2xl border-t animate-slide-in-bottom"
        )}
      >
        <div className="flex items-center justify-between border-b border-sand-200 px-5 py-4">
          <h2 className="text-[11px] font-bold uppercase tracking-widest2 text-ink">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="grid h-9 w-9 place-items-center rounded-full border border-sand-200 text-ink-soft transition hover:bg-sand-100"
          >
            <Icon name="close" size={16} />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
        {footer && <div className="border-t border-sand-200 bg-surface p-5">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}
