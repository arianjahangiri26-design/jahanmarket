"use client";

import { useFormContext } from "react-hook-form";

const inputClass =
  "w-full rounded-xl border border-blue-200 bg-blue-50/40 px-4 py-3 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";

const labelClass = "mb-1.5 text-sm font-medium text-blue-950";

export default function AddressForm({
  onSubmit,
  loading,
  serverError,
  submitText = "ثبت آدرس",
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="w-full p-4 sm:p-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto flex w-full max-w-2xl flex-col gap-5 rounded-2xl border border-slate-100 bg-white p-5 shadow-lg shadow-slate-200/50 sm:p-7"
      >
        <div className="border-b border-slate-100 pb-4">
          <h1 className="text-lg font-bold text-slate-800 sm:text-xl">
            {submitText}
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            اطلاعات محل ارسال سفارش را با دقت وارد کنید.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Province field */}
          <div className="flex flex-col">
            <label htmlFor="province" className={labelClass}>
              استان
            </label>

            <input
              id="province"
              type="text"
              placeholder="مثلاً تهران"
              className={inputClass}
              {...register("province")}
            />

            {errors.province && (
              <p className="mt-1 text-xs text-red-600">
                {errors.province.message}
              </p>
            )}
          </div>

          {/* City field */}
          <div className="flex flex-col">
            <label htmlFor="city" className={labelClass}>
              شهر
            </label>

            <input
              id="city"
              type="text"
              placeholder="مثلاً تهران"
              className={inputClass}
              {...register("city")}
            />

            {errors.city && (
              <p className="mt-1 text-xs text-red-600">
                {errors.city.message}
              </p>
            )}
          </div>
        </div>

        {/* Plaque field */}
        <div className="flex flex-col">
          <label htmlFor="plaque" className={labelClass}>
           
          </label>

          <input
            id="plaque"
            type="text"
            inputMode="text"
            placeholder="مثلاً ۱۲ یا ۱۲/ب"
            className={inputClass}
            {...register("plaque")}
          />

          {errors.plaque && (
            <p className="mt-1 text-xs text-red-600">
              {errors.plaque.message}
            </p>
          )}
        </div>

        {/* Full address field */}
        <div className="flex flex-col">
          <label htmlFor="fullAddress" className={labelClass}>
           آدرس کامل شامل پلاک و واحد و ادرس دقیق محل سکونت  است 
          </label>

          <textarea
            id="fullAddress"
            rows={5}
            placeholder="خیابان، کوچه، بن‌بست، طبقه، واحد و سایر جزئیات آدرس را وارد کنید."
            className={`${inputClass} resize-y leading-7`}
            {...register("fullAddress")}
          />

          {errors.fullAddress && (
            <p className="mt-1 text-xs text-red-600">
              {errors.fullAddress.message}
            </p>
          )}
        </div>

        {/* Server error */}
        {serverError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3">
            <p className="text-center text-sm font-medium text-red-600">
              {serverError}
            </p>
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "در حال پردازش..." : submitText}
        </button>
      </form>
    </div>
  );
}
