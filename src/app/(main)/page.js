import HeroBannerLogic from "@/components/main/banner/hero-banner/logic/HeroBannerLogic";
import ByCategoriesLogic from "@/components/main/by-category/ByCategoryLogic";
import { SoldProductsLogic } from "@/components/main/by-sold-products/logic/SoldProductsLogic";
import ProductShowcaseLogic from "@/components/main/product/showcase/logic/ProductShowcaseLogic";
import BannerPlacementLogic from "@/components/main/banner/placement/logic/BannerPlacementLogic";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8 lg:px-6">
      <div className="space-y-12">
        {/* ۱. اسلایدر اصلی بالای صفحه */}
        <section aria-label="بنرهای تبلیغاتی اصلی">
          <HeroBannerLogic />
        </section>

        {/* ۲. دسته‌بندی محصولات */}
        <section aria-label="دسته‌بندی‌های کالا">
          <ByCategoriesLogic />
        </section>

        {/* ۳. بنر تبلیغاتی بعد از دسته‌بندی‌ها */}
        <section aria-label="بنر تبلیغاتی دسته‌بندی‌ها">
          <BannerPlacementLogic
            position="after-categories"
            className="my-4"
          />
        </section>

        {/* ۴. جدیدترین محصولات */}
        <section
          aria-label="جدیدترین محصولات"
          className="border-t border-slate-200/80 pt-8"
        >
          <ProductShowcaseLogic
            title="جدیدترین محصولات فروشگاه"
            subtitle="انتخاب و بررسی بهترین کالاهای دیجیتال و غیر دیجیتال به همراه تخفیف‌های ویژه روزانه"
            href="/products"
          />
        </section>

        {/* ۵. بنر تبلیغاتی بعد از جدیدترین محصولات */}
        <section aria-label="بنر تبلیغاتی محصولات جدید">
          <BannerPlacementLogic
            position="after-newest-products"
            className="my-4"
          />
        </section>

        {/* ۶. پرفروش‌ترین محصولات */}
        <section
          aria-label="محصولات فروخته شده"
          className="border-t border-slate-200/80 pt-8"
        >
          <SoldProductsLogic />
        </section>

        {/* ۷. بنر تبلیغاتی پایانی */}
        <section aria-label="بنر تبلیغاتی پایانی">
          <BannerPlacementLogic
            position="footer-banner"
            className="my-4"
          />
        </section>
      </div>
    </div>
  );
}
