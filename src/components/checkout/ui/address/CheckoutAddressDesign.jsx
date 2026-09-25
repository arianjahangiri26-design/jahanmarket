// src/components/checkout/CheckoutAddressDesign.jsx
"use client";

import React from "react";
import { MapPin, ChevronLeft, Map, CheckCircle2, Loader2 } from "lucide-react";

/**
 * UI-only component for displaying the address selection section.
 */
export function CheckoutAddressDesign({ 
  addresses, 
  loading, 
  selectedAddressId, 
  onSelectAddress 
}) {
  // 1. Loading State UI
  if (loading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-[2.5rem] border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-sm font-bold">در حال دریافت آدرس‌های شما...</span>
        </div>
      </div>
    );
  }

  // 2. Empty State UI
  if (addresses.length === 0) {
    return (
      <div className="rounded-[2.5rem] border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-blue-600 p-3 text-white shadow-lg shadow-blue-200">
              <MapPin className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-800">آدرس تحویل سفارش</h2>
          </div>
        </div>
        <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
          <p className="font-bold text-slate-500">هیچ آدرسی ثبت نشده است.</p>
          <button
            type="button"
            className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-blue-600 hover:underline"
          >
            ثبت آدرس جدید
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  // 3. Main UI with Data
  return (
    <div className="group relative overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
      {/* Decorative Background Element */}
      <div className="absolute -right-12 -top-12 h-24 w-24 rounded-full bg-blue-50 transition-transform group-hover:scale-110"></div>

      <div className="relative mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-blue-600 p-3 text-white shadow-lg shadow-blue-200">
            <MapPin className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-800">آدرس تحویل سفارش</h2>
        </div>

        <button
          type="button"
          className="flex items-center gap-1 text-sm font-bold text-blue-600 hover:underline"
        >
          تغییر یا مدیریت آدرس‌ها
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>

      {/* Grid displaying user addresses */}
      <div className="relative grid grid-cols-1 gap-4 md:grid-cols-2">
        {addresses.map((addr) => {
          const isSelected = selectedAddressId === addr._id;

          return (
            <div
              key={addr._id}
              onClick={() => onSelectAddress(addr._id)}
              className={`relative cursor-pointer rounded-3xl border p-5 transition-all duration-300 ${
                isSelected
                  ? "border-blue-600 bg-blue-50/20 shadow-md shadow-blue-50"
                  : "border-slate-100 bg-slate-50/50 hover:bg-slate-50"
              }`}
            >
              {isSelected && (
                <div className="absolute left-4 top-4 text-blue-600">
                  <CheckCircle2 className="h-5 w-5 fill-blue-50" />
                </div>
              )}

              <div className="flex items-center gap-2 mb-2">
                <Map className={`h-4 w-4 ${isSelected ? "text-blue-600" : "text-slate-400"}`} />
                <span className="text-xs font-bold text-slate-400">
                  {addr.province}، {addr.city}
                </span>
              </div>

              <p className="text-sm font-medium leading-relaxed text-slate-700 mb-2 truncate">
                {addr.fullAddress}
              </p>

              <div className="flex items-center gap-2 text-[10px] text-slate-400">
                <span>پلاک: {addr.plaque}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
