"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import HeroBannerSlide from "./HeroBannerSlide";

export default function HeroBannerView({ banners = [] }) {
  return (
    <div
      className="
        relative 
        w-full 
        overflow-hidden 
        rounded-[32px]
        
        /* تبدیل کل باکس پجینیشن به یک کپسول شیشه‌ای متمرکز و مدرن */
        [&_.swiper-pagination]:!bottom-6
        [&_.swiper-pagination]:!left-1/2
        [&_.swiper-pagination]:!-translate-x-1/2
        [&_.swiper-pagination]:!w-auto
        [&_.swiper-pagination]:!inline-flex
        [&_.swiper-pagination]:!items-center
        [&_.swiper-pagination]:!justify-center
        [&_.swiper-pagination]:!gap-2
        [&_.swiper-pagination]:!bg-slate-950/40
        [&_.swiper-pagination]:!backdrop-blur-md
        [&_.swiper-pagination]:!px-4
        [&_.swiper-pagination]:!py-2.5
        [&_.swiper-pagination]:!rounded-full
        [&_.swiper-pagination]:!border
        [&_.swiper-pagination]:!border-white/10
        [&_.swiper-pagination]:!shadow-lg

        /* استایل پایه برای تمام دایره‌های غیرفعال (کمی بزرگ‌تر و خواناتر) */
        [&_.swiper-pagination-bullet]:!h-2.5
        [&_.swiper-pagination-bullet]:!w-2.5
        [&_.swiper-pagination-bullet]:!m-0
        [&_.swiper-pagination-bullet]:!bg-white/40
        [&_.swiper-pagination-bullet]:!opacity-100
        [&_.swiper-pagination-bullet]:transition-all
        [&_.swiper-pagination-bullet]:duration-300
        [&_.swiper-pagination-bullet]:hover:!bg-white/80

        /* استایل دایره فعال (کشیده، درخشان و با سایه آبی ملایم) */
        [&_.swiper-pagination-bullet-active]:!w-8
        [&_.swiper-pagination-bullet-active]:!rounded-full
        [&_.swiper-pagination-bullet-active]:!bg-gradient-to-r
        [&_.swiper-pagination-bullet-active]:!from-cyan-400
        [&_.swiper-pagination-bullet-active]:!to-blue-500
        [&_.swiper-pagination-bullet-active]:!shadow-[0_0_12px_rgba(56,189,248,0.7)]
      "
    >
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        slidesPerView={1}
        loop={banners.length > 1}
        speed={900}
        effect="fade"
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{
          clickable: true,
        }}
        className="w-full"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner._id}>
            <HeroBannerSlide banner={banner} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
