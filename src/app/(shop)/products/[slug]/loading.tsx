import { Skeleton } from "@/components/ui/primitives";

export default function ProductLoading() {
  return (
    <div className="container-lume py-10 sm:py-14" aria-busy="true" aria-label="Memuat produk">
      <div className="flex items-center gap-2">
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-3 w-3 rounded-full" />
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-3 rounded-full" />
        <Skeleton className="h-3 w-28" />
      </div>
      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div>
          <Skeleton className="aspect-square w-full rounded-3xl" />
          <div className="mt-3 grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="aspect-square rounded-xl" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-4/5" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-8 w-36" />
          <Skeleton className="h-24 w-full rounded-2xl" />
          <div className="flex gap-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-10 w-24 rounded-full" />
            ))}
          </div>
          <Skeleton className="h-[52px] w-full rounded-full" />
          <Skeleton className="h-[52px] w-full rounded-full" />
        </div>
      </div>
    </div>
  );
}
