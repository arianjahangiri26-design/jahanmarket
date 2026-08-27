import React from "react";

export const metadata = {
  title: "شرایط ارسال و مرجوعی — JahanMarket",
  description:
    "اطلاعات مربوط به شرایط ارسال، هزینه‌ها، مدت زمان تحویل، سیاست مرجوعی و نحوه انصراف از خرید در JahanMarket.",
  openGraph: {
    title: "شرایط ارسال و مرجوعی — JahanMarket",
    description:
      "قوانین ارسال، مرجوعی و انصراف از خرید در فروشگاه آنلاین JahanMarket.",
  },
};

export default function ShippingPage() {
  return (
    <main className="max-w-5xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-black">شرایط ارسال، مرجوعی و انصراف از خرید</h1>

      <section className="mt-6 rounded-lg border p-6">
        <h2 className="font-bold">ارسال</h2>
        <p className="mt-2 text-sm text-slate-700">- هزینه ارسال بر اساس وزن، حجم و آدرس محاسبه می‌شود. در زمان تسویه‌حساب مبلغ دقیق نمایش داده می‌شود.</p>
        <p className="mt-2 text-sm text-slate-700">- مدت زمان ارسال معمولاً بین ۲ تا ۷ روز کاری بسته به موقعیت خریدار و نوع خدمت است.</p>
      </section>

      <section className="mt-6 rounded-lg border p-6">
        <h2 className="font-bold">مرجوعی</h2>
        <p className="mt-2 text-sm text-slate-700">- مشتریان می‌توانند در صورت دریافت کالا معیوب یا مغایر با سفارش، ظرف ۷ روز درخواست مرجوعی ثبت کنند.</p>
        <p className="mt-2 text-sm text-slate-700">- کالا باید در بسته‌بندی اصلی و بدون استفاده بازگردانده شود. هزینه بازگشت در موارد غیرمربوط به خطای فروشگاه بر عهده مشتری خواهد بود.</p>
      </section>

      <section className="mt-6 rounded-lg border p-6">
        <h2 className="font-bold">انصراف از خرید</h2>
        <p className="mt-2 text-sm text-slate-700">- در صورت درخواست انصراف قبل از ارسال کالا، وجه به‌صورت کامل بازگردانده خواهد شد.</p>
        <p className="mt-2 text-sm text-slate-700">- پس از ارسال، فرایند مرجوعی طبق بندهای مرجوعی انجام می‌شود.</p>
      </section>

      <section className="mt-6 text-sm text-slate-700">
        <p className="font-semibold">توجه:</p>
        <p className="mt-2">متن بالا یک نمونه پیش‌نویس است؛ برای قوانین رسمی و دقیق‌تر، پیشنهاد می‌شود متن توسط تیم حقوقی بازبینی شود.</p>
      </section>
    </main>
  );
}
