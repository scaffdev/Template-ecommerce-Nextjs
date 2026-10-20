"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  banners as seedBanners,
  categories as seedCategories,
  coupons as seedCoupons,
  products as seedProducts,
  storeSettings as seedSettings,
} from "@/lib/data";
import { generateId } from "@/lib/utils";
import type { Banner, Category, Coupon, Product, StoreSettings } from "@/types";

export interface AuditEntry {
  id: string;
  action: string;
  entity: string;
  entityId?: string;
  at: string;
}

interface CatalogState {
  products: Product[];
  categories: Category[];
  coupons: Coupon[];
  banners: Banner[];
  settings: StoreSettings;
  auditLog: AuditEntry[];
  addProduct: (product: Omit<Product, "id" | "createdAt">) => Product;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  adjustStock: (productId: string, variantId: string, quantityChange: number, note?: string) => void;
  addCategory: (category: Omit<Category, "id">) => void;
  updateCategory: (id: string, patch: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  addCoupon: (coupon: Omit<Coupon, "id">) => void;
  updateCoupon: (id: string, patch: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;
  addBanner: (banner: Omit<Banner, "id">) => void;
  updateBanner: (id: string, patch: Partial<Banner>) => void;
  deleteBanner: (id: string) => void;
  updateSettings: (patch: Partial<StoreSettings>) => void;
  logAudit: (entry: Omit<AuditEntry, "id" | "at">) => void;
  resetDemo: () => void;
}

const seed = {
  products: seedProducts,
  categories: seedCategories,
  coupons: seedCoupons,
  banners: seedBanners,
  settings: seedSettings,
  auditLog: [
    {
      id: "audit-1",
      action: "Menambahkan produk",
      entity: "Product",
      entityId: "p-aura-ring",
      at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "audit-2",
      action: "Memperbarui stok",
      entity: "Inventory",
      entityId: "p-arc-sneakers",
      at: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
  ] as AuditEntry[],
};

export const useCatalog = create<CatalogState>()(
  persist(
    (set, get) => ({
      ...seed,
      addProduct: (product) => {
        const created: Product = { ...product, id: generateId("p"), createdAt: new Date().toISOString() };
        set((state) => ({
          products: [created, ...state.products],
          auditLog: [
            { id: generateId("audit"), action: "Menambahkan produk", entity: "Product", entityId: created.id, at: new Date().toISOString() },
            ...state.auditLog,
          ],
        }));
        return created;
      },
      updateProduct: (id, patch) => {
        set((state) => ({
          products: state.products.map((product) => (product.id === id ? { ...product, ...patch } : product)),
          auditLog: [
            { id: generateId("audit"), action: "Memperbarui produk", entity: "Product", entityId: id, at: new Date().toISOString() },
            ...state.auditLog,
          ],
        }));
      },
      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((product) => product.id !== id),
          auditLog: [
            { id: generateId("audit"), action: "Menghapus produk", entity: "Product", entityId: id, at: new Date().toISOString() },
            ...state.auditLog,
          ],
        }));
      },
      adjustStock: (productId, variantId, quantityChange, note) => {
        set((state) => ({
          products: state.products.map((product) =>
            product.id === productId
              ? {
                  ...product,
                  variants: product.variants.map((variant) =>
                    variant.id === variantId
                      ? { ...variant, stock: Math.max(0, variant.stock + quantityChange) }
                      : variant
                  ),
                }
              : product
          ),
          auditLog: [
            {
              id: generateId("audit"),
              action: `Penyesuaian stok (${quantityChange > 0 ? "+" : ""}${quantityChange})${note ? ` — ${note}` : ""}`,
              entity: "Inventory",
              entityId: variantId,
              at: new Date().toISOString(),
            },
            ...state.auditLog,
          ],
        }));
      },
      addCategory: (category) => {
        set((state) => ({
          categories: [...state.categories, { ...category, id: generateId("c") }],
          auditLog: [
            { id: generateId("audit"), action: "Menambahkan kategori", entity: "Category", at: new Date().toISOString() },
            ...state.auditLog,
          ],
        }));
      },
      updateCategory: (id, patch) => {
        set((state) => ({
          categories: state.categories.map((category) => (category.id === id ? { ...category, ...patch } : category)),
        }));
      },
      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((category) => category.id !== id),
          auditLog: [
            { id: generateId("audit"), action: "Menghapus kategori", entity: "Category", entityId: id, at: new Date().toISOString() },
            ...state.auditLog,
          ],
        }));
      },
      addCoupon: (coupon) => {
        set((state) => ({
          coupons: [{ ...coupon, id: generateId("k") }, ...state.coupons],
          auditLog: [
            { id: generateId("audit"), action: "Menambahkan voucher", entity: "Coupon", at: new Date().toISOString() },
            ...state.auditLog,
          ],
        }));
      },
      updateCoupon: (id, patch) => {
        set((state) => ({
          coupons: state.coupons.map((coupon) => (coupon.id === id ? { ...coupon, ...patch } : coupon)),
        }));
      },
      deleteCoupon: (id) => {
        set((state) => ({ coupons: state.coupons.filter((coupon) => coupon.id !== id) }));
      },
      addBanner: (banner) => {
        set((state) => ({
          banners: [...state.banners, { ...banner, id: generateId("b") }],
          auditLog: [
            { id: generateId("audit"), action: "Menambahkan banner", entity: "Banner", at: new Date().toISOString() },
            ...state.auditLog,
          ],
        }));
      },
      updateBanner: (id, patch) => {
        set((state) => ({
          banners: state.banners.map((banner) => (banner.id === id ? { ...banner, ...patch } : banner)),
        }));
      },
      deleteBanner: (id) => {
        set((state) => ({ banners: state.banners.filter((banner) => banner.id !== id) }));
      },
      updateSettings: (patch) => {
        set((state) => ({ settings: { ...state.settings, ...patch } }));
      },
      logAudit: (entry) => {
        set((state) => ({
          auditLog: [{ ...entry, id: generateId("audit"), at: new Date().toISOString() }, ...state.auditLog],
        }));
      },
      resetDemo: () => set({ ...seed, products: seedProducts, auditLog: seed.auditLog }),
    }),
    {
      name: "tokobagus-catalog-v1",
      version: 1,
    }
  )
);

export function findCouponByCode(code: string) {
  const normalized = code.trim().toUpperCase();
  return useCatalog.getState().coupons.find((coupon) => coupon.code.toUpperCase() === normalized) ?? null;
}
