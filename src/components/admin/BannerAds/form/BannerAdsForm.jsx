"use client";

import Image from "next/image";
import { Controller, useFormContext } from "react-hook-form";

import ControlledInput from "@/shared/form/InputeControler";

const inputClass =
  "w-full px-4 py-3 rounded-xl border border-blue-200 bg-blue-50/40 text-slate-800 focus:ring-2 focus:ring-blue-500 transition-all outline-none";

const labelClass = "text-sm font-medium text-blue-900 mb-1";

export default function BannerAdsForm({
  onSubmit,
  loading,
  serverError,
  currentDesktopImage = "",
  currentMobileImage = "",
  submitText = "ثبت بنر",
}) {
  const methods = useFormContext();

  if (!methods) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
        خطا: فرم خارج از FormProvider رندر شده است.
      </div>
    );
  }

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = methods;

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <form
        onSubmit={handleSubmit(onSubmit, (err) =>
          console.log("Validation Errors:", err)
        )}
        className="flex w-full max-w-md flex-col gap-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-lg"
      >
        <h2 className="mb-2 border-b pb-3 text-center text-xl font-bold text-slate-800">
          {submitText}
        </h2>

        {/* عنوان بنر */}
        <ControlledInput
          name="title"
          label="عنوان بنر"
          className={inputClass}
        />

        {/* توضیحات */}
        <ControlledInput
          name="description"
          label="توضیحات اختیاری"
          className={inputClass}
        />

        {/* لینک */}
        <ControlledInput
          name="link"
          label="لینک هدایت‌کننده"
          placeholder="https://example.com"
          className={inputClass}
        />

        <div className="grid grid-cols-2 gap-4">
          {/* ترتیب نمایش */}
          <ControlledInput
            name="order"
            label="ترتیب نمایش"
            type="number"
            className={inputClass}
          />

          {/* جایگاه */}
          <div className="flex flex-col">
            <label className={labelClass}>جایگاه بنر</label>

            <select {...register("position")} className={inputClass}>
              <option value="main-slider">اسلایدر اصلی</option>
              <option value="hero-right">بنر سمت راست هیرو</option>
              <option value="middle-banner">بنر وسط صفحه</option>
              <option value="footer-banner">بنر فوتر</option>
            </select>

            {errors.position && (
              <p className="mt-1 text-xs text-red-600">
                {errors.position.message?.toString()}
              </p>
            )}
          </div>
        </div>

        {/* تصویر دسکتاپ */}
        <div className="flex flex-col gap-2">
          <label className={labelClass}>تصویر دسکتاپ اصلی</label>

          {currentDesktopImage && (
            <div className="mb-1 flex items-center gap-4 rounded-xl border border-blue-100 bg-blue-50/20 p-2">
              <div className="relative h-10 w-20 overflow-hidden rounded-lg border border-white shadow-sm">
                <Image
                  src={currentDesktopImage}
                  alt="تصویر دسکتاپ فعلی"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              <span className="rounded-full border border-blue-50 bg-white px-2 py-1 text-[10px] text-blue-400">
                تصویر دسکتاپ فعلی
              </span>
            </div>
          )}

          <Controller
            name="desktopImage"
            control={control}
            render={({ field }) => (
              <input
                type="file"
                accept="image/*"
                onBlur={field.onBlur}
                onChange={(e) => field.onChange(e.target.files)}
                className="block w-full cursor-pointer text-sm text-slate-500
                  file:mr-4 file:rounded-xl file:border-0
                  file:bg-blue-600 file:px-4 file:py-2.5
                  file:text-sm file:font-semibold file:text-white
                  transition-all hover:file:bg-blue-700"
              />
            )}
          />

          {errors.desktopImage && (
            <p className="mt-1 text-xs text-red-600">
              {errors.desktopImage.message?.toString()}
            </p>
          )}
        </div>

        {/* تصویر موبایل */}
        <div className="flex flex-col gap-2">
          <label className={labelClass}>تصویر موبایل اختیاری</label>

          {currentMobileImage && (
            <div className="mb-1 flex items-center gap-4 rounded-xl border border-blue-100 bg-blue-50/20 p-2">
              <div className="relative h-12 w-12 overflow-hidden rounded-lg border border-white shadow-sm">
                <Image
                  src={currentMobileImage}
                  alt="تصویر موبایل فعلی"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              <span className="rounded-full border border-blue-50 bg-white px-2 py-1 text-[10px] text-blue-400">
                تصویر موبایل فعلی
              </span>
            </div>
          )}

          <Controller
            name="mobileImage"
            control={control}
            render={({ field }) => (
              <input
                type="file"
                accept="image/*"
                onBlur={field.onBlur}
                onChange={(e) => field.onChange(e.target.files)}
                className="block w-full cursor-pointer text-sm text-slate-500
                  file:mr-4 file:rounded-xl file:border-0
                  file:bg-blue-600 file:px-4 file:py-2.5
                  file:text-sm file:font-semibold file:text-white
                  transition-all hover:file:bg-blue-700"
              />
            )}
          />

          {errors.mobileImage && (
            <p className="mt-1 text-xs text-red-600">
              {errors.mobileImage.message?.toString()}
            </p>
          )}
        </div>

        {/* وضعیت فعال بودن */}
        <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
          <input
            type="checkbox"
            id="isActive"
            {...register("isActive")}
            className="h-5 w-5 cursor-pointer rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />

          <label
            htmlFor="isActive"
            className="cursor-pointer select-none text-sm font-medium text-slate-700"
          >
            این بنر فعال و در سایت نمایش داده شود
          </label>
        </div>

        {/* خطای سرور */}
        {serverError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3">
            <p className="text-center text-sm font-medium text-red-600">
              {serverError}
            </p>
          </div>
        )}

        {/* دکمه ارسال */}
        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-xl bg-blue-600 py-3.5 font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-60"
        >
          {loading ? "در حال پردازش..." : submitText}
        </button>
      </form>
    </div>
  );
}
