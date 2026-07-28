"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { useFetch } from "@/hooks/crud/UseCrud";
import FormProvider from "@/context/form/FormProvider";
import BannerAdsForm from "../form/BannerAdsForm";
import { updateBannerAdsSchema } from "@/lib/validators/admin/bannerAdes/bannerAds.validation";

const defaultValues = {
  title: "",
  description: "",
  link: "",
  order: 0,
  position: "main-slider",
  isActive: true,
  desktopImage: undefined,
  mobileImage: undefined,
};

export default function EditBannerAdsLogic() {
  const params = useParams();
  const id = params?.id;

  const router = useRouter();
  const { request, loading } = useFetch();

  const [currentDesktopImage, setCurrentDesktopImage] = useState("");
  const [currentMobileImage, setCurrentMobileImage] = useState("");
  const [serverError, setServerError] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [initialValues, setInitialValues] = useState(defaultValues);

  useEffect(() => {
    if (!id) return;

    const fetchBanner = async () => {
      setPageLoading(true);
      setServerError("");

      try {
        const res = await request({
          method: "GET",
          url: `/api/admin/banner-ads/${id}`,
        });

        if (res?.success || res?.data?.success) {
          const banner =
            res?.data?.data ||
            res?.data?.message?.data ||
            res?.message?.data ||
            res?.data ||
            res?.message;

          if (!banner) {
            setServerError("اطلاعات بنر پیدا نشد");
            return;
          }

          setCurrentDesktopImage(banner.desktopImage || "");
          setCurrentMobileImage(banner.mobileImage || "");

          setInitialValues({
            title: banner.title || "",
            description: banner.description || "",
            link: banner.link || "",
            order: Number(banner.order ?? 0),
            position: banner.position || "main-slider",
            isActive:
              typeof banner.isActive === "boolean" ? banner.isActive : true,
            desktopImage: undefined,
            mobileImage: undefined,
          });

          return;
        }

        setServerError(
          res?.data?.message ||
            res?.message ||
            res?.error ||
            "خطا در دریافت اطلاعات بنر"
        );
      } catch (error) {
        console.error("Fetch banner error:", error);
        setServerError("خطا در ارتباط با سرور");
      } finally {
        setPageLoading(false);
      }
    };

    fetchBanner();
  }, [id]);
  // عمداً request را dependency نگذاشتیم
  // چون معمولاً unstable است و باعث refetch loop می‌شود

  const handleUpdateBanner = async (formData) => {
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
        method: "PUT",
        url: `/api/admin/banner-ads/${id}`,
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
          "خطا در ویرایش بنر"
      );
    } catch (error) {
      console.error("Update banner error:", error);
      setServerError("خطا در ارتباط با سرور");
    }
  };

  if (pageLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-slate-500">در حال بارگذاری اطلاعات بنر...</p>
      </div>
    );
  }

  return (
    <FormProvider
      schema={updateBannerAdsSchema}
      defaultValues={initialValues}
    >
      <BannerAdsForm
        onSubmit={handleUpdateBanner}
        loading={loading}
        serverError={serverError}
        currentDesktopImage={currentDesktopImage}
        currentMobileImage={currentMobileImage}
        submitText="ویرایش اطلاعات بنر"
      />
    </FormProvider>
  );
}
