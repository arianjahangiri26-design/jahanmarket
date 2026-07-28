"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Input } from "@heroui/react";

export default function ControlledInput({
  name,
  label,
  type = "text",
  placeholder,
  className = "",
  ...props
}) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="w-full">
          {label && (
            <label className="mb-1 block text-sm font-semibold text-blue-900">
              {label}
            </label>
          )}

          <Input
            {...field}
            {...props}
            type={type}
            placeholder={placeholder}
            variant="flat"
            radius="md"
            isInvalid={!!error}
            errorMessage={error?.message}
            value={field.value ?? ""}
            classNames={{
              base: "w-full !border-0 !outline-none !ring-0 !shadow-none",
              mainWrapper: "w-full !border-0 !outline-none !ring-0 !shadow-none",
              input: `text-slate-900 placeholder:text-slate-400 ${className}`,
              inputWrapper: `
                 
                !border-0
               
              `,
              errorMessage: "mt-1 px-1 text-xs font-medium text-red-600",
            }}
          />
        </div>
      )}
    />
  );
}
