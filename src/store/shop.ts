"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types";

interface CartState {
  items: CartItem[];
  couponCode: string;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQty: (productId: string, variantId: string | undefined, qty: number) => void;
  clear: () => void;
  setCoupon: (code: string) => void;
  subtotal: () => number;
  count: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: "",
      addItem: (item) =>
        set((s) => {
          const idx = s.items.findIndex(
            (i) => i.productId === item.productId && i.variantId === item.variantId
          );
          if (idx >= 0) {
            const next = [...s.items];
            next[idx] = { ...next[idx], qty: Math.min(next[idx].qty + item.qty, next[idx].stock || 99) };
            return { items: next };
          }
          return { items: [...s.items, item] };
        }),
      removeItem: (productId, variantId) =>
        set((s) => ({
          items: s.items.filter((i) => !(i.productId === productId && i.variantId === variantId)),
        })),
      updateQty: (productId, variantId, qty) =>
        set((s) => ({
          items: qty <= 0
            ? s.items.filter((i) => !(i.productId === productId && i.variantId === variantId))
            : s.items.map((i) =>
                i.productId === productId && i.variantId === variantId
                  ? { ...i, qty: Math.min(qty, i.stock || 99) }
                  : i
              ),
        })),
      clear: () => set({ items: [], couponCode: "" }),
      setCoupon: (couponCode) => set({ couponCode }),
      subtotal: () => get().items.reduce((a, i) => a + i.price * i.qty, 0),
      count: () => get().items.reduce((a, i) => a + i.qty, 0),
    }),
    { name: "ecom-cart" }
  )
);

interface AuthState {
  user: { name: string; email: string } | null;
  login: (name: string, email: string) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: (name, email) => set({ user: { name, email } }),
      logout: () => set({ user: null }),
    }),
    { name: "ecom-auth" }
  )
);

interface WishState {
  ids: string[];
  toggle: (id: string) => void;
}

export const useWishlist = create<WishState>()(
  persist(
    (set) => ({
      ids: [],
      toggle: (id) => set((s) => ({ ids: s.ids.includes(id) ? s.ids.filter((x) => x !== id) : [...s.ids, id] })),
    }),
    { name: "ecom-wishlist" }
  )
);

const ORDER_KEY = "ecom-orders";
export function saveOrder(order: unknown) {
  try {
    const raw = localStorage.getItem(ORDER_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    arr.unshift(order);
    localStorage.setItem(ORDER_KEY, JSON.stringify(arr));
  } catch {}
}
export function getOrders(): // eslint-disable-next-line @typescript-eslint/no-explicit-any
any[] {
  try {
    return JSON.parse(localStorage.getItem(ORDER_KEY) || "[]");
  } catch {
    return [];
  }
}
