"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useFetch } from "@/hooks/crud/UseCrud";
import FormProvider from "@/context/form/FormProvider";
import BannerAdsForm from "../form/BannerAdsForm";
import { createBannerAdsSchema } from "@/lib/validators/admin/bannerAdes/bannerAds.validation";

export default function CreateBannerAdsLogic() {
  const router = useRouter();
  const { request, loading } = useFetch();
  const [serverError, setServerError] = useState("");

  const handleCreateBanner = async (formData) => {
    setServerError("");

    try {
      const data = new FormData();

      data.append("title", formData.title || "");
      data.append("description", formData.description || "");
      data.append("link", formData.link || "");
      data.append("order", String(formData.order ?? 0));
      data.append("position", formData.position || "main-slider");
      data.append("isActive", formData.isActive ? "true" : "false");

      if (formData.desktopImage?.[0]) {
        data.append("desktopImage", formData.desktopImage[0]);
      }

      if (formData.mobileImage?.[0]) {
        data.append("mobileImage", formData.mobileImage[0]);
      }

      const res = await request({
        method: "POST",
        url: "/api/admin/banner-ads",
        data,
      });

      if (res?.success || res?.data?.success) {
        router.push("/admin/banner-ads");
        router.refresh();
        return;
      }

      setServerError(
        res?.data?.message ||
          res?.message ||
          res?.error ||
          "خطا در ایجاد بنر جدید"
      );
    } catch (error) {
      console.error("Create banner error:", error);
      setServerError("خطا در ارتباط با سرور");
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
        isActive: true,
        desktopImage: undefined,
        mobileImage: undefined,
      }}
    >
      <BannerAdsForm
        onSubmit={handleCreateBanner}
        loading={loading}
        serverError={serverError}
        submitText="ساخت بنر جدید"
      />
    </FormProvider>
  );
}
