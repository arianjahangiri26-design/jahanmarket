"use client";

import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useFetch } from "@/hooks/crud/UseCrud";
import CommentDisplay from "./CommentForm";
 
 
 CommentDisplay
  

export default function CommentListLogic({ productId }) {
   

  const { request, loading, data } = useFetch();

  useEffect(() => {
    
    request({
      method: "GET",
      url: `/api/admin/comment-product/${productId}`,
    });
  }, [productId, request]);

  return (
    <FormProvider  defaultValue={{
      text: "",
      product: productId || "",}
    }>
      <CommentDisplay
        comments={data || []}
        commentsLoading={loading}
 
      />
    </FormProvider>
  );
}
