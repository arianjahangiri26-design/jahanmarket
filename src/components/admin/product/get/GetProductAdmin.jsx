"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useFetch } from "@/hooks/crud/UseCrud";
import AdminTable from "@/shared/admin/AdminTable";

export default function ProductsListLogic() {
  const { request, data, loading } = useFetch();

  const fetchProducts = async () => {
    await request({
      method: "GET",
      url: "/api/admin/products",
    });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
  

    const res = await request({
      method: "DELETE",
      url: `/api/admin/products/${id}`,
    });

    if (res?.data?.success || res?.success) {
      fetchProducts();
    }
  };

  const columns = [
    { key: "imageProduct", label: "تصویر" },
    { key: "name", label: "نام محصول" },
    { key: "discountprice", label:"مقدار تخفیف  %" },
    { key: "price", label: "قیمت" },
    { key: "stock", label: "موجودی" },
    { key: "category.name", label: "دسته‌بندی" }, // هماهنگ شده با فیلد name در مدل Category
    { key: "isActive", label: "وضعیت" },
  ];

  const products = data?.message?.data || data?.data || [];

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
      data={products}
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
