export const metadata = {
  title: "پروفایل من",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

import AddressesPreview from "@/components/user-panel/addresses/ui/AddressesPreview";

export default function UserPanelPage() {
  return (
    <section className="space-y-4">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-black text-slate-900 lg:text-2xl">
          پروفایل من
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          اطلاعات حساب کاربری و فعالیت‌های شما در این بخش نمایش داده می‌شود.
        </p>
      </div>

      {/* Addresses preview + quick summary box */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <AddressesPreview />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-sm font-bold text-slate-800">خلاصه حساب</h3>
          <p className="mt-3 text-sm text-slate-500">خلاصه‌ای از سفارش‌ها، آدرس‌ها و اطلاعات حساب شما در اینجا نمایش داده می‌شود.</p>
        </div>
      </div>
    </section>
  );
}
