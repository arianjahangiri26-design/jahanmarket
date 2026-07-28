"use client";

import React from "react";
import { MapPin, Truck, ShieldCheck, Info, CreditCard, Calendar, ChevronLeft } from "lucide-react";
import { CheckoutInvoiceCard } from "./CheckoutInvoiceCard";
 
 
 
export function CheckoutDesign({
  cartItems,
  subtotal,
  discountAmount,
  shippingAmount,
  payableAmount,
  isLoading,
  discountError,
  hasDiscountApplied,
  register,
  onSubmitDiscount,
  onResetDiscount,
  onConfirmOrder,
}) {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 font-sans sm:px-6 lg:px-8" dir="rtl">
      <div className="mx-auto max-w-7xl">
        {/* هدر صفحه */}
        <div className="mb-10 flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-800 sm:text-3xl">
              تایید نهایی و پرداخت
            </h1>
            <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
              <Info className="h-4 w-4 text-blue-500" />
              لطفا اطلاعات سفارش و مبلغ نهایی را بررسی کنید
            </p>
          </div>

          <div className="flex w-fit items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-600">
            <ShieldCheck className="h-5 w-5" />
            <span>پرداخت شما به صورت امن انجام می‌شود</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* بخش اطلاعات ارسال و پرداخت */}
          <div className="space-y-6 lg:col-span-8">
            {/* آدرس تحویل */}
            <div className="group relative overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
              <div className="absolute -right-12 -top-12 h-24 w-24 rounded-full bg-blue-50 transition-transform group-hover:scale-110"></div>

              <div className="relative mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-blue-600 p-3 text-white shadow-lg shadow-blue-200">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-800">آدرس تحویل سفارش</h2>
                </div>

                <button className="flex items-center gap-1 text-sm font-bold text-blue-600 hover:underline">
                  تغییر آدرس
                  <ChevronLeft className="h-4 w-4" />
                </button>
              </div>

              <div className="relative grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="rounded-3xl border border-slate-100 bg-slate-50/50 p-5">
                  <p className="mb-1 text-xs font-bold text-slate-400">نشانی دقیق:</p>
                  <p className="font-medium leading-relaxed text-slate-700">
                    تهران، محله سعادت‌آباد، خیابان سرو غربی، پلاک ۲۴، واحد ۱۲
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-3xl border border-slate-100 bg-slate-50/50 p-4 text-center">
                    <p className="mb-1 text-xs font-bold text-slate-400">تحویل گیرنده:</p>
                    <p className="font-bold text-slate-700">محمد علوی</p>
                  </div>

                  <div className="rounded-3xl border border-slate-100 bg-slate-50/50 p-4 text-center">
                    <p className="mb-1 text-xs font-bold text-slate-400">شماره تماس:</p>
                    <p className="font-bold text-slate-700">۰۹۱۲۰۰۰۰۰۰۰</p>
                  </div>
                </div>
              </div>
            </div>

            {/* زمان و نحوه ارسال */}
            <div className="rounded-[2.5rem] border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-8 flex items-center gap-3">
                <div className="rounded-2xl bg-blue-600 p-3 text-white shadow-lg shadow-blue-200">
                  <Truck className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-extrabold text-slate-800">زمان و نحوه ارسال</h2>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1 rounded-3xl border-2 border-blue-600 bg-blue-50/30 p-5">
                  <div className="absolute -top-3 right-6 rounded-full bg-blue-600 px-3 py-1 text-[10px] font-bold text-white">
                    انتخاب شده
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="rounded-2xl bg-white p-3 text-blue-600 shadow-sm">
                      <Calendar className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-black text-slate-800">ارسال سریع</p>
                      <p className="mt-1 text-right text-xs font-medium text-slate-500">
                        تحویل امروز بین ساعت ۱۸ الی ۲۱
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 cursor-not-allowed rounded-3xl border border-slate-100 bg-slate-50/30 p-5 opacity-60">
                  <div className="flex items-center gap-4">
                    <div className="rounded-2xl bg-white p-3 text-slate-400 shadow-sm">
                      <Truck className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-500">پست پیشتاز</p>
                      <p className="mt-1 text-right text-xs font-medium text-slate-400">
                        تحویل ۳ الی ۵ روز کاری
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* روش پرداخت */}
            <div className="rounded-[2.5rem] border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-8 flex items-center gap-3">
                <div className="rounded-2xl bg-blue-600 p-3 text-white shadow-lg shadow-blue-200">
                  <CreditCard className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-extrabold text-slate-800">روش پرداخت</h2>
              </div>

              <div className="rounded-[2rem] border-2 border-blue-600 bg-blue-50/50 p-6 ring-4 ring-blue-50">
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-blue-600 p-3 text-white">
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-black text-slate-800">پرداخت آنلاین</p>
                    <p className="mt-2 text-xs leading-relaxed text-slate-500">
                      سفارش شما فقط از طریق درگاه پرداخت آنلاین ثبت و نهایی می‌شود
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* فاکتور */}
          <CheckoutInvoiceCard
            cartItems={cartItems}
            subtotal={subtotal}
            discountAmount={discountAmount}
            shippingAmount={shippingAmount}
            payableAmount={payableAmount}
            isLoading={isLoading}
            discountError={discountError}
            hasDiscountApplied={hasDiscountApplied}
            register={register}
            onSubmitDiscount={onSubmitDiscount}
            onResetDiscount={onResetDiscount}
            onConfirmOrder={onConfirmOrder}
          />
        </div>
      </div>
    </div>
  );
}
