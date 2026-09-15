 
import dynamicImport from "next/dynamic";
import React from "react";

 
export const dynamic = "force-dynamic";

export default function BannerAdsListPage() {
  return (
    <div>
      <BannersAdsListLogic />
    </div>
  );
}
