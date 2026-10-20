import { Skeleton } from "@/components/ui/primitives";

export default function CategoryLoading() {
  return (
    <div className="container-lume py-10 sm:py-14" aria-busy="true" aria-label="Memuat kategori">
      <Skeleton className="h-3 w-32" />
      <Skeleton className="mt-4 h-10 w-2/3 max-w-md" />
      <Skeleton className="mt-3 h-4 w-full max-w-xl" />
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index}>
            <Skeleton className="aspect-[4/5] w-full rounded-2xl" />
            <Skeleton className="mt-3 h-4 w-3/4" />
            <Skeleton className="mt-2 h-4 w-1/3" />
          </div>
        ))}
      </div>
    </div>
  );
}
