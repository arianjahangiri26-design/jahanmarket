"use client";

import { useMemo } from "react";
import { useFetch } from "@/hooks/crud/UseCrud";
import HeroBannerView from "../ui/HeroBannerView";
 
   

export default function HeroBannerLogic() {
    const { data, loading, error } = useFetch(
        {
            method: "GET",
            url: "/api/admin/banner-ads",

        },
        []
    );

    const banners = useMemo(() => {
        const rawBanners = data?.message?.data || data?.data || [];
console.log(rawBanners);

        return rawBanners
            .filter(
                (banner) =>
                    banner?.isActive === true &&
                    banner?.position === "main-slider" &&
                    (banner?.desktopImage || banner?.mobileImage)
            )
            .sort((a, b) => (a?.order || 0) - (b?.order || 0));
    }, [data]);
 
    if (loading) {
        return (
            <div className="relative h-[220px] overflow-hidden rounded-[32px] bg-slate-200 md:h-[320px] lg:h-[420px] animate-pulse">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200" />
            </div>
        );
    }

    if (error) {
        return null;
    }

    if (!banners.length) {
        return null;
    }

    return <HeroBannerView banners={banners} />;
}
