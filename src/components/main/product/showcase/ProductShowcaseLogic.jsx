"use client";

import { useFetch } from "@/hooks/crud/UseCrud";
import ProductShowcaseView from "./ProductShowcaseView";
import ProductShowcaseSkeleton from "@/lib/loading/skeleton/main/product/product-card/ProductShowcaseSkeleton";
 
export default function ProductShowcaseLogic({ title, subtitle, href = "/products" }) {
  // فرض بر این است که API محصولات در این مسیر است
  const { data, loading, error } = useFetch(
    {
      method: "GET",
      url: "/api/admin/products", // مسیر API خودت را اینجا قرار بده
    },
    []
  );

  if (loading) return <ProductShowcaseSkeleton />;
 
  const products = data?.data || [];
 

  return (
    <ProductShowcaseView 
      title={title} 
      subtitle={subtitle} 
      href={href} 
      products={products} 
    />
  );
}
