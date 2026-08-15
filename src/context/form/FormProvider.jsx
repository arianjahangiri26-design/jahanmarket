"use client";

import { useForm, FormProvider as RHFProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function FormProvider({ children, schema, defaultValues = {} }) {
  const methods = useForm({
    resolver: schema ? zodResolver(schema) : undefined,
    // استفاده از values به جای defaultValues برای مانیتور و ریست خودکار مقادیر بدون افکت
    defaultValues: defaultValues, 
    mode: "all",
    reValidateMode: "onChange",
  });

  return <RHFProvider {...methods}>{children}</RHFProvider>;
}
