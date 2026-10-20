import { Skeleton } from "@/components/ui/primitives";

export default function PaymentLoading() {
  return (
    <div className="container-lume py-10 sm:py-14" aria-busy="true" aria-label="Memuat pembayaran">
      <Skeleton className="h-3 w-40" />
      <Skeleton className="mt-4 h-9 w-72" />
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-4">
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-2xl" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-52 w-full rounded-2xl" />
          <Skeleton className="h-36 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
