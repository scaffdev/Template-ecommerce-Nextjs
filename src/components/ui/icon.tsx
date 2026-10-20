import type { SVGProps } from "react";

export type IconName =
  | "arrow-right"
  | "arrow-left"
  | "arrow-up-right"
  | "chevron-down"
  | "chevron-left"
  | "chevron-right"
  | "chevron-up"
  | "search"
  | "user"
  | "heart"
  | "bag"
  | "menu"
  | "close"
  | "plus"
  | "minus"
  | "star"
  | "check"
  | "check-circle"
  | "truck"
  | "shield"
  | "refresh"
  | "headset"
  | "trash"
  | "edit"
  | "eye"
  | "eye-off"
  | "filter"
  | "grid"
  | "list"
  | "share"
  | "copy"
  | "clock"
  | "map-pin"
  | "phone"
  | "mail"
  | "image"
  | "credit-card"
  | "qr"
  | "wallet"
  | "bank"
  | "package"
  | "home"
  | "layout-grid"
  | "box"
  | "tag"
  | "ticket"
  | "chart"
  | "settings"
  | "users"
  | "logout"
  | "bell"
  | "sparkles"
  | "leaf"
  | "award"
  | "gift"
  | "calendar"
  | "printer"
  | "download"
  | "alert"
  | "info"
  | "external"
  | "zoom"
  | "play"
  | "quote"
  | "lock"
  | "globe"
  | "bolt"
  | "compare"
  | "instagram"
  | "facebook"
  | "whatsapp"
  | "tiktok"
  | "pinterest"
  | "filter-x";

