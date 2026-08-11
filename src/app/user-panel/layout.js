import UserSidebar from "@/components/user-panel/layout/sidebar/sidebar";

export default function ProfileLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto flex max-w-[1600px] gap-6 px-4 py-4 lg:px-6 lg:py-6">
        {/* Sidebar */}
        <UserSidebar />

        {/* Main content area */}
        <main className="min-w-0 flex-1">
          <div className="min-h-[calc(100vh-2rem)] rounded-3xl border border-slate-200 bg-white p-4 shadow-sm lg:min-h-[calc(100vh-3rem)] lg:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
