"use client";

import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

const DEFAULT_CART = { items: [], discountPrice: 0 };

const normalizeCart = (data) => {
  if (!data || !Array.isArray(data.items)) {
    return DEFAULT_CART;
  }

  return {
    ...DEFAULT_CART,
    ...data,
    items: data.items,
  };
};

const getErrorMessage = (errorData, fallbackMessage) => {
  return errorData?.error || errorData?.message || fallbackMessage;
};

const getItemProductId = (item) => {
  if (!item) return null;
  return item.productId || item.product?._id || item.product || null;
};

export function CartProvider({ children }) {
  const [cart, setCart] = useState(DEFAULT_CART);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingItem, setUpdatingItem] = useState(null);

  useEffect(() => {
    async function fetchCart() {
      try {
        setError(null);

        const res = await fetch("/api/cart");

        // Treat unauthorized users as empty cart without noisy UI error
        if (res.status === 401) {
          setCart(DEFAULT_CART);
          return;
        }

        if (!res.ok) {
          const errorData = await res.json().catch(() => null);
          setError(getErrorMessage(errorData, "Failed to fetch cart"));
          setCart(DEFAULT_CART);
          return;
        }

        const data = await res.json();
        setCart(normalizeCart(data));
 

      } catch (error) {
        setError(error?.message || "Failed to fetch cart");
        setCart(DEFAULT_CART);
      } finally {
        setLoading(false);
      }
    }

    fetchCart();
  }, []);

  async function updateCart() {
    try {
      const res = await fetch("/api/cart");

      if (res.status === 401) {
        setCart(DEFAULT_CART);
        return;
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        setError(getErrorMessage(errorData, "خطا در بروزرسانی سبد خرید"));
        return;
      }

      const updatedCart = await res.json();
      setCart(normalizeCart(updatedCart));
    } catch (error) {
      setError(error?.message || "خطا در بروزرسانی سبد خرید");
    }
  }

  async function addToCart(productId, quantity = 1) {
    try {
      setUpdatingItem(productId);
      setError(null);

      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        setError(
          getErrorMessage(
            errorData,
            "مشکلی در اضافه کردن به سبد خرید پیش آمده است"
          )
        );
        return;
      }

      await updateCart();
    } catch (error) {
      setError("مشکلی در اضافه کردن به سبد خرید پیش آمده است");
    } finally {
      setUpdatingItem(null);
    }
  }

  async function decreaseQuantity(productId) {
    try {
      setError(null);

      // Support both populated and flat cart item shapes
      const item = cart.items.find((item) => {
        return getItemProductId(item)?.toString() === productId?.toString();
      });

      if (!item) {
        setError("محصول مورد نظر یافت نشد");
        return;
      }

      setUpdatingItem(productId);

      if (item.quantity <= 1) {
        await removeFromCart(productId);
        return;
      }

      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: -1 }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        setError(
          getErrorMessage(errorData, "مشکلی در کاهش تعداد پیش آمده است")
        );
        return;
      }

      await updateCart();
    } catch (error) {
      setError("مشکلی در کاهش تعداد پیش آمده است");
    } finally {
      setUpdatingItem(null);
    }
  }

  async function increaseQuantity(productId) {
    try {
      setError(null);

      const item = cart.items.find((item) => {
        return getItemProductId(item)?.toString() === productId?.toString();
      });

      if (!item) {
        setError("محصول مورد نظر یافت نشد");
        return;
      }

      const stock = item.product?.stock;

      // If stock exists, prevent increasing beyond inventory
      if (typeof stock === "number" && item.quantity >= stock) {
        setError("موجودی کافی نیست");
        return;
      }

      setUpdatingItem(productId);
      await addToCart(productId, 1);
    } catch (error) {
      setError("مشکلی در افزایش تعداد پیش آمده است");
    } finally {
      setUpdatingItem(null);
    }
  }

  async function removeFromCart(productId) {
    try {
      setUpdatingItem(productId);
      setError(null);

      const res = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        setError(
          getErrorMessage(errorData, "مشکلی در حذف محصول پیش آمده است")
        );
        return;
      }

      await updateCart();
    } catch (error) {
      setError("مشکلی در حذف محصول پیش آمده است");
    } finally {
      setUpdatingItem(null);
    }
  }

  function clearCart() {
    setCart(DEFAULT_CART);
    setError(null);
    setUpdatingItem(null);
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        error,
        loading,
        updatingItem,
        addToCart,
        decreaseQuantity,
        increaseQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
