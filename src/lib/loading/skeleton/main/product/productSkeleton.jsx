export default function ProductSkeleton() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="h-[420px] animate-pulse rounded-3xl bg-slate-200" />
        <div className="space-y-4">
          <div className="h-10 w-2/3 animate-pulse rounded-xl bg-slate-200" />
          <div className="h-8 w-1/3 animate-pulse rounded-xl bg-slate-200" />
          <div className="h-28 w-full animate-pulse rounded-2xl bg-slate-200" />
          <div className="h-14 w-40 animate-pulse rounded-2xl bg-slate-200" />
        </div>
      </div>
    </div>
  );
}
