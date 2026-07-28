"use client";

import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import CommentDisplay from "../get/CommentForm";

export default function CommentForm({
  comments,
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
    <div className="space-y-10" dir="rtl">
      <div className="overflow-hidden rounded-[28px] border border-[#D9E7F5] bg-white shadow-[0_14px_40px_-18px_rgba(11,60,93,0.18)]">
        <div className="border-b border-[#EAF2F9] bg-[linear-gradient(135deg,#F8FBFF_0%,#EEF6FD_55%,#FFFFFF_100%)] px-6 py-5">
          <h3 className="flex items-center gap-3 text-lg font-black text-[#0A2540] sm:text-xl">
            <span className="h-2.5 w-2.5 rounded-full bg-[#0B3C5D]" />
            اشتراک‌گذاری تجربه خرید
          </h3>
          <p className="mt-2 text-sm leading-7 text-[#627D98]">
            نظر، تجربه یا سوال خود را درباره این محصول با دیگران به اشتراک بگذارید.
          </p>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="relative">
              <textarea
                {...register("text", {
                  required: "لطفاً متن نظر خود را وارد کنید",
                  onChange: () => clearErrors("text"),
                })}
                placeholder="نظر، نقد یا سوال خود را درباره این محصول بنویسید..."
                className={`min-h-[150px] w-full rounded-[22px] border p-4 text-sm font-medium leading-7 text-[#0A2540] outline-none transition-all duration-300 placeholder:text-[#7B93AA] ${
                  errors.text
                    ? "border-rose-400 bg-rose-50/40 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                    : "border-[#D9E7F5] bg-[linear-gradient(180deg,#F8FBFF_0%,#FFFFFF_100%)] focus:border-[#0B3C5D] focus:bg-white focus:ring-4 focus:ring-[#0B3C5D]/10"
                }`}
              />
            </div>

            <input type="hidden" {...register("product")} />

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1">
                {errors.text ? (
                  <p className="animate-in fade-in slide-in-from-right-2 text-xs font-bold text-rose-500">
                    {errors.text.message}
                  </p>
                ) : (
                  <p className="text-xs font-medium text-[#8AA0B6]">
                    متن نظر باید واضح و مرتبط با محصول باشد.
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitLoading || !textValue?.trim()}
                className="relative flex min-w-[140px] items-center justify-center overflow-hidden rounded-2xl bg-[#0B3C5D] px-8 py-3 text-sm font-black text-white shadow-[0_10px_25px_-10px_rgba(11,60,93,0.45)] transition-all duration-300 hover:bg-[#07263D] hover:shadow-[0_16px_35px_-12px_rgba(11,60,93,0.5)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitLoading ? (
                  <div className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    <span>در حال ثبت...</span>
                  </div>
                ) : (
                  "ثبت نظر"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-[#D9E7F5] bg-white shadow-[0_14px_40px_-18px_rgba(11,60,93,0.14)]">
        <div className="flex items-center justify-between gap-3 border-b border-[#EAF2F9] bg-[linear-gradient(135deg,#FFFFFF_0%,#F7FBFF_100%)] px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[#0B3C5D]" />
            <h4 className="text-base font-black text-[#0A2540] sm:text-lg">
              نظرات کاربران
            </h4>
          </div>

          <span className="flex h-8 min-w-[32px] items-center justify-center rounded-full border border-[#CFE0F2] bg-[#EDF5FC] px-2 text-xs font-black text-[#0B3C5D]">
            {comments?.length || 0}
          </span>
        </div>

        <div className="p-6">
          <CommentDisplay comments={comments} loading={false} />
        </div>
      </div>
    </div>
  );
}
