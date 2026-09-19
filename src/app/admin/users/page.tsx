import { Card } from "@/components/ui/primitives";

const users = [
  { name: "Owner", email: "owner@tokokita.id", role: "Owner" },
  { name: "Admin", email: "admin@tokokita.id", role: "Admin" },
  { name: "Gudang", email: "gudang@tokokita.id", role: "Staff Gudang" },
  { name: "CS", email: "cs@tokokita.id", role: "Customer Service" },
];

export default function AdminUsers() {
  return (
    <div>
      <h1 className="text-xl font-bold">User & Role</h1>
      <div className="mt-3 space-y-2">
        {users.map((u) => (
          <Card key={u.email} className="flex items-center gap-3">
            <div className="flex-1"><p className="text-sm font-bold">{u.name}</p><p className="text-xs text-gray-500">{u.email}</p></div>
            <span className="rounded-full bg-slate-800 px-3 py-1 text-[11px] font-bold text-white">{u.role}</span>
          </Card>
        ))}
      </div>
      <p className="mt-2 text-xs text-gray-500">Audit log: setiap perubahan admin dicatat (siapa, apa, kapan) — lihat implementasi di Prisma AuditLog.</p>
    </div>
  );
}
