// src/components/main/fetch-category-products/filter-product/logic/filterUtils.js

export const MAX_PRICE = 100000000;

export const getPrice = (product) => {
  return Number(product?.discountprice || product?.price || 0);
};

export const getCategoryId = (product) => {
  if (!product?.category) return "";

  if (Array.isArray(product.category)) {
    const lastCat = product.category[product.category.length - 1];
    return typeof lastCat === "object" ? lastCat?._id || lastCat?.id || "" : lastCat;
  }

  return typeof product.category === "object"
    ? product.category?._id || product.category?.id || ""
    : product.category;
};

export const getCategoryPath = (product) => {
  if (!product?.category) return [];

  const cats = Array.isArray(product.category) ? product.category : [product.category];

  return cats
    .map((c) => (typeof c === "object" ? c?.slug : c))
    .filter(Boolean);
};

export const filterProductsByCategory = (products, selectedCategory) => {
  if (!selectedCategory) return products;
  return products.filter((product) => getCategoryId(product) === selectedCategory);
};

export const filterProductsByPrice = (products, min, max) => {
  return products.filter((product) => {
    const price = getPrice(product);
    return price >= min && price <= max;
  });
};

export const sortProducts = (products, sortBy) => {
  const sorted = [...products];

  switch (sortBy) {
    case "cheap":
      return sorted.sort((a, b) => getPrice(a) - getPrice(b));

    case "expensive":
      return sorted.sort((a, b) => getPrice(b) - getPrice(a));

    default:
      return sorted.sort(
        (a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0)
      );
  }
};

export const getProductsPriceRange = (products) => {
  if (!products?.length) {
    return { min: 0, max: MAX_PRICE };
  }

  const prices = products.map(getPrice).filter((price) => !Number.isNaN(price));

  if (!prices.length) {
    return { min: 0, max: MAX_PRICE };
  }

  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
};
