 
"use client";

import { useFetch } from "@/hooks/crud/UseCrud";
 
import CategoriesSkeleton from "@/lib/loading/skeleton/main/by-category/ByCategoriesSkeleton";
import ByCategoryView from "./ByCategoryView";
 
  
export default function ByCategoriesLogic() {
  const { data, loading, error } = useFetch(
    {
      method: "GET",
      url: "/api/admin/categories",
    },
    []
  );
 
console.log(data?.message?.data);

  if (loading) return <CategoriesSkeleton />;
 

  return <ByCategoryView categories={ data?.message?.data} />;
}
