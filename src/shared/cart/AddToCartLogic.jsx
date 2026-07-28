"use client";

import { useState } from "react";
import { useCart } from "@/context/cart/CartContext";
import { AddToCartButton } from "./AddToCartButton";

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
    } catch (error) {
      // Show a clean fallback error if addToCart throws.
      setButtonError(
        
          "مشکلی در افزودن محصول به سبد خرید پیش آمده است"
      );
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
