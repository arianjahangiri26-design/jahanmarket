// src/components/checkout/CheckoutLogic.jsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useCart } from "@/context/cart/CartContext";
import { useFetch } from "@/hooks/crud/UseCrud";
 
import { useRouter } from "next/navigation";
import { toast } from "@heroui/react";
import { CheckoutDesign } from "../ui/checkoutDesign";
 
export function CheckoutLogic() {
  const { cart, loading: cartLoading, clearCart } = useCart();
  const { request, loading: requestLoading } = useFetch();

  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountError, setDiscountError] = useState("");
  const [hasDiscountApplied, setHasDiscountApplied] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState("");

  const router = useRouter();
  const { register, handleSubmit, setValue, reset } = useForm({
    defaultValues: { discountCode: "" },
  });

  // Sync discount states with context database values
  useEffect(() => {
    const savedDiscount = Number(cart?.discountPrice) || 0;
    setDiscountAmount(savedDiscount);
    setHasDiscountApplied(savedDiscount > 0);
    setValue("discountCode", cart?.discountCode || "");
  }, [cart, setValue]);

  const cartItems = cart?.items || [];

  // Calculate total price of products in cart
  const subtotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
      const price = Number(item?.product?.price || 0);
      const quantity = Number(item?.quantity || 0);
      return total + price * quantity;
    }, 0);
  }, [cartItems]);

  // Determine delivery shipping cost (Free if subtotal is over 1,000,000 tomans)
  const shippingAmount = useMemo(() => {
    if (subtotal === 0 || subtotal >= 1000000) return 0;
    return 50000;
  }, [subtotal]);

  // Compute total payable amount
  const payableAmount = useMemo(() => {
    return Math.max(subtotal - discountAmount + shippingAmount, 0);
  }, [subtotal, discountAmount, shippingAmount]);

  // Handle coupon validation request
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

  // Reset coupon state
  const handleResetDiscount = () => {
    setDiscountAmount(0);
    setDiscountError("");
    setHasDiscountApplied(false);
    reset({ discountCode: "" });
  };

  // Handle final checkout and order confirmation
  const handleOrderSubmit = async () => {
    if (requestLoading) return;
    
    // Ensure an address has been selected
    if (!selectedAddressId) {
      toast.error("لطفاً آدرس تحویل سفارش خود را مشخص کنید.");
      return;
    }

    setDiscountError("");

    const result = await request({
      url: "/api/order",
      method: "POST",
      data: { addressId: selectedAddressId },
    });

    if (!result?.success) {
      setDiscountError(result?.message || result?.error || "ثبت سفارش با خطا مواجه شد.");
      return;
    }

    if (result.success) {
      toast.success("سفارش شما با موفقیت ثبت شد", {
        description: "پس از بررسی، مراحل پردازش و ارسال آغاز خواهد شد.",
      });

      if (clearCart) {
        clearCart();
      }
      
      router.push("/");
    }
  };

  if (cartLoading && !cart) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50" dir="rtl">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
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
      selectedAddressId={selectedAddressId}
      onSelectAddress={setSelectedAddressId}
    />
  );
}
