import Link from "next/link";
import { HiOutlineEye, HiOutlineChevronLeft } from "react-icons/hi";
import { BiGridAlt } from "react-icons/bi";
import { AiOutlineProduct } from "react-icons/ai";

export default function ByCategoryView({ categories = [] }) {
  return (
    <section className="relative bg-transparent py-16 md:py-20">
      <div className="mx-auto max-w-[1550px] px-6">
        {/* Header */}
        <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-[#0B3C5D]/10 bg-[#EEF5FB] px-5 py-2 text-sm font-bold text-[#0B3C5D] shadow-sm">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0B3C5D] text-white">
                <BiGridAlt className="text-lg" />
              </span>
              دسته‌بندی محصولات
            </div>

            <h2 className="text-3xl font-black leading-tight text-[#0F2740] md:text-4xl lg:text-5xl">
              دسته‌بندی محصولات
            </h2>
          </div>

          <div>
            <Link
              href="/categories"
              className="group inline-flex items-center justify-center gap-3 rounded-2xl border border-[#D7E4F0] bg-white px-8 py-4 text-base font-bold text-[#0B3C5D] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#0B3C5D]/30 hover:bg-[#F7FBFF] hover:text-[#0F4F78] hover:shadow-[0_18px_40px_-18px_rgba(11,60,93,0.18)] active:scale-[0.98]"
            >
              <HiOutlineEye className="text-xl" />
              <span>مشاهده همه دسته‌ها</span>
              <HiOutlineChevronLeft className="text-xl transition-transform duration-300 group-hover:-translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Banner */}
        <div className="relative mb-14 overflow-hidden rounded-[32px] border border-[#D7E4F0] bg-[linear-gradient(135deg,#F8FBFF_0%,#FFFFFF_45%,#EEF5FB_100%)] px-10 py-10 shadow-[0_18px_45px_-30px_rgba(11,60,93,0.14)]">
          <div className="absolute -right-10 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full bg-[#0B3C5D]/10 blur-3xl" />
          <div className="absolute -left-12 top-0 h-32 w-32 rounded-full bg-[#D7E4F0]/70 blur-3xl" />

          <p className="relative z-10 flex flex-wrap items-center justify-center gap-4 text-center text-xl font-black text-[#0B3C5D] md:text-2xl">
            <span className="text-3xl">
              <AiOutlineProduct />
            </span>
            <span>تنوع محصولات ما رو دیدی؟</span>
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:gap-8 lg:grid-cols-4 xl:grid-cols-6">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              href={`/${cat.slug}`}
              className="group relative overflow-visible rounded-[32px] border border-[#D7E4F0] bg-[linear-gradient(180deg,#FFFFFF_0%,#FBFDFF_100%)] p-6 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-[#0B3C5D]/25 hover:shadow-[0_24px_50px_-24px_rgba(11,60,93,0.18)]"
            >
              <div className="pointer-events-none absolute inset-0 rounded-[32px] bg-gradient-to-b from-transparent via-transparent to-[#0B3C5D]/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="relative z-10 flex flex-col items-center text-center">
                {/* Image */}
                <div className="relative mb-6 flex h-36 w-36 items-center justify-center rounded-full border border-[#E7EFF6] bg-[#F7FBFF] p-2 shadow-inner transition-all duration-500 group-hover:scale-105 group-hover:border-[#0B3C5D]/15 group-hover:bg-white group-hover:shadow-[0_14px_30px_-16px_rgba(11,60,93,0.18)]">
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      loading="lazy"
                      className="h-[85%] w-[85%] object-contain transition-all duration-500 ease-out group-hover:scale-110"
                    />
                  ) : (
                    <span className="text-xs font-bold text-[#8AA0B5]">
                      بدون تصویر
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="min-h-[52px] line-clamp-2 text-lg font-bold leading-7 text-[#0F2740] transition-colors duration-300 group-hover:text-[#0B3C5D]">
                  {cat.name}
                </h3>

                {/* Action */}
                <p className="mt-2 text-sm font-medium text-[#5F7893] transition-colors duration-300 group-hover:text-[#0B3C5D]">
                  مشاهده محصولات
                </p>

                {/* Underline */}
                <span className="mt-5 h-1.5 w-8 rounded-full bg-[#D7E4F0] transition-all duration-500 group-hover:w-16 group-hover:bg-[#0B3C5D]" />
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {categories.length === 0 && (
          <div className="rounded-[40px] border-2 border-dashed border-[#D7E4F0] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FBFF_100%)] px-10 py-24 text-center">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-[#EEF5FB] text-[#0B3C5D] shadow-sm">
              <BiGridAlt className="text-5xl" />
            </div>

            <h3 className="text-2xl font-black text-[#0F2740]">
              هنوز دسته‌بندی‌ای ثبت نشده
            </h3>

            <p className="mx-auto mt-4 max-w-md text-[#5F7893]">
              بعد از افزودن دسته‌بندی‌ها در پنل مدیریت، این بخش به‌صورت خودکار با
              ظاهری جذاب نمایش داده خواهد شد.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
