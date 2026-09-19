"use client";
import { Card, Button } from "@/components/ui/primitives";

export default function AdminContent() {
  return (
    <div>
      <h1 className="text-xl font-bold">Banner Homepage</h1>
      <Card className="mt-3"><p className="text-sm font-bold">Hero: Belanja Lokal, Gratis Ongkir</p><p className="text-xs text-gray-500">Aktif • tampil di /</p><Button variant="outline" className="mt-2" onClick={() => {}}>Edit Banner</Button></Card>
    </div>
  );
}
