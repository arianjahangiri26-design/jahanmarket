"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFetch } from "@/hooks/crud/UseCrud";

import ProductForm from "../form/FormProductAdmin";
import FormProvider from "@/context/form/FormProvider";

export default function CreateProductLogic() {
  const router = useRouter();
  const { request, loading } = useFetch();

  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    const res = await request({
      method: "GET",
      url: "/api/admin/categories",
    });

    const categoriesData = res?.data?.message?.data || res?.data?.data || [];
    setCategories(categoriesData);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateProduct = async (values) => {
    const formData = new FormData();

    formData.append("name", values.name || "");
    formData.append("description", values.description || "");
    formData.append("price", values.price || "");
    formData.append("stock", values.stock || "");
    formData.append("discountprice", values.discountprice || "");
    formData.append("category", values.category || "");
    formData.append("isActive", values.isActive ? "true" : "false");

    // تمیز کردن آیتم‌های ویژگی برای عدم ارسال عنوان/مقدارهای خالی به سرور
    const cleanedFeatures = (values.features || []).filter(
      (item) => item?.title?.trim() && item?.value?.trim()
    );
    formData.append("features", JSON.stringify(cleanedFeatures));

    const file = values.imageProduct?.[0];
    if (file) {
      formData.append("imageProduct", file);
    }

    const res = await request({
      method: "POST",
      url: "/api/admin/products",
      data: formData,
    });

    if (res?.data?.success) {
      router.push("/admin/product");
    }
  };

  return (
    <FormProvider
      defaultValues={{
        name: "",
        description: "",
        price: "",
        stock: "",
        discountprice: "",
        category: "",
        imageProduct: null,
        isActive: true,
        features: [],
      }}
    >
      <ProductForm
        onSubmit={handleCreateProduct}
        loading={loading}
        categories={categories}
      />
    </FormProvider>
  );
}
