 
import Image from "next/image";
import { Card, CardBody, Chip } from "@heroui/react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

export  function productSellerTable({ data, onEdit, onDelete }) {
  // تابعی برای دسترسی به مقادیر تو در تو (مثل category.name)
  const getValue = (obj, path) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  return (
    <Card className="rounded-3xl border border-slate-100 bg-white shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
      <CardBody className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-100">
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">تصویر</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">نام محصول</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">دسته‌بندی</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">قیمت</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">موجودی</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">وضعیت</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.length > 0 ? (
                data.map((product) => (
                  <tr key={product._id} className="hover:bg-amber-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-slate-100 shadow-sm">
                        <Image 
                          src={product.imageProduct || "/placeholder.png"} 
                          alt={product.name} 
                          fill 
                          className="object-cover" 
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-700">{product.name}</td>
                    <td className="px-6 py-4 text-slate-500">{getValue(product, "category.name") || "-"}</td>
                    <td className="px-6 py-4 font-medium text-slate-600">
                      {product.price?.toLocaleString("fa-IR")} <span className="text-[10px] text-slate-400">تومان</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-lg text-xs font-bold ${product.stock > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}>
                        {product.stock} عدد
                      </span>
                    </td>
                    <td className="px-6 py-4">
                       <Chip 
                        size="sm" 
                        variant="flat" 
                        color={product.isActive ? "success" : "default"}
                        className="font-bold"
                       >
                         {product.isActive ? "فعال" : "غیرفعال"}
                       </Chip>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <button 
                          onClick={() => onEdit(product)}
                          className="p-2 rounded-lg text-amber-600 hover:bg-amber-100 transition-all"
                          title="ویرایش"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button 
                          onClick={() => onDelete(product._id)}
                          className="p-2 rounded-lg text-rose-500 hover:bg-rose-100 transition-all"
                          title="حذف"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-slate-400">محصولی یافت نشد.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  );
}
