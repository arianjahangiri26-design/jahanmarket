"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFetch } from "@/hooks/crud/UseCrud";
import FormProvider from "@/context/form/FormProvider";
import BannerAdsForm from "../form/BannerAdsForm";
import { createBannerAdsSchema } from "@/lib/validators/admin/bannerAdes/bannerAds.validation";

export default function CreateBannerAdsLogic({ categories = [] }) {
  const router = useRouter();
  const { request, loading } = useFetch();
  const [serverError, setServerError] = useState("");

  const handleCreateBanner = async (formData) => {
    setServerError("");

    try {
      const res = await request({
        method: "POST",
        url: "/api/admin/banner-ads",
        data: formData,
      });

      const isSuccess = res?.success || res?.data?.success || res?.status === 200 || res?.status === 201;

      if (isSuccess) {
        router.push("/admin/banner-ads");
        router.refresh();
        return;
      }

      setServerError(
        res?.data?.message || res?.message || res?.error || "خطا در ایجاد بنر"
      );
    } catch {
      setServerError("خطا در برقراری ارتباط با سرور");
    }
  };

  return (
    <FormProvider
      schema={createBannerAdsSchema}
      defaultValues={{
        title: "",
        description: "",
        link: "",
        order: 0,
        position: "main-slider",
        category: "",
        startsAt: "",
        endsAt: "",
        isActive: true,
      }}
    >
      <BannerAdsForm
        onSubmit={handleCreateBanner}
        loading={loading}
        serverError={serverError}
        categories={categories}
        submitText="ثبت بنر جدید"
        isEdit={false}
      />
    </FormProvider>
  );
}
