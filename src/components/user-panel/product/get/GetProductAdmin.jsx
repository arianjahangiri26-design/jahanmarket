"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFetch } from "@/hooks/crud/UseCrud";
import productSellerTable from "@/components/user-panel/product/table/productSellerTable";
 

export default function ProductsListLogic() {
  const { request, data, loading } = useFetch();
  const router = useRouter();

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
    // پیشنهاد: اینجا می‌توانی یک تاییدیه (Alert) هم بگذاری
    const res = await request({
      method: "DELETE",
      url: `/api/admin/products/${id}`,
    });

    if (res?.data?.success || res?.success) {
      fetchProducts();
    }
  };

  const handleEdit = (product) => {
    router.push(`/admin/product/${product._id}`);
  };

  const products = data?.message?.data || data?.data || [];

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-2">
            <div className="animate-spin h-6 w-6 border-2 border-amber-500 border-t-transparent rounded-full"></div>
            <p className="text-xs font-medium text-slate-400">در حال بارگذاری محصولات...</p>
        </div>
      </div>
    );
  }

  return (
    <productSellerTable 
      data={products} 
      onEdit={handleEdit} 
      onDelete={handleDelete} 
    />
  );
}
