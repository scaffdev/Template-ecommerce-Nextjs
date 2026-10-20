import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "brass" | "link";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

export const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-lg font-bold transition duration-200 disabled:pointer-events-none disabled:opacity-45";

export const buttonVariants: Record<ButtonVariant, string> = {
  primary: "bg-brand-600 text-white shadow-sm hover:bg-brand-700",
  secondary: "bg-ink text-white hover:bg-ink-soft",
  brass: "bg-accent-500 text-white shadow-sm hover:bg-accent-600",
  outline: "border border-sand-300 bg-surface text-ink hover:border-brand-500 hover:text-brand-600",
  ghost: "bg-transparent text-ink hover:bg-sand-100",
  danger: "bg-danger text-white hover:bg-red-700",
  link: "rounded-none bg-transparent p-0 text-brand-600 underline decoration-brand-200 underline-offset-4 hover:decoration-brand-600",
};

export const buttonSizes: Record<ButtonSize, string> = {
  sm: "min-h-[34px] px-3.5 text-xs",
  md: "min-h-[40px] px-5 text-sm",
  lg: "min-h-[48px] px-7 text-sm",
  icon: "h-10 w-10 p-0",
};

export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return cn(buttonBase, buttonVariants[variant], buttonSizes[size], className);
}
