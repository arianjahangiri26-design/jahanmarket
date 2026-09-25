"use client";

import { useFetch } from "@/hooks/crud/UseCrud";
import ProductShowcaseSkeleton from "@/lib/loading/skeleton/main/product/product-card/ProductShowcaseSkeleton";
import ProductShowcaseView from "../ui/ProductShowcaseView";
 
 
export default function ProductShowcaseLogic({ title, subtitle, href = "/products" }) {
  const { data, loading, error } = useFetch(
    {
      method: "GET",
      url: "/api/admin/products",
    },
    []
  );

  if (loading) return <ProductShowcaseSkeleton />;
  if (error) return null;

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
