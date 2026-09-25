export const bannerAds = [
    {
      id: 1,
      title: "پیشنهاد شگفت‌انگیز",
      subtitle: "تا 40٪ تخفیف",
      image: "/images/coffee.png",
      link: "/offers",
      badge: "HOT",
      bg: "from-red-50 to-white",
    },
    {
      id: 2,
      title: "قهوه‌ساز و اسپرسوساز",
      subtitle: "ارسال فوری + گارانتی",
      image: "/images/washing.png",
      link: "/category/coffee",
      badge: "NEW",
      bg: "from-blue-50 to-white",
    },
  ];
  export const BANNER_POSITIONS = [
  { value: "main-slider", label: "اسلایدر اصلی" },
  { value: "hero-right", label: "بنر سمت راست هیرو" },
  { value: "after-newest-products", label: "زیر جدیدترین محصولات" },
  { value: "after-best-selling-products", label: "زیر پرفروش‌ترین محصولات" },
  { value: "before-categories", label: "قبل از دسته‌بندی‌ها" },
  { value: "after-categories", label: "زیر دسته‌بندی‌ها" },
  { value: "category-page", label: "صفحه اختصاصی دسته" },
  { value: "middle-banner", label: "بنر وسط صفحه" },
  { value: "footer-banner", label: "بنر فوتر" },
];

export const BANNER_POSITION_VALUES = BANNER_POSITIONS.map((p) => p.value);

export const getBannerPositionLabel = (pos) => {
  const found = BANNER_POSITIONS.find((p) => p.value === pos);
  return found ? found.label : pos || "نامشخص";
};
