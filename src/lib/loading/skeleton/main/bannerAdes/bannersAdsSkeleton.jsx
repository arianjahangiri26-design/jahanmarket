"use client";

export default function BannersAdsSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="flex flex-col gap-5 max-w-md w-full bg-white p-6 rounded-2xl shadow-lg border border-slate-100 animate-pulse">
        {/* عنوان بالای فرم */}
        <div className="h-7 bg-slate-200 rounded-lg w-1/3 mx-auto mb-4"></div>

        {/* فیلد عنوان */}
        <div className="flex flex-col gap-2">
          <div className="h-4 bg-slate-200 rounded w-1/4"></div>
          <div className="h-12 bg-slate-100 rounded-xl w-full"></div>
        </div>

        {/* فیلد توصیف */}
        <div className="flex flex-col gap-2">
          <div className="h-4 bg-slate-200 rounded w-1/4"></div>
          <div className="h-12 bg-slate-100 rounded-xl w-full"></div>
        </div>

        {/* فیلد لینک و اولویت */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            <div className="h-12 bg-slate-100 rounded-xl w-full"></div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            <div className="h-12 bg-slate-100 rounded-xl w-full"></div>
          </div>
        </div>

        {/* فیلد جایگاه بنر */}
        <div className="flex flex-col gap-2">
          <div className="h-4 bg-slate-200 rounded w-1/3"></div>
          <div className="h-12 bg-slate-100 rounded-xl w-full"></div>
        </div>

        {/* فیلد تصویر دسکتاپ */}
        <div className="flex flex-col gap-2">
          <div className="h-4 bg-slate-200 rounded w-2/5"></div>
          <div className="h-20 bg-slate-50 border border-dashed border-slate-200 rounded-xl w-full flex items-center px-4">
            <div className="w-12 h-12 bg-slate-200 rounded-lg"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2 mr-4"></div>
          </div>
        </div>

        {/* دکمه سابمیت */}
        <div className="h-12 bg-slate-200 rounded-xl w-full mt-4"></div>
      </div>
    </div>
  );
}
