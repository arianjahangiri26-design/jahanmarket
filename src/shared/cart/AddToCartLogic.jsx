"use client";

import { useState } from "react";
import { useCart } from "@/context/cart/CartContext";
import { AddToCartButton } from "./AddToCartButton";
import { toast } from "@heroui/react";

export const AddToCartLogic = ({ productId }) => {
  const { addToCart } = useCart();

  const [loading, setLoading] = useState(false);
  const [buttonError, setButtonError] = useState(null);

  const handleAddToCart = async () => {
    // Prevent sending request without a valid product id.
    if (!productId) {
      setButtonError("شناسه محصول نامعتبر است");
      return;
    }

    try {
      setLoading(true);
      setButtonError(null);

      // Add one quantity of the selected product to cart.
      await addToCart(productId, 1);

toast.success("محصول به سبد خرید شما اضافه شد", {
  description: "می‌توانید از طریق سبد خرید، سفارش خود را نهایی کنید.",
});

      
    } catch (error) {
      // Show a clean fallback error if addToCart throws.
   toast.danger("ثبت سفارش با خطا مواجه شد", {
  description: "لطفاً دوباره تلاش کنید یا در صورت تداوم مشکل با پشتیبانی تماس بگیرید.",
});

    } finally {
      // Always stop loading, even if request fails.
      setLoading(false);
    }
  };

  return (
    <AddToCartButton
      loading={loading}
      error={buttonError}
      onAddToCart={handleAddToCart}
    />
  );
};
