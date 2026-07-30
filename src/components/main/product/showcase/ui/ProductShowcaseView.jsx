"use client";

import { useId } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";

// Default Swiper styles
import "swiper/css";
import ProductCard from "../../product-card/ProductCard";

export default function ProductShowcaseView({
  title,
  subtitle,
  href,
  products,
}) {
  const uniqueId = useId().replace(/:/g, "");

  if (!products || products.length === 0) return null;

  return (
    <section className="relative mx-auto my-12 w-full max-w-[1550px] overflow-hidden rounded-[32px] border border-[#D7E4F0] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FBFF_100%)] px-4 py-12 shadow-[0_20px_60px_-35px_rgba(11,60,93,0.16)] sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute right-1/4 top-0 -z-10 h-96 w-96 rounded-full bg-[#0B3C5D]/6 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/4 -z-10 h-80 w-80 rounded-full bg-[#D7E4F0]/45 blur-3xl" />

      <div className="mb-10 flex flex-col justify-between gap-5 border-b border-[#E8F0F7] pb-6 sm:flex-row sm:items-end">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="block h-7 w-2 rounded-full bg-[#0B3C5D]" />
            <h2 className="text-2xl font-black tracking-tight text-[#0F2740] sm:text-3xl">
              {title}
            </h2>
          </div>

          {subtitle && (
            <p className="pr-5 text-sm font-medium text-[#5F7893] sm:text-base">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between gap-6 sm:justify-end">
          {href && (
            <Link
              href={href}
              className="group flex items-center gap-2 rounded-full border border-[#D7E4F0] bg-white px-4 py-2 text-md font-extrabold text-[#0B3C5D] transition-all duration-300 hover:border-[#BFD3E4] hover:bg-[#F7FBFF] hover:text-[#0F4F78]"
            >
              مشاهده همه
              <ArrowLeft
                size={18}
                className="transition-transform text-blue-600 duration-300 group-hover:-translate-x-1"
              />
            </Link>
          )}

          <div className="flex items-center gap-2.5">
            <button
              id={`prev-${uniqueId}`}
              aria-label="اسلاید قبلی"
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#D7E4F0] bg-white text-[#5F7893] shadow-sm transition-all duration-300 hover:border-[#0B3C5D]/30 hover:bg-[#F4F9FD] hover:text-[#0B3C5D] active:scale-95 disabled:pointer-events-none disabled:opacity-40"
            >
              <ChevronRight size={22} />
            </button>

            <button
              id={`next-${uniqueId}`}
              aria-label="اسلاید بعدی"
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#D7E4F0] bg-white text-[#5F7893] shadow-sm transition-all duration-300 hover:border-[#0B3C5D]/30 hover:bg-[#F4F9FD] hover:text-[#0B3C5D] active:scale-95 disabled:pointer-events-none disabled:opacity-40"
            >
              <ChevronLeft size={22} />
            </button>
          </div>
        </div>
      </div>

      <div className="relative">
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={20}
          slidesPerView={1.15}
          dir="rtl"
          autoplay={{
            delay: 4500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          navigation={{
            nextEl: `#next-${uniqueId}`,
            prevEl: `#prev-${uniqueId}`,
          }}
          breakpoints={{
            480: { slidesPerView: 1.4, spaceBetween: 16 },
            640: { slidesPerView: 1.8, spaceBetween: 18 },
            768: { slidesPerView: 2.2, spaceBetween: 20 },
            1024: { slidesPerView: 2.6, spaceBetween: 22 },
            1280: { slidesPerView: 3.15, spaceBetween: 24 },
            1500: { slidesPerView: 3, spaceBetween: 28 },
          }}
          className="product-swiper !px-1.5 !py-5"
        >
          {products.map((product) => (
            <SwiperSlide key={product._id} className="h-auto">
              <div className="h-full pb-3 transition-all duration-500 ease-out hover:-translate-y-1.5">
                <ProductCard product={product} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