const strokeIcons: Partial<Record<IconName, React.ReactNode>> = {
  "arrow-right": <path d="M4 12h15m0 0-5.5-5.5M19 12l-5.5 5.5" />,
  "arrow-left": <path d="M20 12H5m0 0 5.5-5.5M5 12l5.5 5.5" />,
  "arrow-up-right": <path d="M7 17 17 7m0 0H8m9 0v9" />,
  "chevron-down": <path d="m6 9 6 6 6-6" />,
  "chevron-up": <path d="m6 15 6-6 6 6" />,
  "chevron-left": <path d="m15 6-6 6 6 6" />,
  "chevron-right": <path d="m9 6 6 6-6 6" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20c.8-3.5 3.7-5.5 7.5-5.5s6.7 2 7.5 5.5" />
    </>
  ),
  heart: <path d="M12 20s-7.5-4.5-7.5-9.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 7.5 3.5C19.5 15.5 12 20 12 20Z" />,
  bag: (
    <>
      <path d="M5 8h14l-1 12H6L5 8Z" />
      <path d="M9 9V6.5a3 3 0 0 1 6 0V9" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  star: <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3Z" />,
  check: <path d="m5 12.5 4.5 4.5L19 7" />,
  "check-circle": (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12 2.5 2.5 4.5-5" />
    </>
  ),
  truck: (
    <>
      <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7" />
      <circle cx="7" cy="18" r="1.7" />
      <circle cx="17.5" cy="18" r="1.7" />
    </>
  ),
  shield: <path d="m12 3 7 3v5.3c0 4.4-2.9 8-7 9.7-4.1-1.7-7-5.3-7-9.7V6l7-3Z" />,
  refresh: (
    <>
      <path d="M4.5 9A8 8 0 0 1 20 12" />
      <path d="M20 5v7h-7M19.5 15A8 8 0 0 1 4 12" />
      <path d="M4 19v-7h7" />
    </>
  ),
  headset: (
    <>
      <path d="M4 13v-1a8 8 0 0 1 16 0v1" />
      <path d="M4 13h2.5v6H6a2 2 0 0 1-2-2v-4ZM20 13h-2.5v6h.5a2 2 0 0 0 2-2v-4Z" />
      <path d="M17.5 19c0 1.5-1.5 2.5-4 2.5" />
    </>
  ),
  trash: (
    <>
      <path d="M4 7h16M9 7V5h6v2M6.5 7l.8 13h9.4l.8-13" />
      <path d="M10 11v5M14 11v5" />
    </>
  ),
  edit: <path d="m4 20 4.5-1 10-10L15 5.5l-10 10L4 20Z" />,
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  "eye-off": (
    <>
      <path d="M3 3l18 18M10 6.2c.6-.1 1.3-.2 2-.2 6 0 9.5 6 9.5 6a17 17 0 0 1-3 3.6M6 7.1C3.8 8.8 2.5 12 2.5 12S6 18 12 18c1.3 0 2.5-.3 3.6-.7" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </>
  ),
  filter: <path d="M4 6h16M7 12h10M10 18h4" />,
  "filter-x": <path d="M4 6h16M7 12h7M4 18l4-4m0 4-4-4" />,
  grid: (
    <>
      <rect x="4" y="4" width="6" height="6" />
      <rect x="14" y="4" width="6" height="6" />
      <rect x="4" y="14" width="6" height="6" />
      <rect x="14" y="14" width="6" height="6" />
    </>
  ),
  list: (
    <>
      <path d="M8 6h12M8 12h12M8 18h12" />
      <path d="M4 6h.01M4 12h.01M4 18h.01" />
    </>
  ),
  share: (
    <>
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="6" r="2.5" />
      <circle cx="18" cy="18" r="2.5" />
      <path d="m8.2 10.8 7.6-3.6M8.2 13.2l7.6 3.6" />
    </>
  ),
  copy: (
    <>
      <rect x="8" y="8" width="11" height="11" rx="1.5" />
      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  "map-pin": (
    <>
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  phone: <path d="M6.5 3.5h3l1.5 4-2 1.5a13 13 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A17.5 17.5 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2Z" />,
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </>
  ),
  image: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="9" cy="9" r="1.5" />
      <path d="m4 17 5-5 4 4 3-3 4 4" />
    </>
  ),
  "credit-card": (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 10h18M7 15h3" />
    </>
  ),
  qr: (
    <>
      <rect x="4" y="4" width="6" height="6" />
      <rect x="14" y="4" width="6" height="6" />
      <rect x="4" y="14" width="6" height="6" />
      <path d="M14 14h2v2h-2zM18 14h2M14 18h2M18 18h2v2h-2z" />
    </>
  ),
  wallet: (
    <>
      <path d="M4 6h14a2 2 0 0 1 2 2v10H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Z" />
      <path d="M3 8V6a2 2 0 0 1 2-2h12M16 12h4v3h-4a1.5 1.5 0 0 1 0-3Z" />
    </>
  ),
  bank: (
    <>
      <path d="M3 9 12 3l9 6M5 10v8M9 10v8M15 10v8M19 10v8M3 21h18" />
    </>
  ),
  package: (
    <>
      <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
      <path d="m4 7.5 8 4.5 8-4.5M12 12v9" />
    </>
  ),
  home: <path d="m3 11 9-7 9 7v9H3v-9Z" />,
  "layout-grid": (
    <>
      <rect x="3" y="3" width="8" height="8" rx="1.5" />
      <rect x="13" y="3" width="8" height="5" rx="1.5" />
      <rect x="13" y="10" width="8" height="11" rx="1.5" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" />
    </>
  ),
  box: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 4v5" />
    </>
  ),
  tag: (
    <>
      <path d="M20 13 13 20 3 10V3h7l10 10Z" />
      <circle cx="7.5" cy="7.5" r="1.2" />
    </>
  ),
  ticket: (
    <>
      <path d="M3 9V6h18v3a3 3 0 0 0 0 6v3H3v-3a3 3 0 0 0 0-6Z" />
      <path d="M12 6v2M12 16v2" />
    </>
  ),
  chart: <path d="M4 20V5M4 20h16M8 16v-4M12 16V8M16 16v-6M20 16V5" />,
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="m12 2 1.2 3a7 7 0 0 1 2.2.9l3-1.2 1.9 3.3-2.1 2.4a7 7 0 0 1 0 2.4l2.1 2.4-1.9 3.3-3-1.2a7 7 0 0 1-2.2.9L12 22l-1.2-3a7 7 0 0 1-2.2-.9l-3 1.2-1.9-3.3 2.1-2.4a7 7 0 0 1 0-2.4L3.7 9.2l1.9-3.3 3 1.2A7 7 0 0 1 10.8 5L12 2Z" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c.6-3.4 3.1-5.2 6.5-5.2s5.9 1.8 6.5 5.2" />
      <path d="M16 5.2a3.5 3.5 0 0 1 0 6.6M18 14.5c2 .7 3.3 2.5 3.5 5.5" />
    </>
  ),
  logout: <path d="M9 4H4v16h5M15 8l4 4-4 4M19 12H9" />,
  bell: (
    <>
      <path d="M18 9a6 6 0 0 0-12 0c0 5-2 6-2 6h16s-2-1-2-6Z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </>
  ),
  sparkles: (
    <>
      <path d="m12 3 1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3Z" />
      <path d="m18.5 15 .8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z" />
    </>
  ),
  leaf: (
    <>
      <path d="M5 20c0-9 5-15 15-16 0 10-5 15-12 15H5Z" />
      <path d="M4 21c2-6 6-9 12-12" />
    </>
  ),
  award: (
    <>
      <circle cx="12" cy="9" r="5" />
      <path d="m8.5 13.5-1 7 4.5-2.5 4.5 2.5-1-7" />
    </>
  ),
  gift: (
    <>
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M5 12v8h14v-8M12 8v12" />
      <path d="M12 8c-4 0-5-1.5-5-3a2 2 0 0 1 4-1c1 1 1 2.5 1 4ZM12 8c4 0 5-1.5 5-3a2 2 0 0 0-4-1c-1 1-1 2.5-1 4Z" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </>
  ),
  printer: (
    <>
      <path d="M6 9V3h12v6M6 17H4a1 1 0 0 1-1-1v-5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5a1 1 0 0 1-1 1h-2" />
      <path d="M6 14h12v7H6z" />
    </>
  ),
  download: <path d="M12 3v12m0 0 5-5m-5 5-5-5M4 19h16" />,
  alert: (
    <>
      <path d="m12 3 9 17H3L12 3Z" />
      <path d="M12 9v5M12 17h.01" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </>
  ),
  external: <path d="M14 4h6v6M20 4l-9 9M18 13v6H5V6h6" />,
  zoom: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5M8.5 11h5M11 8.5v5" />
    </>
  ),
  play: <path d="M8 5.5v13l11-6.5-11-6.5Z" />,
  quote: <path d="M9 7H5v6h4v4H3V9a6 6 0 0 1 6-6v4Zm12 0h-4v6h4v4h-6V9a6 6 0 0 1 6-6v4Z" />,
  lock: (
    <>
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 3 3.5 6 3.5 9s-1 6-3.5 9c-2.5-3-3.5-6-3.5-9s1-6 3.5-9Z" />
    </>
  ),
  bolt: <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />,
  compare: (
    <>
      <path d="M4 7h7M4 17h7M17 7h3M17 17h3" />
      <path d="m9 4 2 3-2 3M9 14l2 3-2 3" />
    </>
  ),
};

