"use client";

import Image from "next/image";
import Link from "next/link";

export default function HeroBannerSlide({
  banner,
  isFirst = false,
}) {
  const desktopImage = banner?.desktopImage?.trim() || null;
  const mobileImage = banner?.mobileImage?.trim() || desktopImage;
  const href = banner?.link?.trim() || "#";

  if (!desktopImage && !mobileImage) {
    return null;
  }

  const isExternalLink =
    href.startsWith("http://") || href.startsWith("https://");

  const imageAlt =
    banner?.title?.trim() || "بنر تبلیغاتی جهان مارکت";

  const content = (
    <div
      className="
        group
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
      {/* تصویر دسکتاپ */}
      {desktopImage && (
        <div className="absolute inset-0 hidden md:block">
          <Image
            src={desktopImage}
            alt={imageAlt}
            fill
            priority={isFirst}
            quality={90}
            sizes="(max-width: 768px) 100vw, 1400px"
            className="
              object-cover
              object-center
              transition-transform
              duration-700
              ease-out
              group-hover:scale-[1.03]
            "
          />
        </div>
      )}

      {/* تصویر موبایل */}
      {mobileImage && (
        <div className="absolute inset-0 block md:hidden">
          <Image
            src={mobileImage}
            alt={imageAlt}
            fill
            priority={isFirst}
            quality={90}
            sizes="100vw "
            className="
              object-cover
              transition-transform
              duration-700
              ease-out
              group-hover:scale-[1.03]
            "
          />
        </div>
      )}

      {/* فقط گرادیانت پایین برای خوانایی متن؛ بدون هاله روی کل تصویر */}
      {(banner?.title || banner?.description) && (
        <div
          className="
            pointer-events-none
            absolute
            inset-x-0
            bottom-0
            h-1/3
            bg-gradient-to-t
            from-black/55
            via-black/15
            to-transparent
          "
        />
      )}

      {/* افکت شاین بسیار کم‌رنگ و بدون blur */}
      <div
        className="
          pointer-events-none
          absolute
          inset-y-0
          -left-1/3
          w-1/3
          -skew-x-12
          bg-gradient-to-r
          from-transparent
          via-white/10
          to-transparent
          opacity-0
          transition-all
          duration-1000
          group-hover:left-[120%]
          group-hover:opacity-100
        "
      />

      {/* عنوان و توضیحات */}
      {(banner?.title || banner?.description) && (
        <div
          className="
            absolute
            bottom-6
            right-6
            z-10
            hidden
            max-w-md
            md:block
          "
        >
          {banner?.title && (
            <h2 className="text-xl font-extrabold text-white drop-shadow-lg lg:text-3xl">
              {banner.title}
            </h2>
          )}

          {banner?.description && (
            <p className="mt-2 text-sm text-white drop-shadow-md lg:text-base">
              {banner.description}
            </p>
          )}
        </div>
      )}

      {/* برچسب */}
      <div
        className="
          absolute
          right-5
          top-5
          z-10
          rounded-full
          border
          border-white/20
          bg-black/20
          px-3.5
          py-1
          text-xs
          font-medium
          text-white
        "
      >
        ویژه فروشگاه
      </div>
    </div>
  );

  if (isExternalLink) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full"
        aria-label={imageAlt}
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className="block w-full"
      aria-label={imageAlt}
    >
      {content}
    </Link>
  );
}
