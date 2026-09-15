"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

import { useFetch } from "@/hooks/crud/UseCrud";
import AdminTable from "@/shared/admin/AdminTable";

export default function BannersAdsListLogic() {
  const { request, data, loading } = useFetch();

  const fetchBanners = async () => {
    await request({
      method: "GET",
      url: "/api/admin/banner-ads",
    });
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleDelete = async (id) => {
    const res = await request({
      method: "DELETE",
      url: `/api/admin/banner-ads/${id}`,
    });

    if (res?.success || res?.data?.success) {
      fetchBanners();
    }
  };

  const columns = [
    { key: "desktopImage", label: "تصویر دسکتاپ" },
    { key: "title", label: "عنوان" },
    { key: "position", label: "جایگاه" },
    { key: "order", label: "ترتیب" },
    { key: "isActive", label: "وضعیت" },
  ];

  const banners = data?.data || data?.message?.data || [];

  const rows = banners.map((item) => ({
    ...item,

    desktopImage: item.desktopImage ? (
      <div className="relative w-20 h-10 rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
        <Image
          src={item.desktopImage}
          alt={item.title || "تصویر بنر"}
          fill
          sizes="80px"
          className="object-cover"
        />
      </div>
    ) : (
      <div className="w-20 h-10 rounded-lg border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center">
        <span className="text-[10px] text-slate-400">بدون عکس</span>
      </div>
    ),

    isActive: item.isActive ? (
      <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 border border-green-100">
        فعال
      </span>
    ) : (
      <span className="inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700 border border-red-100">
        غیرفعال
      </span>
    ),
  }));

  if (loading) {
    return (
      <div className="w-full py-10 flex items-center justify-center">
        <p className="text-sm text-slate-500">در حال دریافت بنرها...</p>
      </div>
    );
  }

  return (
    <AdminTable
      columns={columns}
      data={rows}
      actions={(banner) => (
        <div className="flex items-center gap-3">
          <Link
            href={`/admin/banner-ads/${banner._id}`}
            className="text-blue-500 hover:text-blue-700 text-sm font-medium transition-colors"
          >
            ویرایش
          </Link>

          <button
            type="button"
            onClick={() => handleDelete(banner._id)}
            className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
          >
            حذف
          </button>
        </div>
      )}
    />
  );
}