const brandIcons: Partial<Record<IconName, React.ReactNode>> = {
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.2 6.8h.01" />
    </>
  ),
  facebook: <path d="M14 8h3V4h-3c-2.8 0-5 2.2-5 5v3H6v4h3v6h4v-6h3l1-4h-4V9c0-.6.4-1 1-1Z" />,
  whatsapp: <path d="M20 11.6a8 8 0 0 1-11.9 7L4 20l1.4-4A8 8 0 1 1 20 11.6ZM9.2 8.5c.3 0 .7.7 1 1.4.1.4-.8.8-.6 1.4.5 1.1 1.6 2.2 2.7 2.7.6.3 1-.6 1.4-.5.7.3 1.4.7 1.4 1 .1.6-1.3 1.5-2 1.4-2.8-.4-5.6-3.2-6-6 0-.7.8-2.1 1.4-2.1Z" />,
  tiktok: <path d="M15 4c.5 2.5 2 4 4.5 4.3V12c-1.8 0-3.3-.6-4.5-1.5v5.7a5.7 5.7 0 1 1-5-5.6v3.6a2.2 2.2 0 1 0 1.5 2.1V4H15Z" />,
  pinterest: <path d="M12 3a9 9 0 0 0-3.3 17.4c-.1-.8-.2-2 0-2.9l1.2-5s-.3-.6-.3-1.5c0-1.4.8-2.4 1.8-2.4.9 0 1.3.6 1.3 1.4 0 .9-.6 2.2-.9 3.4-.2 1 .5 1.9 1.6 1.9 1.9 0 3.2-2.4 3.2-5.3 0-2.2-1.5-3.8-4.1-3.8-3 0-4.9 2.2-4.9 4.7 0 .9.3 1.5.7 2 .1.2.2.3.1.5l-.2.9c0 .2-.2.3-.4.2-1.4-.6-2.1-2.2-2.1-4C6 7 8.5 3.6 12.9 3.6c3.5 0 5.9 2.5 5.9 5.3 0 3.6-2 6.3-5 6.3-1 0-1.9-.5-2.2-1.1l-.6 2.4c-.2.8-.8 1.9-1.2 2.5A9 9 0 1 0 12 3Z" />,
};

export function Icon({
  name,
  size = 20,
  className,
  ...props
}: { name: IconName; size?: number } & SVGProps<SVGSVGElement>) {
  const brand = brandIcons[name];
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={brand ? "currentColor" : "none"}
      stroke={brand ? "none" : "currentColor"}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...props}
    >
      {brand ?? strokeIcons[name] ?? strokeIcons["info"]}
    </svg>
  );
}

export function StarRow({ value, size = 13, className = "" }: { value: number; size?: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`} aria-label={`Rating ${value} dari 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Icon
          key={n}
          name="star"
          size={size}
          className={n <= Math.round(value) ? "fill-amber-400 text-amber-400" : "fill-sand-200 text-sand-200"}
        />
      ))}
    </span>
  );
}
