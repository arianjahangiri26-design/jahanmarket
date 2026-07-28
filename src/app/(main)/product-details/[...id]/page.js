import ProductDetailsLogic from "@/components/main/product/productDetails/logic/ProductDetailsLogic";

 
 export default async function ProductPage({ params }) {
 
  const resolvedParams = await params;

  // ۲. متناسب با نام فولدر شما (که id است)، آرایه را بیرون می‌کشیم
  const idArray = resolvedParams?.id;

  // ۳. اگر آیدی وجود نداشت، صفحه ۴۰۴ نشان داده شود
  if (!idArray || idArray.length === 0) {
    return <NotFound />;
  }

  // ۴. اولین بخش آرایه همان شناسه (ID) دیتابیس است
  const productId = idArray[0];
  
  return <ProductDetailsLogic id={productId} />;
}
