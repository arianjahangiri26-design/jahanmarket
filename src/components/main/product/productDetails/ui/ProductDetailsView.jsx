import Link from "next/link";
import { FaChevronLeft } from "react-icons/fa";
import ProductInfoCard from "./ProductInfoCard";
import CommentListLogic from "../../comment/get/CommentLogic";
import ProductFeatures from "./ProductFeatures";
import CommentFormLogic from "../../comment/create/CommentFormLogic";
import ProductGallery from "../ProductGallery/ProductGallery";

 
export default function ProductDetailsView({ product }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100/40 py-10">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="transition hover:text-blue-600">خانه</Link>
          <FaChevronLeft className="text-xs" />
          <Link href="/products" className="transition hover:text-blue-600">محصولات</Link>
          <FaChevronLeft className="text-xs" />
          <span className="font-medium text-slate-700">{product?.name}</span>
        </div>

        <div className="grid grid-cols-1 gap-8 rounded-2xl lg:grid-cols-2">
          <ProductGallery image={product?.imageProduct} title={product?.name} />
          <div className="space-y-6">
            <ProductInfoCard product={product} />
          </div>
        </div>

        <div className="mt-10 rounded-[32px] mb-25 mt-10 border border-blue-100 bg-white p-6 shadow-lg shadow-blue-100/40">
          <h2 className="mb-4 text-2xl font-extrabold text-slate-800">توضیحات محصول</h2>
          <p className="text-sm leading-8 text-slate-600">{product?.description}</p>
        </div>

        <ProductFeatures features={product?.features} />
       
        <CommentFormLogic productId={product?._id} />
        <CommentListLogic productId={product?._id} />
 
      </div>
    </div>
  );
}
