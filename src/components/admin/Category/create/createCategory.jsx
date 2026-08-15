"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFetch } from "@/hooks/crud/UseCrud"; 
import { createCategorySchema } from "@/lib/validators/admin/categories/categorie.validation";
import CategoryForm from "../Form/FormCategory";
import FormProvider from "@/context/form/FormProvider";

export default function CreateCategoryLogic() {
  const router = useRouter();
  
  // استفاده از متد request و هوک به صورت استاندارد در لایه بالایی کامپوننت
  const { request, loading } = useFetch();

  const [categories, setCategories] = useState([]);
  const [serverError, setServerError] = useState("");

  const fetchCategories = async () => {
    const res = await request({
      method: "GET",
      url: "/api/admin/categories",
    });

    // بر اساس ساختار خروجی useFetch: res.data کل آبجکت پاسخ سرور است و res.data.data آرایه اصلی است.
    if (res?.success) {
      setCategories(res?.message?.data  || []);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);
 
  const handleCreateCategory = async (formData) => {
    setServerError("");

    try {
      const data = new FormData();

      data.append("name", formData.name);
      data.append("description", formData.description || "");
      data.append("parent", formData.parent || "");
      data.append("isActive", formData.isActive ? "true" : "false");

      if (formData.image?.[0]) {
        data.append("image", formData.image[0]);
      }

      const res = await request({
        method: "POST",
        url: "/api/admin/categories",
        data,
      });

      if (res?.success && res.data?.success) {
        router.push("/admin/categories");
      } else {
        setServerError(res?.data?.message || res?.error || "خطا در ایجاد دسته‌بندی");
      }
    } catch {
      setServerError("خطا در ارتباط با سرور");
    }
  };

  return (
    <FormProvider
      schema={createCategorySchema}
      defaultValues={{
        name: "",
        description: "",
        image: undefined,
        parent: "",
        isActive: true,
      }}
    >
      <CategoryForm
        onSubmit={handleCreateCategory}
        loading={loading}
        serverError={serverError}
        categories={categories}
        submitText="ساخت دسته‌بندی"
      />
    </FormProvider>
  );
}
