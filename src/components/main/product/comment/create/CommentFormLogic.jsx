"use client";

import { useFetch } from "@/hooks/crud/UseCrud";
import CommentForm from "./CommentForm";
import FormProvider from "@/context/form/FormProvider";
import { addToast } from "@heroui/toast"; // استفاده از متد ثبت توست HeroUI

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
      addToast({
        title: "خطا در ثبت",
        description: result.error || "ثبت نظر با خطا مواجه شد.",
        variant: "flat",
        color: "danger",
      });
      return;
    }

    // نمایش توست موفقیت با استایل سرمه‌ای/آجری (Custom Style)
    addToast({
      title: "با موفقیت ثبت شد",
      description: result.message || "نظر شما پس از تایید نمایش داده می‌شود.",
      variant: "flat",
      color: "success",
      classNames: {
        base: "bg-white border-r-4 border-[#0B3C5D]", // نوار سرمه‌ای کنار توست
        title: "text-[#0A2540] font-bold",
        description: "text-[#627D98] text-xs",
      }
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
