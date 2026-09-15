import AdminHeader from "@/components/admin/layout/header/AdminHeader";
import AdminSidebar from "@/components/admin/layout/sidebar/adminSidebar";
import { HeroProviders } from "@/components/providers/heroProviders";

export default function Layout({ children }) {
  return (
    <HeroProviders>
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />

        <div className="flex flex-col flex-1 overflow-hidden">
          <AdminHeader />

          <main className="flex-1 bg-mauve-500 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </HeroProviders>
  );
}
