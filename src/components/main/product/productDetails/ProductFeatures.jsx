// src/components/product/ProductFeatures.js

export default function ProductFeatures({ features = [] }) {
  if (!features.length) return null;

  return (
    <div className="mt-8 rounded-[32px] border border-blue-100 bg-white p-6 shadow-lg shadow-blue-100/40">
      <h2 className="mb-6 text-2xl font-extrabold text-slate-800">
        ویژگی‌های محصول
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {features.map((item, index) => (
          <div
            key={index}
            className="flex justify-between rounded-2xl bg-gradient-to-br from-blue-50 to-white px-4 py-3 shadow-sm"
          >
            <span className="text-slate-500 text-sm">{item.key}</span>
            <span className="font-semibold text-slate-800">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
