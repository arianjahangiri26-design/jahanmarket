// src/components/admin/menus/FormMenu.jsx
"use client";

import { useFormContext } from "react-hook-form";
import ControlledInput from "@/shared/form/InputeControler";
import Image from "next/image";

const inputClass =
  "w-full px-4 py-3 rounded-xl border border-blue-200 bg-blue-50/40 text-slate-800 focus:ring-2 focus:ring-blue-500 transition-all outline-none text-sm";

const labelClass = "text-sm font-bold text-slate-700 mb-1.5";

export default function MenuForm({
  onSubmit,
  loading,
  serverError,
  menus = [],
  currentIcon = "",
  submitText = "ثبت",
}) {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useFormContext();

 console.log(`${menus} ` );
 
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit(onSubmit, (err) => console.log("Validation Errors:", err))}
        className="flex flex-col gap-5 max-w-lg w-full bg-white p-6 rounded-2xl shadow-xl border border-slate-100"
      >
        <h2 className="text-xl font-black text-slate-800 mb-2 border-b pb-4 text-center">
          {submitText}
        </h2>

        {/* عنوان منو */}
        <ControlledInput
          name="title"
          label="عنوان منو"
          className={inputClass}
        />

        {/* آدرس لینک منو */}
        <ControlledInput
          name="url"
          label="آدرس URL (مثال: /shop یا لینک خارجی)"
          className={inputClass}
        />

        {/* انتخاب والد با پشتیبانی از ساختار درختی */}
        <div className="flex flex-col">
          <label className={labelClass}>منوی والد (چند سطحی)</label>
          <select {...register("parent")} className={inputClass}>
            <option value="">منوی اصلی (بدون والد)</option>
            {menus.map((m) => (
              <option key={m._id} value={m._id}>
                 {m.title}
              </option>
            ))}
          </select>
          {errors.parent && (
            <p className="text-xs text-red-600 mt-1">{errors.parent.message}</p>
          )}
        </div>

        {/* نوع منو و ترتیب قرارگیری */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className={labelClass}>نوع نمایش</label>
            <select {...register("type")} className={inputClass}>
              <option value="normal">معمولی</option>
              <option value="mega">مگا منو</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className={labelClass}>ترتیب نمایش</label>
            <input
              type="number"
              {...register("order")}
              className={inputClass}
            />
          </div>
        </div>

        {/* آپلود تصویر آیکون اختصاصی منو */}
        <div className="flex flex-col gap-2">
          <label className={labelClass}>تصویر آیکون منو</label>

          {currentIcon && (
            <div className="flex items-center gap-4 p-2 border border-blue-100 rounded-xl bg-blue-50/20 mb-1">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-white shadow-sm bg-white flex items-center justify-center">
                <Image
                  src={currentIcon}
                  alt="آیکون فعلی"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-[10px] text-blue-500 bg-white px-2 py-1 rounded-full border border-blue-50 font-bold">
                آیکون فعلی ثبت شده
              </span>
            </div>
          )}

          <div className="relative group">
            <input
              type="file"
              accept="image/*"
              {...register("iconImage")}
              className="block w-full text-sm text-slate-500
                file:mr-4 file:py-2.5 file:px-4
                file:rounded-xl file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-600 file:text-white
                hover:file:bg-blue-700
                cursor-pointer transition-all"
            />
          </div>
          <p className="text-[11px] text-slate-400">
            فرمت‌های مجاز: SVG, PNG, WebP (ابعاد کوچک ترجیحاً ۶۴در۶۴)
          </p>
          {errors.iconImage && (
            <p className="text-xs text-red-600 mt-1">
              {errors.iconImage.message?.toString()}
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
            className="text-sm font-semibold text-slate-700 cursor-pointer select-none"
          >
            این منو فعال و در وبسایت نمایش داده شود
          </label>
        </div>

        {/* نمایش خطای سرور */}
        {serverError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl animate-shake">
            <p className="text-sm text-red-600 text-center font-bold">
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
          {loading ? "در حال ذخیره‌سازی اطلاعات..." : submitText}
        </button>
      </form>
    </div>
  );
}
