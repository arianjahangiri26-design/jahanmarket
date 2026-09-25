"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

import { useFetch } from "@/hooks/crud/UseCrud";
import AdminTable from "@/shared/admin/AdminTable";

export default function CategoriesListLogic() {
  const { request, data, loading } = useFetch();

  const fetchCategories = async () => {
    await request({
      method: "GET",
      url: "/api/admin/categories",
    });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    const res = await request({
      method: "DELETE",
      url: `/api/admin/categories/${id}`,
    });

    if (res?.success || res?.data?.success) {
      fetchCategories();
    }
  };

  const columns = [
    { key: "image", label: "تصویر" },
    { key: "name", label: "نام" },
    { key: "slug", label: "اسلاگ" },
    { key: "isActive", label: "وضعیت" },
  ];

  const categories = data?.data || data?.message?.data || [];

  const rows = categories.map((item) => ({
    ...item,

    image: item.image ? (
      <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
        <Image
          src={item.image}
          alt={item.name || "تصویر دسته‌بندی"}
          fill
          sizes="48px"
          className="object-cover"
        />
      </div>
    ) : (
      <div className="w-12 h-12 rounded-xl border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center">
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
        <p className="text-sm text-slate-500">در حال دریافت دسته‌بندی‌ها...</p>
      </div>
    );
  }

  return (
    <AdminTable
      columns={columns}
      data={rows}
      actions={(category) => (
        <div className="flex items-center gap-3">
          <Link
            href={`/admin/categories/${category._id}`}
            className="text-blue-500 hover:text-blue-700 text-sm font-medium transition-colors"
          >
            ویرایش
          </Link>

          <button
            type="button"
            onClick={() => handleDelete(category._id)}
            className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
          >
            حذف
          </button>
        </div>
      )}
    />
  );
}
