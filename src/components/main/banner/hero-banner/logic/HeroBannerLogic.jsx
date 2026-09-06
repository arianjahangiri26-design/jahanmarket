"use client";

import { useMemo } from "react";
import { useFetch } from "@/hooks/crud/UseCrud";
import HeroBannerView from "../ui/HeroBannerView";

export default function HeroBannerLogic() {
  const { data, loading, error } = useFetch(
    {
      method: "GET",
      url: "/api/banner-ads",
    },
    []
  );

  // Filter and prepare banners for the main slider
  const banners = useMemo(() => {
    const rawBanners = Array.isArray(data?.message?.data) ? data.message.data : [];

    return rawBanners
      .filter((banner) => {
        const isMainSlider = banner?.position === "main-slider";
        const isActive = banner?.isActive !== false;
        const hasImage = !!(banner?.desktopImage || banner?.mobileImage);

        return isMainSlider && isActive && hasImage;
      })
      .map((banner) => ({
        ...banner,
        // Fallback mobile image to desktop image if empty
        mobileImage: banner.mobileImage || banner.desktopImage,
      }))
      .sort((a, b) => (Number(a?.order) || 0) - (Number(b?.order) || 0));
  }, [data]);

  if (loading) {
    return (
      <div className="relative h-[280px] w-full overflow-hidden rounded-[32px] bg-slate-200 animate-pulse md:h-[400px] lg:h-[650px]" />
    );
  }

  if (error || !banners.length) return null;

  return <HeroBannerView banners={banners} />;
}
