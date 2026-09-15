// components/admin/discounts/create/CreateDiscountLogic.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFetch } from "@/hooks/crud/UseCrud";
import FormProvider from "@/context/form/FormProvider";
import { createDiscountSchema } from "@/lib/validators/admin/discounts/discount.validation";
import DiscountForm from "../form/FormDiscountAdmin";

export default function CreateDiscountLogic() {
  const router = useRouter();
  const { request, loading } = useFetch();

  const [categories, setCategories] = useState([]);
  const [serverError, setServerError] = useState("");

  // بارگذاری دسته‌بندی‌ها برای فیلد انتخابی
  useEffect(() => {
    const fetchCategories = async () => {
      const res = await request({
        method: "GET",
        url: "/api/admin/discountcode",
      });

      if (res?.success) {
        // هماهنگ با ساختار پاسخ سرور شما
        const categoriesData = res?.data?.message?.data || res?.data?.data || [];
        setCategories(categoriesData);
      }
    };

    fetchCategories();
  }, []);

  const handleCreateDiscount = async (formData) => {
    setServerError("");

    const payload = {
      ...formData,
      category: formData.category || null,
    };

    const res = await request({
      method: "POST",
      url: "/api/admin/discountcode",
      data: payload,
    });

    if (res?.success) {
      router.push("/admin/discounts-code");
    } else {
      setServerError(res?.data?.message || res?.error || "خطا در ایجاد کد تخفیف");
    }
  };

  return (
    <FormProvider
      schema={createDiscountSchema}
      defaultValues={{
        code: "",
        title: "",
        type: "percentage",
        value: "",
        minPurchaseAmount: "",
        startDate: "",
        endDate: "",
        isActive: true,
        category: "",
      }}
    >
      <DiscountForm
        onSubmit={handleCreateDiscount}
        loading={loading}
        serverError={serverError}
        categories={categories}
      />
    </FormProvider>
  );
}
