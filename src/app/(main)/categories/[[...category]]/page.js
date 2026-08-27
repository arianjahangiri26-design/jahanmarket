import FetchCategoryProductsLogic from "@/components/main/fetch-category-products/logic/fetchCategoryProductsLogic";

 
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

  // جلوگیری از مشکل در صورت تکرار q در URL
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
