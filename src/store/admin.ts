"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AdminProfile {
  name: string;
  email: string;
  role: string;
}

interface AdminState {
  admin: AdminProfile | null;
  login: (email: string) => void;
  logout: () => void;
}

export const useAdminAuth = create<AdminState>()(
  persist(
    (set) => ({
      admin: null,
      login: (email) => {
        const name = email
          .split("@")[0]
          .replace(/[._-]/g, " ")
          .replace(/\b\w/g, (letter) => letter.toUpperCase());
        set({ admin: { name: name || "Admin tokobagus.com", email, role: "Owner" } });
      },
      logout: () => set({ admin: null }),
    }),
    { name: "tokobagus-admin-v1" }
  )
);
