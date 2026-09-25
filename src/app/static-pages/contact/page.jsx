import React from "react";
import ContactMap from "./components/ContactMap";

export const metadata = {
  title: "تماس با ما — JahanMarket",
  description:
    "اطلاعات تماس، آدرس، تلفن و ایمیل فروشگاه — برای پرسش‌ها، پشتیبانی و هماهنگی سفارشات با ما تماس بگیرید.",
  openGraph: {
    title: "تماس با ما — JahanMarket",
    description:
      "تماس با JahanMarket: آدرس، تلفن و ایمیل جهت پیگیری سفارشات و پشتیبانی.",
  },
};

export default function ContactPage() {
  // Placeholder contact details as requested. The user will replace them later.
  const address = "ندوم";
  const phone = "021-00000000"; // شماره ثابت نمونه
  const email = "dandoom@example.com"; // ایمیل نمونه

  return (
    <main className="max-w-5xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-black">تماس با ما</h1>

      <p className="mt-4 text-sm text-slate-600">
        برای تماس با بخش پشتیبانی یا هماهنگی سفارشات، لطفاً از اطلاعات زیر
        استفاده کنید. در صورت نیاز به پاسخ سریع، تلفن را ترجیح دهید.
      </p>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg border p-6">
          <h2 className="font-bold">آدرس دقیق</h2>
          <p className="mt-2 text-sm text-slate-700">{address}</p>

          <h3 className="mt-4 font-bold">تلفن ثابت</h3>
          <p className="mt-2 text-sm text-slate-700">{phone}</p>

          <h3 className="mt-4 font-bold">پست الکترونیک</h3>
          <p className="mt-2 text-sm text-slate-700">{email}</p>

          <h3 className="mt-4 font-bold">ساعات پاسخ‌گویی</h3>
          <p className="mt-2 text-sm text-slate-700">شنبه تا چهارشنبه، ۹:۰۰ - ۱۸:۰۰</p>
        </div>

        <div className="rounded-lg border p-6">
          <h2 className="font-bold">نقشه</h2>
          <p className="mt-2 text-sm text-slate-600">
            مکان نمایش داده شده بر اساس آدرس نمونه است. پس از جایگذاری آدرس
            دقیق، نقشه به‌روزرسانی خواهد شد.
          </p>

          <ContactMap query={address} />
        </div>
      </div>

      <section className="mt-8 rounded-lg border p-6">
        <h2 className="font-bold">نحوه ارتباط</h2>
        <ul className="mt-3 list-disc space-y-2 pr-5 text-sm text-slate-700">
          <li>برای مسائل فوری تلفنی تماس بگیرید.</li>
          <li>برای ارسال مدارک یا مکاتبات رسمی از ایمیل استفاده کنید.</li>
          <li>درخواست‌های پشتیبانی پس از ارسال تیکت ظرف ۲۴ تا ۴۸ ساعت پاسخ داده می‌شوند.</li>
        </ul>
      </section>
    </main>
  );
}
