"use client";

import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { useId } from "react";
import { cn } from "@/lib/cn";
import { formatIDR } from "@/lib/utils";
import { Icon, StarRow, type IconName } from "./icon";
import { buttonStyles, type ButtonSize, type ButtonVariant } from "./button-styles";

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  loading,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}) {
  return (
    <button
      className={buttonStyles({ variant, size, className })}
      disabled={props.disabled || loading}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />
      )}
      {children}
    </button>
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn("field", className)} {...props} />;
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn("field min-h-[110px] resize-y", className)} {...props} />;
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select className={cn("field appearance-none pr-10", className)} {...props}>
        {children}
      </select>
      <Icon
        name="chevron-down"
        size={16}
        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-muted"
      />
    </div>
  );
}

export function Field({
  label,
  hint,
  error,
  children,
  className,
}: {
  label?: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  const id = useId();
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="label">
          {label}
        </label>
      )}
      <div id={id}>{children}</div>
      {error ? (
        <p className="mt-1 text-[11px] font-medium text-danger">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-[11px] text-ink-muted">{hint}</p>
      ) : null}
    </div>
  );
}

export type BadgeTone = "neutral" | "brass" | "olive" | "danger" | "success" | "ink" | "sand";

const badgeTones: Record<BadgeTone, string> = {
  neutral: "bg-sand-100 text-ink-soft",
  brass: "bg-brass-100 text-brass-800",
  olive: "bg-olive-100 text-olive-800",
  danger: "bg-[#f6e4df] text-danger",
  success: "bg-[#e6ece2] text-success",
  ink: "bg-ink text-surface",
  sand: "bg-canvas text-ink-soft",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em]",
        badgeTones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("card-surface", className)}>{children}</div>;
}

export function Rating({ value, count, size }: { value: number; count?: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-ink-muted">
      <StarRow value={value} size={size} />
      <span className="font-semibold text-ink-soft">{value.toFixed(1)}</span>
      {count !== undefined && <span>({count.toLocaleString("id-ID")})</span>}
    </span>
  );
}

export function Price({
  value,
  compareAt,
  size = "md",
  className,
}: {
  value: number;
  compareAt?: number;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const sizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-2xl",
    xl: "text-4xl",
  };
  return (
    <span className={cn("inline-flex flex-wrap items-baseline gap-x-2 gap-y-0.5", className)}>
      <span className={cn("font-extrabold tracking-tight text-brand-600", sizes[size])}>{formatIDR(value)}</span>
      {compareAt && compareAt > value && (
        <span className="text-xs text-ink-muted line-through">{formatIDR(compareAt)}</span>
      )}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  action?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        align === "center" && "sm:flex-col sm:items-center sm:text-center",
        className
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h2 className="display text-3xl leading-[1.08] sm:text-4xl lg:text-[2.75rem]">{title}</h2>
        {description && (
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-soft sm:text-[15px]">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function EmptyState({
  icon = "bag",
  title,
  description,
  action,
  className,
}: {
  icon?: IconName;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center rounded-xl border border-dashed border-sand-300 bg-white px-6 py-16 text-center", className)}>
      <span className="grid h-14 w-14 place-items-center rounded-full bg-brand-50 text-brand-600">
        <Icon name={icon} size={24} />
      </span>
      <h3 className="mt-4 text-lg font-extrabold text-ink">{title}</h3>
      {description && <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-muted">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton rounded-lg", className)} />;
}

export function Divider({ className }: { className?: string }) {
  return <div className={cn("h-px w-full bg-sand-200", className)} />;
}

export function Checkbox({
  label,
  description,
  checked,
  onChange,
  className,
}: {
  label: ReactNode;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}) {
  const id = useId();
  return (
    <label htmlFor={id} className={cn("flex cursor-pointer items-start gap-3", className)}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden
        className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded border border-sand-400 bg-surface transition peer-checked:border-brand-600 peer-checked:bg-brand-600 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-500"
      >
        {checked && <Icon name="check" size={12} className="text-surface" />}
      </span>
      <span className="min-w-0">
        <span className="block text-sm text-ink">{label}</span>
        {description && <span className="mt-0.5 block text-xs leading-relaxed text-ink-muted">{description}</span>}
      </span>
    </label>
  );
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  size = "md",
  label = "Jumlah",
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  label?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-lg border border-sand-300 bg-white",
        size === "sm" ? "h-9" : "h-11"
      )}
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Kurangi jumlah"
        className={cn(
          "grid place-items-center rounded-md text-ink-soft transition hover:bg-sand-100 disabled:opacity-30",
          size === "sm" ? "h-8 w-8" : "h-10 w-10"
        )}
      >
        <Icon name="minus" size={14} />
      </button>
      <span className={cn("text-center font-semibold tabular-nums", size === "sm" ? "w-7 text-xs" : "w-9 text-sm")}>
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Tambah jumlah"
        className={cn(
          "grid place-items-center rounded-md text-ink-soft transition hover:bg-sand-100 disabled:opacity-30",
          size === "sm" ? "h-8 w-8" : "h-10 w-10"
        )}
      >
        <Icon name="plus" size={14} />
      </button>
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full transition",
        checked ? "bg-olive-700" : "bg-sand-300"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 h-5 w-5 rounded-full bg-surface shadow-sm transition",
          checked ? "left-[22px]" : "left-0.5"
        )}
      />
    </button>
  );
}

export function Progress({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-sand-200", className)}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-accent-400 to-brand-600 transition-all duration-500"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
