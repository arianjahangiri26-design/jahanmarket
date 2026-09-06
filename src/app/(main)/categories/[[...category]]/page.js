import FetchCategoryProductsLogic from "@/components/main/fetch-category-products/logic/fetchCategoryProductsLogic";
import { generateCategoryMetadata } from "@/lib/seo/category/category-seo";
 
// ۱. تولید متادیتای داینامیک و دقیق سئو برای هر دسته
export async function generateMetadata({ params, searchParams }) {
  return await generateCategoryMetadata({ params, searchParams });
}

export default async function CategoryProductPage({
  params,
  searchParams,
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const rawSlugParts = resolvedParams?.category;
  const rawSearchQuery = resolvedSearchParams?.q;

  const slugParts = Array.isArray(rawSlugParts)
    ? rawSlugParts
    : rawSlugParts
      ? [rawSlugParts]
      : [];

  const searchQuery = Array.isArray(rawSearchQuery)
    ? rawSearchQuery[0] || ""
    : rawSearchQuery || "";

  return (
    <FetchCategoryProductsLogic
      slugParts={slugParts}
      searchQuery={searchQuery}
    />
  );
}
