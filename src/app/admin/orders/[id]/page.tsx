"use client";
import { useState } from "react";
import { Card, Button, Input } from "@/components/ui/primitives";

export default function AdminOrderDetail() {
  const [resi, setResi] = useState("");
  const [status, setStatus] = useState("processing");
  return (
    <div className="space-y-3">
      <h1 className="text-xl font-bold">Detail Pesanan (simulasi)</h1>
      <Card>
        <p className="text-sm font-bold">Update status & resi</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {["paid", "processing", "shipped", "completed", "cancelled"].map((s) => (
            <button key={s} onClick={() => setStatus(s)} className={`rounded-full border px-3 py-1.5 text-xs font-bold ${status === s ? "bg-sky-600 text-white" : "bg-white"}`}>{s}</button>
          ))}
        </div>
        <div className="mt-2 flex gap-2">
          <Input value={resi} onChange={(e) => setResi(e.target.value)} placeholder="Nomor resi (mis. JNE123456)" />
          <Button onClick={() => alert(`Status → ${status}, resi ${resi || "-"} tersimpan + email "Pesanan Dikirim" dikirim (simulasi).`)}>Simpan</Button>
        </div>
      </Card>
      <Card>
        <p className="text-sm font-bold">Refund / pembatalan</p>
        <Button variant="danger" className="mt-2" onClick={() => alert("Refund diproses via gateway (simulasi) + stok dikembalikan.")}>Proses Refund</Button>
      </Card>
    </div>
  );
}
