"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import {
  FaSpinner,
  FaQuoteRight,
  FaUserCircle,
  FaCheckCircle,
} from "react-icons/fa";

import "swiper/css";
import "swiper/css/pagination";

export default function CommentDisplay({
  comments = [],
  commentsLoading = false,
}) {
  if (commentsLoading) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-[#0B3C5D]" />
      </div>
    );
  }

  const safeComments = Array.isArray(comments) ? comments : [];

  if (safeComments.length === 0) {
    return (
      <div className="w-full rounded-2xl border-2 border-dashed border-blue-100 bg-blue-50/50 px-4 py-12 text-center sm:px-6">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
          <FaUserCircle className="text-4xl text-blue-200" />
        </div>
        <h3 className="text-lg font-black text-[#0A2540] sm:text-xl">
          هنوز دیدگاهی ثبت نشده
        </h3>
        <p className="mx-auto mt-2 max-w-xs text-xs leading-6 text-slate-500 sm:text-sm sm:leading-7">
          اولین نفری باشید که تجربه خود را از این محصول با دیگران به اشتراک می‌گذارد.
        </p>
      </div>
    );
  }

  return (
    <section className="mt-8 w-full max-w-full" dir="rtl">
      <div className="mb-6 flex w-full flex-col gap-3 px-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-0.5">
          <h2 className="text-xl font-black text-[#0B3C5D] sm:text-2xl">
            نظرات و تجربه‌ها
          </h2>
          <p className="text-xs font-medium text-slate-400 sm:text-sm">
            بررسی محصول توسط خریداران واقعی
          </p>
        </div>

        <div className="flex w-fit shrink-0 items-center gap-1.5 rounded-xl bg-[#0B3C5D] px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-blue-900/10 sm:text-sm">
          <span>{safeComments.length}</span>
          <span>دیدگاه ثبت شده</span>
        </div>
      </div>

      <div className="w-full overflow-hidden">
        <Swiper
          modules={[Pagination, Autoplay]}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop={safeComments.length > 2}
          spaceBetween={16}
          grabCursor={true}
          breakpoints={{
            0: { slidesPerView: 1 },
            640: { slidesPerView: 1.05, spaceBetween: 20 },
            1024: { slidesPerView: 1.4, spaceBetween: 24 },
            1280: { slidesPerView: 2, spaceBetween: 24 },
            1536: { slidesPerView: 2.2, spaceBetween: 28 },
          }}
          className="!w-full !pb-12"
        >
          {safeComments.map((comment) => (
            <SwiperSlide key={comment._id} className="!h-auto">
              <article className="flex h-full w-full flex-col rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_12px_40px_-10px_rgba(11,60,93,0.1)] sm:rounded-[22px] sm:p-6">
                <div className="mb-5 flex items-start justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="relative shrink-0">
                      {comment?.user?.imageProduct ? (
                        <Image
                          src={comment.user.imageProduct}
                          alt={comment.user.name || "کاربر"}
                          width={48}
                          height={48}
                          className="h-11 w-11 rounded-2xl border-2 border-white object-cover shadow-sm sm:h-12 sm:w-12"
                        />
                      ) : (
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0B3C5D] to-[#1d5b85] text-base font-black text-white shadow-sm sm:h-12 sm:w-12 sm:text-lg">
                          {comment?.user?.name?.charAt(0) || "؟"}
                        </div>
                      )}

                      <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white shadow-sm">
                        <FaCheckCircle className="text-[10px] text-green-500" />
                      </span>
                    </div>

                    <div className="flex min-w-0 flex-col gap-0.5">
                      <h3 className="truncate text-sm font-black text-[#0A2540] sm:text-base">
                        {comment?.user?.name || "کاربر ناشناس"}
                      </h3>
                      <time className="text-[10px] font-bold text-slate-400 sm:text-[11px]">
                        {comment?.createdAt
                          ? new Date(comment.createdAt).toLocaleDateString("fa-IR")
                          : "به تازگی"}
                      </time>
                    </div>
                  </div>

                  <FaQuoteRight className="shrink-0 text-2xl text-blue-50/80 sm:text-[26px]" />
                </div>

                <div className="flex-1">
                  <p className="line-clamp-4 text-justify text-sm font-medium leading-7 text-slate-600 sm:line-clamp-5 sm:text-[14px] sm:leading-[1.85]">
                    {comment.text}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-end border-t border-slate-50 pt-4 sm:mt-6 sm:pt-5">
                  <div className="rounded-lg bg-blue-50 px-3 py-1.5">
                    <span className="text-[10px] font-black text-[#0B3C5D] sm:text-[13px]">
                      خریدار تایید شده
                    </span>
                  </div>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
