"use client";

import { priceFormatter } from "@/lib/utils/priceFormatter";
import { AddToCartLogic } from "@/shared/cart/AddToCartLogic";
import { Button, Chip } from "@heroui/react";
import { FaCartPlus, FaHeart, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
 
 
export default function ProductInfoCard({ product }) {
  const isAvailable = product?.stock > 0 && product?.isActive;

  return (
    <div className="rounded-[32px] border border-blue-100 bg-white p-6 shadow-xl shadow-blue-100/40">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Chip
          color={isAvailable ? "success" : "danger"}
          variant="flat"
          className="font-medium"
        >
          {isAvailable ? "موجود" : "ناموجود"}
        </Chip>

        <Chip color="primary" variant="flat" className="font-medium">
          {product?.category?.name || "بدون دسته‌بندی"}
        </Chip>
      </div>

      <h1 className="mb-4 text-3xl font-extrabold leading-relaxed text-slate-800">
        {product?.name}
      </h1>

      <div className="mb-6">
        <span className="text-sm text-slate-500">قیمت محصول</span>
        <div className="mt-2 text-3xl font-black text-blue-700">
          {priceFormatter(product?.price || 0)}
          <span className="mr-2 text-lg font-medium text-slate-500">تومان</span>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 rounded-2xl bg-blue-50 p-4">
        <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
          <p className="mb-2 text-sm text-slate-500">موجودی</p>
          <p className="text-lg font-bold text-slate-800">{product?.stock}</p>
        </div>

        <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
          <p className="mb-2 text-sm text-slate-500">وضعیت</p>
          <p
            className={`flex items-center justify-center gap-2 text-sm font-bold ${
              product?.isActive ? "text-green-600" : "text-red-500"
            }`}
          >
            {product?.isActive ? <FaCheckCircle /> : <FaTimesCircle />}
            {product?.isActive ? "فعال" : "غیرفعال"}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
       <AddToCartLogic productId={product._id}/>

        <Button
          variant="bordered"
          size="lg"
          startContent={<FaHeart />}
          className="border-blue-200 text-blue-700"
        >
          علاقه‌مندی
        </Button>
      </div>
    </div>
  );
}
