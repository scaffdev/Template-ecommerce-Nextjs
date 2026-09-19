"use client";
import Link from "next/link";
import { useAuth, getOrders } from "@/store/shop";
import { Card } from "@/components/ui/primitives";
import { useEffect, useState } from "react";

export default function AccountHome() {
  const user = useAuth((s) => s.user);
  const [count, setCount] = useState(0);
  useEffect(() => { setCount(getOrders().length); }, []);
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Halo, {user?.name ?? "Tamu"} 👋</h1>
      <div className="grid gap-3 md:grid-cols-3">
        <Card><p className="text-xs text-gray-500">Total Pesanan</p><b className="text-2xl">{count}</b></Card>
        <Card><p className="text-xs text-gray-500">Email</p><b className="text-sm">{user?.email ?? "-"}</b></Card>
        <Card><p className="text-xs text-gray-500">Aksi cepat</p><Link href="/account/orders" className="text-sm text-sky-600 underline">Lacak pesanan →</Link></Card>
      </div>
    </div>
  );
}
