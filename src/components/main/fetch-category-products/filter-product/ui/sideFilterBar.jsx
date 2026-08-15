"use client";

import React from "react";
import { ChevronDown, Funnel, Grid2x2, WalletCards } from "lucide-react";
import { MAX_PRICE } from "../logic/filterUtils";

const formatPrice = (value) => Number(value || 0).toLocaleString();

export default function SideFilterBar({
  selectedCategory,
  setSelectedCategory,
  categories = [],
  priceRange = { min: 0, max: MAX_PRICE },
  setPriceRange,
}) {
  const safeMin = Math.max(0, Number(priceRange?.min || 0));
  const safeMax = Math.min(MAX_PRICE, Number(priceRange?.max || MAX_PRICE));

  const minPercent = (safeMin / MAX_PRICE) * 100;
  const maxPercent = (safeMax / MAX_PRICE) * 100;

  const handleInputChange = (e, type) => {
    if (!setPriceRange) return;

    let value = Number(e.target.value);
    if (Number.isNaN(value)) value = 0;
    value = Math.max(0, Math.min(value, MAX_PRICE));

    setPriceRange((prev) => {
      const next = { ...prev, [type]: value };

      if (type === "min" && next.min > next.max) next.min = next.max;
      if (type === "max" && next.max < next.min) next.max = next.min;

      return next;
    });
  };

  const handleSliderChange = (e, type) => {
    if (!setPriceRange) return;

    const value = Number(e.target.value);

    setPriceRange((prev) => {
      if (type === "min") {
        return { ...prev, min: Math.min(value, prev.max) };
      }

      return { ...prev, max: Math.max(value, prev.min) };
    });
  };

  return (
    <div className="rounded-[30px] border border-zinc-200 bg-white p-6 shadow-[0_20px_55px_-30px_rgba(15,23,42,0.18)]">
      <div className="mb-7 flex items-center gap-4 border-b border-zinc-100 pb-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-100">
          <Funnel className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-2xl font-black text-zinc-900">فیلتر محصولات</h2>
          <p className="mt-1 text-sm font-medium text-zinc-500">
            دسته‌بندی و بازه قیمت موردنظر را انتخاب کنید
          </p>
        </div>
      </div>

      <div className="mb-6 rounded-[24px] border border-zinc-200 bg-gradient-to-b from-zinc-50 to-white p-5">
        <div className="mb-4 flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm ring-1 ring-zinc-100">
            <Grid2x2 className="h-4.5 w-4.5" />
          </div>
          <h3 className="text-base font-extrabold text-zinc-900">دسته‌بندی</h3>
        </div>

        <div className="relative">
          <select
            value={selectedCategory ?? ""}
            onChange={(e) =>
              setSelectedCategory(e.target.value === "" ? null : e.target.value)
            }
            className="w-full appearance-none rounded-2xl border border-zinc-200 bg-white px-4 py-3.5 text-base font-bold text-zinc-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          >
            <option value="">همه محصولات</option>
            {categories.map((cat) => {
              const categoryValue = cat?._id || cat?.id;
              return (
                <option key={categoryValue} value={categoryValue}>
                  {cat?.name}
                </option>
              );
            })}
          </select>

          <ChevronDown className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
        </div>
      </div>

      <div className="rounded-[24px] border border-blue-100 bg-gradient-to-b from-blue-50 via-white to-white p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
        <div className="mb-4 flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm ring-1 ring-blue-100">
            <WalletCards className="h-4.5 w-4.5" />
          </div>
          <h3 className="text-base font-extrabold text-zinc-900">محدوده قیمت</h3>
        </div>

        <div className="mb-5 rounded-[22px] border border-blue-100 bg-white px-4 py-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="text-sm font-bold text-zinc-500">بازه انتخاب‌شده</span>
            <div className="text-left">
              <span className="text-base font-black text-blue-700">
                {formatPrice(safeMax)}
              </span>
              <span className="mx-1 text-sm font-bold text-zinc-400">تا</span>
              <span className="text-base font-black text-blue-700">
                {formatPrice(safeMin)}
              </span>
              <span className="mr-1 text-sm font-bold text-blue-600">تومان</span>
            </div>
          </div>

          <div className="relative h-3 w-full overflow-hidden rounded-full bg-zinc-200">
            <div
              className="absolute top-0 h-full rounded-full bg-gradient-to-r from-blue-700 to-blue-500 transition-all duration-200"
              style={{
                left: `${minPercent}%`,
                right: `${100 - maxPercent}%`,
              }}
            />
          </div>

          <div className="mt-3 flex items-center justify-between text-xs font-bold text-zinc-400">
            <span>{formatPrice(MAX_PRICE)}</span>
            <span>۰</span>
          </div>
        </div>

        <div className="relative mb-7 h-10 w-full px-1" dir="rtl">
          <div className="absolute top-1/2 h-2 w-full -translate-y-1/2 rounded-full bg-zinc-200" />

          <div
            className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-700 to-blue-500 transition-all duration-200"
            style={{
              left: `${minPercent}%`,
              right: `${100 - maxPercent}%`,
            }}
          />

          <input
            type="range"
            min="0"
            max={MAX_PRICE}
            value={safeMin}
            onChange={(e) => handleSliderChange(e, "min")}
            className="pointer-events-none absolute top-1/2 z-20 h-2 w-full -translate-y-1/2 appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-blue-600 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md"
          />

          <input
            type="range"
            min="0"
            max={MAX_PRICE}
            value={safeMax}
            onChange={(e) => handleSliderChange(e, "max")}
            className="pointer-events-none absolute top-1/2 z-30 h-2 w-full -translate-y-1/2 appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-blue-600 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-right text-sm font-black text-zinc-800">
              حداکثر قیمت
            </label>
            <div className="relative">
              <input
                type="number"
                value={safeMax}
                onChange={(e) => handleInputChange(e, "max")}
                className="w-full rounded-2xl border border-zinc-200 bg-white px-3 py-3 text-center text-base font-bold text-zinc-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-extrabold text-zinc-500">
                تومان
              </span>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-right text-sm font-black text-zinc-800">
              حداقل قیمت
            </label>
            <div className="relative">
              <input
                type="number"
                value={safeMin}
                onChange={(e) => handleInputChange(e, "min")}
                className="w-full rounded-2xl border border-zinc-200 bg-white px-3 py-3 text-center text-base font-bold text-zinc-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-extrabold text-zinc-500">
                تومان
              </span>
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-[20px] bg-gradient-to-r from-blue-700 to-blue-600 px-4 py-3.5 text-center shadow-lg shadow-blue-200">
          <p className="text-base font-black text-white">
            از {formatPrice(safeMin)} تا {formatPrice(safeMax)}
            <span className="mr-1 text-sm font-bold text-blue-100">تومان</span>
          </p>
        </div>
      </div>
    </div>
  );
}
