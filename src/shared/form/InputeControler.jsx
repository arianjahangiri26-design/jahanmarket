"use client";

import { Controller, useFormContext } from "react-hook-form";

export default function ControlledInput({
  name,
  label,
  type = "text",
  placeholder,
  className = "",
  startContent = null,
  endContent = null,
  rules = {},
  // سایر پراپ‌ها
  ...props
}) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <div className="w-full">
          {label && (
            <label
              htmlFor={name}
              className="mb-1 block text-sm font-semibold text-slate-700"
            >
              {label}
            </label>
          )}

          <div
            className={`flex min-h-12 items-center gap-2 rounded-2xl border bg-white px-3 transition-colors ${
              error
                ? "border-red-400 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100"
                : "border-slate-200 hover:border-blue-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100"
            } ${className}`}
          >
            {startContent && (
              <span className="flex shrink-0 items-center text-slate-400">
                {startContent}
              </span>
            )}

            <input
              id={name}
              {...field}
              {...props}
              type={type}
              placeholder={placeholder}
              value={field.value ?? ""}
              className="min-w-0 flex-1 border-0 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:outline-none focus:ring-0"
            />

            {endContent && (
              <span className="flex shrink-0 items-center text-slate-400">
                {endContent}
              </span>
            )}
          </div>

          {error?.message && (
            <p className="mt-1 px-1 text-xs font-medium text-red-500">
              {error.message}
            </p>
          )}
        </div>
      )}
    />
  );
}
