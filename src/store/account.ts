"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { notifications as seedNotifications, profile as demoProfile, savedAddresses as seedAddresses } from "@/lib/data";
import { generateId } from "@/lib/utils";
import type { NotificationItem, Profile, SavedAddress } from "@/types";

interface AuthState {
  user: Profile | null;
  login: (email: string, name?: string) => void;
  register: (name: string, email: string, phone?: string) => void;
  logout: () => void;
  updateProfile: (patch: Partial<Profile>) => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      login: (email, name) => {
        if (email.toLowerCase() === demoProfile.email.toLowerCase()) {
          set({ user: demoProfile });
          return;
        }
        const displayName = name?.trim() || email.split("@")[0].replace(/[._-]/g, " ");
        set({
          user: {
            ...demoProfile,
            id: `user-${Date.now()}`,
            name: displayName.replace(/\b\w/g, (letter) => letter.toUpperCase()),
            email,
            phone: "",
          },
        });
      },
      register: (name, email, phone) => {
        set({
          user: {
            ...demoProfile,
            id: `user-${Date.now()}`,
            name,
            email,
            phone: phone ?? "",
            joinedAt: new Date().toISOString().slice(0, 10),
          },
        });
      },
      logout: () => set({ user: null }),
      updateProfile: (patch) => {
        const user = get().user;
        if (!user) return;
        set({ user: { ...user, ...patch } });
      },
    }),
    { name: "tokobagus-auth-v1" }
  )
);

interface AddressState {
  addresses: SavedAddress[];
  addAddress: (address: Omit<SavedAddress, "id">) => void;
  updateAddress: (id: string, patch: Partial<SavedAddress>) => void;
  deleteAddress: (id: string) => void;
  setDefault: (id: string) => void;
}

export const useAddresses = create<AddressState>()(
  persist(
    (set) => ({
      addresses: seedAddresses,
      addAddress: (address) =>
        set((state) => {
          const id = generateId("addr");
          const normalized = state.addresses.map((item) => (address.isDefault ? { ...item, isDefault: false } : item));
          return { addresses: [...normalized, { ...address, id }] };
        }),
      updateAddress: (id, patch) =>
        set((state) => ({
          addresses: state.addresses.map((address) => {
            if (address.id === id) return { ...address, ...patch };
            if (patch.isDefault) return { ...address, isDefault: false };
            return address;
          }),
        })),
      deleteAddress: (id) =>
        set((state) => {
          const remaining = state.addresses.filter((address) => address.id !== id);
          if (remaining.length > 0 && !remaining.some((address) => address.isDefault)) {
            remaining[0] = { ...remaining[0], isDefault: true };
          }
          return { addresses: remaining };
        }),
      setDefault: (id) =>
        set((state) => ({
          addresses: state.addresses.map((address) => ({ ...address, isDefault: address.id === id })),
        })),
    }),
    { name: "tokobagus-addresses-v1" }
  )
);

interface NotificationState {
  notifications: NotificationItem[];
  addNotification: (notification: Omit<NotificationItem, "id" | "date" | "read">) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  remove: (id: string) => void;
  unread: () => number;
}

export const useNotifications = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: seedNotifications,
      addNotification: (notification) =>
        set((state) => {
          if (
            notification.productId &&
            state.notifications.some(
              (item) => item.productId === notification.productId && item.type === "restock"
            )
          ) {
            return state;
          }
          return {
            notifications: [
              {
                ...notification,
                id: generateId("notif"),
                date: new Date().toISOString(),
                read: false,
              },
              ...state.notifications,
            ],
          };
        }),
      markRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((notification) =>
            notification.id === id ? { ...notification, read: true } : notification
          ),
        })),
      markAllRead: () =>
        set((state) => ({
          notifications: state.notifications.map((notification) => ({ ...notification, read: true })),
        })),
      remove: (id) =>
        set((state) => ({ notifications: state.notifications.filter((notification) => notification.id !== id) })),
      unread: () => get().notifications.filter((notification) => !notification.read).length,
    }),
    { name: "tokobagus-notifications-v1" }
  )
);

interface PreferencesState {
  newsletter: boolean;
  orderUpdates: boolean;
  promotions: boolean;
  setPreference: (key: "newsletter" | "orderUpdates" | "promotions", value: boolean) => void;
}

export const usePreferences = create<PreferencesState>()(
  persist(
    (set) => ({
      newsletter: true,
      orderUpdates: true,
      promotions: false,
      setPreference: (key, value) => set({ [key]: value } as Pick<PreferencesState, typeof key>),
    }),
    { name: "tokobagus-preferences-v1" }
  )
);
