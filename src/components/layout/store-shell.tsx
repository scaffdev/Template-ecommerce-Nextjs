"use client";

import { useEffect, useState } from "react";
import { AnnouncementBar } from "./announcement";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { CartDrawer } from "./cart-drawer";
import { MobileBottomNav, WhatsAppFloat } from "./mobile-nav";
import { CompareBar } from "@/components/product/compare-bar";
import { Icon } from "@/components/ui/icon";
import { StoreSidebarFrame } from "./store-sidebars";
import { cn } from "@/lib/cn";

function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const listener = () => setVisible(window.scrollY > 700);
    window.addEventListener("scroll", listener, { passive: true });
    return () => window.removeEventListener("scroll", listener);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Kembali ke atas"
      className={cn(
        "fixed bottom-32 left-4 z-30 grid h-10 w-10 place-items-center rounded-lg border border-sand-300 bg-surface text-ink-soft shadow-soft transition duration-300 hover:border-brand-500 hover:text-brand-600 md:bottom-24 md:left-6",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      )}
    >
      <Icon name="chevron-up" size={17} />
    </button>
  );
}

export function StoreShell({ children, withSidebars = false }: { children: React.ReactNode; withSidebars?: boolean }) {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main id="main-content" className="min-h-[60vh] pb-20 md:pb-0">
        {withSidebars ? <StoreSidebarFrame>{children}</StoreSidebarFrame> : children}
      </main>
      <Footer />
      <div className="h-14 md:hidden" aria-hidden />
      <CartDrawer />
      <CompareBar />
      <MobileBottomNav />
      <WhatsAppFloat />
      <BackToTop />
    </>
  );
}
