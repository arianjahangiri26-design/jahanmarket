import Link from "next/link";
import { FaChevronLeft, FaCommentDots, FaInfoCircle } from "react-icons/fa";
import ProductInfoCard from "./ProductInfoCard";
import ProductFeatures from "./ProductFeatures";
import ProductGallery from "../ProductGallery/ProductGallery";
import CommentFormLogic from "../../comment/create/CommentFormLogic";
import CommentListLogic from "../../comment/get/CommentLogic";

export default function ProductDetailsView({ product }) {
  // Use real count if available, otherwise fallback to a default value
  const commentsCount =
    product?.commentsCount || product?.comments?.length || 8;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-cyan-50/50 py-8 sm:py-10">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Breadcrumb */}
        <div className="mb-8 flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="transition hover:text-blue-600">
            خانه
          </Link>

          <FaChevronLeft className="text-[10px]" />

          <Link href="/products" className="transition hover:text-blue-600">
            محصولات
          </Link>

          <FaChevronLeft className="text-[10px]" />

          <span className="font-semibold text-slate-700">{product?.name}</span>
        </div>

        {/* Hero section */}
        <section className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <ProductGallery
              image={product?.imageProduct}
              title={product?.name}
            />
          </div>

          <div className="lg:col-span-7">
            <ProductInfoCard
              product={product}
              commentsCount={commentsCount}
            />
          </div>
        </section>

        {/* Description section */}
        <section className="mt-10 overflow-hidden rounded-[32px] border border-blue-100 bg-white shadow-xl shadow-blue-100/30">
          <div className="border-b border-blue-50 bg-gradient-to-l from-blue-50/80 to-white px-5 py-5 sm:px-7">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                <FaInfoCircle className="text-lg" />
              </div>

              <div>
                <h2 className="text-xl font-black text-slate-800 sm:text-2xl">
                  توضیحات محصول
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  معرفی کامل و بررسی خلاصه این محصول
                </p>
              </div>
            </div>
          </div>

          <div className="px-5 py-6 sm:px-7 sm:py-7">
            <p className="text-sm leading-8 text-slate-600 sm:text-[15px]">
              {product?.description || "توضیحی برای این محصول ثبت نشده است."}
            </p>
          </div>
        </section>

        {/* Features section */}
        <ProductFeatures features={product?.features} />

        {/* Comments section */}
        <section
          id="comments-section"
          className="mt-12 overflow-hidden rounded-[32px] border border-blue-100 bg-white shadow-xl shadow-blue-100/30"
        >
          <div className="border-b border-blue-50 bg-gradient-to-l from-blue-50/80 to-white px-5 py-5 sm:px-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                  <FaCommentDots className="text-lg" />
                </div>

                <div>
                  <h2 className="text-xl font-black text-slate-800 sm:text-2xl">
                    دیدگاه کاربران
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    تجربه خرید و نظر کاربران درباره این محصول
                  </p>
                </div>
              </div>

              <div className="rounded-full border border-blue-200 bg-white px-4 py-2 text-xs font-bold text-blue-700">
                {commentsCount} دیدگاه
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 px-5 py-6 xl:grid-cols-12 xl:px-7 xl:py-7">
            <div className="xl:col-span-4">
              <div className="xl:sticky xl:top-24">
                <CommentFormLogic productId={product?._id} />
              </div>
            </div>

            <div className="xl:col-span-8">
              <CommentListLogic productId={product?._id} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
