import {
  AlertCircle,
  CalendarDays,
  MapPin,
  Package,
  RefreshCw,
  ShoppingBag,
  UserRound,
  Wallet,
} from "lucide-react";

const DEFAULT_PRODUCT_IMAGE =
  "https://placehold.co/400x400/eff6ff/1d4ed8?text=JahanMarket";

const STATUS_STYLES = {
  "در انتظار پرداخت":
    "border-amber-200 bg-amber-50 text-amber-700",
  "پرداخت شده":
    "border-emerald-200 bg-emerald-50 text-emerald-700",
  "لغو شده":
    "border-rose-200 bg-rose-50 text-rose-700",
};

const SUMMARY_COLORS = {
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

/**
 * Formats a numeric value as Iranian currency.
 */
const formatPrice = (value) => {
  const number = Number(value || 0);

  return `${number.toLocaleString("fa-IR")} تومان`;
};

/**
 * Formats an ISO date for Persian users.
 */
const formatDate = (value) => {
  if (!value) {
    return "تاریخ نامشخص";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "تاریخ نامشخص";
  }

  return new Intl.DateTimeFormat("fa-IR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

/**
 * Returns a stable order ID.
 */
const getOrderId = (order) => {
  return String(order?._id || order?.id || "unknown-order");
};

/**
 * Returns the first available product image.
 */
const getProductImage = (product) => {
  return (
    product?.image ||
    product?.images?.[0] ||
    DEFAULT_PRODUCT_IMAGE
  );
};

/**
 * Creates a readable address string.
 */
const getAddressText = (address) => {
  if (!address) {
    return "آدرس ثبت نشده است";
  }

  return [
    address.province,
    address.city,
    address.fullAddress,
    address.plaque,
  ]
    .filter(Boolean)
    .join(" - ") || "آدرس ثبت نشده است";
};

/**
 * Calculates the total number of items in an order.
 */
const getOrderItemsCount = (items) => {
  if (!Array.isArray(items)) {
    return 0;
  }

  return items.reduce((total, item) => {
    return total + Number(item?.quantity || 0);
  }, 0);
};

/**
 * Returns the appropriate status class.
 */
const getStatusClassName = (status) => {
  return (
    STATUS_STYLES[status] ||
    "border-slate-200 bg-slate-100 text-slate-700"
  );
};

/**
 * Returns the best available user display name.
 */
const getUserDisplayName = (user) => {
  return (
    user?.name ||
    user?.email ||
    "کاربر گرامی"
  );
};

function OrdersLoading() {
  return (
    <section className="space-y-6" dir="rtl">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-5">
        <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
        <div className="h-9 w-44 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-full max-w-xl animate-pulse rounded bg-slate-200" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <div
            key={index}
            className="h-32 animate-pulse rounded-3xl border border-slate-200 bg-slate-100"
          />
        ))}
      </div>

      <div className="space-y-4">
        {Array.from({ length: 3 }, (_, index) => (
          <div
            key={index}
            className="h-64 animate-pulse rounded-3xl border border-slate-200 bg-slate-100"
          />
        ))}
      </div>
    </section>
  );
}

