"use client";

export default function CommentProductList() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-full bg-slate-200" />

          <div className="space-y-2">
            <div className="h-3 w-24 rounded-full bg-slate-200" />
            <div className="h-2.5 w-16 rounded-full bg-slate-100" />
          </div>
        </div>

        <div className="h-6 w-16 rounded-full bg-slate-200" />
      </div>

      <div className="space-y-2">
        <div className="h-3 w-full rounded-full bg-slate-200" />
        <div className="h-3 w-[92%] rounded-full bg-slate-200" />
        <div className="h-3 w-[78%] rounded-full bg-slate-200" />
      </div>
    </div>
  );
}
