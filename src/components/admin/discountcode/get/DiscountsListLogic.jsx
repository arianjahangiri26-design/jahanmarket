// components/admin/discounts/list/DiscountsListLogic.jsx
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useFetch } from "@/hooks/crud/UseCrud";
import AdminTable from "@/shared/admin/AdminTable";

export default function DiscountsListLogic() {
  const { request, data, loading } = useFetch();

  const fetchDiscounts = async () => {
    await request({
      method: "GET",
      url: "/api/admin/discountcode",
    });
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const handleDelete = async (id) => {
    const hasConfirmed = confirm("آیا از حذف این کد تخفیف اطمینان دارید؟");
    if (!hasConfirmed) return;

    const res = await request({
      method: "DELETE",
      url: `/api/admin/discountcode/${id}`,
    });

    if (res?.data?.success || res?.success) {
      fetchDiscounts();
    }
  };

  // ستون‌های جدول مدیریت تخفیف
  const columns = [
    { key: "code", label: "کد تخفیف" },
    { key: "title", label: "عنوان" },
    { key: "type", label: "نوع" },
    { key: "value", label: "مقدار" },
    { key: "minPurchaseAmount", label: "حداقل خرید (تومان)" },
    { key: "category.name", label: "دسته‌بندی محدود شده" },
    { key: "isActive", label: "وضعیت" },
  ];

  const discounts = data?.message?.data || data?.data || [];

  if (loading) {
    return (
      <div className="flex h-32 items-center justify-center">
        <p className="text-sm font-semibold text-blue-600 animate-pulse">
          در حال بارگذاری لیست کدهای تخفیف...
        </p>
      </div>
    );
  }

  return (
    <AdminTable
      columns={columns}
      data={discounts}
      actions={(discount) => (
        <div className="flex items-center gap-3">
          <Link
            href={`/admin/discounts/${discount._id}`}
            className="text-blue-600 transition hover:text-blue-800 text-xs font-semibold"
          >
            ویرایش
          </Link>

          <button
            type="button"
            onClick={() => handleDelete(discount._id)}
            className="text-red-500 transition hover:text-red-700 text-xs font-semibold"
          >
            حذف
          </button>
        </div>
      )}
    />
  );
}
