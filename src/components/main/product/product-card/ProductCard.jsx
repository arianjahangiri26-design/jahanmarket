// src/components/product/showcase/ProductCard.jsx
import Image from "next/image";
import Link from "next/link";
import { HiOutlineShoppingBag, HiOutlineEye } from "react-icons/hi2";

function formatPrice(price) {
  return Number(price || 0).toLocaleString("fa-IR");
}

function stripHtml(html = "") {
  return html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

function truncateText(text = "", maxLength = 110) {
  if (!text) return "محصولی با کیفیت بالا و مناسب برای نیاز شما.";
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
}

export default function ProductCard({ product }) {
  const title = product?.title || product?.name || "محصول بدون نام";
  const image =
    product?.imageProduct || product?.image || "/images/product-placeholder.png";

  const description = truncateText(
    stripHtml(product?.description || product?.shortDescription || ""),
    95
  );

  const price = Number(product?.price || 0);
  const discountPrice = Number(product?.discountPrice || 0);

  const hasDiscount =
    discountPrice > 0 && price > 0 && discountPrice < price;

  const discountPercent = hasDiscount
    ? Math.round(((price - discountPrice) / price) * 100)
    : 0;

  const href = `/product/${product?.id || product?._id || ""}`;

  return (
    <Link
      href={href}
      className="group relative block h-full overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-blue-200 hover:shadow-[0_20px_60px_-15px_rgba(37,99,235,0.25)]"
    >
      {/* background glow */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white via-white to-blue-50/60 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {/* top blur */}
      <div className="pointer-events-none absolute -top-16 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-blue-200/20 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Image Section */}
      <div className="relative p-3 pb-0">
        {/* badges */}
        <div className="absolute left-5 top-5 z-20 flex items-center gap-2">
          <span className="rounded-full bg-blue-600 px-3 py-1 text-[11px] font-extrabold text-white shadow-lg shadow-blue-500/30">
            ویژه
          </span>

          {product?.isNew && (
            <span className="rounded-full bg-emerald-500 px-3 py-1 text-[11px] font-extrabold text-white shadow-md">
              جدید
            </span>
          )}
        </div>

        {hasDiscount && (
          <div className="absolute right-5 top-5 z-20 rounded-full bg-red-500 px-3 py-1 text-[11px] font-black text-white shadow-lg shadow-red-500/20">
            {discountPercent}٪ تخفیف
          </div>
        )}

        <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-slate-50 via-white to-blue-50">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.10),_transparent_55%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          <div className="relative aspect-[1/1] overflow-hidden">
            <Image
              src={image}
              alt={title}
              fill
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 40vw, 300px"
              className="object-contain  rounded-[40px]  p-5 transition-all duration-700 ease-out group-hover:scale-110 group-hover:-translate-y-1"
            />
          </div>

          {/* quick action overlay */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-6 items-center justify-center opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-xs font-bold text-slate-700 shadow-xl backdrop-blur-sm">
              <HiOutlineEye className="text-base text-blue-600" />
              مشاهده جزئیات محصول
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-[calc(100%-0px)] flex-col p-5">
        {/* category */}
        {product?.category?.name && (
          <div className="mb-3">
            <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-bold text-slate-500">
              {product.category.name}
            </span>
          </div>
        )}

        {/* title */}
        <h3 className="line-clamp-2 min-h-[56px] text-[15px] font-extrabold leading-7 text-slate-800 transition-colors duration-300 group-hover:text-blue-700 md:text-base">
          {title}
        </h3>

        {/* short description */}
        <p className="mt-3 line-clamp-2 min-h-[48px] text-sm leading-6 text-slate-500">
          {description}
        </p>

        {/* spacer */}
        <div className="flex-1" />

        {/* bottom section */}
        <div className="mt-5 border-t border-slate-100 pt-4">
          <div className="flex items-end justify-between gap-3">
            <div className="space-y-1.5">
              {hasDiscount ? (
                <>
                  <div className="text-xs font-medium text-slate-400 line-through">
                    {formatPrice(price)} تومان
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-blue-700 md:text-xl">
                      {formatPrice(discountPrice)}
                    </span>
                    <span className="text-sm font-bold text-slate-500">
                      تومان
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="  font-serif   text-blue-700 md:text-2xl">
                    {formatPrice(price)}
                  </span>
                  <span className="text-sm font-bold text-slate-500">
                    تومان
                  </span>
                </div>
              )}
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-600 transition-all duration-300 group-hover:scale-110 group-hover:border-blue-600 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-blue-500/20">
              <HiOutlineShoppingBag className="text-[22px]" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
