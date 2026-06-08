export function ProductCardSkeleton() {
  return (
    <div className="group flex flex-col animate-pulse">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-brand/5">
      </div>
      <div className="mt-4 flex flex-col gap-2">
        <div className="h-4 w-3/4 bg-brand/10" />
        <div className="h-3 w-1/4 bg-brand/5" />
      </div>
    </div>
  );
}
export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:gap-8">
      {Array.from({ length: 8 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
