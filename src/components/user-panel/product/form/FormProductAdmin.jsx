"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Card,
  CardBody,
  Input,
  Textarea,
  Select,
  SelectItem,
  Button,
} from "@heroui/react";
import {
  FiBox,
  FiDollarSign,
  FiLayers,
  FiImage,
  FiUploadCloud,
} from "react-icons/fi";
import { Controller, useFormContext } from "react-hook-form";
import { BsFillLayersFill, BsPercent } from "react-icons/bs";

export default function ProductForm({
  onSubmit,
  loading,
  categories = [],
  isEdit = false,
  currentImage = null,
}) {
  const {
    handleSubmit,
    control,
    register,
    watch,
    formState: { errors },
  } = useFormContext();

  const [previewImage, setPreviewImage] = useState(null);
  const watchedImage = watch("imageProduct");

  // ساخت پیش‌نمایش زنده برای عکسی که فروشنده تازه انتخاب می‌کند
  useEffect(() => {
    if (watchedImage && watchedImage[0]) {
      const file = watchedImage[0];
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [watchedImage]);

  // کلاس‌های استایل دهی تم لایت و مدرن ورودی‌ها برای پنل فروشنده
  const inputClassNames = {
    label: "text-xs font-bold text-slate-600 mb-1.5",
    inputWrapper:
      "border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-amber-500/70 focus-within:border-amber-600 focus-within:bg-white transition-all duration-250 shadow-none py-1.5",
    input: "text-slate-800 placeholder:text-slate-400 text-sm",
    errorMessage: "text-xs text-rose-500 mt-1 font-medium",
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl mx-auto">
      {/* کارت اصلی اطلاعات محصول */}
      <Card className="rounded-[2.5rem] border border-slate-100/80 bg-white/70 backdrop-blur-md p-2 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
        <CardBody className="space-y-8 p-6">
          
          {/* هدر بخش اطلاعات عمومی */}
          <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 shadow-inner">
              <FiBox className="text-xl" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                {isEdit ? "ویرایش و به‌روزرسانی محصول" : "ثبت محصول جدید در فروشگاه"}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                اطلاعات دقیق کالا را جهت نمایش بهتر به خریداران وارد نمایید.
              </p>
            </div>
          </div>

          {/* فیلد نام محصول */}
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <Input
                {...field}
                value={field.value ?? ""}
                onValueChange={field.onChange}
                label="نام محصول"
                labelPlacement="outside"
                placeholder="نام تجاری و دقیق محصول را وارد کنید"
                variant="bordered"
                radius="xl"
                startContent={<FiBox className="text-slate-400/80 text-lg" />}
                isInvalid={!!fieldState.error}
                errorMessage={fieldState.error?.message}
                classNames={inputClassNames}
              />
            )}
          />

          {/* فیلد توضیحات محصول */}
          <Controller
            name="description"
            control={control}
            render={({ field, fieldState }) => (
              <Textarea
                {...field}
                value={field.value ?? ""}
                onValueChange={field.onChange}
                label="توضیحات معرفی محصول"
                labelPlacement="outside"
                placeholder="ویژگی‌های کلیدی، مشخصات فنی و کاربرد کالا را توضیح دهید..."
                variant="bordered"
                radius="xl"
                minRows={5}
                isInvalid={!!fieldState.error}
                errorMessage={fieldState.error?.message}
                classNames={inputClassNames}
              />
            )}
          />

          {/* ردیف قیمت و موجودی */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <Controller
              name="price"
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                  type="number"
                  label="قیمت فروش (تومان)"
                  labelPlacement="outside"
                  placeholder="مثال: 450000"
                  variant="bordered"
                  radius="xl"
                  startContent={<FiDollarSign className="text-slate-400/80 text-lg" />}
                  isInvalid={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                  classNames={inputClassNames}
                />
              )}
            />

            <Controller
              name="discountprice"
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                  type="number"
                  label="قیمت پس از تخفیف (تومان)"
                  labelPlacement="outside"
                  placeholder="اختیاری - مثال: 390000"
                  variant="bordered"
                  radius="xl"
                  startContent={<BsPercent className="text-slate-400/80 text-lg" />}
                  isInvalid={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                  classNames={inputClassNames}
                />
              )}
            />

            <Controller
              name="stock"
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                  type="number"
                  label="موجودی انبار فروشنده"
                  labelPlacement="outside"
                  placeholder="مثال: 10"
                  variant="bordered"
                  radius="xl"
                  startContent={<FiLayers className="text-slate-400/80 text-lg" />}
                  isInvalid={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                  classNames={inputClassNames}
                />
              )}
            />
          </div>

          {/* فیلد دسته‌بندی کالا */}
          <Controller
            name="category"
            control={control}
            render={({ field, fieldState }) => (
              <Select
                label="دسته‌بندی مرتبط کالا"
                labelPlacement="outside"
                placeholder="یک دسته‌بندی برای محصول انتخاب کنید"
                variant="bordered"
                radius="xl"
                startContent={<BsFillLayersFill className="text-slate-400/80 text-lg" />}
                selectedKeys={field.value ? new Set([field.value]) : new Set([])}
                onSelectionChange={(keys) => {
                  const value =
                    keys === "all" ? "" : Array.from(keys)[0]?.toString() || "";
                  field.onChange(value);
                }}
                isInvalid={!!fieldState.error}
                errorMessage={fieldState.error?.message}
                classNames={{
                  label: "text-xs font-bold text-slate-600 mb-1.5",
                  trigger:
                    "border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-amber-500/70 data-[open=true]:border-amber-600 shadow-none py-6 transition-all duration-200",
                  value: "text-slate-800 text-sm",
                  errorMessage: "text-xs text-rose-500 mt-1 font-medium",
                }}
              >
                {categories.map((category) => (
                  <SelectItem key={category._id} textValue={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </Select>
            )}
          />

          {/* بارگذاری تصاویر محصول */}
          <div className="space-y-2.5">
            <label className="block text-xs font-bold text-slate-600">
              تصویر اصلی محصول
            </label>

            <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/40 p-6 transition-all hover:bg-slate-50/80 hover:border-amber-400/80 flex flex-col items-center">
              <label className="flex flex-col items-center justify-center gap-3 cursor-pointer w-full py-6 text-center">
                <div className="h-14 w-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-500 border border-slate-100">
                  <FiUploadCloud className="text-2xl text-amber-500" />
                </div>
                <div>
                  <span className="block text-sm font-semibold text-slate-700">
                    انتخاب یا کشیدن عکس محصول
                  </span>
                  <span className="block text-xs text-slate-400 mt-1">
                    فرمت‌های مجاز: JPG, PNG (حداکثر حجم ۲ مگابایت)
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  {...register("imageProduct")}
                  className="hidden"
                />
              </label>

              {errors?.imageProduct && (
                <p className="mt-2 text-xs text-rose-500 font-medium">
                  {errors.imageProduct.message}
                </p>
              )}

              {/* پیش‌نمایش تصویر جدید یا قبلی */}
              {(previewImage || (isEdit && currentImage)) && (
                <div className="mt-6 w-full border-t border-slate-100 pt-6 flex flex-col items-center">
                  <p className="mb-3 text-xs font-semibold text-slate-500">
                    {previewImage ? "تصویر انتخاب شده جدید:" : "تصویر فعلی روی سایت:"}
                  </p>
                  <div className="relative h-32 w-32 overflow-hidden rounded-2xl border-2 border-white shadow-md bg-white">
                    <Image
                      src={previewImage || currentImage}
                      alt="preview-product"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

        </CardBody>
      </Card>

      {/* دکمه ارسال نهایی در پایین صفحه */}
      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          isLoading={loading}
          className="h-13 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 px-12 font-bold text-white shadow-lg shadow-amber-500/20 text-sm transition-all duration-200 active:scale-[0.98]"
        >
          {isEdit ? "ذخیره و ویرایش کالا" : "انتشار محصول در فروشگاه"}
        </Button>
      </div>
    </form>
  );
}
