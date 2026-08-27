import EditPhoneUI from "@/components/user-panel/setting/profile/EditPhoneUI";

export const metadata = {
  title: "تنظیمات حساب - شماره تلفن",
  robots: { index: false, follow: false },
};

export default function ProfileSettingPage() {
  return (
    <section className="space-y-6">
      <h1 className="text-lg font-black text-slate-900">تنظیمات حساب</h1>

      <div className="grid gap-4 md:grid-cols-2">
        <EditPhoneUI />
      </div>
    </section>
  );
}
