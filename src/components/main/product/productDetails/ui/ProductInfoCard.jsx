"use client";

import React from "react";
import { priceFormatter } from "@/lib/utils/priceFormatter";
import { AddToCartLogic } from "@/shared/cart/AddToCartLogic";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaCommentDots,
  FaTruck,
  FaShieldAlt,
  FaHeadset,
  FaBoxOpen,
  FaArrowDown,
} from "react-icons/fa";

/**
 * ProductInfoCard Component
 * Displays product information, pricing, stock status, and purchase actions.
 */
export default function ProductInfoCard({ product, commentsCount = 0 }) {
  const stock = Number(product?.stock || 0);
  const price = Number(product?.price || 0);
  const isActive = Boolean(product?.isActive);
  const isAvailable = Boolean(isActive && stock > 0);

  const categoryName = product?.category?.name || "بدون دسته‌بندی";
  const productName = product?.name || "نام محصول";

  // Scroll smoothly to the comments section
  const handleScrollToComments = () => {
    const section = document.getElementById("comments-section");

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Keep only the three requested store services
  const services = [
    {
      icon: <FaShieldAlt className="text-lg" />,
      title: "۷ روز مهلت مرجوعی",
      desc: "تضمین بازگشت کالا در صورت وجود مشکل یا مغایرت.",
      wrapperClass: "border-blue-100 bg-blue-50/70",
      iconClass: "bg-blue-600 text-white",
    },
    {
      icon: <FaTruck className="text-lg" />,
      title: "ارسال سریع",
      desc: "تحویل سریع و هماهنگ در کوتاه‌ترین زمان ممکن.",
      wrapperClass: "border-cyan-100 bg-cyan-50/70",
      iconClass: "bg-cyan-600 text-white",
    },
    {
      icon: <FaHeadset className="text-lg" />,
      title: "پشتیبانی ۲۴ ساعته",
      desc: "پاسخ‌گویی و پیگیری سفارش در تمام روزهای هفته.",
      wrapperClass: "border-indigo-100 bg-indigo-50/70",
      iconClass: "bg-indigo-600 text-white",
    },
  ];

  return (
    <div>
    <section className="overflow-hidden rounded-[30px] border border-blue-100 bg-white shadow-[0_20px_60px_rgba(59,130,246,0.12)]">
      {/* Product Header */}
      <div className="relative overflow-hidden border-b border-blue-100 bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 px-5 py-6 text-white sm:px-7 sm:py-4">
        <div className="absolute left-0 top-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-44 w-44 rounded-full bg-cyan-300/20 blur-3xl" />

        <div className="relative">
          <div className="flex flex-wrap items-center gap-2">
            {/* Product Category */}
            <span className="rounded-full border border-white/20 bg-white/15 px-3 py-1.5 text-xs font-bold text-white">
              {categoryName}
            </span>

            {/* Product Availability */}
            <span
              className={`rounded-full border px-3 py-1.5 text-[13px] font-bold text-white ${
                isAvailable
                  ? "border-emerald-300/30 bg-emerald-400/15"
                  : "border-red-300/30 bg-red-400/15"
              }`}
            >
              {isAvailable ? "موجود در انبار" : "ناموجود"}
            </span>
          </div>

          <h1 className="mt-5 text-2xl font-black leading-10 sm:text-3xl sm:leading-[3.2rem]">
            {productName}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            {/* Comments Button */}
            <button
              type="button"
              onClick={handleScrollToComments}
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-extrabold text-blue-700 transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white/80"
            >
              <FaCommentDots className="text-[23px]" />
              <span className="text-[15px]"  >{commentsCount} دیدگاه</span>
              <FaArrowDown className="text-[10px]" />
            </button>

            {/* Stock Information */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white">
              <FaBoxOpen className="text-[19px]" />
              <span>موجودی: {stock} عدد</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Product Content */}
      <div className="p-5 sm:p-7">
        {/* Price and Purchase Section */}
        <div className="rounded-[26px] border border-blue-100 bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4 sm:p-6">
          <div className="overflow-hidden rounded-[24px] border border-blue-200/70 bg-white shadow-[0_10px_30px_rgba(59,130,246,0.08)]">
            {/* Price Header */}
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 px-5 py-5 sm:px-6">
              <div>
                <p className="text-xs font-bold tracking-wide text-slate-500">
                  قیمت نهایی
                </p>

                <div className="mt-3 flex flex-wrap items-end gap-2">
                  <span className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                    {priceFormatter(price)}
                  </span>

                  <span className="pb-1 text-sm font-bold text-slate-500">
                    تومان
                  </span>
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  قیمت این محصول به‌صورت به‌روز نمایش داده می‌شود.
                </p>
              </div>

              {/* Purchase Status */}
              <div
                className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-extrabold shadow-sm ${
                  isAvailable
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-red-200 bg-red-50 text-red-600"
                }`}
              >
                {isAvailable ? (
                  <FaCheckCircle className="text-base" />
                ) : (
                  <FaTimesCircle className="text-base" />
                )}

                <span>{isAvailable ? "قابل خرید" : "غیرقابل خرید"}</span>
              </div>
            </div>

            {/* Product and Stock Status */}
            <div className="grid grid-cols-1 gap-3 px-5 py-5 sm:grid-cols-2 sm:px-6">
              <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <FaCheckCircle className="text-base" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-500">
                      وضعیت محصول
                    </p>

                    <p className="mt-1 text-sm font-black text-slate-800">
                      {isActive ? "فعال و قابل نمایش" : "غیرفعال"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                      stock > 0
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-red-50 text-red-500"
                    }`}
                  >
                    {stock > 0 ? (
                      <FaBoxOpen className="text-base" />
                    ) : (
                      <FaTimesCircle className="text-base" />
                    )}
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-500">
                      وضعیت انبار
                    </p>

                    <p className="mt-1 text-sm font-black text-slate-800">
                      {stock > 0 ? `${stock} عدد موجود` : "موجودی تمام شده"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Inventory Summary */}
            <div className="border-t border-slate-100 bg-slate-50/80 px-5 py-4 sm:px-6">
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-semibold">
                <span className="rounded-full bg-white px-3 py-1.5 text-slate-600 ring-1 ring-slate-200">
                  {isAvailable ? "آماده ثبت سفارش" : "فعلاً خارج از دسترس"}
                </span>

                <span className="text-slate-500">
                  {stock > 0
                    ? `موجودی فعلی: ${stock} عدد`
                    : "در حال حاضر موجودی ثبت نشده است"}
                </span>
              </div>
            </div>
          </div>

          {/* Add to Cart Action */}
          <div className="mt-6 border-t border-slate-100 pt-6">
            <AddToCartLogic productId={product?._id} />
          </div>

          {!isAvailable && (
            <p className="mt-4 text-center text-xs font-bold text-red-500">
              امکان افزودن این محصول به سبد خرید وجود ندارد
            </p>
          )}
        </div>
      </div>

      {/* Separate Store Services Section */}
   
    </section>
    
    
       <div className="border-t   border-blue-100 bg-slate-50/70 px-5 py-5 sm:px-7 sm:py-10">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.title}
              className={`rounded-[24px] border p-4 ${service.wrapperClass}`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${service.iconClass}`}
                >
                  {service.icon}
                </div>

                <div className="min-w-0">
                  <p className="text-[14px] font-black text-slate-800">
                    {service.title}
                  </p>

                  <p className="mt-1 text-[13px] leading-6 text-slate-600">
                    {service.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
