"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";

import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

import { FaSearchPlus, FaChevronRight, FaChevronLeft } from "react-icons/fa";

export default function ProductGallery({ images = [], image, title = "محصول" }) {
  // پاک‌سازی هوشمند و ساخت لیست یکتا
  const imageList = useMemo(() => {
    const raw = [image, ...(Array.isArray(images) ? images : [])];
    const clean = [...new Set(raw.filter((i) => typeof i === "string" && i.trim()))];
    return clean.length > 0 ? clean : ["/images/product-placeholder.png"];
  }, [images, image]);

  const [activeIdx, setActiveIdx] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);

  const total = imageList.length;
  const next = (e) => { e?.stopPropagation(); setActiveIdx((i) => (i + 1) % total); };
  const prev = (e) => { e?.stopPropagation(); setActiveIdx((i) => (i - 1 + total) % total); };

  // ژست لمسی (Swipe) برای تجربه عالی روی موبایل
  const handleTouchEnd = (e) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (diff > 40) next();
    if (diff < -40) prev();
    setTouchStartX(null);
  };

  return (
    <>
      <div className="sticky top-24 select-none rounded-3xl border border-slate-100 bg-white p-3 sm:p-4 shadow-xl shadow-slate-100/60">
        {/* کانتینر تصویر اصلی */}
        <div
          onTouchStart={(e) => setTouchStartX(e.targetTouches[0].clientX)}
          onTouchEnd={handleTouchEnd}
          onClick={() => setIsOpen(true)}
          className="group relative aspect-square w-full cursor-zoom-in overflow-hidden rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100/60"
        >
          {/* دکمه ذره‌بین */}
          <button
            type="button"
            className="absolute left-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-xl bg-white/80 text-slate-700 shadow-sm backdrop-blur-md transition-all hover:scale-110 hover:bg-blue-600 hover:text-white"
            title="بزرگ‌نمایی"
          >
            <FaSearchPlus className="text-xs" />
          </button>

          {/* تصویر فعال */}
          <Image
            src={imageList[activeIdx]}
            alt={`${title} - ${activeIdx + 1}`}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 500px"
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
          />

          {/* کنترل‌های ورق زدن (فقط در صورت وجود بیش از ۱ تصویر) */}
          {total > 1 && (
            <>
              <button
                type="button"
                onClick={prev}
                className="absolute left-3 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md backdrop-blur-sm transition-all hover:scale-110 hover:bg-blue-600 hover:text-white sm:opacity-0 sm:group-hover:opacity-100"
              >
                <FaChevronLeft className="text-xs" />
              </button>

              <button
                type="button"
                onClick={next}
                className="absolute right-3 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md backdrop-blur-sm transition-all hover:scale-110 hover:bg-blue-600 hover:text-white sm:opacity-0 sm:group-hover:opacity-100"
              >
                <FaChevronRight className="text-xs" />
              </button>

              {/* نشانگر مینیمال شماره عکس */}
              <div className="absolute right-3 top-3 z-10 rounded-full bg-slate-900/60 px-2.5 py-0.5 text-[11px] font-bold text-white backdrop-blur-md">
                {activeIdx + 1} / {total}
              </div>
            </>
          )}
        </div>

        {/* لیست تصاویر بندانگشتی (Thumbnails) */}
        {total > 1 && (
          <div className="mt-3 flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
            {imageList.map((img, idx) => (
              <button
                key={`${img}-${idx}`}
                type="button"
                onClick={() => setActiveIdx(idx)}
                className={`relative h-16 w-16 sm:h-[72px] sm:w-[72px] shrink-0 overflow-hidden rounded-xl border-2 bg-white transition-all duration-200 ${
                  idx === activeIdx
                    ? "border-blue-600 ring-2 ring-blue-500/20 scale-100"
                    : "border-slate-200/80 opacity-60 hover:opacity-100 hover:border-slate-300"
                }`}
              >
                <Image src={img} alt={`thumb-${idx}`} fill sizes="72px" className="object-contain p-1" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* لایت‌باکس با قابلیت زوم دوضرب و حرکات لمسی */}
      <Lightbox
        open={isOpen}
        close={() => setIsOpen(false)}
        index={activeIdx}
        slides={useMemo(() => imageList.map((src) => ({ src })), [imageList])}
        on={{ view: ({ index }) => setActiveIdx(index) }}
        plugins={[Zoom, Thumbnails, Fullscreen]}
        zoom={{ maxZoomPixelRatio: 3, scrollToZoom: true }}
      />
    </>
  );
}
