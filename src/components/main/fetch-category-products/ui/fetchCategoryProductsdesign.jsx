"use client";

import { useRouter } from "next/navigation";
import { LucideAlertCircle, SearchX, X } from "lucide-react";
import ProductCard from "../../product/product-card/ProductCard";
import SortBar from "../filter-product/ui/sortBar";
import SideFilterBar from "../filter-product/ui/sideFilterBar";

export default function FetchCategoryProductsDesign({
  products = [],
  productsError = null,
  categoriesError = null,
  sortBy,
  setSortBy,
  selectedCategory,
  setSelectedCategory,
  categories = [],
  priceRange,
  setPriceRange,
  searchQuery = "",
}) {
  const router = useRouter();

  const hasSearchQuery = Boolean(String(searchQuery).trim());
  const hasError = Boolean(productsError || categoriesError);

  const handleClearSearch = () => {
    router.push("/categories/all");
  };

  if (hasError) {
    return (
      <section className="my-8 md:my-10" dir="rtl">
        <div className="overflow-hidden rounded-[32px] border border-[#D9E7F5] bg-white shadow-[0_18px_50px_-20px_rgba(11,60,93,0.18)]">
          <div className="bg-[linear-gradient(135deg,#F8FBFF_0%,#EEF6FD_55%,#FFFFFF_100%)] px-6 py-6 sm:px-8">
            <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-[#CFE0F2] bg-[#EDF5FC] shadow-sm">
                <LucideAlertCircle className="h-8 w-8 text-[#0B3C5D]" />
              </div>

              <h2 className="text-lg font-black text-[#0A2540]">
                دریافت اطلاعات با خطا مواجه شد
              </h2>

              <p className="mt-3 max-w-md text-sm leading-7 text-[#627D98]">
                {productsError ||
                  categoriesError ||
                  "لطفاً دوباره تلاش کنید."}
              </p>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-6 rounded-2xl bg-[#0B3C5D] px-6 py-3 text-sm font-bold text-white shadow-[0_12px_30px_-12px_rgba(11,60,93,0.45)] transition-all duration-300 hover:bg-[#07263D] hover:shadow-[0_18px_35px_-12px_rgba(11,60,93,0.5)]"
              >
                تلاش مجدد
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="my-8 bg-[linear-gradient(180deg,#F8FBFF_0%,#F4F9FD_45%,#FFFFFF_100%)] py-1 md:my-10"
      dir="rtl"
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 xl:gap-8">
        <aside className="lg:col-span-3">
          <div className="sticky top-24">
            <div className="rounded-[30px] border border-[#D9E7F5] bg-white/95 p-1 shadow-[0_18px_50px_-24px_rgba(11,60,93,0.16)] backdrop-blur-sm">
              <SideFilterBar
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                categories={categories}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
              />
            </div>
          </div>
        </aside>

        <div className="space-y-5 lg:col-span-9">
          {hasSearchQuery && (
            <div className="overflow-hidden rounded-[28px] border border-[#D9E7F5] bg-white shadow-[0_14px_40px_-20px_rgba(11,60,93,0.14)]">
              <div className="flex flex-col gap-4 bg-[linear-gradient(135deg,#F8FBFF_0%,#EEF6FD_55%,#FFFFFF_100%)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div>
                  <p className="text-sm text-[#486581]">
                    نتایج جستجو برای:
                    <span className="mr-1 font-black text-[#0B3C5D]">
                      «{searchQuery}»
                    </span>
                  </p>

                  <p className="mt-1 text-xs font-medium text-[#7B93AA]">
                    {products.length.toLocaleString("fa-IR")} محصول پیدا شد
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="inline-flex items-center justify-center gap-1.5 self-start rounded-2xl border border-[#CFE0F2] bg-white px-4 py-2.5 text-xs font-bold text-[#0B3C5D] transition-all duration-300 hover:border-[#A9C7E6] hover:bg-[#F4F9FD] hover:text-[#07263D] sm:self-auto"
                >
                  <X className="h-4 w-4" />
                  حذف جستجو
                </button>
              </div>
            </div>
          )}

          <div className="rounded-[28px] border border-[#D9E7F5] bg-white/95 p-1 shadow-[0_14px_40px_-24px_rgba(11,60,93,0.14)] backdrop-blur-sm">
            <SortBar
              sortBy={sortBy}
              setSortBy={setSortBy}
              totalProducts={products.length}
            />
          </div>

          {products.length === 0 ? (
            <div className="overflow-hidden rounded-[32px] border border-[#D9E7F5] bg-white shadow-[0_18px_50px_-20px_rgba(11,60,93,0.16)]">
              <div className="flex min-h-[320px] flex-col items-center justify-center bg-[linear-gradient(180deg,#FFFFFF_0%,#F5FAFF_100%)] p-10 text-center">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-[#CFE0F2] bg-[#EDF5FC] shadow-sm">
                  {hasSearchQuery ? (
                    <SearchX className="h-8 w-8 text-[#0B3C5D]" />
                  ) : (
                    <LucideAlertCircle className="h-8 w-8 text-[#0B3C5D]" />
                  )}
                </div>

                <h2 className="text-lg font-black text-[#0A2540]">
                  محصولی پیدا نشد
                </h2>

                <p className="mt-3 max-w-md text-sm leading-7 text-[#627D98]">
                  {hasSearchQuery
                    ? `برای عبارت «${searchQuery}» محصولی یافت نشد. نام محصول را بررسی کرده و دوباره جستجو کنید.`
                    : "محصولی با فیلترهای انتخاب‌شده وجود ندارد. فیلترها را تغییر دهید."}
                </p>

                {hasSearchQuery && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="mt-6 rounded-2xl bg-[#0B3C5D] px-6 py-3 text-sm font-bold text-white shadow-[0_12px_30px_-12px_rgba(11,60,93,0.45)] transition-all duration-300 hover:bg-[#07263D] hover:shadow-[0_18px_35px_-12px_rgba(11,60,93,0.5)]"
                  >
                    مشاهده همه محصولات
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {products.map((product, index) => (
                <div
                  key={product?._id || product?.id || index}
                  className="transition-transform duration-300 hover:-translate-y-1"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
