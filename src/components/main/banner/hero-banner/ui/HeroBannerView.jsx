"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  Pagination,
  EffectFade,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import HeroBannerSlide from "./HeroBannerSlide";

export default function HeroBannerView({ banners = [] }) {
  if (!Array.isArray(banners) || banners.length === 0) {
    return null;
  }

  return (
    <div
      className="
        relative
        w-full
        overflow-hidden
        rounded-[32px]

        [&_.swiper-pagination]:!bottom-6
        [&_.swiper-pagination]:!left-1/2
        [&_.swiper-pagination]:!-translate-x-1/2
        [&_.swiper-pagination]:!w-auto
        [&_.swiper-pagination]:!inline-flex
        [&_.swiper-pagination]:!gap-2
 [&_.swiper-pagination]:!justify-center
        [&_.swiper-pagination]:!gap-2
        [&_.swiper-pagination]:!rounded-full
        [&_.swiper-pagination]:!border
        [&_.swiper-pagination]:!border-white/10
        [&_.swiper-pagination]:!bg-black/25
        [&_.swiper-pagination]:!px-4
        [&_.swiper-pagination]:!py-2.5
        [&_.swiper-pagination]:!shadow-lg

        [&_.swiper-pagination-bullet]:!m-0
        [&_.swiper-pagination-bullet]:!h-2.5
        [&_.swiper-pagination-bullet]:!w-2.5
        [&_.swiper-pagination-bullet]:!bg-white/50
        [&_.swiper-pagination-bullet]:!opacity-100
        [&_.swiper-pagination-bullet]:transition-all
        [&_.swiper-pagination-bullet]:duration-300
        [&_.swiper-pagination-bullet]:hover:!bg-white

        [&_.swiper-pagination-bullet-active]:!w-8
        [&_.swiper-pagination-bullet-active]:!rounded-full
        [&_.swiper-pagination-bullet-active]:!bg-white
        [&_.swiper-pagination-bullet-active]:!shadow-[0_0_12px_rgba(255,255,255,0.7)]
      "
    >
      <Swiper
        modules={[
          Autoplay,
          Pagination,
          EffectFade,
        ]}
        slidesPerView={1}
        loop={banners.length > 1}
        speed={900}
        effect="fade"
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{
          clickable: true,
        }}
        className="w-full"
      >
        {banners.map((banner, index) => (
          <SwiperSlide
            key={banner?._id || banner?.id || `hero-${index}`}
          >
            <HeroBannerSlide
              banner={banner}
              isFirst={index === 0}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
