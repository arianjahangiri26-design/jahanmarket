"use client";
   import { useFormContext } from "react-hook-form";


import ControlledInput from "@/shared/form/InputeControler";

/**
 * Reusable form for creating and editing users
 * Uses react-hook-form context
 */

const inputClass =
  "w-full px-4 py-3 rounded-xl border border-blue-200 bg-blue-50/40 text-slate-800 focus:ring-2 focus:ring-blue-500";

const labelClass = "text-sm font-medium text-blue-900 mb-1";

export default function UserForm({ onSubmit, loading, errors }) {
  const { handleSubmit   } = useFormContext();

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5 max-w-md"
    >
      {/* Name */}
      <ControlledInput
        name="name"
        label="نام کاربر"
        className={inputClass}
        labelClass={labelClass}
      />

      {/* Phone */}
      <ControlledInput
        name="phoneNumber"
        label="شماره موبایل"
      
        className={inputClass}
        labelClass={labelClass}
      />

      {/* Email */}
      <ControlledInput
        name="email"
        label="ایمیل"
        className={inputClass}
        labelClass={labelClass}
      />

     

      {/* Error messages */}
      {Object.keys(errors || {}).length > 0 && (
        <div className="text-red-600 text-sm">
          {Object.values(errors).map((e, i) => (
            <p key={i}>{e.message}</p>
          ))}
        </div>
      )}

      <button
        disabled={loading}
        className="bg-blue-700 text-white py-3 rounded-xl hover:bg-blue-800"
      >
        {loading ? "در حال پردازش..." : "ثبت"}
      </button>
    </form>
  );
}
