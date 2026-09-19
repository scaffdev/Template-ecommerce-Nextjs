"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Button, Input } from "@/components/ui/primitives";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("owner@tokokita.id");
  return (
    <div className="mx-auto max-w-sm py-16">
      <Card>
        <h1 className="text-xl font-bold">Admin Login</h1>
        <p className="text-xs text-gray-500">Middleware role-check di produksi (Owner/Admin/Gudang/CS).</p>
        <label className="mt-3 block text-xs">Email<Input value={email} onChange={(e) => setEmail(e.target.value)} /></label>
        <label className="mt-2 block text-xs">Password<Input type="password" defaultValue="admin123" /></label>
        <Button className="mt-3 w-full" onClick={() => router.push("/admin")}>Masuk Dashboard</Button>
      </Card>
    </div>
  );
}
