export default function ProductShowcaseSkeleton() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8 h-8 w-64 animate-pulse rounded-lg bg-slate-200" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-[350px] animate-pulse rounded-3xl bg-slate-100 p-4">
              <div className="mb-4 h-48 w-full rounded-2xl bg-slate-200" />
              <div className="mb-2 h-4 w-3/4 rounded bg-slate-200" />
              <div className="h-4 w-1/2 rounded bg-slate-200" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
