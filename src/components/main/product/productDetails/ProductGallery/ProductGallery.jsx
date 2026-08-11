import Image from "next/image";
import { FaSearchPlus } from "react-icons/fa";

export default function ProductGallery({ image, title }) {
  return (
    <div className="sticky top-24 overflow-hidden rounded-[28px] border border-blue-100 bg-white shadow-xl shadow-blue-100/40">
      {/* Decorative top area */}
      <div className="relative overflow-hidden border-b border-blue-50 bg-gradient-to-br from-blue-100 via-white to-cyan-50 px-4 py-4 sm:px-6 sm:py-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.18),_transparent_38%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(34,211,238,0.10),_transparent_28%)]" />

        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-blue-600">تصویر محصول</p>
            <h2 className="mt-1 line-clamp-2 text-sm font-bold text-slate-700 sm:text-base">
              {title || "محصول"}
            </h2>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/90 text-blue-700 shadow-sm">
            <FaSearchPlus className="text-base" />
          </div>
        </div>
      </div>

      {/* Main image area */}
      <div className="p-4 sm:p-6">
        <div className="relative flex min-h-[320px] items-center justify-center overflow-hidden rounded-[24px] border border-blue-50 bg-gradient-to-br from-slate-50 via-white to-blue-50/60 p-6 sm:min-h-[460px]">
          <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(59,130,246,0.08),_transparent_55%)]" />

          <Image
            src={image || "/images/placeholder.png"}
            alt={title || "product"}
            width={700}
            height={700}
            priority
            className="relative z-10 h-auto max-h-[280px] w-auto object-contain transition duration-300 hover:scale-105 sm:max-h-[390px]"
          />
        </div>
      </div>
    </div>
  );
}
