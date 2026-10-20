import { Skeleton } from "@/components/ui/primitives";

export default function AdminLoading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Memuat admin panel">
      <div className="flex items-end justify-between gap-4">
        <div>
          <Skeleton className="h-3 w-24" />
          <Skeleton className="mt-3 h-8 w-64" />
          <Skeleton className="mt-3 h-4 w-80" />
        </div>
        <Skeleton className="h-10 w-32 rounded-full" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-36 rounded-2xl" />
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <Skeleton className="h-72 rounded-2xl" />
        <Skeleton className="h-72 rounded-2xl" />
      </div>
    </div>
  );
}
