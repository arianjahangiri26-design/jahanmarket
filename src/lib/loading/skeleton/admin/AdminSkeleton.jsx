"use client";

import Skeleton from "react-loading-skeleton";

export default function AdminSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton height={32} width="33%" />

      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-2xl">
            <Skeleton height={160} />
          </div>
        ))}
      </div>

      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg">
            <Skeleton height={48} />
          </div>
        ))}
      </div>
    </div>
  );
}
