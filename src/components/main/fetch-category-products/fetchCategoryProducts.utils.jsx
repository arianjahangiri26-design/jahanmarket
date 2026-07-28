import {
  filterProductsByCategory,
  filterProductsByPrice,
  getCategoryPath,
  sortProducts,
} from "./filter-product/logic/filterUtils";

export const PRODUCTS_REQUEST = { method: "GET", url: "/api/admin/products" };
export const CATEGORIES_REQUEST = { method: "GET", url: "/api/admin/categories" };
export const INITIAL_PRICE_RANGE = { min: 0, max: 100000000 };

const TITLE_FIELDS = ["title", "name", "productName", "titleFa", "titleEn"];
const SEARCH_FIELDS = [
  ...TITLE_FIELDS,
  "brand",
  "shortDescription",
  "description",
  "slug",
  "tags",
  "keywords",
  "category",
  "categories",
];

export const getArrayData = (source, paths = []) => {
  for (const path of paths) {
    const value = path.split(".").reduce((acc, key) => acc?.[key], source);
    if (Array.isArray(value)) return value;
  }
  return Array.isArray(source) ? source : [];
};

export const safeDecode = (value = "") => {
  try {
    return decodeURIComponent(String(value));
  } catch {
    return String(value);
  }
};

export const normalizeText = (value = "") =>
  String(value)
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .toLowerCase()
    .replace(/ي|ى/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/ۀ|ة/g, "ه")
    .replace(/ؤ/g, "و")
    .replace(/إ|أ/g, "ا")
    .replace(/\u200c/g, " ")
    .replace(/[\u064B-\u065F\u0670]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

const toSearchText = (value) => {
  if (value == null) return "";
  if (Array.isArray(value)) return value.map(toSearchText).join(" ");
  if (typeof value === "object") return Object.values(value).map(toSearchText).join(" ");
  return String(value);
};

const pickProductFields = (product, fields) =>
  fields.map((field) => {
    if (field === "brand") return [product?.brand, product?.brand?.name];
    if (field === "category") return [product?.category, product?.category?.name];
    return product?.[field];
  });

export const productMatchesSearch = (product, query) => {
  const q = normalizeText(query);
  if (!q) return true;

  const titleText = normalizeText(toSearchText(pickProductFields(product, TITLE_FIELDS)));
  const fullText = normalizeText(toSearchText(pickProductFields(product, SEARCH_FIELDS)));

  if (titleText.includes(q) || fullText.includes(q)) return true;

  return q
    .split(" ")
    .filter(Boolean)
    .every((word) => fullText.includes(word));
};

export const getCurrentSlug = (slugParts = []) =>
  normalizeText(safeDecode(Array.isArray(slugParts) ? slugParts.at(-1) || "" : ""));

export const getSortedAndFilteredProducts = ({
  products = [],
  normalizedSearchQuery = "",
  currentSlug = "",
  selectedCategory = null,
  priceRange = INITIAL_PRICE_RANGE,
  sortBy = "newest",
}) => {
  let result = [...products];

  if (normalizedSearchQuery) {
    result = result.filter((product) =>
      productMatchesSearch(product, normalizedSearchQuery)
    );
  } else if (currentSlug && currentSlug !== "all" && currentSlug !== "products") {
    result = result.filter((product) =>
      getCategoryPath(product)?.some(
        (slug) => normalizeText(safeDecode(slug)) === currentSlug
      )
    );
  }

  if (selectedCategory) {
    result = filterProductsByCategory(result, selectedCategory);
  }

  result = filterProductsByPrice(
    result,
    Number(priceRange?.min) || 0,
    Number(priceRange?.max) || INITIAL_PRICE_RANGE.max
  );

  return sortProducts(result, sortBy);
};
