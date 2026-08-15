"use client";

import { useRef } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { HiOutlineChevronLeft, HiOutlineChevronRight, HiOutlineEye } from "react-icons/hi";
import { AiOutlineProduct } from "react-icons/ai";
import { BiGridAlt } from "react-icons/bi";
import ProductCard from "@/components/product/product-card/ProductCard";

import "swiper/css";

/**
 * Presentational component for rendering sold products.
 * A single section wrapper holds: loading skeleton, empty state and the slider.
 */
export function SoldProductsDesign({ products = [], loading }) {
  const swiperRef = useRef(null);

  // True when data is loaded but there is nothing to show.
  const isEmpty = !loading && !products.length;

  return (
    <section className="py-10 sm:py-12" dir="rtl">
      <div className="mx-auto max-w-[1550px] px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[36px] border border-blue-100 bg-white shadow-sm">
          {/* Top accent */}
          <div className="h-1 bg-blue-600" />

          <div className="p-5 sm:p-8 lg:p-10">
            {/* Section header */}
            <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="mb-4 inline-flex items-center gap-3 rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-600">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
                    <AiOutlineProduct />
                  </span>
                  پرفروش‌ترین محصولات
                </div>

                <h2 className="text-2xl font-black text-slate-800 sm:text-3xl">
                  محبوب‌ترین انتخاب‌های مشتریان
                </h2>

                <p className="mt-3 text-sm text-slate-500 sm:text-base">
                  محصولات برتر فروشگاه بر اساس تعداد فروش
                </p>
              </div>

              {/* "View all" link is only useful when there are products */}
              {!isEmpty && (
                <Link
                  href="/products"
                  className="group inline-flex w-fit items-center gap-2 rounded-2xl border border-blue-100 px-5 py-3 text-sm font-bold text-blue-600 transition hover:border-blue-500 hover:bg-blue-50"
                >
                  <HiOutlineEye className="text-xl" />
                  مشاهده همه محصولات
                  <HiOutlineChevronLeft className="transition group-hover:-translate-x-1" />
                </Link>
              )}
            </div>

            {/* Body — always rendered inside the same section */}
            {loading ? (
              /* Loading skeleton */
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="rounded-[26px] border border-blue-100 p-4">
                    <div className="aspect-square animate-pulse rounded-[20px] bg-blue-50" />
                    <div className="mt-4 h-4 animate-pulse rounded-full bg-slate-100" />
                    <div className="mt-3 h-3 w-20 animate-pulse rounded-full bg-blue-50" />
                  </div>
                ))}
              </div>
            ) : isEmpty ? (
              /* Empty state */
              <div className="rounded-[32px] border-2 border-dashed border-blue-100 bg-blue-50/30 px-5 py-16 text-center">
                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-100 text-blue-500">
                  <BiGridAlt className="text-4xl" />
                </div>

                <h3 className="text-xl font-black text-slate-800 sm:text-2xl">
                  هنوز محصولی برای نمایش وجود ندارد
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-500 sm:text-base">
                  پرفروش‌ترین محصولات پس از دریافت اطلاعات نمایش داده می‌شوند.
                </p>
              </div>
            ) : (
              /* Products slider */
              <div className="relative">
                <Swiper
                  ref={swiperRef}
                  dir="rtl"
                  modules={[Autoplay]}
                  spaceBetween={20}
                  slidesPerView={2}
                  autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                  }}
                  breakpoints={{
                    640: { slidesPerView: 3 },
                    1024: { slidesPerView: 4 },
                    1440: { slidesPerView: 5 },
                  }}
                  className="!px-1 !py-2"
                >
                  {products.map((product, index) => (
                    <SwiperSlide
                      key={product?._id || product?.id || index}
                      className="!h-auto"
                    >
                      <div className="h-full">
                        <ProductCard product={product} />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Previous button (right in RTL) */}
                <button
                  type="button"
                  onClick={() => swiperRef.current?.slidePrev()}
                  aria-label="قبلی"
                  className="absolute right-3 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-2xl border border-blue-100 bg-white text-blue-600 shadow-lg transition hover:bg-blue-600 hover:text-white md:flex"
                >
                  <HiOutlineChevronRight className="text-2xl" />
                </button>

                {/* Next button (left in RTL) */}
                <button
                  type="button"
                  onClick={() => swiperRef.current?.slideNext()}
                  aria-label="بعدی"
                  className="absolute left-3 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-2xl border border-blue-100 bg-white text-blue-600 shadow-lg transition hover:bg-blue-600 hover:text-white md:flex"
                >
                  <HiOutlineChevronLeft className="text-2xl" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
