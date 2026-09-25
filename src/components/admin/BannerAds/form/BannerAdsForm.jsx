"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useFormContext } from "react-hook-form";
import ControlledInput from "@/shared/form/InputeControler";
import { BANNER_POSITIONS } from "@/constants/admin/banner-ads/bannerAds";
 
 
const inputClass =
  "w-full px-4 py-3 rounded-xl border border-blue-200 bg-blue-50/40 text-slate-800 focus:ring-2 focus:ring-blue-500 transition-all outline-none";
const labelClass = "text-sm font-medium text-blue-900 mb-1";

export default function BannerAdsForm({
  onSubmit,
  loading,
  serverError,
  categories = [],
  submitText = "ثبت بنر",
  isEdit = false,
  initialDesktopImage = "",
  initialMobileImage = "",
}) {
  const methods = useFormContext();

  const [desktopFile, setDesktopFile] = useState(null);
  const [desktopPreview, setDesktopPreview] = useState(initialDesktopImage);

  const [mobileFile, setMobileFile] = useState(null);
  const [mobilePreview, setMobilePreview] = useState(initialMobileImage);
  const [removeMobile, setRemoveMobile] = useState(false);

  const [fileError, setFileError] = useState("");

  useEffect(() => {
    setDesktopPreview(initialDesktopImage);
  }, [initialDesktopImage]);

  useEffect(() => {
    setMobilePreview(initialMobileImage);
    setRemoveMobile(false);
  }, [initialMobileImage]);

  useEffect(() => {
    return () => {
      if (desktopFile && desktopPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(desktopPreview);
      }
      if (mobileFile && mobilePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(mobilePreview);
      }
    };
  }, [desktopFile, desktopPreview, mobileFile, mobilePreview]);

  if (!methods) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
        خطا: فرم خارج از FormProvider قرار گرفته است.
      </div>
    );
  }

  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = methods;

  const currentPosition = watch("position");
  const isCategoryPosition = currentPosition === "category-page";

  const handleDesktopFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setFileError("حجم تصویر دسکتاپ نباید بیشتر از ۵ مگابایت باشد");
      return;
    }

    if (desktopPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(desktopPreview);
    }

    setFileError("");
    setDesktopFile(file);
    setDesktopPreview(URL.createObjectURL(file));
  };

  const handleMobileFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setFileError("حجم تصویر موبایل نباید بیشتر از ۵ مگابایت باشد");
      return;
    }

    if (mobilePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(mobilePreview);
    }

    setFileError("");
    setRemoveMobile(false);
    setMobileFile(file);
    setMobilePreview(URL.createObjectURL(file));
  };

  const handleRemoveMobile = () => {
    if (mobilePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(mobilePreview);
    }
    setMobileFile(null);
    setMobilePreview("");
    setRemoveMobile(true);
  };

  const handleFormSubmit = (values) => {
    if (!isEdit && !desktopFile) {
      setFileError("انتخاب تصویر دسکتاپ اجباری است");
      return;
    }

    const formData = new FormData();

    Object.entries(values).forEach(([key, val]) => {
      if (val === undefined || val === null) {
        formData.append(key, "");
      } else {
        formData.append(key, String(val));
      }
    });

    if (desktopFile) {
      formData.append("desktopImage", desktopFile);
    }

    if (mobileFile) {
      formData.append("mobileImage", mobileFile);
    }

    if (removeMobile) {
      formData.append("removeMobileImage", "true");
    }

    onSubmit(formData);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="flex w-full max-w-2xl flex-col gap-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-lg"
      >
        <h2 className="border-b pb-3 text-center text-xl font-bold text-slate-800">
          {submitText}
        </h2>

        <ControlledInput name="title" label="عنوان بنر" className={inputClass} />
        <ControlledInput name="description" label="توضیحات اختیاری" className={inputClass} />
        <ControlledInput
          name="link"
          label="لینک بنر (مانند /products یا https://site.com)"
          placeholder="https://example.com"
          className={inputClass}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <ControlledInput
            name="order"
            label="ترتیب نمایش (اولویت کمتر، اول)"
            type="number"
            className={inputClass}
          />

          <div className="flex flex-col">
            <label className={labelClass}>جایگاه بنر</label>
            <select {...register("position")} className={inputClass}>
              {BANNER_POSITIONS.map((pos) => (
                <option key={pos.value} value={pos.value}>
                  {pos.label}
                </option>
              ))}
            </select>
            {errors.position && (
              <p className="mt-1 text-xs text-red-600">
                {errors.position.message?.toString()}
              </p>
            )}
          </div>
        </div>

        {isCategoryPosition && (
          <div className="flex flex-col">
            <label className={labelClass}>دسته‌بندی مربوطه</label>
            <select {...register("category")} className={inputClass}>
              <option value="">همه دسته‌بندی‌ها</option>
              {categories.map((cat) => (
                <option key={cat._id || cat.id} value={cat._id || cat.id}>
                  {cat.title || cat.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <ControlledInput
            name="startsAt"
            label="تاریخ شروع نمایش"
            type="datetime-local"
            className={inputClass}
          />
          <ControlledInput
            name="endsAt"
            label="تاریخ پایان نمایش"
            type="datetime-local"
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-2 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
          <label className={labelClass}>تصویر دسکتاپ اصلی (اجباری)</label>
          {desktopPreview && (
            <div className="flex items-center justify-between gap-4 rounded-xl border border-blue-100 bg-white p-3 shadow-sm">
              <div className="relative h-20 w-40 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                <Image
                  src={desktopPreview}
                  alt="پیش‌نمایش دسکتاپ"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <span className="text-xs text-slate-500 font-medium">
                {desktopFile ? "فایل جدید" : "تصویر جاری"}
              </span>
            </div>
          )}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleDesktopFileChange}
            className="block w-full cursor-pointer text-sm text-slate-500 file:mr-4 file:rounded-xl file:border-0 file:bg-blue-600 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-700"
          />
        </div>

        <div className="flex flex-col gap-2 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
          <label className={labelClass}>تصویر نسخه موبایل (اختیاری)</label>
          {!removeMobile && mobilePreview && (
            <div className="flex items-center justify-between gap-4 rounded-xl border border-blue-100 bg-white p-3 shadow-sm">
              <div className="relative h-20 w-20 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                <Image
                  src={mobilePreview}
                  alt="پیش‌نمایش موبایل"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <button
                type="button"
                onClick={handleRemoveMobile}
                className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-100"
              >
                حذف تصویر موبایل
              </button>
            </div>
          )}
          {removeMobile && (
            <p className="text-xs text-amber-600">
              تصویر موبایل پس از ذخیره حذف خواهد شد.
            </p>
          )}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleMobileFileChange}
            className="block w-full cursor-pointer text-sm text-slate-500 file:mr-4 file:rounded-xl file:border-0 file:bg-slate-700 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-800"
          />
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
          <input
            type="checkbox"
            id="isActive"
            {...register("isActive")}
            className="h-5 w-5 cursor-pointer rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="isActive" className="cursor-pointer text-sm font-medium text-slate-700">
            این بنر فعال باشد و در سایت نمایش داده شود
          </label>
        </div>

        {(fileError || serverError) && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3">
            <p className="text-center text-sm font-medium text-red-600">
              {fileError || serverError}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-xl bg-blue-600 py-3.5 font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-60"
        >
          {loading ? "در حال ارسال..." : submitText}
        </button>
      </form>
    </div>
  );
}
