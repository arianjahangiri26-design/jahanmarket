"use client";

import HeroBannerLogic from "@/components/main/banner/hero-banner/logic/HeroBannerLogic";
import ByCategoriesLogic from "@/components/main/by-category/ByCategoryLogic";
import ProductShowcaseLogic from "@/components/main/product/showcase/logic/ProductShowcaseLogic";

 
 
 
export default function HomePage() {
  return (
    <section className="container mx-auto px-4 py-8 lg:px-6">
      <div className="space-y-12">
        {/* Hero Banner */}
        <div>
          <HeroBannerLogic />
        </div>

        {/* Categories Section */}
        <div>
          <ByCategoriesLogic />
        </div>

        {/* Product Showcase Section */}
        <div className="border-t border-slate-100 pt-8">
          <ProductShowcaseLogic
            title="جدیدترین محصولات فروشگاه"
            subtitle="انتخاب و بررسی بهترین کالاهای دیجیتال و غیر دیجیتال به همراه تخفیف‌های ویژه روزانه"
            href="/products"
          />
        </div>
      </div>
    </section>
  );
}
