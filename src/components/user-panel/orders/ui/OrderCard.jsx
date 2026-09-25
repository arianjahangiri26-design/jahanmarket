import {
  CalendarDays,
  MapPin,
  Package,
  ShoppingBag,
} from "lucide-react";

const DEFAULT_PRODUCT_IMAGE =
  "https://placehold.co/400x400/eff6ff/1d4ed8?text=JahanMarket";

const STATUS_STYLES = {
  "در انتظار پرداخت": "border-amber-200 bg-amber-50 text-amber-700",
  "پرداخت شده": "border-emerald-200 bg-emerald-50 text-emerald-700",
  "ارسال شده": "border-blue-200 bg-blue-50 text-blue-700",
  "تحویل داده شده": "border-green-200 bg-green-50 text-green-700",
  "لغو شده": "border-rose-200 bg-rose-50 text-rose-700",
};

const formatPrice = (value) => {
  return `${Number(value || 0).toLocaleString("fa-IR")} تومان`;
};

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

const getAddressText = (address) => {
  if (!address) {
    return "آدرس ثبت نشده است";
  }

  return (
    [
      address.province,
      address.city,
      address.fullAddress,
      address.plaque,
    ]
      .filter(Boolean)
      .join(" - ") || "آدرس ثبت نشده است"
  );
};

const getStatusClass = (status) => {
  return (
    STATUS_STYLES[status] ||
    "border-slate-200 bg-slate-100 text-slate-700"
  );
};

const getProductImage = (product) => {
  return (
    product?.image ||
    product?.images?.[0] ||
    DEFAULT_PRODUCT_IMAGE
  );
};

const getItemsCount = (items) => {
  return items.reduce((total, item) => {
    return total + Number(item?.quantity || 0);
  }, 0);
};

function OrderItem({ item, index }) {
  const product = item?.product || {};
  const productName = product?.name || `محصول ${index + 1}`;

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3 sm:gap-4">
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

        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500">
          <span>
            تعداد: {Number(item?.quantity || 0).toLocaleString("fa-IR")}
          </span>

          <span>
            قیمت واحد:{" "}
            {formatPrice(item?.price || product?.price)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function OrderCard({ order }) {
  const orderId = String(order?._id || order?.id || "unknown");
  const items = Array.isArray(order?.items) ? order.items : [];
  const status = order?.status || "نامشخص";

  return (
    <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
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
              {getItemsCount(items).toLocaleString("fa-IR")} کالا
            </span>
          </div>
        </div>

        <div className="flex flex-col items-start gap-3 md:items-end">
          <span
            className={`rounded-full border px-3 py-1.5 text-xs font-bold ${getStatusClass(
              status
            )}`}
          >
            {status}
          </span>

          <p className="text-xl font-black text-slate-900">
            {formatPrice(order?.finalPrice ?? order?.totalPrice)}
          </p>
        </div>
      </div>

      <div className="space-y-5 p-5 sm:p-6">
        <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
          <MapPin
            size={18}
            className="mt-0.5 shrink-0 text-blue-600"
          />

          <div>
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
            <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
              جزئیات محصولات این سفارش موجود نیست.
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
