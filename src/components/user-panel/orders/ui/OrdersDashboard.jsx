import OrdersLoading from "@/lib/loading/skeleton/user-panel/order/OrdersLoading";
import {
  AlertCircle,
  RefreshCw,
  ShoppingBag,
  UserRound,
  Wallet,
} from "lucide-react";
import OrderCard from "./OrderCard";

 
 
const SUMMARY_STYLES = {
  blue: {
    wrapper: "border-blue-100 bg-blue-50/70",
    title: "text-blue-700",
    icon: "text-blue-600",
  },

  emerald: {
    wrapper: "border-emerald-100 bg-emerald-50/70",
    title: "text-emerald-700",
    icon: "text-emerald-600",
  },

  amber: {
    wrapper: "border-amber-100 bg-amber-50/70",
    title: "text-amber-700",
    icon: "text-amber-600",
  },
};

function formatPrice(value) {
  return `${Number(value || 0).toLocaleString("fa-IR")} تومان`;
}

function getUserName(user) {
  return user?.name || user?.email || "کاربر گرامی";
}

function SummaryCard({ title, value, icon: Icon, color }) {
  const styles = SUMMARY_STYLES[color] || SUMMARY_STYLES.blue;

  return (
    <div
      className={`rounded-3xl border p-5 shadow-sm ${styles.wrapper}`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className={`text-sm font-bold ${styles.title}`}>
          {title}
        </span>

        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm">
          <Icon size={20} className={styles.icon} />
        </div>
      </div>

      <p className="mt-5 text-2xl font-black text-slate-900">
        {value}
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div
      className="rounded-[2rem] border border-dashed border-slate-300 bg-gradient-to-br from-slate-50 to-blue-50/50 px-6 py-16 text-center"
      dir="rtl"
    >
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-slate-400 shadow-sm">
        <ShoppingBag size={38} strokeWidth={1.7} />
      </div>

      <h2 className="mt-6 text-xl font-black text-slate-800">
        هنوز سفارشی ثبت نشده است
      </h2>

      <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-500">
        بعد از ثبت اولین خرید، اطلاعات سفارش و وضعیت آن در این بخش نمایش داده
        می‌شود.
      </p>
    </div>
  );
}

function ErrorState({ message, onRetry, loading }) {
  return (
    <div
      className="rounded-3xl border border-red-200 bg-red-50 p-5 text-red-700"
      dir="rtl"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <AlertCircle
            size={20}
            className="mt-0.5 shrink-0"
          />

          <div>
            <p className="font-black">خطا در دریافت سفارش‌ها</p>

            <p className="mt-1 text-sm leading-6">
              {message || "دریافت سفارش‌ها با خطا مواجه شد."}
            </p>
          </div>
        </div>

        {typeof onRetry === "function" && (
          <button
            type="button"
            onClick={onRetry}
            disabled={loading}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-bold text-red-700 shadow-sm transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={15}
              className={loading ? "animate-spin" : ""}
            />

            تلاش مجدد
          </button>
        )}
      </div>
    </div>
  );
}

export default function OrdersDashboard({
  user,
  orders = [],
  loading = false,
  serverError = "",
  summary = {},
  onRetry,
}) {
  const safeOrders = Array.isArray(orders) ? orders : [];
  const userName = getUserName(user);

  if (loading && safeOrders.length === 0) {
    return <OrdersLoading />;
  }

  return (
    <section className="space-y-6" dir="rtl">
      <header className="flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-black tracking-[0.2em] text-blue-600">
            USER PANEL
          </p>

          <div className="mt-3 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <UserRound size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-black text-slate-900 sm:text-3xl">
                سفارش‌های {userName}
              </h1>

              {user?.email && (
                <p className="mt-1 text-xs text-slate-500">
                  {user.email}
                </p>
              )}
            </div>
          </div>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
            در این بخش می‌توانید سفارش‌های ثبت‌شده، مبلغ و جزئیات خریدهای خود
            را مشاهده کنید.
          </p>
        </div>

        <button
          type="button"
          onClick={onRetry}
          disabled={loading || typeof onRetry !== "function"}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={17}
            className={loading ? "animate-spin" : ""}
          />

          بروزرسانی سفارش‌ها
        </button>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          title="تعداد سفارش‌ها"
          value={Number(
            summary?.totalOrders ?? safeOrders.length
          ).toLocaleString("fa-IR")}
          icon={ShoppingBag}
          color="blue"
        />

        <SummaryCard
          title="مجموع خرید"
          value={formatPrice(summary?.totalSpent)}
          icon={Wallet}
          color="emerald"
        />

        <SummaryCard
          title="در انتظار پرداخت"
          value={Number(
            summary?.pendingCount || 0
          ).toLocaleString("fa-IR")}
          icon={ShoppingBag}
          color="amber"
        />
      </div>

      {serverError && (
        <ErrorState
          message={serverError}
          onRetry={onRetry}
          loading={loading}
        />
      )}

      {!serverError && safeOrders.length === 0 && <EmptyState />}

      {!serverError && safeOrders.length > 0 && (
        <div className="space-y-5">
          {safeOrders.map((order, index) => (
            <OrderCard
              key={String(order?._id || order?.id || index)}
              order={order}
            />
          ))}
        </div>
      )}

      {!serverError && loading && safeOrders.length > 0 && (
        <div className="flex items-center justify-center gap-2 py-4 text-sm text-slate-500">
          <RefreshCw
            size={16}
            className="animate-spin"
          />

          در حال بروزرسانی سفارش‌ها...
        </div>
      )}
    </section>
  );
}
