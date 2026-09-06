"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { useFetch } from "@/hooks/crud/UseCrud";
import ProductForm from "../form/FormProductAdmin";

export default function CreateProductLogic() {
  const router = useRouter();
  const { request, loading } = useFetch();

  const [categories, setCategories] = useState([]);
  const [allUploadedImages, setAllUploadedImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [libraryImages, setLibraryImages] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);
  const [duplicateWarnings, setDuplicateWarnings] = useState([]);

  const methods = useForm({
    defaultValues: {
      name: "",
      description: "",
      price: "",
      stock: "",
      discountprice: 0,
      category: "",
      isActive: true,
      features: [{ title: "", value: "" }],
    },
    mode: "all",
  });

  const { setError, clearErrors } = methods;

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const catRes = await request({ method: "GET", url: "/api/admin/categories" });
        if (isMounted && catRes) {
          const catData =
            catRes?.data.message?.data ||
            
            (Array.isArray(catRes?.data) ? catRes.data : []);
          setCategories(Array.isArray(catData) ? catData : []);
          console.log(catRes);

        }
      } catch {
        if (isMounted) setCategories([]);
      }

      try {
        const uploadsRes = await request({ method: "GET", url: "/api/admin/uploads" });
        if (isMounted && uploadsRes) {
          const imgList =
            uploadsRes?.data?.images ||
            (Array.isArray(uploadsRes?.data) ? uploadsRes.data : []);
          setAllUploadedImages(Array.isArray(imgList) ? imgList : []);
        }
      } catch {
        if (isMounted) setAllUploadedImages([]);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

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
    setLibraryImages((prev) => (prev.includes(imgPath) ? prev : [...prev, imgPath]));
    setNewPreviews((prev) => (prev.includes(imgPath) ? prev : [...prev, imgPath]));
  }, []);

  const handleRemoveNewImage = useCallback(
    (indexToRemove) => {
      const preview = newPreviews[indexToRemove];

      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }

      if (preview && libraryImages.includes(preview)) {
        setLibraryImages((prev) => prev.filter((img) => img !== preview));
      } else {
        const fileIndex = newPreviews
          .slice(0, indexToRemove)
          .filter((p) => p.startsWith("blob:")).length;

        setSelectedFiles((prev) => prev.filter((_, i) => i !== fileIndex));
      }

      setNewPreviews((prev) => prev.filter((_, i) => i !== indexToRemove));
    },
    [newPreviews, libraryImages]
  );

  const handleCreateProduct = async (values) => {
    clearErrors();
    try {
      const formData = new FormData();
      formData.append("name", values.name || "");
      formData.append("description", values.description || "");
      formData.append("price", String(values.price || ""));
      formData.append("stock", String(values.stock || ""));
      formData.append("discountprice", String(values.discountprice || 0));
      formData.append("category", values.category || "");
      formData.append("isActive", values.isActive ? "true" : "false");

      const cleanedFeatures = (values.features || []).filter(
        (f) => f?.title?.trim() && f?.value?.trim()
      );
      formData.append("features", JSON.stringify(cleanedFeatures));
      formData.append("existingImages", JSON.stringify(libraryImages));

      selectedFiles.forEach((file) => {
        if (file instanceof File && file.size > 0) {
          formData.append("images", file);
        }
      });

      const res = await request({
        method: "POST",
        url: "/api/admin/products",
        data: formData,
      });

      if (res?.data?.success || res?.success) {
        router.push("/admin/product");
      } else {
        const message = res?.data?.message || res?.message || "خطایی در ایجاد محصول رخ داد";
        setError("root.serverError", { type: "server", message });
      }
    } catch (error) {
      const message = error?.response?.data?.message || "خطا در برقراری ارتباط با سرور";
      setError("root.serverError", { type: "server", message });
    }
  };

  return (
    <FormProvider {...methods}>
      <ProductForm
        onSubmit={handleCreateProduct}
        loading={loading}
        categories={categories}
        allUploadedImages={allUploadedImages}
        newImagePreviews={newPreviews}
        onImageChange={handleImageChange}
        onRemoveNewImage={handleRemoveNewImage}
        onAddFromLibrary={handleAddFromLibrary}
        duplicateWarnings={duplicateWarnings}
        onClearDuplicateWarnings={() => setDuplicateWarnings([])}
      />
    </FormProvider>
  );
}
