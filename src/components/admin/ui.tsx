"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "@/components/ui/icon";

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
        <h1 className="display text-2xl sm:text-3xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon,
  trend,
  tone = "default",
}: {
  label: string;
  value: string;
  hint?: string;
  icon: IconName;
  trend?: { value: string; positive: boolean };
  tone?: "default" | "brass" | "olive";
}) {
  return (
    <div className="card-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            "grid h-10 w-10 place-items-center rounded-xl",
            tone === "brass" && "bg-brass-100 text-brass-800",
            tone === "olive" && "bg-olive-100 text-olive-800",
            tone === "default" && "bg-canvas-deep text-ink-soft"
          )}
        >
          <Icon name={icon} size={18} />
        </span>
        {trend && (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold",
              trend.positive ? "bg-[#e6ece2] text-success" : "bg-[#f6e4df] text-danger"
            )}
          >
            <Icon name="chevron-up" size={10} className={trend.positive ? "" : "rotate-180"} />
            {trend.value}
          </span>
        )}
      </div>
      <p className="mt-4 text-[11px] font-semibold uppercase tracking-widest text-ink-muted">{label}</p>
      <p className="display mt-1 text-2xl">{value}</p>
      {hint && <p className="mt-1 text-[11px] text-ink-muted">{hint}</p>}
    </div>
  );
}

export function AdminCard({
  title,
  description,
  action,
  children,
  className,
  bodyClassName,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={cn("card-surface overflow-hidden", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sand-200 px-5 py-4">
        <div>
          <h2 className="text-[11px] font-bold uppercase tracking-widest2 text-ink">{title}</h2>
          {description && <p className="mt-1 text-[11px] text-ink-muted">{description}</p>}
        </div>
        {action}
      </div>
      <div className={cn("p-5", bodyClassName)}>{children}</div>
    </section>
  );
}

export function MiniBars({
  data,
  formatValue,
  className,
}: {
  data: { label: string; value: number }[];
  formatValue?: (value: number) => string;
  className?: string;
}) {
  const max = Math.max(1, ...data.map((item) => item.value));
  return (
    <div className={cn("flex items-end gap-2", className)}>
      {data.map((item) => (
        <div key={item.label} className="group flex flex-1 flex-col items-center gap-2">
          <span className="text-[9px] font-semibold text-ink-muted opacity-0 transition group-hover:opacity-100">
            {formatValue ? formatValue(item.value) : item.value}
          </span>
          <div
            className="w-full rounded-t-md bg-olive-200 transition group-hover:bg-olive-600"
            style={{ height: `${Math.max(4, (item.value / max) * 120)}px` }}
            title={`${item.label}: ${formatValue ? formatValue(item.value) : item.value}`}
          />
          <span className="text-[9px] uppercase tracking-wide text-ink-muted">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export function BarRow({
  label,
  value,
  max,
  formatValue,
  tone = "olive",
}: {
  label: string;
  value: number;
  max: number;
  formatValue?: (value: number) => string;
  tone?: "olive" | "brass";
}) {
  const width = max > 0 ? Math.max(2, Math.round((value / max) * 100)) : 0;
  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-xs">
        <span className="truncate font-medium text-ink-soft">{label}</span>
        <span className="shrink-0 font-semibold text-ink">{formatValue ? formatValue(value) : value}</span>
      </div>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-sand-200">
        <div className={cn("h-full rounded-full", tone === "olive" ? "bg-olive-600" : "bg-brass-500")} style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

export function AdminEmpty({ colSpan, message }: { colSpan: number; message: string }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-5 py-10 text-center text-sm text-ink-muted">
        {message}
      </td>
    </tr>
  );
}

export function statusPill(active: boolean, activeLabel = "Aktif", inactiveLabel = "Nonaktif") {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide",
        active ? "bg-[#e6ece2] text-success" : "bg-sand-100 text-ink-muted"
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", active ? "bg-success" : "bg-sand-400")} />
      {active ? activeLabel : inactiveLabel}
    </span>
  );
}

export function csvDownload(filename: string, rows: (string | number)[][]) {
  const csv = rows
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
