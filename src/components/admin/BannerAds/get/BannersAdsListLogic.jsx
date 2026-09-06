"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useFetch } from "@/hooks/crud/UseCrud";
import AdminTable from "@/shared/admin/AdminTable";
import { BANNER_POSITIONS, getBannerPositionLabel } from "@/constants/admin/banner-ads/bannerAds";
 
 
export default function BannersAdsListLogic() {
  const { request, loading } = useFetch();
  const requestRef = useRef(request);
  requestRef.current = request;

  const [banners, setBanners] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState("");

  const fetchBanners = useCallback(async () => {
    const url = selectedPosition
      ? `/api/admin/banner-ads?position=${encodeURIComponent(selectedPosition)}`
      : "/api/admin/banner-ads";

    const res = await requestRef.current({
      method: "GET",
      url,
    });

    const items =
      res?.data?.data ||
      res?.data?.message?.data ||
      res?.message?.data ||
      res?.data ||
      [];

    if (Array.isArray(items)) {
      setBanners(items);
    }
  }, [selectedPosition]);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const handleDelete = async (id) => {
    if (!window.confirm("آیا از حذف این بنر مطمئن هستید؟ فایل‌های تصویر نیز از سرور پاک می‌شوند.")) {
      return;
    }

    const res = await requestRef.current({
      method: "DELETE",
      url: `/api/admin/banner-ads/${id}`,
    });

    const isSuccess = res?.success || res?.data?.success || res?.status === 200;
    if (isSuccess) {
      fetchBanners();
    }
  };

  const columns = [
    { key: "desktopImage", label: "تصویر دسکتاپ" },
    { key: "mobileImage", label: "تصویر موبایل" },
    { key: "title", label: "عنوان" },
    { key: "positionLabel", label: "جایگاه نمایش" },
    { key: "order", label: "ترتیب" },
    { key: "isActive", label: "وضعیت" },
  ];

  const rows = banners.map((item) => ({
    ...item,
    desktopImage: item.desktopImage ? (
      <div className="relative h-12 w-24 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
        <Image
          src={item.desktopImage}
          alt={item.title || "تصویر بنر"}
          fill
          sizes="96px"
          className="object-cover"
          unoptimized
        />
      </div>
    ) : (
      <div className="flex h-12 w-24 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50">
        <span className="text-[10px] text-slate-400">بدون عکس</span>
      </div>
    ),
    mobileImage: item.mobileImage ? (
      <div className="relative h-12 w-12 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
        <Image
          src={item.mobileImage}
          alt="موبایل"
          fill
          sizes="48px"
          className="object-cover"
          unoptimized
        />
      </div>
    ) : (
      <span className="text-[11px] text-slate-400">ندارد</span>
    ),
    positionLabel: (
      <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
        {getBannerPositionLabel(item.position)}
      </span>
    ),
    isActive: item.isActive ? (
      <span className="inline-flex items-center rounded-full border border-green-100 bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
        فعال
      </span>
    ) : (
      <span className="inline-flex items-center rounded-full border border-red-100 bg-red-50 px-3 py-1 text-xs font-medium text-red-700">
        غیرفعال
      </span>
    ),
  }));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-700">فیلتر بر اساس جایگاه:</label>
          <select
            value={selectedPosition}
            onChange={(e) => setSelectedPosition(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">همه جایگاه‌ها</option>
            {BANNER_POSITIONS.map((pos) => (
              <option key={pos.value} value={pos.value}>
                {pos.label}
              </option>
            ))}
          </select>
        </div>

        <Link
          href="/admin/banner-ads/creat-banner"
          className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-blue-700"
        >
          + افزودن بنر جدید
        </Link>
      </div>

      {loading ? (
        <div className="flex w-full items-center justify-center py-12">
          <p className="text-sm text-slate-500">در حال بارگذاری بنرها...</p>
        </div>
      ) : (
        <AdminTable
          columns={columns}
          data={rows}
          actions={(banner) => (
            <div className="flex items-center gap-3">
              <Link
                href={`/admin/banner-ads/${banner._id}`}
                className="text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                ویرایش
              </Link>
              <button
                type="button"
                onClick={() => handleDelete(banner._id)}
                className="text-sm font-medium text-red-600 hover:text-red-800"
              >
                حذف
              </button>
            </div>
          )}
        />
      )}
    </div>
  );
}
