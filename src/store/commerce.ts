"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types";

interface CartState {
  items: CartItem[];
  couponCode: string;
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQty: (productId: string, variantId: string | undefined, qty: number) => void;
  clear: () => void;
  setCoupon: (code: string) => void;
  setOpen: (open: boolean) => void;
  subtotal: () => number;
  count: () => number;
  hasItem: (productId: string) => boolean;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: "",
      isOpen: false,
      addItem: (item) =>
        set((state) => {
          const index = state.items.findIndex(
            (current) => current.productId === item.productId && current.variantId === item.variantId
          );
          const items =
            index >= 0
              ? state.items.map((current, itemIndex) =>
                  itemIndex === index
                    ? { ...current, qty: Math.min(current.qty + item.qty, current.stock || 99), stock: item.stock }
                    : current
                )
              : [...state.items, item];
          return { items, isOpen: true };
        }),
      removeItem: (productId, variantId) =>
        set((state) => ({
          items: state.items.filter((item) => !(item.productId === productId && item.variantId === variantId)),
        })),
      updateQty: (productId, variantId, qty) =>
        set((state) => ({
          items:
            qty <= 0
              ? state.items.filter((item) => !(item.productId === productId && item.variantId === variantId))
              : state.items.map((item) =>
                  item.productId === productId && item.variantId === variantId
                    ? { ...item, qty: Math.min(qty, item.stock || 99) }
                    : item
                ),
        })),
      clear: () => set({ items: [], couponCode: "", isOpen: false }),
      setCoupon: (couponCode) => set({ couponCode }),
      setOpen: (isOpen) => set({ isOpen }),
      subtotal: () => get().items.reduce((total, item) => total + item.price * item.qty, 0),
      count: () => get().items.reduce((total, item) => total + item.qty, 0),
      hasItem: (productId) => get().items.some((item) => item.productId === productId),
    }),
    {
      name: "tokobagus-cart-v1",
      partialize: (state) => ({ items: state.items, couponCode: state.couponCode }),
    }
  )
);

interface WishlistState {
  ids: string[];
  toggle: (id: string) => boolean;
  remove: (id: string) => void;
  has: (id: string) => boolean;
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) => {
        const exists = get().ids.includes(id);
        set((state) => ({
          ids: exists ? state.ids.filter((current) => current !== id) : [...state.ids, id],
        }));
        return !exists;
      },
      remove: (id) => set((state) => ({ ids: state.ids.filter((current) => current !== id) })),
      has: (id) => get().ids.includes(id),
    }),
    { name: "tokobagus-wishlist-v1" }
  )
);

interface RecentlyViewedState {
  ids: string[];
  add: (id: string) => void;
}

export const useRecentlyViewed = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      ids: [],
      add: (id) =>
        set((state) => ({
          ids: [id, ...state.ids.filter((current) => current !== id)].slice(0, 8),
        })),
    }),
    { name: "tokobagus-recent-v1" }
  )
);

interface CompareState {
  ids: string[];
  toggle: (id: string) => boolean;
  remove: (id: string) => void;
  clear: () => void;
  has: (id: string) => boolean;
}

export const MAX_COMPARE = 4;

export const useCompare = create<CompareState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) => {
        const exists = get().ids.includes(id);
        if (exists) {
          set((state) => ({ ids: state.ids.filter((current) => current !== id) }));
          return false;
        }
        if (get().ids.length >= MAX_COMPARE) return false;
        set((state) => ({ ids: [...state.ids, id] }));
        return true;
      },
      remove: (id) => set((state) => ({ ids: state.ids.filter((current) => current !== id) })),
      clear: () => set({ ids: [] }),
      has: (id) => get().ids.includes(id),
    }),
    { name: "tokobagus-compare-v1" }
  )
);

interface ClaimedVoucherState {
  codes: string[];
  claim: (code: string) => boolean;
  has: (code: string) => boolean;
}

export const useClaimedVouchers = create<ClaimedVoucherState>()(
  persist(
    (set, get) => ({
      codes: [],
      claim: (code) => {
        const normalized = code.trim().toUpperCase();
        if (get().codes.includes(normalized)) return false;
        set((state) => ({ codes: [...state.codes, normalized] }));
        return true;
      },
      has: (code) => get().codes.includes(code.trim().toUpperCase()),
    }),
    { name: "tokobagus-vouchers-v1" }
  )
);
