"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { reviews as seedReviews, seedOrders } from "@/lib/data";
import { generateOrderId } from "@/lib/utils";
import type { CartItem, Order, OrderCustomer, OrderStatus, Review, ShippingAddress } from "@/types";
import { useCatalog } from "./catalog";

interface CreateOrderInput {
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  couponCode?: string;
  courierId: string;
  courier: string;
  etd?: string;
  paymentMethodId: string;
  paymentMethod: string;
  address: ShippingAddress;
  customer: OrderCustomer;
  notes?: string;
}

interface OrdersState {
  orders: Order[];
  createOrder: (input: CreateOrderInput) => Order;
  updateStatus: (id: string, status: OrderStatus, note?: string) => void;
  setTracking: (id: string, trackingNumber: string) => void;
  markPaid: (id: string) => void;
  cancelOrder: (id: string) => void;
  expirePending: () => void;
  resetOrders: () => void;
}

function restock(order: Order) {
  const catalog = useCatalog.getState();
  order.items.forEach((item) => {
    if (item.variantId) {
      catalog.adjustStock(item.productId, item.variantId, item.qty, `Restock dari pembatalan ${order.id}`);
    }
  });
}

export const useOrders = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: seedOrders,
      createOrder: (input) => {
        const now = new Date();
        const id = generateOrderId();
        const order: Order = {
          ...input,
          id,
          orderNumber: `#${id}`,
          status: "pending",
          paymentStatus: input.paymentMethodId === "cod" ? "cod" : "unpaid",
          createdAt: now.toISOString(),
          expiresAt: new Date(now.getTime() + 24 * 3600000).toISOString(),
          timeline: [{ status: "pending", at: now.toISOString(), note: "Pesanan dibuat" }],
        };
        const catalog = useCatalog.getState();
        input.items.forEach((item) => {
          if (item.variantId) {
            catalog.adjustStock(item.productId, item.variantId, -item.qty, `Order ${id}`);
          }
        });
        set((state) => ({ orders: [order, ...state.orders] }));
        return order;
      },
      updateStatus: (id, status, note) => {
        const order = get().orders.find((current) => current.id === id);
        if (!order || order.status === status) return;
        if ((status === "cancelled" || status === "returned") && order.status !== "cancelled" && order.status !== "returned") {
          restock(order);
        }
        set((state) => ({
          orders: state.orders.map((current) =>
            current.id === id
              ? {
                  ...current,
                  status,
                  paymentStatus:
                    status === "cancelled" || status === "returned"
                      ? current.paymentStatus === "unpaid" || current.paymentStatus === "cod"
                        ? current.paymentStatus
                        : "refunded"
                      : status === "paid" || status === "processing" || status === "shipped" || status === "completed"
                        ? "paid"
                        : current.paymentStatus,
                  timeline: [...current.timeline, { status, at: new Date().toISOString(), note }],
                }
              : current
          ),
        }));
      },
      setTracking: (id, trackingNumber) => {
        set((state) => ({
          orders: state.orders.map((order) => (order.id === id ? { ...order, trackingNumber } : order)),
        }));
      },
      markPaid: (id) => {
        get().updateStatus(id, "paid", "Pembayaran diterima");
      },
      cancelOrder: (id) => {
        get().updateStatus(id, "cancelled", "Dibatalkan oleh pelanggan");
      },
      expirePending: () => {
        const now = Date.now();
        get().orders.forEach((order) => {
          if (order.status === "pending" && order.paymentStatus === "unpaid" && new Date(order.expiresAt).getTime() < now) {
            get().updateStatus(order.id, "cancelled", "Pembayaran kedaluwarsa — stok dikembalikan otomatis");
          }
        });
      },
      resetOrders: () => set({ orders: seedOrders }),
    }),
    { name: "tokobagus-orders-v1", version: 1 }
  )
);

interface ReviewsState {
  reviews: Review[];
  addReview: (review: Omit<Review, "id" | "date">) => void;
}

export const useReviews = create<ReviewsState>()(
  persist(
    (set) => ({
      reviews: seedReviews,
      addReview: (review) => {
        const entry = {
          ...review,
          id: `rev-${Date.now()}`,
          date: new Date().toISOString().slice(0, 10),
          verified: true,
        };
        set((state) => ({ reviews: [entry, ...state.reviews] }));
        const catalog = useCatalog.getState();
        const product = catalog.products.find((item) => item.id === review.productId);
        if (product) {
          const nextCount = product.reviewCount + 1;
          const nextRating = (product.rating * product.reviewCount + review.rating) / nextCount;
          catalog.updateProduct(product.id, { reviewCount: nextCount, rating: Math.round(nextRating * 10) / 10 });
        }
      },
    }),
    { name: "tokobagus-reviews-v1" }
  )
);
