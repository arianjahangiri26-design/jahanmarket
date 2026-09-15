"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Input } from "@heroui/react";
 

export default function ControlledInput({
  name,
  label,
  type = "text",
  placeholder,
  className,
  ...props
}) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const error = fieldState.error;

        return (
          <div className="flex flex-col gap-1 w-full">
            {label && (
              <label className="text-sm font-semibold text-blue-900 mb-1 block">
                {label}
              </label>
            )}

            <Input
              {...field}
              {...props}
              type={type}
              placeholder={placeholder}
              variant="bordered"
              isInvalid={!!error}
              // نمایش مستقیم پیام خطا از طریق خود کامپوننت Input
              errorMessage={error?.message} 
              validationState={error ? "invalid" : "valid"}
              classNames={{
                base: "w-full",
                input: `text-slate-900 placeholder:text-slate-400 ${className}`,
                inputWrapper: error ? "border-red-500 hover:border-red-600 focus-within:border-red-600" : "border-blue-200",
                errorMessage: "text-xs text-red-600 font-medium mt-1 px-1 block",
              }}
              value={field.value ?? ""}
            />
          </div>
        );
      }}
    />
  );
}
