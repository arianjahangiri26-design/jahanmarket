"use client";

import { useFetch } from "@/hooks/crud/UseCrud";
 
import ProductSkeleton from "@/lib/loading/skeleton/main/product/productSkeleton";
import ProductDetailsView from "../ui/ProductDetailsView";
 export default function ProductDetailsLogic({ id }) {
 
  const { data, loading } = useFetch(
    { method: "GET", url: `/api/admin/products/${id}` },
    [id]
  );
 
  if (loading) return <ProductSkeleton />;
 
  if (!data?.data) {
    return (
      <div className="text-center p-16 text-slate-500">
        محصول یافت نشد.
      </div>
    );
  }

 
  return <ProductDetailsView product={data.data} />;
}
