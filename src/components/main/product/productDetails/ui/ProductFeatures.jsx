import { FaCheckCircle } from "react-icons/fa";

export default function ProductFeatures({ features = [] }) {
  if (!Array.isArray(features) || features.length === 0) return null;

  return (
    <section className="mt-10 rounded-[32px] border border-blue-100 bg-white p-5 shadow-xl shadow-blue-100/30 sm:p-7">
      {/* Section header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-xl font-black text-slate-800 sm:text-2xl">
            ویژگی‌های محصول
          </h2>
          <p className="mt-2 text-sm leading-7 text-slate-500">
            مشخصات اصلی این محصول را می‌توانید در این بخش مشاهده کنید.
          </p>
        </div>

        <div className="rounded-full bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700">
          {features.length} ویژگی
        </div>
      </div>

      {/* Features list */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {features.map((item, index) => (
          <div
            key={`${item?.key || "feature"}-${index}`}
            className="group rounded-[24px] border border-blue-100 bg-gradient-to-br from-blue-50/80 via-white to-cyan-50/70 p-4 transition duration-200 hover:-translate-y-1 hover:shadow-md hover:shadow-blue-100/40"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm">
                <FaCheckCircle className="text-base" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-500">
                  {item?.key || "ویژگی"}
                </p>

                <p className="mt-2 break-words text-sm font-black leading-7 text-slate-800 sm:text-base">
                  {item?.value || "-"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
