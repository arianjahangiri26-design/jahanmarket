"use client";

import { useMemo, useState } from "react";
import { useFetch } from "@/hooks/crud/UseCrud";
import ProductSkeleton from "@/lib/loading/skeleton/main/product/productSkeleton";
 
import { CATEGORIES_REQUEST, getArrayData, getCurrentSlug, getSortedAndFilteredProducts, INITIAL_PRICE_RANGE, normalizeText, PRODUCTS_REQUEST } from "../fetchCategoryProducts.utils";

 fetchc 
 
 
export default function FetchCategoryProductsLogic({
  slugParts = [],
  searchQuery = "",
}) {
  const {
    data: productsData,
    loading: productsLoading,
    error: productsError,
  } = useFetch(PRODUCTS_REQUEST);

  const {
    data: categoriesData,
    loading: categoriesLoading,
    error: categoriesError,
  } = useFetch(CATEGORIES_REQUEST);

  const [sortBy, setSortBy] = useState("newest");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [priceRange, setPriceRange] = useState(() => ({ ...INITIAL_PRICE_RANGE }));

  const products = useMemo(
    () => getArrayData(productsData, ["data", "products"]),
    [productsData]
  );

  const categories = useMemo(
    () => getArrayData(categoriesData, ["message.data", "data", "categories"]),
    [categoriesData]
  );

  const currentSlug = useMemo(() => getCurrentSlug(slugParts), [slugParts]);
  const normalizedSearchQuery = useMemo(() => normalizeText(searchQuery), [searchQuery]);

  const finalProducts = useMemo(
    () =>
      getSortedAndFilteredProducts({
        products,
        normalizedSearchQuery,
        currentSlug,
        selectedCategory,
        priceRange,
        sortBy,
      }),
    [
      products,
      normalizedSearchQuery,
      currentSlug,
      selectedCategory,
      priceRange,
      sortBy,
    ]
  );

  if (productsLoading || categoriesLoading) {
    return <ProductSkeleton />;
  }

  return (
    <FetchCategoryProductsDesign
      products={finalProducts}
      productsError={productsError}
      categories={categories}
      categoriesError={categoriesError}
      sortBy={sortBy}
      setSortBy={setSortBy}
      selectedCategory={selectedCategory}
      setSelectedCategory={setSelectedCategory}
      priceRange={priceRange}
      setPriceRange={setPriceRange}
      searchQuery={searchQuery}
    />
  );
}
