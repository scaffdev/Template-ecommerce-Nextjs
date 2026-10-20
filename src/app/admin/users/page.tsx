"use client";

import { useState } from "react";
import { useCatalog } from "@/store/catalog";
import { useAdminAuth } from "@/store/admin";
import { useToast } from "@/components/ui/toast";
import { AdminCard, AdminPageHeader } from "@/components/admin/ui";
import { Button, Field, Input, Select } from "@/components/ui/primitives";
import { Modal } from "@/components/ui/overlay";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/cn";
import { formatDateTime } from "@/lib/utils";

const ROLES = ["Owner", "Admin", "Staff", "Konten"] as const;
type Role = (typeof ROLES)[number];

interface Member {
  id: string;
  name: string;
  email: string;
  role: Role;
  lastActive: string;
}

const INITIAL_TEAM: Member[] = [
  { id: "u-1", name: "Alya Rahmawati", email: "alya@tokobagus.com", role: "Owner", lastActive: "2026-10-20T08:30:00Z" },
  { id: "u-2", name: "Bramantyo Putra", email: "bram@tokobagus.com", role: "Admin", lastActive: "2026-10-19T15:10:00Z" },
  { id: "u-3", name: "Citra Maharani", email: "citra@tokobagus.com", role: "Konten", lastActive: "2026-10-18T11:45:00Z" },
  { id: "u-4", name: "Damar Prakoso", email: "damar@tokobagus.com", role: "Staff", lastActive: "2026-10-17T09:20:00Z" },
];

const PERMISSIONS: { scope: string; owner: boolean; admin: boolean; staff: boolean; konten: boolean }[] = [
  { scope: "Dashboard & laporan", owner: true, admin: true, staff: true, konten: true },
  { scope: "Kelola produk & kategori", owner: true, admin: true, staff: true, konten: false },
  { scope: "Inventori & stok", owner: true, admin: true, staff: true, konten: false },
  { scope: "Pesanan & pengiriman", owner: true, admin: true, staff: true, konten: false },
  { scope: "Voucher & banner", owner: true, admin: true, staff: false, konten: true },
  { scope: "Pengaturan toko", owner: true, admin: false, staff: false, konten: false },
  { scope: "Kelola tim & akses", owner: true, admin: false, staff: false, konten: false },
];

