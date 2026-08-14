import Image from "next/image";
import Link from "next/link";
import { HiOutlineShoppingBag } from "react-icons/hi2";

function formatPrice(price) {
  return Number(price || 0).toLocaleString("fa-IR");
}

function stripHtml(html = "") {
  return html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

function truncateText(text = "", maxLength = 78) {
  if (!text) return "محصولی با کیفیت و طراحی مدرن برای استفاده روزمره.";
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
}

function slugify(value = "") {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u0600-\u06FF-]/g, "");
}

function isFreshProduct(createdAt, days = 3) {
  if (!createdAt) return false;

  const createdDate = new Date(createdAt);
  if (Number.isNaN(createdDate.getTime())) return false;

  const now = new Date();
  const diffInDays = Math.floor((now - createdDate) / (1000 * 60 * 60 * 24));

  return diffInDays <= days;
}

export default function ProductCard({ product }) {
  if (!product) return null;

  const isOutOfStock = (product?.stock ?? 0) <= 0;

  const id = product?._id || product?.id || "";
  const title = product?.title || product?.name || "محصول بدون نام";
  const href = `/product-details/${id}/${slugify(title)}`;

  const image =
    product?.imageProduct ||
    product?.image ||
    "/images/product-placeholder.png";

  const description = truncateText(
    stripHtml(product?.description || product?.shortDescription || "")
  );

  const price = Number(product?.price || 0);

  const rawDiscountPercent = product?.discountprice ?? product?.discountPrice;
  const parsedDiscountPercent = Number(rawDiscountPercent);

  const hasValidDiscountValue =
    rawDiscountPercent !== undefined &&
    rawDiscountPercent !== null &&
    rawDiscountPercent !== "" &&
    Number.isFinite(parsedDiscountPercent);

  const discountPercent = hasValidDiscountValue
    ? Math.min(Math.max(parsedDiscountPercent, 0), 99)
    : 0;

  const hasDiscount = price > 0 && discountPercent > 0;

  const finalPrice = hasDiscount
    ? Math.round(price - (price * discountPercent) / 100)
    : price;

  const fresh = isFreshProduct(product?.createdAt, 3);

  return (
    <Link
      href={href}
      className={`group relative mx-auto flex h-full w-full max-w-[320px] flex-col overflow-hidden rounded-[32px] border border-[#D9E7F5] bg-white shadow-[0_12px_45px_-15px_rgba(11,60,93,0.08)] transition-transform duration-300 hover:scale-[1.02] ${
        isOutOfStock ? "opacity-60" : ""
      }`}
    >
      <div className="relative p-4 pb-0">
        {/* Blue gradient media area */}
        <div className="relative overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,rgba(239,246,255,0.98)_0%,rgba(219,234,254,0.95)_45%,rgba(248,250,252,1)_100%)] p-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.14),transparent_32%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(11,60,93,0.10),transparent_34%)]" />

          <div className="absolute right-4 top-4 z-20 flex items-center gap-2">
            {fresh && (
              <span className="rounded-full bg-[#0B3C5D] px-3 py-1 text-[12px] font-bold text-white shadow-md shadow-[#0B3C5D]/20">
                تازه
              </span>
            )}

            {hasDiscount && (
              <span className="rounded-full bg-[#2563EB] px-3 py-1 text-[12px] font-bold text-white shadow-md shadow-[#2563EB]/20">
                {discountPercent}٪ تخفیف
              </span>
            )}
          </div>

          {isOutOfStock && (
            <div className="absolute left-4 top-4 z-30">
              <span className="rounded-full bg-gray-200 px-3 py-1 text-[12px] font-bold text-gray-700">
                ناموجود
              </span>
            </div>
          )}

          <div className="relative h-[240px] w-full overflow-hidden rounded-[20px]">
            <Image
              src={image}
              alt={title}
              fill
              sizes="(max-width: 640px) 100vw, 320px"
              className="object-contain transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5 pt-4 text-right">
        <h3 className="line-clamp-1 text-[17px] font-bold leading-7 text-[#0A2540] transition-colors duration-300 group-hover:text-[#0B3C5D]">
          {title}
        </h3>

        <p className="mt-1 line-clamp-2 min-h-[42px] text-[13px] leading-6 text-[#627D98]">
          {description}
        </p>

        <div className="mt-4 border-t border-[#EAF2F9] pt-4">
          <div className="flex items-end justify-between gap-3">
            <div className="flex flex-col justify-end">
              {hasDiscount && (
                <span className="text-[12px] font-medium text-[#9FB3C8] line-through">
                  {formatPrice(price)}
                </span>
              )}

              <div className="flex items-baseline gap-1">
                <span className="text-[26px] font-extrabold tracking-tighter text-[#0A2540]">
                  {formatPrice(finalPrice)}
                </span>

                <span className="mb-0.5 text-[14px] font-bold text-[#0B3C5D]">
                  تومان
                </span>
              </div>
            </div>

            <button
              type="button"
              disabled={isOutOfStock}
              aria-disabled={isOutOfStock}
              className={`flex h-12 w-12 items-center justify-center rounded-[20px] text-white shadow-md transition-all duration-300 ${
                isOutOfStock
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                  : "bg-blue-600 hover:bg-sky-500 hover:shadow-lg"
              }`}
              aria-label="Add to cart"
            >
              <HiOutlineShoppingBag className="text-[22px]" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
