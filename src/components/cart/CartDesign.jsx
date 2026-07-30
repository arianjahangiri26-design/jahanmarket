

import React from 'react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function CartDesign({ 
  cart, 
  loadingItem, 
  decreasequantityProduct, 
  increaseQuantityProduct, 
  removeFromCartProduct 
}) {
  
  const totalPrice = cart?.items?.reduce((total, item) => {
    const price = item?.product?.price || 0;
    const qty = item?.quantity || 0;
    return total + (price * qty);
  }, 0) || 0;

  const totalItemsCount = cart?.items?.reduce((acc, item) => acc + (item?.quantity || 0), 0) || 0;
  
 
  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 font-sans" dir="rtl">
      <div className="max-w-7xl mx-auto">
    
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-blue-400">سبد خرید شما</h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                دارای {cart?.items?.length || 0} کالا در سبد خرید
              </p>
            </div>
          </div>
          
          <Link href="/" className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition">
            <span>بازگشت به فروشگاه</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          <div className="lg:col-span-2 space-y-4">
            {cart?.items && cart.items.map((item) => {
              // تغییر کلیدی: استخراج دقیق آیدی محصول (Product ID)
              const productId = item?.product?._id; 
              if (!productId) return null;

              const isItemLoading = loadingItem === productId;

              return (
                <div 
                  key={productId} 
                  className={`bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-4 sm:gap-6 items-center justify-between hover:shadow-md transition duration-300 ${
                    isItemLoading ? 'opacity-60 pointer-events-none' : ''
                  }`}
                >
                  {/* تصویر محصول */}
                  <div className="w-24 h-24 sm:w-28 sm:h-28 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0 relative group">
                    {item?.product?.imageProduct ? (
                      <Image 
                        src={item.product.imageProduct} 
                        alt={item.product.name || 'محصول'} 
                        fill
                        sizes="(max-width: 112px) 100vw, 112px"
                        className="object-cover group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                        تصویر موجود نیست
                      </div>
                    )}
                  </div>

                  {/* مشخصات محصول */}
                  <div className="flex-1 text-center sm:text-right min-w-0">
                    <span className="inline-block bg-blue-50 text-blue-600 text-xs font-semibold px-2.5 py-1 rounded-full mb-2">
                      {item?.product?.category?.name || "بدون دسته‌بندی"}
                    </span>
                    <h3 className="font-bold text-slate-800 text-sm sm:text-base line-clamp-2 leading-relaxed">
                      {item?.product?.name || "بدون نام"}
                    </h3>
                    <div className="mt-3 text-xs text-slate-400 font-medium">
                      {item?.product?.stock ? `موجودی: ${item.product.stock} عدد` : "ناموجود"}
                    </div>
                  </div>

                  {/* بخش قیمت و کنترل */}
                  <div className="flex flex-col sm:items-end justify-between gap-4 w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-100">
                    <div className="text-center sm:text-left text-lg font-extrabold text-blue-600">
                      { item?.product?.price.toLocaleString()} تومان
                    </div>

                    <div className="flex items-center justify-center sm:justify-end gap-3">
                      <button 
                        onClick={() => removeFromCartProduct(productId)}
                        disabled={isItemLoading}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition disabled:opacity-50"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>

                      <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl p-1">
                        <button 
                          onClick={() => increaseQuantityProduct(productId)}
                          disabled={(item?.quantity >= (item?.product?.stock || 0)) || isItemLoading}
                          className="p-1.5 rounded-lg bg-white text-slate-700 hover:bg-blue-600 hover:text-white transition disabled:opacity-40"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        
                        <span className="px-4 font-bold text-slate-800 text-sm w-8 text-center">
                          {item?.quantity || 0}
                        </span>

                        <button 
                          onClick={() => decreasequantityProduct(productId)}
                          disabled={(item?.quantity <= 1) || isItemLoading}
                          className="p-1.5 rounded-lg bg-white text-slate-700 hover:bg-blue-600 hover:text-white transition disabled:opacity-40"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
 
          {/* خلاصه سفارش */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 left-0 h-1.5 bg-blue-600"></div>
              <h3 className="font-bold text-slate-800 text-base mb-6 pb-3 border-b border-slate-100">
                خلاصه سفارش
              </h3>

              <div className="space-y-4 text-sm mb-6">
                <div className="flex justify-between text-slate-500">
                  <span>قیمت کالاها ({totalItemsCount} عدد)</span>
                  <span className="font-semibold text-slate-800">{totalPrice.toLocaleString()} تومان</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>هزینه ارسال</span>
                  <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium">رایگان</span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-5 mb-6 flex justify-between items-center">
                <span className="font-bold text-slate-800 text-base">مبلغ قابل پرداخت:</span>
                <span className="font-black text-xl text-blue-600">{totalPrice.toLocaleString()} تومان</span>
              </div>

              <Link href={"/checkout"} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-2xl transition shadow-lg shadow-blue-600/20 text-center text-sm flex items-center justify-center gap-2">
                <span>ثبت سفارش</span>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