function EmptyOrders() {
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

function SummaryCard({ title, value, icon: Icon, color }) {
  const styles = SUMMARY_COLORS[color] || SUMMARY_COLORS.blue;

  return (
    <div
      className={`rounded-3xl border p-5 shadow-sm ${styles.wrapper}`}
      dir="rtl"
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

function OrderItem({ item, index }) {
  const product = item?.product || {};
  const productName = product?.name || `محصول ${index + 1}`;

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-3 sm:gap-4">
      <img
        src={getProductImage(product)}
        alt={productName}
        loading="lazy"
        className="h-16 w-16 shrink-0 rounded-2xl object-cover sm:h-20 sm:w-20"
      />

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-black text-slate-800 sm:text-base">
          {productName}
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
          <span>
            تعداد:{" "}
            {Number(item?.quantity || 0).toLocaleString("fa-IR")}
          </span>

          <span>
            قیمت واحد:{" "}
            {formatPrice(item?.price || product?.price || 0)}
          </span>
        </div>
      </div>
    </div>
  );
}

function OrderCard({ order }) {
  const orderId = getOrderId(order);
  const items = Array.isArray(order?.items) ? order.items : [];
  const status = order?.status || "در انتظار پرداخت";

  return (
    <article
      className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-lg"
      dir="rtl"
    >
      <div className="flex flex-col gap-5 border-b border-slate-100 p-5 sm:p-6 md:flex-row md:items-start md:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 text-sm font-black text-slate-800">
              <Package size={17} className="text-blue-600" />
              سفارش
            </span>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-600">
              #{orderId.slice(-8)}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <CalendarDays size={14} />
              {formatDate(order?.createdAt)}
            </span>

            <span className="flex items-center gap-1.5">
              <ShoppingBag size={14} />
              {getOrderItemsCount(items).toLocaleString("fa-IR")} کالا
            </span>
          </div>
        </div>

        <div className="flex flex-col items-start gap-3 md:items-end">
          <span
            className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-bold ${getStatusClassName(
              status
            )}`}
          >
            {status}
          </span>

          <p className="text-xl font-black text-slate-900">
            {formatPrice(order?.finalPrice ?? order?.totalPrice ?? 0)}
          </p>
        </div>
      </div>

      <div className="space-y-5 p-5 sm:p-6">
        <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
          <MapPin className="mt-0.5 shrink-0 text-blue-600" size={18} />

          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-500">
              آدرس تحویل
            </p>

            <p className="mt-1 text-sm leading-6 text-slate-700">
              {getAddressText(order?.address)}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-800">
              محصولات سفارش
            </h3>

            <span className="text-xs text-slate-500">
              {items.length.toLocaleString("fa-IR")} محصول
            </span>
          </div>

          {items.length > 0 ? (
            <div className="space-y-3">
              {items.map((item, index) => (
                <OrderItem
                  key={`${orderId}-${item?.product?._id || index}`}
                  item={item}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
              جزئیات محصولات این سفارش موجود نیست.
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default function OrdersDashboard({
  user,
  orders = [],
  loading = false,
  serverError = "",
  summary,
  onRetry,
}) {
  if (loading && orders.length === 0) {
    return <OrdersLoading />;
  }

  const displayName = getUserDisplayName(user);

  return (
    <section className="space-y-6" dir="rtl">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
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
                سفارش‌های {displayName}
              </h1>

              {user?.email ? (
                <p className="mt-1 text-xs text-slate-500">
                  {user.email}
                </p>
              ) : null}
            </div>
          </div>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
            در این بخش می‌توانید سفارش‌های ثبت‌شده، وضعیت، مبلغ و جزئیات خریدهای
            خود را مشاهده کنید.
          </p>
        </div>

        <button
          type="button"
          onClick={onRetry}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={17}
            className={loading ? "animate-spin" : ""}
          />
          بروزرسانی سفارش‌ها
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          title="تعداد سفارش‌ها"
          value={Number(summary?.totalOrders || 0).toLocaleString("fa-IR")}
          icon={ShoppingBag}
          color="blue"
        />

        <SummaryCard
          title="مجموع خرید"
          value={formatPrice(summary?.totalSpent || 0)}
          icon={Wallet}
          color="emerald"
        />

        <SummaryCard
          title="سفارش‌های در انتظار پرداخت"
          value={Number(summary?.pendingCount || 0).toLocaleString("fa-IR")}
          icon={Package}
          color="amber"
        />
      </div>

      {serverError ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-5 text-red-700">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 shrink-0" size={20} />

            <div>
              <p className="font-black">
                خطا در دریافت سفارش‌ها
              </p>

              <p className="mt-1 text-sm leading-6">
                {serverError}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {!serverError && orders.length === 0 && !loading ? (
        <EmptyOrders />
      ) : null}

      {!serverError && orders.length > 0 ? (
        <div className="space-y-5">
          {orders.map((order) => (
            <OrderCard key={getOrderId(order)} order={order} />
          ))}
        </div>
      ) : null}
    </section>
  );
}
