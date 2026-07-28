"use client";
 
import ControlledInput from "@/shared/form/InputeControler";
import { useFormContext } from "react-hook-form";
 
 
const inputClass =
  "w-full px-4 py-3 rounded-xl border border-blue-200 bg-blue-50/40 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200";

const labelClass = "text-sm font-medium text-blue-900 mb-1";

export default function Logindesign({
  handelLogin,
  serverError,
  loading,
}) {
  const {
    formState: { errors },
  } = useFormContext();

  const submitHandler = async (event) => {
    event.preventDefault();
    await handelLogin();
  };

  return (
    <div className="flex items-center justify-center min-h-screen from-blue-900 via-slate-900 to-blue-950">
      <div className="w-full max-w-md p-8 bg-white/95 backdrop-blur rounded-2xl shadow-[0_25px_60px_-10px_rgba(0,0,0,0.45)] border border-blue-100">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-900">
          ورود
        </h2>

        <form onSubmit={submitHandler} className="flex flex-col gap-5">
          {serverError && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {serverError}
            </div>
          )}

          {Object.keys(errors || {}).length > 0 && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <ul className="list-disc pr-5 space-y-1">
                {Object.entries(errors).map(([field, error]) => (
                  <li key={field}>
                    {error?.message || `خطا در فیلد ${field}`}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <ControlledInput
            name="identifier"
            label="ایمیل یا شماره موبایل"
            className={inputClass}
            labelClass={labelClass}
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full py-3 rounded-xl bg-blue-700 text-white font-semibold shadow-lg shadow-blue-900/30 hover:bg-blue-800 hover:shadow-xl active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? "در حال ارسال..." : "ارسال کد"}
          </button>
        </form>
      </div>
    </div>
  );
}
