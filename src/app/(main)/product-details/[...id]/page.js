import { notFound } from "next/navigation";
import { resolveProductMetadata } from "@/lib/seo/product/product-page-seo";
import ProductDetailsLogic from "@/components/main/product/productDetails/logic/ProductDetailsLogic";
import ProductJsonLd from "@/components/seo/ProductJsonLd";

// ۱. تولید متادیتای سئو برای تگ <head>
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { metadata } = await resolveProductMetadata(resolvedParams);
  return metadata;
}

// ۲. رندر صفحه محصول
export default async function ProductPage({ params }) {
  const resolvedParams = await params;
  const { product, productId } = await resolveProductMetadata(resolvedParams);

  if (!product || !productId) {
    notFound();
  }

  return (
    <div>
      {/* اسکیما استراکچرد دیتا برای گوگل */}
      <ProductJsonLd product={product} />

      {/* پاس دادن اطلاعات سرور برای نمایش فوری بدون لودینگ اضافه */}
      <ProductDetailsLogic id={productId} initialProduct={product} />
    </div>
  );
}
