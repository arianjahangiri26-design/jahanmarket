"use client";

import Image from "next/image";
import Link from "next/link";
import { HiOutlineShoppingBag } from "react-icons/hi2";

const formatPrice = (p) => Number(p || 0).toLocaleString("fa-IR");
const stripHtml = (t = "") => t.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
const slugify = (t = "") => String(t).trim().toLowerCase().replace(/\s+/g, "-").replace(/[^\w\u0600-\u06FF-]/g, "");

export default function ProductCard({ product }) {
  if (!product?.isActive) return null;

  const { _id, id, price = 0, createdAt } = product;
  const title = product.title || product.name || "محصول بدون نام";
  const isOutOfStock = Number(product.stock ?? product.countInStock ?? product.quantity ?? 0) <= 0;
  
  // تصویر و لینک
  const image = (Array.isArray(product.images) ? product.images[0] : product.image) || "/images/product-placeholder.png";
  const href = `/product-details/${_id || id}/${slugify(title)}`;

  // محاسبات تخفیف و تازگی
  const discount = Math.min(Math.max(Number(product.discountprice ?? product.discountPrice) || 0, 0), 99);
  const finalPrice = discount > 0 ? Math.round(price - (price * discount) / 100) : price;
  const isFresh = createdAt && (new Date() - new Date(createdAt)) / 86400000 <= 3;
  const desc = stripHtml(product.description || product.shortDescription || "");

  return (
    <Link
      href={href}
      className={`group relative mx-auto flex h-full w-full max-w-[320px] flex-col overflow-hidden rounded-[32px] border bg-white transition-all duration-500 hover:-translate-y-2 ${
        isOutOfStock
          ? "border-slate-200 shadow-sm opacity-85"
          : "border-[#D9E7F5] shadow-[0_12px_45px_-15px_rgba(11,60,93,0.08)] hover:border-[#93C5FD]/60 hover:shadow-[0_24px_60px_-15px_rgba(11,60,93,0.16)]"
      }`}
    >
      {/* مدیا و عکس محصول */}
      <div className="p-4 pb-0">
        <div className={`relative overflow-hidden rounded-[28px] p-6 transition-colors ${
          isOutOfStock ? "bg-slate-100" : "bg-gradient-to-br from-blue-50/90 via-blue-100/50 to-slate-50"
        }`}>
          {/* بج‌ها */}
          <div className="absolute right-4 top-4 z-10 flex gap-2">
            {isOutOfStock ? (
              <span className="rounded-full bg-slate-600/90 px-3 py-1 text-[12px] font-bold text-white">ناموجود</span>
            ) : (
              <>
                {isFresh && <span className="rounded-full bg-[#0B3C5D] px-3 py-1 text-[12px] font-bold text-white">تازه</span>}
                {discount > 0 && <span className="rounded-full bg-[#2563EB] px-3 py-1 text-[12px] font-bold text-white">{discount}٪ تخفیف</span>}
              </>
            )}
          </div>

          <div className="relative h-[240px] w-full overflow-hidden rounded-[20px]">
            <Image
              src={image}
              alt={title}
              fill
              sizes="(max-width: 640px) 100vw, 320px"
              className={`object-contain transition-transform duration-700 group-hover:scale-105 ${
                isOutOfStock ? "grayscale opacity-60" : ""
              }`}
            />
          </div>
        </div>
      </div>

      {/* اطلاعات محصول */}
      <div className="flex flex-1 flex-col px-5 pb-5 pt-4 text-right">
        <h3 className="line-clamp-1 text-[17px] font-bold leading-7 text-[#0A2540] transition-colors group-hover:text-[#0B3C5D]">
          {title}
        </h3>

        <p className="mt-1 line-clamp-2 min-h-[42px] text-[13px] leading-6 text-[#627D98]">
          {desc || "محصولی با کیفیت و طراحی مدرن برای استفاده روزمره."}
        </p>

        <div className="mt-4 flex items-end justify-between gap-3 border-t border-[#EAF2F9] pt-4">
          <div className="flex flex-col justify-end">
            {isOutOfStock ? (
              <span className="text-[15px] font-bold text-slate-400">در حال حاضر ناموجود</span>
            ) : (
              <>
                {discount > 0 && (
                  <span className="text-[12px] font-medium text-[#9FB3C8] line-through">{formatPrice(price)}</span>
                )}
                <div className="flex items-baseline gap-1">
                  <span className="text-[26px] font-extrabold tracking-tighter text-[#0A2540]">{formatPrice(finalPrice)}</span>
                  <span className="text-[14px] font-bold text-[#0B3C5D]">تومان</span>
                </div>
              </>
            )}
          </div>

          <button
            type="button"
            disabled={isOutOfStock}
            aria-label="افزودن به سبد خرید"
            className={`flex h-12 w-12 items-center justify-center rounded-[20px] transition-all duration-300 ${
              isOutOfStock
                ? "cursor-not-allowed bg-slate-200 text-slate-400"
                : "bg-blue-600 text-white shadow-md shadow-[#0B3C5D]/20 hover:bg-sky-500 active:scale-95"
            }`}
          >
            <HiOutlineShoppingBag className="text-[22px]" />
          </button>
        </div>
      </div>
    </Link>
  );
}
