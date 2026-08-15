// src/components/checkout/CheckoutDesign.jsx
"use client";

import React from "react";
import { Truck, ShieldCheck, Info, CreditCard, Calendar } from "lucide-react";
import { CheckoutInvoiceCard } from "./CheckoutInvoiceCard";
import { CheckoutAddressLogic } from "../logic/address/CheckoutAddressLogic";

// Import the Logic wrapper component for address management instead of the old section.
// NOTE: Make sure the relative import path points to your actual file location (e.g., in the same directory).
 
 
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
  selectedAddressId,
  onSelectAddress,
}) {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 font-sans sm:px-6 lg:px-8" dir="rtl">
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
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
          {/* Main Delivery & Shipping Information */}
          <div className="space-y-6 lg:col-span-8">
            
            {/* 
              CALL ADDRESS COMPONENT HERE:
              Here we call the CheckoutAddressLogic component. It handles state, 
              fetches addresses from the API using your `useFetch` hook, and 
              automatically manages address selection without cluttering this view.
            */}
            <CheckoutAddressLogic
              selectedAddressId={selectedAddressId}
              onSelectAddress={onSelectAddress}
            />

            {/* Delivery Methods */}
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

            {/* Payment Method */}
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

          {/* Invoice Summary */}
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
