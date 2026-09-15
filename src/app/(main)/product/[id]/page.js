import ProductDetailsLogic from "@/components/main/product/productDetails/ProductDetailsLogic";

 
export default async function ProductPage({ params }) {
  const { id } = await params;

  return <ProductDetailsLogic id={id} />;
}
