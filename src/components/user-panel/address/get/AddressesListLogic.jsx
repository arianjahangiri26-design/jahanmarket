"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Edit3, MapPin, Plus, Trash2 } from "lucide-react";

import { useFetch } from "@/hooks/crud/UseCrud";

export default function AddressesListLogic() {
  const { request, loading } = useFetch();

  const [addresses, setAddresses] = useState([]);
  const [serverError, setServerError] = useState("");
  const [deletingId, setDeletingId] = useState("");

  // Fetch all addresses of the authenticated user
  const fetchAddresses = async () => {
    setServerError("");

    try {
      const response = await request({
        method: "GET",
        url: "/api/user-panel/addresses",
      });

      const addressList =
        response?.data?.data ||
        response?.data ||
        response?.message?.data ||
        [];

      if (response?.success) {
        setAddresses(Array.isArray(addressList) ? addressList : []);
        return;
      }

      setServerError(
        response?.data?.message ||
          response?.message ||
          response?.error ||
          "خطا در دریافت آدرس‌ها"
      );
    } catch {
      setServerError("خطا در ارتباط با سرور");
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // Delete an address and refresh the list afterwards
  const handleDeleteAddress = async (id) => {
    const confirmed = window.confirm(
      "آیا از حذف این آدرس مطمئن هستید؟"
    );

    if (!confirmed) return;

    setDeletingId(id);
    setServerError("");

    try {
      const response = await request({
        method: "DELETE",
        url: `/api/addresses/${id}`,
      });

      const isSuccess = response?.success || response?.data?.success;

      if (isSuccess) {
        setAddresses((currentAddresses) =>
          currentAddresses.filter((address) => address._id !== id)
        );

        return;
      }

      setServerError(
        response?.data?.message ||
          response?.message ||
          response?.error ||
          "خطا در حذف آدرس"
      );
    } catch {
      setServerError("خطا در ارتباط با سرور");
    } finally {
      setDeletingId("");
    }
  };

  if (loading && addresses.length === 0) {
    return (
      <div className="flex w-full items-center justify-center py-16">
        <p className="text-sm text-slate-500">در حال دریافت آدرس‌ها...</p>
      </div>
    );
  }

  return (
    <section className="mx-auto w-full max-w-4xl p-4 sm:p-6">
      <div className="mb-6 flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">آدرس‌های من</h1>
          <p className="mt-1 text-sm text-slate-500">
            آدرس‌های مورد استفاده برای ارسال سفارش‌ها را مدیریت کنید.
          </p>
        </div>

        <Link
          href="/profile/addresses/create"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 transition-colors hover:bg-blue-700"
        >
          <Plus size={18} />
          افزودن آدرس
        </Link>
      </div>

      {serverError && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3">
          <p className="text-center text-sm font-medium text-red-600">
            {serverError}
          </p>
        </div>
      )}

      {addresses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
          <MapPin className="mx-auto mb-3 text-slate-400" size={34} />

          <h2 className="font-bold text-slate-700">هنوز آدرسی ثبت نشده است</h2>

          <p className="mt-2 text-sm text-slate-500">
            برای ارسال سریع‌تر سفارش، آدرس خود را ثبت کنید.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {addresses.map((address) => (
            <article
              key={address._id}
              className="flex min-w-0 flex-col rounded-2xl border border-blue-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex items-start gap-3">
                <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
                  <MapPin size={20} />
                </div>

                <div className="min-w-0">
                  <h2 className="font-bold text-slate-800">
                    {address.province}، {address.city}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    پلاک: {address.plaque}
                  </p>
                </div>
              </div>

              <p className="flex-1 text-sm leading-7 text-slate-600">
                {address.fullAddress}
              </p>

              <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
                <Link
                  href={`/profile/addresses/${address._id}`}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 transition-colors hover:text-blue-800"
                >
                  <Edit3 size={16} />
                  ویرایش
                </Link>

                <button
                  type="button"
                  disabled={deletingId === address._id}
                  onClick={() => handleDeleteAddress(address._id)}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-red-500 transition-colors hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Trash2 size={16} />
                  {deletingId === address._id
                    ? "در حال حذف..."
                    : "حذف"}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
