"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFetch } from "@/hooks/crud/UseCrud";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
 
import CategoryForm from "../Form/FormCategory";
import { updateCategorySchema } from "@/lib/validators/admin/categories/categorie.validation";

export default function EditCategoryLogic() {
  const { id } = useParams();
  const router = useRouter();

  const methods = useForm({
    resolver: zodResolver(updateCategorySchema),
    defaultValues: {
      name: "",
      description: "",
      parent: "",
      isActive: true,
      image: undefined,
    },
  });

  const { reset } = methods;
  const { request, loading } = useFetch();

  const [categories, setCategories] = useState([]);
  const [currentImage, setCurrentImage] = useState(""); 
  const [serverError, setServerError] = useState("");

  // ۱. دریافت لیست کل دسته‌ها برای انتخاب والد (بدون آی‌دی)
  const fetchCategories = async () => {
    const res = await request({
      method: "GET",
      url: "/api/admin/categories", // اصلاح شد: لیست کل دسته‌ها
    });

    if (res?.success) {
      // توجه: طبق استاندارد خروجی بک‌اند شما، ساختار res.data.data است
      const list = res.data?.message?.data  || [];
      // فیلتر کردن دسته‌بندی فعلی برای جلوگیری از انتخاب خود به عنوان والد
      setCategories(list.filter((c) => c._id !== id));
    }
  };

  // ۲. دریافت اطلاعات دقیق دسته فعلی برای پر کردن فیلدها (با آی‌دی)
  const fetchCategory = async () => {
    const res = await request({
      method: "GET",
      url: `/api/admin/categories/${id}`, // اصلاح شد: اطلاعات همین دسته
    });

    if (res?.success) {
      // داده در res.data.data قرار دارد
      const category = res.data?.message?.data ;
      if (!category) return;

      if (category.image) {
        setCurrentImage(category.image);
      }

      // مقادیر فرم را با مقادیر ثبت‌شده قبلی پر می‌کنیم
      reset({
        name: category.name || "",
        description: category.description || "",
        parent: category.parent?._id || category.parent || "",
        isActive: Boolean(category.isActive),
      });
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchCategories();
    fetchCategory();
  }, [id]);

  const handleUpdateCategory = async (formData) => {
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
        method: "PUT",
        url: `/api/admin/categories/${id}`,
        data,
      });
  
      // چک کردن موفقیت‌آمیز بودن ویرایش
      if (res?.success && res?.success) {
        router.push("/admin/categories");
      } else {
        setServerError(res?.data?.message || res?.error || "خطا در ویرایش دسته‌بندی");
      }
    } catch {
      setServerError("خطا در ارتباط با سرور");
    }
  };

  return (
    <FormProvider {...methods}>
      <CategoryForm
        onSubmit={handleUpdateCategory}
        loading={loading}
        serverError={serverError}
        categories={categories}
        currentImage={currentImage}
        submitText="ویرایش دسته‌بندی"
      />
    </FormProvider>
  );
}
