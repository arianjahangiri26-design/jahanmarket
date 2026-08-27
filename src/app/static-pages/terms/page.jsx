import React from "react";

export const metadata = {
  title: "قوانین و مقررات — JahanMarket",
  description:
    "متن قوانین و مقررات استفاده از فروشگاه آنلاین JahanMarket — حقوق کاربران، محرمانگی، و چارچوب‌های قانونی.",
  openGraph: {
    title: "قوانین و مقررات — JahanMarket",
    description:
      "قوانین و مقررات استفاده از خدمات JahanMarket شامل حریم خصوصی و تعهدات کاربران.",
  },
};

export default function TermsPage() {
  return (
    <main className="max-w-5xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-black">قوانین و مقررات</h1>

      <p className="mt-4 text-sm text-slate-600">در ادامه خلاصه‌ای از قوانین و مقررات آمده است. این متن نمونه است و باید توسط حقوق‌دان یا مسئول مربوطه بازبینی و نهایی شود.</p>

      <section className="mt-6 rounded-lg border p-6">
        <h2 className="font-bold">۱. معرفی خدمت</h2>
        <p className="mt-2 text-sm text-slate-700">فروشگاه JahanMarket خدمات فروش آنلاین کالا را با شرایط مشخص شده ارائه می‌دهد.</p>

        <h2 className="mt-4 font-bold">۲. حقوق و مسئولیت کاربران</h2>
        <p className="mt-2 text-sm text-slate-700">کاربران متعهد می‌شوند اطلاعات صحیح ارائه کنند و قوانین سایت را رعایت نمایند. سوء استفاده از خدمات پیگرد قانونی دارد.</p>

        <h2 className="mt-4 font-bold">۳. حفظ حریم خصوصی</h2>
        <p className="mt-2 text-sm text-slate-700">جمع‌آوری و استفاده از داده‌ها مطابق سیاست حریم خصوصی سایت انجام می‌شود. جزئیات بیشتر در بخش حریم خصوصی درج خواهد شد.</p>

        <h2 className="mt-4 font-bold">۴. تغییر قوانین</h2>
        <p className="mt-2 text-sm text-slate-700">JahanMarket می‌تواند قوانین را با اعلام قبلی تغییر دهد. استفاده مداوم از سرویس به معنی پذیرش تغییرات جدید است.</p>
      </section>

      <section className="mt-6 text-sm text-slate-700">
        <p className="font-semibold">یادداشت مهم:</p>
        <p className="mt-2">این متن به‌عنوان پیش‌نویس قرار داده شده است. برای اجرا، نسخه نهایی باید توسط مشاور حقوقی بررسی شود.</p>
      </section>
    </main>
  );
}
