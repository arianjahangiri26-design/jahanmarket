// src/app/admin/layout.jsx
import AdminHeader from "@/components/admin/layout/header/AdminHeader";
import AdminSidebar from "@/components/admin/layout/sidebar/adminSidebar";
import { HeroProviders } from "@/components/providers/heroProviders";
import AdminFilters from "@/components/admin/filter/AdminFilters"; // کامپوننت جدید
 
export default function Layout({ children }) {
  return (
    <HeroProviders>
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />

        <div className="flex flex-col flex-1 overflow-hidden">
          <AdminHeader />

          <main className="flex-1 bg-gray-100 overflow-y-auto p-6">
            {/* استفاده راحت و بدون خطای توابع فرزند در کامپوننت‌های سرور */}
            <AdminFilters /> 

            {children}
          </main>
        </div>
      </div>
    </HeroProviders>
  );
}
