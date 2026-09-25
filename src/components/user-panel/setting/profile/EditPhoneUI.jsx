"use client";

import React from "react";
import EditPhoneLogic from "./EditPhoneLogic";

export default function EditPhoneUI() {
  const { phone, setPhone, loading, serverError, success, onSave } = EditPhoneLogic();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="text-sm font-bold text-slate-800">ویرایش شماره تلفن</h2>
      <p className="mt-1 text-xs text-slate-500">شماره موبایل خود را برای دریافت پیامک‌ها و اطلاع‌رسانی وارد کنید.</p>

      <div className="mt-4 flex flex-col gap-3">
        <input
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          placeholder="مثال: 09123456789"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        {serverError && <p className="text-xs text-red-600">{serverError}</p>}
        {success && <p className="text-xs text-emerald-600">{success}</p>}

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSave}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-sm disabled:opacity-60"
          >
            ذخیره شماره
          </button>
        </div>
      </div>
    </div>
  );
}
