"use client";

import { useFetch } from "@/hooks/crud/UseCrud";
import CommentForm from "./CommentForm";
import FormProvider from "@/context/form/FormProvider";
import { toast } from "@heroui/react";

 
export default function CommentFormLogic({ productId, comments = [] }) {
  const { request, loading } = useFetch(null);

  const defaultValues = {
    text: "",
    product: productId || "",
  };

  const handleSubmitComment = async (values, methods) => {
    const { setError, reset } = methods;

    const result = await request({
      url: "/api/admin/comment-product",
      method: "POST",
      data: {
        text: values.text,
        product: values.product,
      },
    });

    if (!result.success) {
      setError("text", {
        type: "server",
        message: result.error || "خطایی در ثبت نظر شما رخ داده است.",
      });
      
      // نمایش توست خطا با استایل HeroUI
      toast.warning({
        title: "خطا در ثبت",
        description: result.error || "ثبت نظر با خطا مواجه شد.",
        variant: "flat",
        color: "danger",
      });
      return;
    }

    // نمایش توست موفقیت با استایل سرمه‌ای/آجری (Custom Style)
   toast.success("نظر شما با موفقیت ثبت شد", {
  description: "پس از تأیید مدیر، دیدگاه شما در صفحه محصول نمایش داده خواهد شد.",
});

    
    reset({
      text: "",
      product: productId || "",
    });
  };

  return (
    <FormProvider defaultValues={defaultValues}>
      <CommentForm
        comments={comments}
        productId={productId}
        submitLoading={loading}
        onSubmitLogic={handleSubmitComment}
      />
    </FormProvider>
  );
}
