"use client";

import { useMemo } from "react";
import { useFetch } from "@/hooks/crud/UseCrud";
import BannerPlacementCard from "../ui/BannerPlacementCard";

const GRID_LAYOUTS = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
};

export default function BannerPlacementLogic({ position, className = "" }) {
  const { data, loading, error } = useFetch(
    { method: "GET", url: "/api/banner-ads" },
    []
  );

  // Filter and sort active banners by position and order
  const banners = useMemo(() => {
    const list = Array.isArray(data?.message?.data) ? data.message.data : [];
    const targetPos = position?.trim().toLowerCase();

    return list
      .filter((item) => {
        const itemPos = item?.position?.trim().toLowerCase();
        const hasImage = item?.desktopImage?.trim() || item?.mobileImage?.trim();
        return itemPos === targetPos && item?.isActive !== false && hasImage;
      })
      .sort((a, b) => (Number(a?.order) || 0) - (Number(b?.order) || 0));
  }, [data, position]);

  if (loading) {
    return (
      <div className={`w-full ${className}`}>
        <div className="h-32 sm:h-44 md:h-52 w-full animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
      </div>
    );
  }

  if (error || !banners.length) return null;

  const gridClass = GRID_LAYOUTS[banners.length] || GRID_LAYOUTS[4];

  return (
    <section className={`w-full my-6 sm:my-8 ${className}`}>
      <div className={`grid gap-4 sm:gap-6 ${gridClass}`}>
        {banners.map((banner) => (
          <BannerPlacementCard
            key={banner._id || banner.id}
            banner={banner}
            isCompact={banners.length > 1}
          />
        ))}
      </div>
    </section>
  );
}
