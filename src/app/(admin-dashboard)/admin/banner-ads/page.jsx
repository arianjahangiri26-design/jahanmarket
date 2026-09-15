"use client";

import dynamicImport from "next/dynamic";
import React from "react";

// لود داینامیک بدون SSR برای جلوگیری از شکست زمان بیلد
const BannersAdsListLogic = dynamicImport(
  () => import("@/components/admin/BannerAds/get/BannersAdsListLogic"),
  { ssr: false }
);

export const dynamic = "force-dynamic";

export default function BannerAdsListPage() {
  return (
    <div>
      <BannersAdsListLogic />
    </div>
  );
}
