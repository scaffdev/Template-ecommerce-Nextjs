"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "./icon";

export type AccordionItem = {
  id: string;
  title: string;
  content: React.ReactNode;
};

export function Accordion({
  items,
  defaultOpen,
  className,
}: {
  items: AccordionItem[];
  defaultOpen?: string;
  className?: string;
}) {
  const [open, setOpen] = useState<string | null>(defaultOpen ?? null);

  return (
    <div className={cn("divide-y divide-sand-200 border-y border-sand-200", className)}>
      {items.map((item) => {
        const isOpen = open === item.id;
        return (
          <div key={item.id}>
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : item.id)}
              className="flex w-full items-center justify-between gap-4 py-5 text-left"
            >
              <span className="text-sm font-semibold text-ink sm:text-[15px]">{item.title}</span>
              <span
                className={cn(
                  "grid h-8 w-8 shrink-0 place-items-center rounded-full border border-sand-300 text-ink-soft transition",
                  isOpen && "rotate-45 border-ink bg-ink text-surface"
                )}
              >
                <Icon name="plus" size={14} />
              </span>
            </button>
            <div
              className={cn(
                "grid transition-all duration-300 ease-out",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              )}
            >
              <div className="overflow-hidden">
                <div className="pb-5 pr-12 text-sm leading-relaxed text-ink-soft">{item.content}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
