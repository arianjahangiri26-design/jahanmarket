"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useCart } from "@/context/cart/CartContext";
import { useFetch } from "@/hooks/crud/UseCrud";
import { CheckoutDesign } from "../ui/checkoutDesign";
import { useRouter } from "next/navigation";
 
 
export function CheckoutLogic() {
  const { cart, loading: cartLoading, clearCart } = useCart();
  const { request, loading: requestLoading } = useFetch();

  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountError, setDiscountError] = useState("");
  const [hasDiscountApplied, setHasDiscountApplied] = useState(false);
const router=useRouter();
  const { register, handleSubmit, setValue, reset } = useForm({
    defaultValues: { discountCode: "" },
  });

  useEffect(() => {
    const savedDiscount = Number(cart?.discountPrice) || 0;
    setDiscountAmount(savedDiscount);
    setHasDiscountApplied(savedDiscount > 0);
    setValue("discountCode", cart?.discountCode || "");
  }, [cart, setValue]);

  const cartItems = cart?.items || [];

  const subtotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
      const price = Number(item?.product?.price || 0);
      const quantity = Number(item?.quantity || 0);
      return total + price * quantity;
    }, 0);
  }, [cartItems]);

  const shippingAmount = useMemo(() => {
    if (subtotal === 0 || subtotal >= 1000000) return 0;
    return 50000;
  }, [subtotal]);

  const payableAmount = useMemo(() => {
    return Math.max(subtotal - discountAmount + shippingAmount, 0);
  }, [subtotal, discountAmount, shippingAmount]);

  const handleApplyDiscount = async (formData) => {
    if (hasDiscountApplied) {
      setDiscountError("کد تخفیف قبلا اعمال شده است.");
      return;
    }

    const code = formData.discountCode?.trim();
    if (!code) {
      setDiscountError("لطفا کد تخفیف را وارد کنید.");
      return;
    }

    setDiscountError("");

    const result = await request({
      url: "/api/admin/discountcode/validate",
      method: "POST",
      data: { code },
    });

    if (!result?.success) {
      setDiscountError(result?.message || result?.error || "کد تخفیف معتبر نیست.");
      return;
    }

    const newDiscount = Number(result?.discountPrice || 0);
    setDiscountAmount(newDiscount);
    setHasDiscountApplied(newDiscount > 0);
  };

  const handleResetDiscount = () => {
    setDiscountAmount(0);
    setDiscountError("");
    setHasDiscountApplied(false);
    reset({ discountCode: "" });
  };

  const handleOrderSubmit = async () => {
    if (requestLoading) return;
    setDiscountError("");

    const result = await request({
      url: "/api/order",
      method: "POST",
    });

    // بررسی دقیق پاسخ خطا از بک‌اند با توجه به فرمت ارسالی
    if (!result?.success) {
      setDiscountError(result?.message || result?.error || "ثبت سفارش با خطا مواجه شد.");
      return;
    }
  if(result.success){
 
  router.push("/")
  }
    if (clearCart) {
      clearCart();
    }
  };

  if (cartLoading && !cart || cart.items.length === 0) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50" dir="rtl">
        <div className="text-center">
          <p className="text-xl font-black text-slate-600">سبد خرید شما خالی است</p>
          <a href="/products" className="mt-4 inline-block font-bold text-blue-600 hover:underline">
            بازگشت به فروشگاه
          </a>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0 || requestLoading ) {
    return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50" dir="rtl">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <CheckoutDesign
      cartItems={cartItems}
      subtotal={subtotal}
      discountAmount={discountAmount}
      shippingAmount={shippingAmount}
      payableAmount={payableAmount}
      isLoading={requestLoading}
      discountError={discountError}
      hasDiscountApplied={hasDiscountApplied}
      register={register}
      onSubmitDiscount={handleSubmit(handleApplyDiscount)}
      onResetDiscount={handleResetDiscount}
      onConfirmOrder={handleOrderSubmit}
    />
  );
}
