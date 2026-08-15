import { HiChevronDown, HiFunnel, HiArrowsUpDown } from "react-icons/hi2";

export default function AdminFilterUI({
  currentSort = "newest",
  currentStatus = "all",
  setSort = () => {},
  setStatus = () => {},
  pathname = "",
  isPending = false,
}) {
  const path = typeof pathname === "string" ? pathname : "";

  const getContextInfo = () => {
    if (path.includes("/products")) {
      return {
        label: "وضعیت محصولات",
        activeText: "محصولات فعال",
        inactiveText: "محصولات غیرفعال",
      };
    }

    if (path.includes("/categories")) {
      return {
        label: "وضعیت دسته‌بندی‌ها",
        activeText: "دسته‌بندی‌های فعال",
        inactiveText: "دسته‌بندی‌های غیرفعال",
      };
    }

    if (path.includes("/users")) {
      return {
        label: "وضعیت کاربران",
        activeText: "کاربران فعال",
        inactiveText: "کاربران غیرفعال",
      };
    }

    return {
      label: "وضعیت",
      activeText: "فعال",
      inactiveText: "غیرفعال",
    };
  };

  const context = getContextInfo();

  // کلاس‌های بهینه‌سازی شده و کاملاً واکنش‌گرا برای سلکت‌ها
  const baseSelectClass =
    "w-full appearance-none rounded-xl border border-gray-200 bg-white pl-10 pr-10 py-2.5 text-sm text-gray-700 shadow-sm outline-none transition-all duration-200 " +
    "hover:border-gray-300 hover:bg-gray-50/50 focus:border-blue-500 focus:ring-4 focus:ring-blue-100/50 " +
    "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400";

  return (
    <div
      className={`mb-6 flex flex-wrap items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-opacity duration-200 ${
        isPending ? "pointer-events-none opacity-60" : "opacity-100"
      }`}
    >
      {/* فیلتر وضعیت */}
      <div className="w-full sm:w-60">
        <label className="mb-2 flex items-center gap-1.5 text-xs font-medium text-gray-500">
          <HiFunnel className="h-3.5 w-3.5 text-gray-400" />
          {context.label}
        </label>
        <div className="relative">
          {/* آیکون وضعیت چپ‌چین */}
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
          </span>

          <select
            value={currentStatus}
            onChange={(e) => setStatus(e.target.value)}
            disabled={isPending}
            className={baseSelectClass}
          >
            <option value="all">همه موارد</option>
            <option value="active">{context.activeText}</option>
            <option value="inactive">{context.inactiveText}</option>
          </select>

          {/* آیکون بازشو چرخشی راست‌چین (React Icon) */}
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
            <HiChevronDown className="h-4 w-4 transition-transform duration-200" />
          </span>
        </div>
      </div>

      {/* فیلتر مرتب‌سازی */}
      <div className="w-full sm:w-60">
        <label className="mb-2 flex items-center gap-1.5 text-xs font-medium text-gray-500">
          <HiArrowsUpDown className="h-3.5 w-3.5 text-gray-400" />
          مرتب‌سازی بر اساس
        </label>
        <div className="relative">
          {/* آیکون مرتب‌سازی چپ‌چین */}
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
            <span>📊</span>
          </span>

          <select
            value={currentSort}
            onChange={(e) => setSort(e.target.value)}
            disabled={isPending}
            className={baseSelectClass}
          >
            <option value="newest">جدیدترین‌ها (تاریخ ایجاد)</option>
            <option value="oldest">قدیمی‌ترین‌ها (تاریخ ایجاد)</option>
            <option value="updated">آخرین بروزرسانی (تاریخ ویرایش)</option>
          </select>

          {/* آیکون بازشو چرخشی راست‌چین (React Icon) */}
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
            <HiChevronDown className="h-4 w-4 transition-transform duration-200" />
          </span>
        </div>
      </div>
    </div>
  );
}
