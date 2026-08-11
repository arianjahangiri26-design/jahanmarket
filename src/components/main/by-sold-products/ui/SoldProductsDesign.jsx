"use client";

import Link from "next/link";
import { HiOutlineEye, HiOutlineChevronLeft } from "react-icons/hi";
import { AiOutlineProduct } from "react-icons/ai";
import { BiGridAlt } from "react-icons/bi";

/**
 * Presentational component for rendering weekly sold products.
 */
export function SoldProductsDesign({ products = [], loading }) {
  if (loading) {
    return (
      <section className="relative bg-transparent py-16 md:py-20">
        <div className="mx-auto max-w-[1550px] px-6">
          <div className="rounded-[40px] border border-blue-100 bg-white px-10 py-24 text-center shadow-sm">
            <p className="text-lg font-bold text-slate-600">در حال بارگذاری محصولات...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!products.length) {
    return (
      <section className="relative bg-transparent py-16 md:py-20">
        <div className="mx-auto max-w-[1550px] px-6">
          <div className="rounded-[40px] border-2 border-dashed border-blue-100 bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FBFF_100%)] px-10 py-24 text-center">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-blue-50 text-blue-500 shadow-sm">
              <BiGridAlt className="text-5xl" />
            </div>

            <h3 className="text-2xl font-black text-slate-800">
              هنوز محصولی برای نمایش وجود ندارد
            </h3>

            <p className="mx-auto mt-4 max-w-md text-slate-500">
              بعد از دریافت داده‌ها، پرفروش‌ترین محصولات اینجا نمایش داده می‌شوند.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-transparent py-16 md:py-20">
      <div className="mx-auto max-w-[1550px] px-6">
        {/* Header */}
        <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-blue-500/10 bg-blue-50 px-5 py-2 text-sm font-bold text-blue-600 shadow-sm">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
                <AiOutlineProduct className="text-lg" />
              </span>
              پرفروش‌ترین محصولات
            </div>
          </div>

          <div>
            <Link
              href="/products"
              className="group inline-flex items-center justify-center gap-3 rounded-2xl border border-blue-100 bg-white px-8 py-4 text-base font-bold text-blue-600 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 hover:shadow-[0_18px_40px_-18px_rgba(37,99,235,0.25)] active:scale-[0.98]"
            >
              <HiOutlineEye className="text-xl" />
              <span>مشاهده همه محصولات</span>
              <HiOutlineChevronLeft className="text-xl transition-transform duration-300 group-hover:-translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Banner */}
        <div className="relative mb-14 overflow-hidden rounded-[32px] border border-blue-100 bg-[linear-gradient(135deg,#F0F6FF_0%,#FFFFFF_50%,#EFF6FF_100%)] px-10 py-10 shadow-[0_18px_45px_-30px_rgba(37,99,235,0.2)]">
          <div className="absolute -right-10 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute -left-12 top-0 h-32 w-32 rounded-full bg-blue-200/50 blur-3xl" />

          <p className="relative z-10 flex flex-wrap items-center justify-center gap-4 text-center text-2xl font-black text-blue-600 md:text-3xl">
            <span className="text-3xl text-blue-500">
              <AiOutlineProduct />
            </span>
            <span>محصولات پرفروش این هفته</span>
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:gap-8 lg:grid-cols-4 xl:grid-cols-6">
          {products.map((product) => (
            <Link
              key={product._id}
              href={`/product/${product.slug}`}
              className="group relative overflow-visible rounded-[32px] border border-blue-100 bg-white p-6 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-blue-500 hover:bg-gradient-to-b hover:from-white hover:to-blue-50/30 hover:shadow-[0_24px_50px_-20px_rgba(37,99,235,0.25)]"
            >
              <div className="pointer-events-none absolute inset-0 rounded-[32px] bg-gradient-to-b from-transparent via-transparent to-blue-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="relative z-10 flex flex-col items-center text-center">
                {/* Image */}
                <div className="relative mb-6 flex h-36 w-36 items-center justify-center rounded-full border border-blue-50 bg-blue-50/50 p-2 shadow-inner transition-all duration-500 group-hover:scale-105 group-hover:border-blue-300 group-hover:bg-white group-hover:shadow-[0_14px_30px_-16px_rgba(37,99,235,0.25)]">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.title || "Product"}
                      loading="lazy"
                      className="h-[85%] w-[85%] object-contain transition-all duration-500 ease-out group-hover:scale-110"
                    />
                  ) : (
                    <span className="text-xs font-bold text-blue-400">
                      بدون تصویر
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="min-h-[52px] line-clamp-2 text-lg font-bold leading-7 text-slate-800 transition-colors duration-300 group-hover:text-blue-600">
                  {product.title}
                </h3>

                {/* Sold */}
                <p className="mt-2 text-sm font-semibold text-blue-400/80 transition-colors duration-300 group-hover:text-blue-500">
                  فروش: {product.sold || 0}
                </p>

                {/* Underline */}
                <span className="mt-5 h-1.5 w-8 rounded-full bg-blue-100 transition-all duration-500 group-hover:w-16 group-hover:bg-blue-500" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
