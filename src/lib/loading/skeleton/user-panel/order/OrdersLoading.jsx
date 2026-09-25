export default function OrdersLoading() {
  return (
    <section className="space-y-6" dir="rtl">
      <div className="space-y-4 border-b border-slate-200 pb-6">
        <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />

        <div className="h-9 w-52 animate-pulse rounded bg-slate-200" />

        <div className="h-4 max-w-xl animate-pulse rounded bg-slate-200" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-32 animate-pulse rounded-3xl bg-slate-100"
          />
        ))}
      </div>

      <div className="space-y-4">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-64 animate-pulse rounded-3xl bg-slate-100"
          />
        ))}
      </div>
    </section>
  );
}
