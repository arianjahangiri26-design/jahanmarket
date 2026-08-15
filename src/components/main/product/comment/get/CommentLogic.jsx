"use client";

import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useFetch } from "@/hooks/crud/UseCrud";
import CommentDisplay from "./CommentForm";

export default function CommentListLogic({ productId }) {
  const { request, loading, data } = useFetch();

  const methods = useForm({
    defaultValues: {
      text: "",
      product: productId || "",
    },
  });

  useEffect(() => {
    if (productId) {
      request({
        method: "GET",
        url: `/api/admin/comment-product/${productId}`,
      });
    }
    // حذف وابستگی request برای جلوگیری از تکرار درخواست
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  // استخراج آرایه اصلی از پاسخ API
  const commentsArray = data?.data || [];

  return (
    <FormProvider {...methods}>
      <CommentDisplay
        comments={commentsArray}
        commentsLoading={loading}
      />
    </FormProvider>
  );
}
