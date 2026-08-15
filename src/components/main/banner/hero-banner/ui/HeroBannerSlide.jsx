"use client";

import Image from "next/image";
import Link from "next/link";

export default function HeroBannerSlide({ banner }) {
  const desktopImage = banner?.desktopImage;
  const mobileImage = banner?.mobileImage || banner?.desktopImage;
  const href = banner?.link || "#";

  return (
    <Link
      href={href}
      className="group block"
      aria-label={banner?.title || "hero banner"}
    >
      {/* 
        ارتفاع بنرها طبق درخواست شما تنظیم شده است:
        موبایل: h-[280px]
        تبلت (md): h-[400px]
        دسکتاپ (lg): h-[650px]
      */}
      <div 
        className="
          relative 
          h-[280px] 
          w-full 
          overflow-hidden 
          rounded-[32px] 
          border 
          border-slate-200/70 
          bg-slate-100 
          shadow-[0_20px_60px_-20px_rgba(15,23,42,0.28)] 
          md:h-[400px] 
          lg:h-[650px]
        "
      >
        {/* تصویر نسخه دسکتاپ */}
        <div className="relative hidden h-full w-full md:block">
          <Image
            src={desktopImage}
            alt={banner?.title || "banner"}
            fill
            priority
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 1200px"
          />
        </div>

        {/* تصویر نسخه موبایل */}
        <div className="relative block h-full w-full md:hidden">
          <Image
            src={mobileImage}
            alt={banner?.title || "banner"}
            fill
            priority
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            sizes="100vw"
          />
        </div>

        {/* لایه‌های گرادیانت پریمیوم برای جلوه بصری بهتر روی متن یا المان‌ها */}
        <div className="absolute inset-0 bg-gradient-to-l from-slate-950/45 via-slate-900/10 to-blue-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(96,165,250,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.16),transparent_25%)]" />

        {/* افکت درخشش براق (Shine Effect) در هنگام هاور */}
        <div className="absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-white/10 blur-2xl transition-all duration-1000 group-hover:left-[120%]" />

        {/* لیبل شناور "ویژه فروشگاه" */}
        <div className="absolute bottom-5 right-5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-md">
          ویژه فروشگاه
        </div>
      </div>
    </Link>
  );
}
