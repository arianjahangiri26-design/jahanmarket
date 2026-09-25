"use client";

import { ShieldCheck, RefreshCw } from "lucide-react";
   import { useFormContext } from "react-hook-form";

import { useOtpTimer } from "@/lib/auth/useOtpTimer";

export default function OtpForm({
  handelSendOtp,
  loading,
  serverError,
  onResend,
}) {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useFormContext();

  const { canResend, restartTimer, formatTime } = useOtpTimer(120, onResend);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md">
        <div className="relative overflow-hidden rounded-3xl border border-blue-100 bg-white/90 shadow-[0_20px_60px_-15px_rgba(37,99,235,0.25)] backdrop-blur-xl">
          
          {/* top gradient */}
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 opacity-90" />
          
          {/* decorative blur */}
          <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/20 blur-2xl" />
          <div className="absolute top-16 -left-8 h-24 w-24 rounded-full bg-cyan-200/30 blur-2xl" />

          <form
            onSubmit={handleSubmit(handelSendOtp)}
            className="relative z-10 flex flex-col gap-5 p-5 pt-8 sm:p-8 sm:pt-10"
          >
            {/* Header */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 shadow-lg ring-1 ring-white/30 backdrop-blur-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-blue-600 shadow-md">
                  <ShieldCheck size={26} />
                </div>
              </div>

              <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                تایید کد OTP
              </h2>

              <p className="mt-2 max-w-sm text-sm leading-6 text-blue-400 sm:text-base">
                کد تاییدی که برای شما ارسال شده را وارد کنید تا ادامه دهید
              </p>
            </div>

            {/* body */}
            <div className="mt-2 rounded-2xl bg-white p-5 shadow-inner ring-1 ring-blue-50 sm:p-6">
              {serverError && (
                <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm">
                  {serverError}
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  کد تایید
                </label>

                <input
                  {...register("code")}
                  maxLength={6}
                  inputMode="numeric"
                  placeholder="------"
                  dir="ltr"
                  className="h-14 w-full rounded-2xl border border-blue-100 bg-blue-50/40 px-4 text-center text-2xl font-bold tracking-[0.45em] text-slate-800 outline-none transition-all duration-300 placeholder:text-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 sm:h-16 sm:text-3xl"
                />

                {errors.code && (
                  <span className="block pt-1 text-center text-sm font-medium text-red-500">
                    {errors.code.message}
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-5 flex h-12 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 px-4 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/30 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 sm:h-14 sm:text-base"
              >
                {loading ? "در حال بررسی..." : "تایید و ادامه"}
              </button>

              {/* resend */}
              <div className="mt-5 flex min-h-[28px] items-center justify-center text-center">
                {canResend ? (
                  <button
                    type="button"
                    onClick={restartTimer}
                    className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-blue-600 transition-all duration-300 hover:bg-blue-50 hover:text-blue-800"
                  >
                    <RefreshCw size={16} />
                    ارسال مجدد کد تایید
                  </button>
                ) : (
                  <p className="text-sm text-slate-500">
                    ارسال مجدد تا{" "}
                    <span className="rounded-md bg-blue-50 px-2 py-1 font-mono font-semibold text-blue-700">
                      {formatTime()}
                    </span>{" "}
                    دیگر
                  </p>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
