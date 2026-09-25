"use client"

import { useCart } from "@/context/cart/CartContext";
import { useState } from "react";
import { CartDesign } from "./CartDesign";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";


export default function CartLogic() {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity } = useCart();
  const [loadingItem, setLoadingItem] = useState(null);
 

  const decreasequantityProduct = async (id) => {
    setLoadingItem(id);
    await decreaseQuantity(id);
    setLoadingItem(null);
  };

  const increaseQuantityProduct = async (id) => {
    setLoadingItem(id);
    await increaseQuantity(id);
    setLoadingItem(null);
  };

  const removeFromCartProduct = async (id) => {
    setLoadingItem(id);
    await removeFromCart(id);
    setLoadingItem(null);
  };
  if (  !cart ) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-slate-600 font-sans" dir="rtl">
        <ShoppingBag className="w-16 h-16 text-slate-300" />
        <p className="font-medium text-lg">سبد خرید شما خالی است</p>
        <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl transition font-semibold text-sm">
          رفتن به صفحه اصلی
        </Link>
      </div>
    );
  }

  return (
    <CartDesign 
      cart={cart} 
      loadingItem={loadingItem}
      decreasequantityProduct={decreasequantityProduct} 
      increaseQuantityProduct={increaseQuantityProduct} 
      removeFromCartProduct={removeFromCartProduct} 
    />
  );
}