// components/admin/discounts/edit/EditDiscountLogic.jsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFetch } from "@/hooks/crud/UseCrud";
import FormProvider from "@/context/form/FormProvider";
import { updateDiscountSchema } from "@/lib/validators/admin/discounts/discount.validation";
import DiscountForm from "../form/FormDiscountAdmin";

export default function EditDiscountLogic() {
  const { id } = useParams();
  const router = useRouter();
  const { request, loading } = useFetch();

  const [categories, setCategories] = useState([]);
  const [initialData, setInitialData] = useState(null);
  const [serverError, setServerError] = useState("");

  // تبدیل تاریخ UTC سرور به ساختار input محلی (YYYY-MM-DDTHH:mm)
  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const tzOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
  };

  useEffect(() => {
    const fetchDiscountAndCategories = async () => {
      // ۱. بارگذاری دسته‌بندی‌ها
      const catRes = await request({
        method: "GET",
        url: "/api/admin/categories",
      });
      const categoriesData = catRes?.message?.data || catRes?.data?.data || [];
      setCategories(categoriesData);

      // ۲. بارگذاری اطلاعات پیش‌فرض تخفیف جهت ویرایش
      const discountRes = await request({
        method: "GET",
        url: `/api/admin/discountcode/${id}`,
      });

      if (discountRes?.success) {
        const discount = discountRes?.message?.data || discountRes?.data?.data;
        if (discount) {
          setInitialData({
            code: discount.code || "",
            title: discount.title || "",
            type: discount.type || "percentage",
            value: discount.value || "",
            minPurchaseAmount: discount.minPurchaseAmount || "",
            startDate: formatDateTime(discount.startDate),
            endDate: formatDateTime(discount.endDate),
            isActive: discount.isActive ?? true,
            category: discount.category?._id || discount.category || "",
          });
        }
      }
    };

    if (id) {
      fetchDiscountAndCategories();
    }
  }, [id]);

  const handleUpdateDiscount = async (formData) => {
    setServerError("");

    const payload = {
      ...formData,
      category: formData.category || null,
    };

    const res = await request({
      method: "PUT",
      url: `/api/admin/discountcode/${id}`,
      data: payload,
    });

    if (res?.success) {
      router.push("/admin/discounts-code");
    } else {
      setServerError(res?.data?.message || res?.error || "خطا در ویرایش کد تخفیف");
    }
  };

  // منتظر می‌مانیم تا اطلاعات از سرور واکشی شده و فرم آماده نمایش شود
  if (!initialData) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-500">
        در حال بارگذاری اطلاعات تخفیف...
      </div>
    );
  }

  return (
    <FormProvider
      schema={updateDiscountSchema}
      defaultValues={initialData}
    >
      <DiscountForm
        onSubmit={handleUpdateDiscount}
        loading={loading}
        serverError={serverError}
        categories={categories}
      />
    </FormProvider>
  );
}
