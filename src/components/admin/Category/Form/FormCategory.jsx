"use client";

 
import ControlledInput from "@/shared/form/InputeControler";
import Image from "next/image";
import { useFormContext } from "react-hook-form";

const inputClass =
  "w-full px-4 py-3 rounded-xl border border-blue-200 bg-blue-50/40 text-slate-800 focus:ring-2 focus:ring-blue-500 transition-all outline-none";

const labelClass = "text-sm font-medium text-blue-900 mb-1";

export default function CategoryForm({
  onSubmit,
  loading,
  serverError,
  categories = [],
  currentImage = "", // آدرس تصویر فعلی از دیتابیس
  submitText = "ثبت",
}) {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit(onSubmit, (err) => console.log("Validation Errors:", err))}
        className="flex flex-col gap-5 max-w-md w-full bg-white p-6 rounded-2xl shadow-lg border border-slate-100"
      >
        <h2 className="text-xl font-bold text-slate-800 mb-2 border-b pb-3 text-center">
          {submitText}
        </h2>

        {/* نام دسته */}
        <ControlledInput
          name="name"
          label="نام دسته"
          className={inputClass}
        />

        {/* توضیحات */}
        <ControlledInput
          name="description"
          label="توضیحات"
          className={inputClass}
        />

        {/* لیست دسته‌های والد */}
        <div className="flex flex-col">
          <label className={labelClass}>دسته والد</label>
          <select {...register("parent")} className={inputClass}>
            <option value="">بدون والد (دسته اصلی)</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.parent && (
            <p className="text-xs text-red-600 mt-1">{errors.parent.message}</p>
          )}
        </div>

        {/* بخش آپلود تصویر */}
        <div className="flex flex-col gap-2">
          <label className={labelClass}>تصویر دسته‌بندی</label>

          {/* نمایش پیش‌نمایش تصویر فعلی با تگ Image نکست */}
          {currentImage && (
            <div className="flex items-center gap-4 p-2 border border-blue-100 rounded-xl bg-blue-50/20 mb-1">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-white shadow-sm">
                <Image
                  src={currentImage}
                  alt="تصویر فعلی"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-[10px] text-blue-400 bg-white px-2 py-1 rounded-full border border-blue-50">
                تصویر فعلی
              </span>
            </div>
          )}

          <div className="relative group">
            <input
              type="file"
              accept="image/*"
              {...register("image")}
              className="block w-full text-sm text-slate-500
                file:mr-4 file:py-2.5 file:px-4
                file:rounded-xl file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-600 file:text-white
                hover:file:bg-blue-700
                cursor-pointer transition-all"
            />
          </div>
          
          <p className="text-[11px] text-slate-400 mr-1">
             فرمت‌های مجاز: JPG, PNG, WebP (حداکثر ۲ مگابایت)
          </p>

          {errors.image && (
            <p className="text-xs text-red-600 mt-1">
              {errors.image.message?.toString()}
            </p>
          )}
        </div>

        {/* وضعیت فعال بودن */}
        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
          <input
            type="checkbox"
            id="isActive"
            {...register("isActive")}
            className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
          />
          <label
            htmlFor="isActive"
            className="text-sm font-medium text-slate-700 cursor-pointer select-none"
          >
            این دسته‌بندی فعال باشد
          </label>
        </div>

        {/* نمایش خطای سرور */}
        {serverError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl animate-shake">
            <p className="text-sm text-red-600 text-center font-medium">
              {serverError}
            </p>
          </div>
        )}

        {/* دکمه ارسال */}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-60 transition-all shadow-lg shadow-blue-200 active:scale-95 mt-2"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
               در حال پردازش...
            </span>
          ) : (
            submitText
          )}
        </button>
      </form>
    </div>
  );
}
