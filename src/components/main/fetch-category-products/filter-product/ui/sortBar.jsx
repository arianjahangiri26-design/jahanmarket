"use client";

import {
  ArrowDownWideNarrow,
  ArrowUpWideNarrow,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react";

const sortOptions = [
  { label: "جدیدترین", value: "newest", icon: Sparkles },
  { label: "ارزان‌ترین", value: "cheap", icon: ArrowDownWideNarrow },
  { label: "گران‌ترین", value: "expensive", icon: ArrowUpWideNarrow },
];

export default function SortBar({
  sortBy = "newest",
  setSortBy = () => {},
  totalProducts = 0,
}) {
  return (
    <div className="mb-8">
      <div className="flex justify-start">
        <div className="w-full max-w-full md:w-fit md:min-w-[760px] overflow-hidden rounded-[1rem] border border-blue-100 bg-white/90 px-5 py-3 shadow-[0_20px_50px_-25px_rgba(37,99,235,0.35)] backdrop-blur-md md:px-6 md:py-3.5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-5">
            <div className="flex flex-wrap items-center gap-3">
              <div className="ml-1 hidden h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 md:flex">
                <SlidersHorizontal className="h-5 w-5" />
              </div>

              {sortOptions.map((item) => {
                const Icon = item.icon;
                const isActive = sortBy === item.value;

                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setSortBy(item.value)}
                    className={`group flex items-center gap-2 rounded-2xl px-4 py-2.5 text-base font-extrabold transition-all duration-300 ${
                      isActive
                        ? "scale-[1.03] bg-blue-600 text-white shadow-lg shadow-blue-200"
                        : "bg-zinc-50 text-zinc-600 hover:bg-blue-50 hover:text-blue-700"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 transition-transform duration-300 ${
                        isActive
                          ? "scale-110"
                          : "opacity-70 group-hover:scale-110 group-hover:opacity-100"
                      }`}
                    />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex shrink-0 items-center gap-4 rounded-2xl border border-zinc-100 bg-zinc-50 px-4 py-2.5 md:border-0 md:bg-transparent md:px-0 md:py-0">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-blue-600" />
              </span>

              <div className="text-right">
                <span className="block text-xs font-bold tracking-wider text-zinc-400">
                  وضعیت نمایش
                </span>
                <h2 className="mt-1 text-base font-extrabold text-zinc-800">
                  {totalProducts.toLocaleString()}{" "}
                  <span className="text-sm font-medium text-zinc-500">
                    محصول یافت شد
                  </span>
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
