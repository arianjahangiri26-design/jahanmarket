"use client";

import Link from "next/link";
   import { useFormContext } from "react-hook-form";

import ControlledInput from "@/shared/form/InputeControler";
import {
  LuShieldCheck,
  LuLock,
  LuZap,
  LuShieldAlert,
  LuLoader,
  LuLogIn,
} from "react-icons/lu";

export default function RegisterDesign({
  onSubmit,
  serverError,
  loading,
  hasBothContact,
  preferredOtpTarget,
  setPreferredOtpTarget,
}) {
  const { handleSubmit } = useFormContext();

  const inputClass =
    "w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 sm:px-6 sm:py-5";

  const trustCardClass =
    "rounded-2xl border border-slate-200 bg-white/90 px-3 py-5 text-center shadow-sm";
  const trustIconClass = "mx-auto mb-2 text-xl text-blue-600";
  const otpButtonBaseClass =
    "rounded-2xl border px-5 py-3.5 text-sm font-semibold transition-all duration-200";

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-sky-50 via-blue-100 to-indigo-200 px-4 py-8 font-sans sm:px-6 lg:px-8">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -top-24 left-[-5rem] h-64 w-64 rounded-full bg-blue-400/20 blur-3xl sm:h-72 sm:w-72" />
      <div className="pointer-events-none absolute right-[-4rem] top-20 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl sm:h-80 sm:w-80" />

      <div className="relative w-full max-w-xl">
        {/* Top Trust Badge */}
        <div className="mb-6 flex justify-center sm:mb-8">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-blue-200/70 bg-white/70 px-5 py-2.5 text-[11px] font-semibold text-blue-700 shadow-sm backdrop-blur sm:text-xs">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            ثبت‌نام امن و سریع
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/60 bg-white/90 px-6 py-8 shadow-[0_25px_80px_rgba(15,23,42,0.18)] backdrop-blur-xl sm:px-10 md:px-12 md:py-10">
          {/* Header */}
          <div className="mb-8 text-center sm:mb-10">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-[0_18px_30px_rgba(37,99,235,0.35)] sm:h-20 sm:w-20">
              <LuShieldCheck className="text-3xl text-white sm:text-4xl" />
            </div>

            <h2 className="mb-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl md:text-4xl">
              ساخت حساب کاربری
            </h2>

            <p className="mx-auto max-w-sm text-xs leading-6 text-slate-500 sm:text-sm">
              اطلاعات شما محفوظ می‌ماند و فقط برای ارسال کد تایید استفاده می‌شود.
            </p>
          </div>

          {/* Trust Row */}
          <div className="mb-8 grid grid-cols-3 gap-3 text-xs text-slate-600 sm:mb-10 sm:gap-4">
            <div className={trustCardClass}>
              <LuLock className={trustIconClass} />
              <div className="text-base font-bold text-slate-900">امن</div>
            </div>

            <div className={trustCardClass}>
              <LuZap className={trustIconClass} />
              <div className="text-base font-bold text-slate-900">سریع</div>
            </div>

            <div className={trustCardClass}>
              <LuShieldAlert className={trustIconClass} />
              <div className="text-base font-bold text-slate-900">مطمئن</div>
            </div>
          </div>

          {serverError && (
            <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 px-5 py-3.5 text-sm font-medium text-red-600 shadow-sm">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
            {/* Inputs */}
            <div className="flex flex-col gap-6 sm:gap-6">
              <ControlledInput
                name="name"
                label="نام"
                placeholder="نام و نام خانوادگی"
                className={inputClass}
              />

              <ControlledInput
                name="email"
                label="ایمیل"
                type="email"
                placeholder="example@mail.com"
                className={inputClass}
              />

              <ControlledInput
                name="phoneNumber"
                label="موبایل"
                type="tel"
                placeholder="09123456789"
                className={inputClass}
              />
            </div>

            {hasBothContact && (
              <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-blue-50/60 p-6 shadow-sm">
                <p className="mb-4 text-sm font-semibold text-slate-700">
                  کد تایید به کجا ارسال شود؟
                </p>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setPreferredOtpTarget("email")}
                    className={`${otpButtonBaseClass} ${
                      preferredOtpTarget === "email"
                        ? "border-blue-600 bg-blue-600 text-white shadow-lg"
                        : "bg-white text-slate-600 hover:border-blue-200 hover:text-blue-700"
                    }`}
                  >
                    📧 ایمیل
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreferredOtpTarget("phone")}
                    className={`${otpButtonBaseClass} ${
                      preferredOtpTarget === "phone"
                        ? "border-blue-600 bg-blue-600 text-white shadow-lg"
                        : "bg-white text-slate-600 hover:border-blue-200 hover:text-blue-700"
                    }`}
                  >
                    📱 موبایل
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5 text-lg font-bold tracking-wide text-white shadow-xl transition-all duration-200 hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:text-xl"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <LuLoader className="animate-spin text-2xl" />
                  در حال پردازش...
                </span>
              ) : (
                "ادامه و دریافت کد"
              )}
            </button>
          </form>

          {/* Login section */}
          <div className="mt-8 border-t border-slate-200 pt-8 sm:mt-10 sm:pt-10">
            <div className="rounded-3xl border border-slate-200 bg-slate-50/80 px-6 py-6 text-center">
              <p className="mb-4 text-sm text-slate-600">
                قبلاً حساب کاربری ساخته‌اید؟
              </p>

              <Link
                href="/auth/login"
                className="inline-flex w-full items-center justify-center gap-2.5 rounded-2xl border border-blue-200 bg-white px-6 py-4 text-sm font-bold text-blue-700 transition-all duration-200 hover:border-blue-300 hover:bg-blue-50 hover:shadow-md sm:w-auto sm:px-8"
              >
                <LuLogIn className="text-lg" />
                ورود به حساب
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}