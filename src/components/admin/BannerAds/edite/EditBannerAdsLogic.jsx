"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFetch } from "@/hooks/crud/UseCrud";
import FormProvider from "@/context/form/FormProvider";
import BannerAdsForm from "../form/BannerAdsForm";
import { updateBannerAdsSchema } from "@/lib/validators/admin/bannerAdes/bannerAds.validation";

const formatDateTimeLocal = (dateString) => {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export default function EditBannerAdsLogic({ categories = [] }) {
  const params = useParams();
  const id = params?.id;

  const router = useRouter();
  const { request, loading } = useFetch();
  const requestRef = useRef(request);
  requestRef.current = request;

  const [serverError, setServerError] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [bannerData, setBannerData] = useState(null);

  useEffect(() => {
    if (!id) return;

    let isMounted = true;

    const fetchBanner = async () => {
      setPageLoading(true);
      setServerError("");

      try {
        const res = await requestRef.current({
          method: "GET",
          url: `/api/admin/banner-ads/${id}`,
        });

        if (!isMounted) return;

        const banner =
          res?.data?.data ||
          res?.data?.message?.data ||
          res?.message?.data ||
          res?.data ||
          res?.message;

        if (banner && banner._id) {
          setBannerData(banner);
          return;
        }

        setServerError("بنر مورد نظر یافت نشد");
      } catch {
        if (isMounted) setServerError("خطا در دریافت اطلاعات بنر");
      } finally {
        if (isMounted) setPageLoading(false);
      }
    };

    fetchBanner();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleUpdateBanner = async (formData) => {
    setServerError("");

    try {
      const res = await requestRef.current({
        method: "PUT",
        url: `/api/admin/banner-ads/${id}`,
        data: formData,
      });

      const isSuccess = res?.success || res?.data?.success || res?.status === 200;

      if (isSuccess) {
        router.push("/admin/banner-ads");
        router.refresh();
        return;
      }

      setServerError(
        res?.data?.message || res?.message || res?.error || "خطا در ویرایش بنر"
      );
    } catch {
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

  if (!bannerData) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-3">
        <p className="text-sm text-red-600">{serverError || "بنر مورد نظر یافت نشد"}</p>
      </div>
    );
  }

  const initialValues = {
    title: bannerData.title || "",
    description: bannerData.description || "",
    link: bannerData.link || "",
    order: Number(bannerData.order ?? 0),
    position: bannerData.position || "main-slider",
    category: bannerData.category?._id || bannerData.category || "",
    startsAt: formatDateTimeLocal(bannerData.startsAt),
    endsAt: formatDateTimeLocal(bannerData.endsAt),
    isActive: typeof bannerData.isActive === "boolean" ? bannerData.isActive : true,
  };

  return (
    <FormProvider
      schema={updateBannerAdsSchema}
      defaultValues={initialValues}
      key={id}
    >
      <BannerAdsForm
        onSubmit={handleUpdateBanner}
        loading={loading}
        serverError={serverError}
        categories={categories}
        submitText="ذخیره تغییرات"
        isEdit={true}
        initialDesktopImage={bannerData.desktopImage}
        initialMobileImage={bannerData.mobileImage}
      />
    </FormProvider>
  );
}
