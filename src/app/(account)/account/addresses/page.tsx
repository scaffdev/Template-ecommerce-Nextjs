"use client";
import { useState } from "react";
import { Card, Button, Input } from "@/components/ui/primitives";

export default function AddressesPage() {
  const [list, setList] = useState([{ id: "a1", label: "Rumah", recipient: "Saya", detail: "Jl. Merdeka No. 10, Bandung", main: true }]);
  const [detail, setDetail] = useState("");
  return (
    <div>
      <h1 className="text-xl font-bold">Alamat Tersimpan</h1>
      <div className="mt-3 space-y-2">
        {list.map((a) => (
          <Card key={a.id} className="flex items-center gap-3">
            <div className="flex-1"><p className="font-bold text-sm">{a.label} {a.main && <span className="ml-1 rounded bg-emerald-100 px-2 py-0.5 text-[11px] text-emerald-700">Utama</span>}</p><p className="text-xs text-gray-600">{a.recipient} — {a.detail}</p></div>
            <button className="text-xs text-red-600" onClick={() => setList((l) => l.filter((x) => x.id !== a.id))}>Hapus</button>
          </Card>
        ))}
      </div>
      <Card className="mt-4">
        <p className="text-sm font-bold">Tambah alamat</p>
        <div className="mt-2 flex gap-2">
          <Input value={detail} onChange={(e) => setDetail(e.target.value)} placeholder="Jalan, kota, kode pos…" />
          <Button onClick={() => { if (detail.length > 5) { setList((l) => [...l, { id: `a${Date.now()}`, label: "Lainnya", recipient: "Saya", detail, main: false }]); setDetail(""); } }}>Simpan</Button>
        </div>
      </Card>
    </div>
  );
}
