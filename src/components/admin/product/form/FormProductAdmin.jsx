"use client";

import { useState } from "react";
import Image from "next/image";
import { Switch, Button } from "@heroui/react";
import {
  FiBox,
  FiDollarSign,
  FiLayers,
  FiImage,
  FiCheckCircle,
  FiChevronDown,
  FiPlus,
  FiTrash2,
  FiList,
  FiX,
  FiStar,
  FiAlertTriangle,
  FiDatabase,
} from "react-icons/fi";
import { BsFillLayersFill } from "react-icons/bs";
import { Controller, useFormContext, useFieldArray } from "react-hook-form";

import ControlledInput from "@/shared/form/InputeControler";

export default function ProductForm({
  onSubmit,
  loading = false,
  categories = [],
  isEdit = false,
  existingImages = [],
  onRemoveExistingImage,
  onReorderExisting,
  newImagePreviews = [],
  onRemoveNewImage,
  onImageChange,
  allUploadedImages = [],
  onAddFromLibrary,
  duplicateWarnings = [],
  onClearDuplicateWarnings,
}) {
  const [showLibrary, setShowLibrary] = useState(false);

  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({ control, name: "features" });

  const inputWrapperClass =
    "min-h-12 rounded-2xl border border-slate-200 bg-white shadow-none transition-colors hover:border-blue-400 focus-within:border-blue-500";

  const getCategoryId = (cat) => String(cat?._id || cat?.id || "");
  const getCategoryName = (cat) => cat?.name || cat?.title || "دسته‌بندی نامشخص";

  const allCurrentImages = [
    ...existingImages.map((src) => ({ src, type: "existing" })),
    ...newImagePreviews.map((src) => ({ src, type: "new" })),
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6" dir="rtl">
      <div className="space-y-6 rounded-3xl border border-blue-100 bg-white p-4 shadow-sm sm:p-6">

        <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
            <FiImage className="text-xl" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-800">
              {isEdit ? "ویرایش اطلاعات محصول" : "ایجاد محصول جدید"}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              مشخصات، تصاویر و ویژگی‌های فنی محصول را کامل کنید.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <ControlledInput
            name="name"
            label="نام محصول"
            placeholder="مثال: لپ‌تاپ گیمینگ ایسوس TUF Gaming F15"
            className={inputWrapperClass}
            startContent={<FiBox className="text-slate-400" />}
          />

          <Controller
            name="description"
            control={control}
            render={({ field, fieldState }) => (
              <div className="w-full">
                <label
                  htmlFor="description"
                  className="mb-1 block text-sm font-semibold text-slate-700"
                >
                  توضیحات محصول
                </label>
                <textarea
                  id="description"
                  {...field}
                  value={field.value ?? ""}
                  rows={4}
                  placeholder="توضیحات کامل درباره محصول..."
                  className={`w-full resize-y rounded-2xl border bg-white p-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 ${
                    fieldState.error
                      ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                      : "border-slate-200 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  }`}
                />
                {fieldState.error?.message && (
                  <p className="mt-1 text-xs text-red-500">{fieldState.error.message}</p>
                )}
              </div>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <ControlledInput
            name="price"
            type="number"
            label="قیمت به تومان"
            placeholder="مثال: 45000000"
            className={inputWrapperClass}
            startContent={<FiDollarSign className="text-slate-400" />}
          />
          <ControlledInput
            name="stock"
            type="number"
            label="موجودی انبار"
            placeholder="مثال: 15"
            className={inputWrapperClass}
            startContent={<FiLayers className="text-slate-400" />}
          />
          <ControlledInput
            name="discountprice"
            type="number"
            label="مقدار تخفیف"
            placeholder="مثال: 20"
            className={inputWrapperClass}
            startContent={<BsFillLayersFill className="text-slate-400" />}
          />
        </div>

        <Controller
          name="category"
          control={control}
          rules={{ required: "انتخاب دسته‌بندی الزامی است" }}
          render={({ field, fieldState }) => (
            <div className="w-full">
              <label
                htmlFor="category"
                className="mb-1 block text-sm font-semibold text-slate-700"
              >
                دسته‌بندی محصول
              </label>
              <div className="relative">
                <FiLayers className="pointer-events-none absolute right-3.5 top-1/2 z-10 -translate-y-1/2 text-slate-400" />
                <select
                  id="category"
                  name={field.name}
                  ref={field.ref}
                  value={field.value ?? ""}
                  onBlur={field.onBlur}
                  onChange={(e) => field.onChange(e.target.value)}
                  className={`w-full appearance-none rounded-2xl border bg-white py-2.5 pl-10 pr-10 text-sm outline-none transition ${
                    fieldState.error
                      ? "border-red-400 text-red-700 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                      : "border-slate-200 text-slate-800 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  }`}
                >
                  <option value="">یک دسته‌بندی انتخاب کنید</option>
                  {categories.map((cat) => (
                    <option key={getCategoryId(cat)} value={getCategoryId(cat)}>
                      {getCategoryName(cat)}
                    </option>
                  ))}
                </select>
                <FiChevronDown className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
              {fieldState.error?.message && (
                <p className="mt-1 text-xs text-red-500">{fieldState.error.message}</p>
              )}
            </div>
          )}
        />

        <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
            <div className="flex items-center gap-2 text-slate-800">
              <FiList className="text-lg text-blue-600" />
              <h3 className="text-sm font-bold">ویژگی‌ها و مشخصات فنی</h3>
            </div>
            <button
              type="button"
              onClick={() => append({ title: "", value: "" })}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-95"
            >
              <FiPlus />
              <span>افزودن ویژگی جدید</span>
            </button>
          </div>

          {fields.length === 0 ? (
            <p className="py-2 text-center text-xs text-slate-500">
              هیچ ویژگی‌ای ثبت نشده است. با زدن دکمه بالا مشخصات فنی را اضافه کنید.
            </p>
          ) : (
            <div className="space-y-3">
              {fields.map((fieldItem, index) => (
                <div key={fieldItem.id} className="flex flex-col items-center gap-2 sm:flex-row">
                  <div className="w-full sm:w-1/3">
                    <input
                      type="text"
                      placeholder="عنوان (مثال: پردازنده)"
                      {...register(`features.${index}.title`)}
                      className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-blue-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
                    />
                  </div>
                  <div className="w-full sm:w-2/3">
                    <input
                      type="text"
                      placeholder="مقدار (مثال: Core i7 13620H)"
                      {...register(`features.${index}.value`)}
                      className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-blue-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100 active:scale-95"
                    title="حذف ویژگی"
                  >
                    <FiTrash2 className="text-base" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-semibold text-slate-700">
            تصاویر محصول
            {allCurrentImages.length > 0 && (
              <span className="mr-2 text-xs font-normal text-slate-400">
                (اولین تصویر به عنوان تصویر شاخص نمایش داده می‌شود)
              </span>
            )}
          </label>

          {duplicateWarnings.length > 0 && (
            <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3">
              <FiAlertTriangle className="mt-0.5 shrink-0 text-amber-500" />
              <div className="flex-1 text-xs text-amber-800">
                <p className="mb-1 font-semibold">فایل‌های زیر قبلاً آپلود شده‌اند:</p>
                <ul className="list-disc space-y-0.5 pr-4 text-amber-700">
                  {duplicateWarnings.map((name, i) => (
                    <li key={i}>{name}</li>
                  ))}
                </ul>
                <p className="mt-1 text-amber-700">
                  برای استفاده از این تصاویر، از بخش «انتخاب از تصاویر آپلودشده» پایین استفاده کنید.
                </p>
              </div>
              <button
                type="button"
                onClick={onClearDuplicateWarnings}
                className="shrink-0 text-amber-500 hover:text-amber-700"
                aria-label="بستن"
              >
                <FiX />
              </button>
            </div>
          )}

          <div className="rounded-2xl border border-dashed border-blue-200 bg-blue-50/30 p-4 space-y-4">
            <label className="flex min-h-14 cursor-pointer items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:border-blue-400 hover:text-blue-600">
              <FiImage className="text-lg text-blue-600" />
              <span>انتخاب تصاویر از رایانه (یک یا چند تصویر)</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={onImageChange}
                className="hidden"
              />
            </label>

            <button
              type="button"
              onClick={() => setShowLibrary((v) => !v)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-blue-400 hover:text-blue-600"
            >
              <FiDatabase className="text-blue-600" />
              <span>انتخاب از تصاویر آپلودشده ({allUploadedImages.length})</span>
              <FiChevronDown
                className={`mr-auto transition-transform ${showLibrary ? "rotate-180" : ""}`}
              />
            </button>

            {showLibrary && (
              <div className="rounded-2xl border border-slate-200 bg-white p-3">
                {allUploadedImages.length === 0 ? (
                  <p className="text-center text-xs text-slate-500 py-4">
                    هیچ تصویری در سرور پیدا نشد.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto">
                    {allUploadedImages.map((imgPath, i) => {
                      const alreadyAdded =
                        existingImages.includes(imgPath) ||
                        newImagePreviews.includes(imgPath);
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => !alreadyAdded && onAddFromLibrary(imgPath)}
                          disabled={alreadyAdded}
                          className={`relative h-20 w-20 overflow-hidden rounded-xl border-2 transition ${
                            alreadyAdded
                              ? "border-blue-400 opacity-50 cursor-not-allowed"
                              : "border-slate-200 hover:border-blue-500 cursor-pointer"
                          }`}
                          title={alreadyAdded ? "قبلاً اضافه شده" : "افزودن به محصول"}
                        >
                          <Image
                            src={imgPath}
                            alt=""
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                          {alreadyAdded && (
                            <div className="absolute inset-0 flex items-center justify-center bg-blue-500/20">
                              <FiCheckCircle className="text-blue-600 text-xl" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {allCurrentImages.length > 0 && (
              <div className="space-y-3 pt-1">
                <p className="text-xs font-bold text-slate-600">
                  تصاویر انتخاب‌شده:
                </p>
                <div className="flex flex-wrap gap-3">
                  {allCurrentImages.map(({ src, type }, index) => (
                    <div
                      key={`${type}-${index}`}
                      className={`group relative h-28 w-28 overflow-hidden rounded-2xl border-2 bg-white shadow-sm ${
                        index === 0
                          ? "border-amber-400 ring-2 ring-amber-200"
                          : type === "new"
                          ? "border-blue-400"
                          : "border-slate-200"
                      }`}
                    >
                      <Image
                        src={src}
                        alt={index === 0 ? "تصویر شاخص" : "تصویر محصول"}
                        fill
                        sizes="112px"
                        className="object-cover"
                      />

                      {index === 0 && (
                        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-1 bg-amber-400/90 py-0.5 text-[10px] font-bold text-white">
                          <FiStar className="text-[10px]" />
                          شاخص
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          type === "existing"
                            ? onRemoveExistingImage(
                                existingImages.indexOf(src)
                              )
                            : onRemoveNewImage(
                                newImagePreviews.indexOf(src)
                              )
                        }
                        className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white shadow transition-transform hover:scale-110 active:scale-90"
                        title="حذف"
                      >
                        <FiX className="text-base" />
                      </button>

                      {index > 0 && isEdit && onReorderExisting && type === "existing" && (
                        <button
                          type="button"
                          onClick={() =>
                            onReorderExisting(existingImages.indexOf(src), 0)
                          }
                          className="absolute left-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-amber-400 text-white shadow transition-transform hover:scale-110"
                          title="تعیین به عنوان شاخص"
                        >
                          <FiStar className="text-xs" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                <FiCheckCircle />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-800">نمایش محصول</p>
                <p className="mt-1 text-xs text-slate-500">
                  محصول فعال باشد تا مشتریان بتوانند آن را در فروشگاه مشاهده کنند.
                </p>
              </div>
            </div>
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <Switch
                  isSelected={Boolean(field.value)}
                  onValueChange={field.onChange}
                  color="primary"
                  aria-label="وضعیت فعال بودن محصول"
                />
              )}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-stretch sm:justify-end">
        <Button
          type="submit"
          color="primary"
          isLoading={loading}
          className="h-12 w-full rounded-2xl bg-blue-600 px-10 font-bold text-white shadow-lg shadow-blue-100 transition-colors hover:bg-blue-700 sm:w-auto"
        >
          {isEdit ? "ذخیره تغییرات" : "ثبت محصول جدید"}
        </Button>
      </div>
    </form>
  );
}
