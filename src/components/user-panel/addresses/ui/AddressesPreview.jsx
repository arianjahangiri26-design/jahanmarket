"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { useFetch } from "@/hooks/crud/UseCrud";

export default function AddressesPreview() {
  const { request, loading } = useFetch();
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await request({ method: "GET", url: "/api/user-panel/addresses" });
        if (res?.success) {
          const list = Array.isArray(res.data) ? res.data : res.data?.data || res.data?.addresses || [];
          if (mounted) setAddresses(list.slice(0, 2));
          return;
        }
      } catch (e) {
        // ignore
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [request]);

  if (loading && addresses.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
        <p className="text-sm text-slate-500">در حال بارگذاری آدرس‌ها...</p>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-4">
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800">آدرس‌ها</h3>
          <Link href="/user-panel/addresses" className="text-xs text-blue-600">مشاهده همه</Link>
        </div>

        <div className="mt-3 grid gap-2">
          {addresses.length === 0 ? (
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-500">
              <MapPin />
              هیچ آدرسی ثبت نشده است
            </div>
          ) : (
            addresses.map((a) => (
              <div key={a._id} className="flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-2 text-sm">
                <div className="rounded-md bg-white p-2 text-blue-600 shadow-sm">
                  <MapPin size={16} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-800">
                    {a.province}, {a.city}
                  </p>
                  <p className="text-xs text-slate-500 truncate max-w-[220px]">{a.fullAddress}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="shrink-0 w-[120px] hidden sm:block">
        <div className="rounded-2xl border border-slate-100 bg-white p-3 text-center text-xs text-slate-500">
          برای ارسال سفارش‌ها آدرس پیش‌فرض را انتخاب کنید
        </div>
      </div>
    </div>
  );
}
