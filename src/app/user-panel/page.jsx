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

      {/* Example content box */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <p className="text-sm leading-7 text-slate-700">
          این صفحه، صفحه اصلی پنل کاربری است. می‌توانی در این بخش خلاصه سفارش‌ها،
          آدرس‌ها، علاقه‌مندی‌ها و اطلاعات حساب را نمایش بدهی.
        </p>
      </div>
    </section>
  );
}
