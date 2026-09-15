// src/components/admin/menus/MenusListLogic.jsx
"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useFetch } from "@/hooks/crud/UseCrud";
import AdminTable from "@/shared/admin/AdminTable";

export default function MenusListLogic() {
  const { request, data, loading } = useFetch();

  const fetchMenus = async () => {
    await request({
      method: "GET",
      url: "/api/admin/menu",
    });
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("آیا از حذف این منو مطمئن هستید؟")) return;

    const res = await request({
      method: "DELETE",
      url: `/api/admin/menu/${id}`,
    });

    if (res?.success) {
      fetchMenus();
    }
  };

  const columns = [
    { key: "iconImage", label: "آیکون" },
    { key: "title", label: "عنوان منو" },
    { key: "parentName", label: "منوی والد" },
    { key: "type", label: "نوع" },
    { key: "order", label: "ترتیب" },
    { key: "isActive", label: "وضعیت" },
  ];

  const rawMenus = data?.data || data?.message?.data || [];

  const rows = rawMenus.map((item) => ({
    ...item,
    iconImage: item.iconImage ? (
      <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-slate-200 bg-white">
        <Image
          src={item.iconImage}
          alt={item.title}
          fill
          sizes="36px"
          className="object-cover"
        />
      </div>
    ) : (
      <span className="text-[10px] text-slate-400 font-medium">بدون آیکون</span>
    ),
    parentName: item.parent ? (
      <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
        {item.parent.title}
      </span>
    ) : (
      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
        منوی اصلی
      </span>
    ),
    type: item.type === "mega" ? (
      <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
        مگا منو
      </span>
    ) : (
      <span className="text-xs font-bold text-slate-600 bg-slate-50 px-2 py-0.5 rounded-md">
        معمولی
      </span>
    ),
    isActive: item.isActive ? (
      <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-bold text-green-700 border border-green-100">
        فعال
      </span>
    ) : (
      <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-bold text-red-700 border border-red-100">
        غیرفعال
      </span>
    ),
  }));

  if (loading) {
    return (
      <div className="w-full py-12 flex items-center justify-center">
        <div className="text-sm font-bold text-slate-500 animate-pulse">
          در حال دریافت اطلاعات منوها از سرور...
        </div>
      </div>
    );
  }

  return (
    <AdminTable
      columns={columns}
      data={rows}
      actions={(menu) => (
        <div className="flex items-center gap-3">
          <Link
            href={`/admin/menus/${menu._id}`}
            className="text-blue-600 hover:text-blue-800 text-xs font-bold transition-colors"
          >
            ویرایش
          </Link>
          <button
            type="button"
            onClick={() => handleDelete(menu._id)}
            className="text-red-500 hover:text-red-700 text-xs font-bold transition-colors"
          >
            حذف
          </button>
        </div>
      )}
    />
  );
}
