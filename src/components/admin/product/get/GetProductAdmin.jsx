"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useFetch } from "@/hooks/crud/UseCrud";
import AdminTable from "@/shared/admin/AdminTable";

export default function ProductsListLogic() {
  const { request, data, loading } = useFetch();
  const searchParams = useSearchParams();

  const currentStatus = searchParams.get("status") || "all";
  const currentSort = searchParams.get("sort") || "newest";

  const fetchProducts = async () => {
    try {
      await request({
        method: "GET",
        url: "/api/admin/products",
      });
    } catch {
      // هندل بی‌صدا
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("آیا از حذف این محصول اطمینان دارید؟")) return;

    try {
      const res = await request({
        method: "DELETE",
        url: `/api/admin/products/${id}`,
      });

      if (res?.data?.success || res?.success) {
        fetchProducts();
      }
    } catch {
      // هندل بی‌صدا
    }
  };

  const columns = [
    { key: "imageProduct", label: "تصویر" },
    { key: "name", label: "نام محصول" },
    { key: "discountprice", label: "مقدار تخفیف %" },
    { key: "price", label: "قیمت" },
    { key: "stock", label: "موجودی" },
    { key: "category.name", label: "دسته‌بندی" },
    { key: "isActive", label: "وضعیت" },
  ];

  const rawProducts = data?.data || data?.message?.data || (Array.isArray(data) ? data : []);

  const filteredProducts = useMemo(() => {
    let result = rawProducts.map((product) => ({
      ...product,
      // اگر جدول به دنبال imageProduct می‌گردد، تصویر اول را پاس می‌دهیم:
      imageProduct:
        Array.isArray(product.images) && product.images.length > 0
          ? product.images[0]
          : "/placeholder.png",
    }));

    // فیلتر بر اساس وضعیت فعال/غیرفعال
    if (currentStatus === "active") {
      result = result.filter((item) => item.isActive === true);
    } else if (currentStatus === "inactive") {
      result = result.filter((item) => item.isActive === false);
    }

    // مرتب‌سازی
    result.sort((a, b) => {
      const aTime = new Date(a.createdAt || a.updatedAt || 0).getTime();
      const bTime = new Date(b.createdAt || b.updatedAt || 0).getTime();

      if (currentSort === "oldest") return aTime - bTime;
      if (currentSort === "updated") {
        const aUpdated = new Date(a.updatedAt || 0).getTime();
        const bUpdated = new Date(b.updatedAt || 0).getTime();
        return bUpdated - aUpdated;
      }
      return bTime - aTime; // newest
    });

    return result;
  }, [rawProducts, currentStatus, currentSort]);

  if (loading) {
    return (
      <div className="flex h-32 items-center justify-center">
        <p className="text-sm font-semibold text-blue-600 animate-pulse">
          در حال بارگذاری لیست محصولات...
        </p>
      </div>
    );
  }

  return (
    <AdminTable
      columns={columns}
      data={filteredProducts}
      actions={(product) => (
        <div className="flex items-center gap-3">
          <Link
            href={`/admin/product/${product._id}`}
            className="text-blue-600 transition hover:text-blue-800 text-xs font-semibold"
          >
            ویرایش
          </Link>

          <button
            type="button"
            onClick={() => handleDelete(product._id)}
            className="text-red-500 transition hover:text-red-700 text-xs font-semibold"
          >
            حذف
          </button>
        </div>
      )}
    />
  );
}
