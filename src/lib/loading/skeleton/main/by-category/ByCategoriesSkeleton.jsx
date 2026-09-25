// src/components/main/categories/CategoriesSkeleton.js
export default function CategoriesSkeleton() {
  return (
    <section className="mt-10">
      <div className="mb-6">
        <div className="h-7 w-40 animate-pulse rounded-xl bg-slate-200" />
        <div className="mt-2 h-4 w-64 animate-pulse rounded-xl bg-slate-100" />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex flex-col items-center justify-center">
              <div className="mb-4 h-20 w-20 animate-pulse rounded-full bg-slate-200" />
              <div className="h-4 w-20 animate-pulse rounded-xl bg-slate-200" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