export default function AdminUsersPage() {
  const { toast } = useToast();
  const auditLog = useCatalog((state) => state.auditLog);
  const currentAdmin = useAdminAuth((state) => state.admin);
  const [team, setTeam] = useState<Member[]>(INITIAL_TEAM);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({ name: "", email: "", role: "Staff" as Role });
  const [confirming, setConfirming] = useState<Member | null>(null);

  const invite = (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft.name.trim() || !/^\S+@\S+\.\S+$/.test(draft.email)) {
      return toast({ title: "Lengkapi nama dan email yang valid", tone: "danger" });
    }
    if (team.some((member) => member.email.toLowerCase() === draft.email.toLowerCase())) {
      return toast({ title: "Email sudah terdaftar di tim", tone: "danger" });
    }
    setTeam((current) => [
      ...current,
      { id: `u-${Date.now()}`, name: draft.name.trim(), email: draft.email.trim(), role: draft.role, lastActive: new Date().toISOString() },
    ]);
    toast({ title: "Anggota tim ditambahkan", description: `${draft.name} (${draft.role})`, tone: "success" });
    setDraft({ name: "", email: "", role: "Staff" });
    setOpen(false);
  };

  return (
    <div className="space-y-5">
      <AdminPageHeader
        eyebrow="Akses"
        title="Tim & peran"
        description="Kelola siapa yang bisa mengubah katalog, pesanan, dan pengaturan toko."
        actions={
          <Button size="sm" onClick={() => setOpen(true)}>
            <Icon name="plus" size={14} /> Undang anggota
          </Button>
        }
      />

      <div className="card-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-xs">
            <thead>
              <tr className="border-b border-sand-200 text-[9px] uppercase tracking-widest text-ink-muted">
                <th className="px-5 py-3 font-semibold">Anggota</th>
                <th className="px-3 py-3 font-semibold">Peran</th>
                <th className="px-3 py-3 font-semibold">Terakhir aktif</th>
                <th className="px-3 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-100">
              {team.map((member) => {
                const isSelf = currentAdmin?.email.toLowerCase() === member.email.toLowerCase();
                return (
                  <tr key={member.id} className="transition hover:bg-canvas-soft">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <span className="grid h-9 w-9 place-items-center rounded-full bg-olive-100 font-display text-xs text-olive-800">
                          {member.name.slice(0, 1)}
                        </span>
                        <div>
                          <p className="font-semibold text-ink">
                            {member.name}
                            {isSelf && <span className="ml-2 rounded-full bg-brass-100 px-2 py-0.5 text-[9px] font-bold text-brass-800">Anda</span>}
                          </p>
                          <p className="text-[10px] text-ink-muted">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <Select
                        value={member.role}
                        onChange={(event) => {
                          const role = event.target.value as Role;
                          setTeam((current) => current.map((entry) => (entry.id === member.id ? { ...entry, role } : entry)));
                          toast({ title: `Peran ${member.name} → ${role}`, tone: "info" });
                        }}
                        className="h-8 w-28 text-[10px]"
                        disabled={member.role === "Owner"}
                      >
                        {ROLES.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </Select>
                    </td>
                    <td className="px-3 py-3 text-[10px] text-ink-muted">{formatDateTime(member.lastActive)}</td>
                    <td className="px-3 py-3">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e6ece2] px-2.5 py-1 text-[9px] font-bold text-success">
                        <span className="h-1.5 w-1.5 rounded-full bg-success" /> Aktif
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => setConfirming(member)}
                        disabled={member.role === "Owner"}
                        className="grid h-8 w-8 place-items-center rounded-lg text-ink-muted transition hover:bg-canvas hover:text-danger disabled:opacity-30"
                        aria-label={`Hapus ${member.name}`}
                      >
                        <Icon name="trash" size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <AdminCard title="Matriks izin" description="Ringkasan akses per peran (demo statis)">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-xs">
              <thead>
                <tr className="border-b border-sand-200 text-[9px] uppercase tracking-widest text-ink-muted">
                  <th className="py-2.5 font-semibold">Modul</th>
                  {ROLES.map((role) => (
                    <th key={role} className="py-2.5 text-center font-semibold">
                      {role}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100">
                {PERMISSIONS.map((row) => (
                  <tr key={row.scope}>
                    <td className="py-2.5 pr-3 text-ink-soft">{row.scope}</td>
                    {[row.owner, row.admin, row.staff, row.konten].map((allowed, index) => (
                      <td key={index} className="py-2.5 text-center">
                        <span
                          className={cn(
                            "inline-grid h-5 w-5 place-items-center rounded-full",
                            allowed ? "bg-[#e6ece2] text-success" : "bg-sand-100 text-sand-400"
                          )}
                        >
                          <Icon name={allowed ? "check" : "minus"} size={11} />
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AdminCard>

        <AdminCard title="Jejak audit" description="Aktivitas terbaru di panel admin" bodyClassName="p-0">
          <ul className="max-h-[420px] divide-y divide-sand-100 overflow-y-auto">
            {auditLog.slice(0, 12).map((entry) => (
              <li key={entry.id} className="flex items-start gap-3 px-5 py-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brass-500" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-ink-soft">{entry.action}</p>
                  <p className="mt-0.5 text-[10px] text-ink-muted">
                    {entry.entity}
                    {entry.entityId ? ` · ${entry.entityId}` : ""} · {formatDateTime(entry.at)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </AdminCard>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Undang anggota tim">
        <form onSubmit={invite} className="space-y-4">
          <Field label="Nama lengkap">
            <Input value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} placeholder="Nama anggota" required />
          </Field>
          <Field label="Email">
            <Input type="email" value={draft.email} onChange={(event) => setDraft((current) => ({ ...current, email: event.target.value }))} placeholder="nama@tokobagus.com" required />
          </Field>
          <Field label="Peran">
            <Select value={draft.role} onChange={(event) => setDraft((current) => ({ ...current, role: event.target.value as Role }))}>
              {ROLES.filter((role) => role !== "Owner").map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </Select>
          </Field>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button type="submit">Kirim undangan</Button>
          </div>
        </form>
      </Modal>

      <Modal open={confirming !== null} onClose={() => setConfirming(null)} title="Hapus anggota tim?">
        <p className="text-sm leading-relaxed text-ink-soft">
          <strong className="text-ink">{confirming?.name}</strong> tidak akan bisa mengakses admin panel lagi.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setConfirming(null)}>
            Batal
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              if (!confirming) return;
              setTeam((current) => current.filter((member) => member.id !== confirming.id));
              toast({ title: "Anggota dihapus", description: confirming.name, tone: "success" });
              setConfirming(null);
            }}
          >
            Ya, hapus
          </Button>
        </div>
      </Modal>
    </div>
  );
}
