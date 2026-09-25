"use client";

import Skeleton from "react-loading-skeleton";

export default function UserPanelSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton height={40} width={192} />

      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-2xl">
            <Skeleton height={96} />
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-3xl">
            <Skeleton height={176} />
          </div>
        ))}
      </div>
    </div>
  );
}
