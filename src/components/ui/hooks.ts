"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}

export function useCountdown(target?: string | number | Date | null) {
  const targetTime = useMemo(() => {
    if (!target) return null;
    return target instanceof Date ? target.getTime() : new Date(target).getTime();
  }, [target]);

  const getRemaining = () => {
    if (!targetTime) return 0;
    return Math.max(0, targetTime - Date.now());
  };

  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    setRemaining(getRemaining());
    const timer = window.setInterval(() => setRemaining(getRemaining()), 1000);
    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetTime]);

  const totalSeconds = Math.floor(remaining / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    expired: targetTime !== null && remaining <= 0,
  };
}

export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      node.classList.add("is-visible");
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return ref;
}

export function useOnClickOutside<T extends HTMLElement = HTMLDivElement>(onOutside: () => void) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) return;
      onOutside();
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [onOutside]);
  return ref;
}
