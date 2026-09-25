// components/admin/discounts/form/DiscountForm.jsx
"use client";

import ControlledInput from "@/shared/form/InputeControler";
import { useFormContext } from "react-hook-form";
 
 
const inputClass =
  "w-full px-4 py-3 rounded-xl border border-blue-200 bg-blue-50/40 text-slate-800 focus:ring-2 focus:ring-blue-500";

const labelClass = "text-sm font-medium text-blue-900 mb-1";

export default function DiscountForm({ onSubmit, loading, errors, categories = [] }) {
  const { handleSubmit, register } = useFormContext();

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5 max-w-md mx-auto bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
    >
      {/* کد تخفیف */}
      <ControlledInput
        name="code"
        label="کد تخفیف"
        placeholder="مثال: WINTER1405"
        className={inputClass}
        labelClass={labelClass}
      />

      {/* عنوان تخفیف */}
      <ControlledInput
        name="title"
        label="عنوان تخفیف"
        placeholder="مثال: جشنواره زمستانه"
        className={inputClass}
        labelClass={labelClass}
      />

      {/* نوع تخفیف */}
      <div className="flex flex-col gap-1">
        <label className={labelClass}>نوع تخفیف</label>
        <select
          {...register("type")}
          className={inputClass}
        >
          <option value="percentage">درصدی (%)</option>
          <option value="fixed">مبلغ ثابت (تومان)</option>
        </select>
      </div>

      {/* مقدار تخفیف */}
      <ControlledInput
        name="value"
        label="مقدار تخفیف"
        type="number"
        
        placeholder="مثال: 20 یا 50000"
        className={inputClass}
        labelClass={labelClass}
      />

      {/* حداقل مبلغ خرید */}
      <ControlledInput
        name="minPurchaseAmount"
        label="حداقل مبلغ خرید (تومان)"
        type="number"
        placeholder="مثال: 150000 (اختیاری)"
        className={inputClass}
        labelClass={labelClass}
      />

      {/* تاریخ شروع */}
      <ControlledInput
        name="startDate"
        label="تاریخ شروع تخفیف"
        type="datetime-local"
        className={inputClass}
        labelClass={labelClass}
      />

      {/* تاریخ پایان */}
      <ControlledInput
        name="endDate"
        label="تاریخ پایان تخفیف"
        type="datetime-local"
        className={inputClass}
        labelClass={labelClass}
      />

      {/* محدودیت دسته‌بندی */}
      <div className="flex flex-col gap-1">
        <label className={labelClass}>محدود به دسته‌بندی خاص</label>
        <select
          {...register("category")}
          className={inputClass}
        >
          <option value="">بدون محدودیت دسته‌بندی (همه محصولات)</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* وضعیت فعال بودن */}
      <div className="flex items-center gap-3 py-2">
        <input
          id="isActive"
          type="checkbox"
          {...register("isActive")}
          className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="isActive" className="text-sm font-semibold text-slate-700 cursor-pointer">
          کد تخفیف فعال باشد
        </label>
      </div>

      {/* نمایش پیام‌های خطای اعتبارسنجی Zod */}
      {Object.keys(errors || {}).length > 0 && (
        <div className="text-red-600 text-sm p-3 bg-red-50 rounded-xl border border-red-100 flex flex-col gap-1">
          {Object.values(errors).map((e, i) => (
            <p key={i}>• {e.message}</p>
          ))}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-700 text-white py-3 rounded-xl hover:bg-blue-800 transition font-bold disabled:bg-blue-400"
      >
        {loading ? "در حال پردازش..." : "ثبت"}
      </button>
    </form>
  );
}
