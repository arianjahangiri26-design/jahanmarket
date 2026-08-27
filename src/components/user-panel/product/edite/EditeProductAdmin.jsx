"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { useFetch } from "@/hooks/crud/UseCrud";
import ProductForm from "../form/FormProductAdmin";
import FormProvider from "@/context/form/FormProvider";

export default function EditProductLogic() {
  const params = useParams();
  const id = params?.id;

  const router = useRouter();

  const methods = useForm({
    defaultValues: {
      name: "",
      description: "",
      price: "",
      discountprice: 0,
      stock: "",
      category: "",
      imageProduct: null,
   
      features: [],
    },
  });

  const { reset } = methods;
  const { request, loading } = useFetch();

  const [categories, setCategories] = useState([]);
  const [currentImage, setCurrentImage] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setPageLoading(true);

        const catRes = await request({
          method: "GET",
          url: "/api/admin/categories",
        });

        if (catRes?.data?.success) {
          setCategories(catRes.data.data);
        }

        const productRes = await request({
          method: "GET",
          url: `/api/admin/products/${id}`,
        });

        const product = productRes?.data?.data;

        if (product) {
          setCurrentImage(product.imageProduct);

          reset({
            name: product.name || "",
            description: product.description || "",
            price: product.price || "",
            discountprice: product.discountprice || 0,
            stock: product.stock || "",
            category: product.category?._id || "",
           
            imageProduct: null,
            features: product.features || [],
          });
        }
      } catch (error) {
      } finally {
        setPageLoading(false);
      }
    };

    fetchData();
  }, [id, request, reset]);

  const handleUpdate = async (values) => {
    try {
      const formData = new FormData();

      formData.append("name", values.name || "");
      formData.append("description", values.description || "");
      formData.append("price", values.price || "");
      formData.append("discountprice", values.discountprice || 0 );
      formData.append("stock", values.stock || "");
      formData.append("category", values.category || "");
 

      const cleanedFeatures = (values.features || []).filter(
        (item) => item?.title?.trim() && item?.value?.trim()
      );
      formData.append("features", JSON.stringify(cleanedFeatures));

      const file = values.imageProduct?.[0];
      if (file instanceof File) {
        formData.append("imageProduct", file);
      }

      const res = await request({
        method: "PUT",
        url: `/api/admin/products/${id}`,
        data: formData,
      });

      if (res?.data?.success) {
        router.push("/admin/products");
      }
    } catch (error) {
    }
  };

  if (pageLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <p className="text-sm font-semibold text-blue-600 animate-pulse">
          در حال دریافت اطلاعات محصول...
        </p>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <ProductForm
        onSubmit={handleUpdate}
        loading={loading}
        categories={categories}
        currentImage={currentImage}
        isEdit
      />
    </FormProvider>
  );
}
