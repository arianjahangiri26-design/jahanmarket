"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { useFetch } from "@/hooks/crud/UseCrud";
import ProductForm from "../form/FormProductAdmin";

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
      isActive: true,
      features: [],
    },
    mode: "all",
  });

  const { reset, setError, clearErrors } = methods;
  const { request, loading } = useFetch();

  const [categories, setCategories] = useState([]);
  const [allUploadedImages, setAllUploadedImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);
  const [duplicateWarnings, setDuplicateWarnings] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    const fetchData = async () => {
      setPageLoading(true);

      try {
        const catRes = await request({ method: "GET", url: "/api/admin/categories" });
        if (!cancelled && catRes) {
          console.log(catRes);

          const catData =
            catRes?.data.message?.data ||

            catRes?.data?.categories ||
            (Array.isArray(catRes?.data) ? catRes.data : []);
          setCategories(Array.isArray(catData) ? catData : []);
        }
      } catch {
        if (!cancelled) setCategories([]);
      }

      try {
        const uploadsRes = await request({ method: "GET", url: "/api/admin/uploads" });
        if (!cancelled && uploadsRes) {
          const imgs = uploadsRes?.data?.images || [];
          setAllUploadedImages(Array.isArray(imgs) ? imgs : []);
        }
      } catch {
        if (!cancelled) setAllUploadedImages([]);
      }

      try {
        const productRes = await request({ method: "GET", url: `/api/admin/products/${id}` });
        if (!cancelled && productRes) {
          const rawProduct = productRes?.data ?? productRes;
          const product = rawProduct?.data || rawProduct?.product || rawProduct;

          if (product?._id) {
            setExistingImages(Array.isArray(product.images) ? product.images : []);
            reset({
              name: product.name || "",
              description: product.description || "",
              price: product.price ?? "",
              discountprice: product.discountprice ?? 0,
              stock: product.stock ?? "",
              category: String(product.category?._id || product.category || ""),
              isActive: product.isActive ?? true,
              features:
                Array.isArray(product.features) && product.features.length > 0
                  ? product.features
                  : [{ title: "", value: "" }],
            });
          }
        }
      } catch (error) {
        if (!cancelled) {
          setError("root.serverError", {
            type: "server",
            message: "اطلاعات محصول یافت نشد یا در دریافت آن خطایی رخ داد",
          });
        }
      } finally {
        if (!cancelled) setPageLoading(false);
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [id, reset]);

  const handleImageChange = useCallback(
    (e) => {
      const files = Array.from(e.target.files || []);
      e.target.value = "";
      if (!files.length) return;

      const warnings = [];
      const validFiles = [];
      const validPreviews = [];

      for (const file of files) {
        const cleanName = file.name.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9._-]/g, "");
        const isDuplicate = allUploadedImages.some((img) => img.endsWith(`-${cleanName}`));

        if (isDuplicate) {
          warnings.push(file.name);
        } else {
          validFiles.push(file);
          validPreviews.push(URL.createObjectURL(file));
        }
      }

      if (warnings.length) setDuplicateWarnings(warnings);
      if (validFiles.length) {
        setSelectedFiles((prev) => [...prev, ...validFiles]);
        setNewPreviews((prev) => [...prev, ...validPreviews]);
      }
    },
    [allUploadedImages]
  );

  const handleAddFromLibrary = useCallback((imgPath) => {
    setExistingImages((prev) => (prev.includes(imgPath) ? prev : [...prev, imgPath]));
  }, []);

  const handleRemoveExistingImage = useCallback((indexToRemove) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== indexToRemove));
  }, []);

  const handleRemoveNewImage = useCallback((indexToRemove) => {
    setNewPreviews((prev) => {
      const preview = prev[indexToRemove];
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
      return prev.filter((_, i) => i !== indexToRemove);
    });
    setSelectedFiles((prev) => prev.filter((_, i) => i !== indexToRemove));
  }, []);

  const handleReorderExisting = useCallback((fromIndex, toIndex) => {
    setExistingImages((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  }, []);

  const handleUpdate = async (values) => {
    clearErrors();
    try {
      const formData = new FormData();
      formData.append("name", values.name || "");
      formData.append("description", values.description || "");
      formData.append("price", String(values.price || ""));
      formData.append("discountprice", String(values.discountprice || 0));
      formData.append("stock", String(values.stock || ""));
      formData.append("category", values.category || "");
      formData.append("isActive", values.isActive ? "true" : "false");
      formData.append("existingImages", JSON.stringify(existingImages));

      const cleanedFeatures = (values.features || []).filter(
        (f) => f?.title?.trim() && f?.value?.trim()
      );
      formData.append("features", JSON.stringify(cleanedFeatures));

      selectedFiles.forEach((file) => {
        if (file instanceof File && file.size > 0) {
          formData.append("images", file);
        }
      });

      const res = await request({
        method: "PUT",
        url: `/api/admin/products/${id}`,
        data: formData,
      });

      if (res?.data?.success || res?.success) {
        router.push("/admin/product");
      } else {
        const message = res?.data?.message || res?.message || "خطایی در ویرایش محصول رخ داد";
        setError("root.serverError", { type: "server", message });
      }
    } catch (error) {
      const message = error?.response?.data?.message || "خطا در ذخیره تغییرات";
      setError("root.serverError", { type: "server", message });
    }
  };

  if (pageLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="animate-pulse text-sm font-semibold text-blue-600">
          در حال بارگذاری اطلاعات محصول...
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
        allUploadedImages={allUploadedImages}
        existingImages={existingImages}
        onRemoveExistingImage={handleRemoveExistingImage}
        onReorderExisting={handleReorderExisting}
        newImagePreviews={newPreviews}
        onImageChange={handleImageChange}
        onRemoveNewImage={handleRemoveNewImage}
        onAddFromLibrary={handleAddFromLibrary}
        duplicateWarnings={duplicateWarnings}
        onClearDuplicateWarnings={() => setDuplicateWarnings([])}
        isEdit
      />
    </FormProvider>
  );
}
