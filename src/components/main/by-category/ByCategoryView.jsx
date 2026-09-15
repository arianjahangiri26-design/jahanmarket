// src/components/category/CategoryListView.js
import Link from "next/link";
import { HiOutlineEye, HiOutlineChevronLeft } from "react-icons/hi";
import { BiGridAlt } from "react-icons/bi";
import { AiOutlineProduct } from "react-icons/ai";

export default function ByCategoryView({ categories = [] }) {
  return (
    <section className="relative py-20 md:py-24">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-12 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-blue-100 bg-blue-50 px-5 py-2 text-sm font-bold text-blue-700 shadow-sm">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
                <BiGridAlt className="text-lg" />
              </span>
              دسته‌بندی محصولات
            </div>

            <h2 className="text-3xl font-extrabold leading-tight text-slate-800 md:text-4xl lg:text-5xl">
              از بین{" "}
              <span className="text-blue-600">دسته‌بندی‌های اصلی</span>{" "}
              انتخاب کن
            </h2>
          </div>

          <div>
            <Link
              href="/categories"
              className="group inline-flex items-center justify-center gap-3 rounded-2xl border border-blue-200 bg-white px-7 py-4 text-base font-bold text-blue-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-500 hover:bg-blue-600 hover:text-white hover:shadow-lg hover:shadow-blue-200/60 active:scale-[0.98]"
            >
              <HiOutlineEye className="text-xl" />
              <span>مشاهده همه دسته‌ها</span>
              <HiOutlineChevronLeft className="text-xl transition-transform duration-300 group-hover:-translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Banner */}
        <div className="relative mb-14 overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-l from-blue-50 via-white to-cyan-50 px-10 py-8 shadow-sm md:px-12 md:py-9">
          <div className="absolute -right-10 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full bg-blue-200/20 blur-3xl" />
          <div className="absolute -left-12 top-0 h-32 w-32 rounded-full bg-cyan-200/20 blur-3xl" />

          <p className="relative z-10 flex flex-wrap items-center justify-center gap-3 text-center text-xl font-extrabold text-blue-700 md:text-2xl">
            <span className="text-2xl md:text-3xl">  <AiOutlineProduct /> </span>
            <span>تنوع محصولات ما رو دیدی؟</span>
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:gap-7 lg:grid-cols-4 xl:grid-cols-6">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              href={`/${cat.slug}`}
              className="group relative overflow-visible rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-100/70"
            >
              {/* Hover background glow */}
              <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-b from-blue-50/0 via-blue-50/0 to-blue-50/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              {/* top decorative blur */}
              <div className="pointer-events-none absolute -top-12 left-1/2 h-28 w-28 -translate-x-1/2 rounded-full bg-blue-200/20 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative z-10 flex flex-col items-center text-center">
                {/* Circle Image Area */}
                <div className="relative mb-5 flex h-32 w-32 items-center justify-center rounded-full border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50 p-1 shadow-inner transition-all duration-300 group-hover:scale-110 group-hover:border-blue-400 group-hover:shadow-lg group-hover:shadow-blue-100">
                  {/* inner white circle */}
                  <div className="relative flex h-full w-full items-center justify-center rounded-full bg-white">
                    {cat.image ? (
                      <img
                        src={cat.image}
                        alt={cat.name}
                        loading="lazy"
                        className="absolute -top-1 rounded-[40px] left-1/2 h-[90%] w-[90%] max-w-none -translate-x-1/2 object-contain transition-all duration-500 ease-out group-hover:-top-2 group-hover:scale-110"
                      />
                    ) : (
                      <span className="text-sm font-bold text-slate-400">
                        بدون تصویر
                      </span>
                    )}
                  </div>
                </div>

                {/* Title */}
                <h3 className="line-clamp-2 min-h-[52px] text-base font-extrabold leading-7 text-slate-700 transition-colors duration-300 group-hover:text-blue-700">
                  {cat.name}
                </h3>

                {/* Subtitle */}
                <p className="mt-2 text-sm text-slate-400 transition-colors duration-300 group-hover:text-slate-500">
                  مشاهده محصولات
                </p>

                {/* underline */}
                <span className="mt-4 h-1 w-8 rounded-full bg-blue-100 transition-all duration-300 group-hover:w-14 group-hover:bg-blue-600" />
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {categories.length === 0 && (
          <div className="rounded-3xl border border-dashed border-blue-200 bg-blue-50/40 px-10 py-20 text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm">
              <BiGridAlt className="text-4xl" />
            </div>

            <h3 className="text-xl font-extrabold text-slate-700">
              هنوز دسته‌بندی‌ای ثبت نشده
            </h3>

            <p className="mt-3 text-base text-slate-500">
              بعد از افزودن دسته‌بندی‌ها، این بخش به‌صورت خودکار نمایش داده
              می‌شود.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
