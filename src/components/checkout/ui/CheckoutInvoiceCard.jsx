// src/components/checkout/CheckoutInvoiceCard.jsx
"use client";

import React from "react";
import { ReceiptText, ArrowLeft, ShieldCheck, RotateCcw } from "lucide-react";

export function CheckoutInvoiceCard({
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
    <div className="lg:col-span-4">
      <div className="sticky top-10 overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-xl shadow-blue-900/5">
        <div className="absolute right-0 top-0 h-2 w-full bg-blue-600"></div>

        <div className="mb-8 flex items-center gap-3">
          <ReceiptText className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-black text-slate-800">صورتحساب نهایی</h2>
        </div>

        {/* Invoice Item List */}
        <div className="mb-8 max-h-60 space-y-4 overflow-y-auto pr-1">
          {cartItems.map((item) => {
            const title = item?.product?.name || item?.name || "محصول";
            const price = Number(item?.product?.price || item?.price || 0);
            const quantity = Number(item?.quantity || item?.qty || 0);
            const total = price * quantity;

            return (
              <div
                key={item?._id || item?.id}
                className="flex items-center justify-between rounded-2xl bg-slate-50/80 p-3"
              >
                <div className="flex flex-col gap-1">
                  <span className="max-w-[160px] truncate text-xs font-bold text-slate-700">
                    {title}
                  </span>
                  <span className="text-[10px] font-medium tracking-tighter text-blue-600">
                    تعداد: {quantity} عدد
                  </span>
                </div>

                <span className="text-xs font-black text-slate-800">
                  {total.toLocaleString()} تومان
                </span>
              </div>
            );
          })}
        </div>

        {/* Coupon Discount Form */}
        <form onSubmit={onSubmitDiscount} className="border-t border-slate-100 pb-4 pt-6">
          <label className="mb-2 block text-xs font-bold text-slate-500">کد تخفیف</label>

          <div className="flex gap-2">
            <input
              type="text"
              {...register("discountCode")}
              disabled={hasDiscountApplied}
              placeholder={hasDiscountApplied ? "کد تخفیف اعمال شده" : "مثال: OFF50"}
              className={`flex-1 rounded-2xl border px-4 py-3 text-sm font-medium transition-all duration-300 focus:outline-none ${
                hasDiscountApplied
                  ? "cursor-not-allowed border-emerald-200 bg-emerald-50 font-bold text-emerald-700"
                  : "border-slate-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              }`}
            />

            {hasDiscountApplied ? (
              <button
                type="button"
                onClick={onResetDiscount}
                className="flex items-center justify-center gap-1 rounded-2xl bg-rose-50 px-4 text-sm font-bold text-rose-600 transition-all hover:bg-rose-100 active:scale-95"
                title="حذف کد تخفیف"
              >
                <RotateCcw className="h-4 w-4" />
                <span>حذف</span>
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-2xl bg-blue-600 px-6 text-sm font-bold text-white shadow-md shadow-blue-200 transition-all duration-300 hover:bg-blue-700 active:scale-95 disabled:opacity-50"
              >
                اعمال
              </button>
            )}
          </div>

          {discountError ? (
            <p className="mr-1 mt-2 text-xs font-semibold text-rose-500">{discountError}</p>
          ) : null}
        </form>

        {/* Price Breakdowns */}
        <div className="space-y-5 border-t border-slate-100 pt-6">
          <div className="flex items-center justify-between text-sm font-medium text-slate-500">
            <span>مجموع قیمت کالاها</span>
            <span className="font-bold text-slate-800">{subtotal.toLocaleString()} تومان</span>
          </div>

          <div className="flex items-center justify-between text-sm font-medium text-emerald-600">
            <span className="flex items-center gap-1.5">
              تخفیف کالاها
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px]">ویژه</span>
            </span>
            <span className="font-black">-{discountAmount.toLocaleString()} تومان</span>
          </div>

          <div className="flex items-center justify-between text-sm font-medium text-slate-500">
            <span>هزینه ارسال</span>
            <span className="font-black text-blue-600">
              {shippingAmount === 0 ? "رایگان" : `${shippingAmount.toLocaleString()} تومان`}
            </span>
          </div>
        </div>

        {/* Final Payable Cost */}
        <div className="mt-8 border-t-2 border-dashed border-slate-200 pt-8">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-bold text-slate-400">مبلغ قابل پرداخت:</span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black tracking-tight text-blue-600">
                {payableAmount.toLocaleString()}
              </span>
              <span className="text-sm font-bold text-blue-600">تومان</span>
            </div>
          </div>
        </div>

        {/* Checkout Confirmation Button */}
        <button
          onClick={onConfirmOrder}
          disabled={isLoading}
          className="group relative mt-8 flex w-full items-center justify-center gap-3 overflow-hidden rounded-[1.5rem] bg-blue-600 py-5 font-black text-white shadow-lg shadow-blue-600/30 transition-all duration-300 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="relative z-10 text-lg">پرداخت و ثبت نهایی</span>
          <ArrowLeft className="relative z-10 h-5 w-5 transition-transform group-hover:-translate-x-1" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-500 opacity-0 transition-opacity group-hover:opacity-100"></div>
        </button>

        {/* Security Footer Details */}
        <div className="mt-8 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>تراکنش شما کاملا ایمن و رمزنگاری شده است</span>
          </div>

          <div className="flex gap-4 opacity-40">
            <div className="h-8 w-8 rounded-lg bg-slate-200"></div>
            <div className="h-8 w-8 rounded-lg bg-slate-200"></div>
            <div className="h-8 w-8 rounded-lg bg-slate-200"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
