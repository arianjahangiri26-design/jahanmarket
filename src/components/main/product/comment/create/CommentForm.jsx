"use client";

import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

export default function CommentForm({
  productId,
  submitLoading,
  onSubmitLogic,
}) {
  const methods = useFormContext();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = methods;

  const textValue = watch("text");

  useEffect(() => {
    if (productId) {
      setValue("product", productId);
    }
  }, [productId, setValue]);

  const onSubmit = (values) => {
    onSubmitLogic(values, methods);
  };

  return (
    <div className="w-full max-w-full space-y-6" dir="rtl">
      <div className="w-full overflow-hidden rounded-2xl border border-[#D9E7F5] bg-white shadow-[0_10px_32px_-16px_rgba(11,60,93,0.15)] sm:rounded-[22px]">
        <div className="border-b border-[#EAF2F9] bg-[linear-gradient(135deg,#F8FBFF_0%,#EEF6FD_55%,#FFFFFF_100%)] px-4 py-4 sm:px-5 sm:py-4">
          <h3 className="flex items-center gap-2.5 text-base font-black text-[#0A2540] sm:text-lg">
            <span className="h-2 w-2 rounded-full bg-[#0B3C5D]" />
            اشتراک‌گذاری تجربه خرید
          </h3>
          <p className="mt-1.5 text-xs leading-6 text-[#627D98] sm:text-sm sm:leading-7">
            نظر، تجربه یا سوال خود را درباره این محصول با دیگران به اشتراک بگذارید.
          </p>
        </div>

        <div className="p-4 sm:p-5">
          <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-3">
            <div className="relative w-full">
              <textarea
                {...register("text", {
                  required: "لطفاً متن نظر خود را وارد کنید",
                  onChange: () => clearErrors("text"),
                })}
                placeholder="نظر، نقد یا سوال خود را درباره این محصول بنویسید..."
                className={`min-h-[110px] w-full max-w-full resize-y rounded-xl border p-3.5 text-sm font-medium leading-7 text-[#0A2540] outline-none transition-all duration-300 placeholder:text-[#7B93AA] sm:min-h-[120px] sm:rounded-2xl sm:p-4 ${
                  errors.text
                    ? "border-rose-400 bg-rose-50/40 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                    : "border-[#D9E7F5] bg-[linear-gradient(180deg,#F8FBFF_0%,#FFFFFF_100%)] focus:border-[#0B3C5D] focus:bg-white focus:ring-4 focus:ring-[#0B3C5D]/10"
                }`}
              />
            </div>

            <input type="hidden" {...register("product")} />

            <div className="flex w-full flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
              <div className="min-w-0 flex-1">
                {errors.text ? (
                  <p className="text-xs font-bold text-rose-500">
                    {errors.text.message}
                  </p>
                ) : (
                  <p className="text-[11px] font-medium text-[#8AA0B6] sm:text-xs">
                    متن نظر باید واضح و مرتبط با محصول باشد.
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitLoading || !textValue?.trim()}
                className="relative flex w-full shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#0B3C5D] px-6 py-2.5 text-sm font-black text-white shadow-[0_8px_20px_-10px_rgba(11,60,93,0.4)] transition-all duration-300 hover:bg-[#07263D] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-[120px] sm:rounded-2xl sm:px-7 sm:py-2.5"
              >
                {submitLoading ? (
                  <div className="flex items-center gap-2">
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    <span className="text-sm">در حال ثبت...</span>
                  </div>
                ) : (
                  "ثبت نظر"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
