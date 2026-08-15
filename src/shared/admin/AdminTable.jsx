"use client";

/**
 * Reusable Admin Table
 * Can be used across the entire admin panel
 * Supports dynamic columns, nested paths (e.g., category.title), images, and actions
 */

// تابع کمکی برای خواندن فیلدهای تودرتو مثل category.title
const resolvePath = (object, path) => {
  return path.split('.').reduce((acc, part) => acc && acc[part], object);
};

export default function AdminTable({ columns = [], data = [], actions }) {
  
  // بررسی اینکه آیا فیلد یک مسیر عکس است یا خیر
  const isImage = (val) => {
    if (typeof val !== "string") return false;
    return val.startsWith("/") || val.startsWith("http://") || val.startsWith("https://");
  };

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-slate-800 bg-slate-900">
      <table className="w-full text-sm text-right text-slate-300">
        
        {/* Table Head */}
        <thead className="bg-slate-800 text-slate-200">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-6 py-4 font-medium text-right"
              >
                {col.label}
              </th>
            ))}
            {actions && <th className="px-6 py-4 text-right">عملیات</th>}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-slate-800">
          {data?.map((row) => {
            return (
              <tr
                key={row._id}
                className="hover:bg-slate-800/50 transition"
              >
                {columns.map((col) => {
                  const val = resolvePath(row, col.key);
                  
                  return (
                    <td key={col.key} className="px-6 py-4 align-middle">
                      {isImage(val) ? (
                        <div className="h-12 w-12 overflow-hidden rounded-lg border border-slate-700 bg-slate-800">
                          <img
                            src={val}
                            alt="تصویر"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : typeof val === "boolean" ? (
                        val ? (
                          <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
                            فعال
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-md bg-rose-500/10 px-2 py-1 text-xs font-medium text-rose-400 ring-1 ring-inset ring-rose-500/20">
                            غیرفعال
                          </span>
                        )
                      ) : (
                        val || "-"
                      )}
                    </td>
                  );
                })}

                {actions && (
                  <td className="px-6 py-4 align-middle">
                    <div className="flex items-center gap-3">
                      {actions(row)}
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>

      </table>
    </div>
  );
}
