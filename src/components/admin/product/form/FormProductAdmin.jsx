"use client";

import Image from "next/image";
import {
  Card,
  CardBody,
  Textarea,
  Select,
  SelectItem,
  Switch,
  Button,
} from "@heroui/react";
import {
  FiBox,
  FiDollarSign,
  FiLayers,
  FiImage,
  FiCheckCircle,
} from "react-icons/fi";
import { BsFillLayersFill } from "react-icons/bs";
import { Controller, useFormContext } from "react-hook-form";

import ControlledInput from "@/shared/form/InputeControler";

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
    formState: { errors },
  } = useFormContext();

  const inputWrapperClass =
    "min-h-12 rounded-2xl border border-slate-200 bg-white shadow-none hover:border-blue-400 focus-within:border-blue-500";

  const textareaClassNames = {
    label: "text-sm font-semibold text-slate-700 mb-1",
    inputWrapper:
      "rounded-2xl border border-slate-200 bg-white shadow-none hover:border-blue-400 focus-within:border-blue-500",
    input: "text-slate-800 placeholder:text-slate-400",
    errorMessage: "text-xs text-red-500 mt-1",
  };

  const selectClassNames = {
    label: "text-sm font-semibold text-slate-700 mb-1",
    trigger:
      "min-h-12 rounded-2xl border border-slate-200 bg-white shadow-none hover:border-blue-400 data-[open=true]:border-blue-500",
    value: "text-slate-800",
    errorMessage: "text-xs text-red-500 mt-1",
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="rounded-3xl border border-blue-100 bg-white shadow-sm">
        <CardBody className="space-y-6 p-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <FiBox className="text-xl" />
            </div>

            <div>
              <h2 className="text-lg font-extrabold text-slate-800">
                {isEdit ? "ویرایش اطلاعات محصول" : "ایجاد محصول جدید"}
              </h2>
              <p className="text-xs text-slate-500">
                مشخصات اصلی و فیلدهای پایه محصول را پر کنید.
              </p>
            </div>
          </div>

          {/* Product Name */}
          <ControlledInput
            name="name"
            label="نام محصول"
            placeholder="مثال: گوشی موبایل مدل X"
            className={inputWrapperClass}
            startContent={<FiBox className="text-slate-400" />}
          />

          {/* Description */}
          <Controller
            name="description"
            control={control}
            render={({ field, fieldState }) => (
              <div className="w-full">
                <Textarea
                  {...field}
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                  label="توضیحات محصول"
                  labelPlacement="outside"
                  placeholder="توضیحات و مشخصات کاربردی در مورد محصول..."
                  variant="bordered"
                  radius="lg"
                  minRows={4}
                  isInvalid={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                  classNames={textareaClassNames}
                />
              </div>
            )}
          />

          {/* Price / Stock / Discount */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <ControlledInput
              name="price"
              type="number"
              label="قیمت (تومان)"
              placeholder="مثال: 4500000"
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
              placeholder="مثال: 15"
              className={inputWrapperClass}
              startContent={<BsFillLayersFill className="text-slate-400" />}
            />
          </div>

          {/* Category */}
          <Controller
            name="category"
            control={control}
            render={({ field, fieldState }) => (
              <Select
                label="دسته‌بندی"
                labelPlacement="outside"
                placeholder="یک دسته‌بندی انتخاب کنید"
                variant="bordered"
                radius="lg"
                startContent={<FiLayers className="text-slate-400" />}
                selectedKeys={field.value ? new Set([field.value]) : new Set([])}
                onSelectionChange={(keys) => {
                  const value =
                    keys === "all" ? "" : Array.from(keys)[0]?.toString() || "";

                  field.onChange(value);
                }}
                isInvalid={!!fieldState.error}
                errorMessage={fieldState.error?.message}
                classNames={selectClassNames}
              >
                {categories.map((category) => (
                  <SelectItem key={category._id}>
                    {category.name}
                  </SelectItem>
                ))}
              </Select>
            )}
          />

          {/* Image Upload */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700">
              تصویر محصول
            </label>

            <div className="rounded-2xl border border-dashed border-blue-200 bg-blue-50/20 p-4">
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-medium text-slate-700 transition hover:border-blue-400">
                <FiImage className="text-lg text-blue-600" />
                انتخاب تصویر محصول

                <input
                  type="file"
                  accept="image/*"
                  {...register("imageProduct")}
                  className="hidden"
                />
              </label>

              {errors?.imageProduct && (
                <p className="mt-2 text-xs text-red-500">
                  {errors.imageProduct.message?.toString()}
                </p>
              )}

              {isEdit && currentImage && (
                <div className="mt-4">
                  <p className="mb-2 text-xs text-slate-400">
                    تصویر آپلود شده فعلی:
                  </p>

                  <div className="relative h-28 w-28 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <Image
                      src={currentImage}
                      alt="current-product-image"
                      fill
                      className="object-cover"
                    />
                  </div>

                  <p className="mt-2 text-xs text-slate-400">
                    در صورت عدم نیاز به تغییر، فیلد بالا را رها کنید.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Active Status */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                  <FiCheckCircle />
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-800">
                    وضعیت نمایش محصول
                  </p>
                  <p className="text-xs text-slate-400">
                    فعال بودن محصول جهت خرید توسط مشتری در وب‌سایت
                  </p>
                </div>
              </div>

              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <Switch
                    isSelected={!!field.value}
                    onValueChange={field.onChange}
                    color="primary"
                  />
                )}
              />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          color="primary"
          isLoading={loading}
          className="h-12 rounded-2xl bg-blue-600 px-10 font-bold text-white shadow-lg shadow-blue-100"
        >
          {isEdit ? "ذخیره تغییرات" : "ثبت محصول جدید"}
        </Button>
      </div>
    </form>
  );
}
