"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  User,
  ShoppingBag,
  MapPin,
  Heart,
  MessageSquare,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ShieldCheck,
} from "lucide-react";

export default function UserSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  // Navigation menu items definition
  const menuItems = useMemo(
    () => [
      { title: "پروفایل من", path: "/user-panel", icon: User },
      { title: "سفارش‌های من", path: "/user-panel/orders", icon: ShoppingBag },
      { title: "آدرس‌های من", path: "/user-panel/setting/addresses", icon: MapPin },
      { title: "علاقه‌مندی‌ها", path: "/user-panel/favorites", icon: Heart },
      { title: "نظرات ثبت شده", path: "/user-panel/comments", icon: MessageSquare },
    ],
    []
  );

  // Active route checking helper
  const isActiveRoute = (path) => {
    if (path === "/profile") return pathname === "/profile";
    return pathname?.startsWith(path);
  };

  // Safe avatar letter calculation
  const avatarLetter = useMemo(() => {
    const name = session?.user?.name?.trim();
    return name ? name.charAt(0) : "U";
  }, [session?.user?.name]);

  // Drawer toggles
  const closeOnMobile = () => setIsOpen(false);

  // Logout handler with verification prompt
  const handleLogout = async () => {
    const isConfirmed = window.confirm("آیا مایل به خروج از حساب کاربری خود هستید؟");
    if (isConfirmed) {
      await signOut({ callbackUrl: "/" });
    }
  };

  return (
    <>
      {/* Mobile Sticky Header - Clean Glass UI */}
      <div className="lg:hidden sticky top-0 z-30 bg-[#0B1528]/80 backdrop-blur-md border-b border-blue-900/40 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white grid place-items-center font-black shadow-lg shadow-blue-500/20">
              {avatarLetter}
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-extrabold text-white truncate">
                {session?.user?.name || "کاربر مهمان"}
              </h4>
              <p className="text-[10px] font-semibold text-blue-400 truncate">
                {session?.user?.email || session?.user?.phone || "حساب کاربری"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="p-2.5 rounded-xl bg-blue-950/60 text-blue-300 hover:text-white border border-blue-900/60 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            aria-label={isOpen ? "بستن منو" : "باز کردن منو"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Sidebar Container spacing wrapper */}
      <div className="lg:w-80 shrink-0">
        {/* Core Sidebar Shell */}
        <aside
          className={[
            "fixed inset-y-0 right-0 z-50 w-80 max-w-[85vw]",
            "lg:sticky lg:top-6 lg:z-0 lg:h-[calc(100vh-3rem)] lg:max-w-none",
            "bg-[#0B1528] text-slate-100",
            "transition-transform duration-300 ease-out",
            "lg:translate-x-0",
            "lg:rounded-3xl lg:shadow-2xl lg:shadow-blue-955/40",
            "border-l border-blue-950 lg:border border-blue-900/30",
            "overflow-y-auto overflow-x-hidden scrollbar-none",
            isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0",
          ].join(" ")}
          aria-label="سایدبار اختصاصی کاربر"
        >
          {/* Ambient Lighting Gradients (Glassmorphism depth) */}
          <div className="pointer-events-none absolute -top-20 -left-20 h-64 w-64 rounded-full bg-blue-600/10 blur-[80px]" />
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-[80px]" />

          {/* Sidebar Top Area */}
          <div className="relative p-5">
            {/* Mobile close toggle */}
            <div className="flex justify-end lg:hidden mb-4">
              <button
                type="button"
                onClick={closeOnMobile}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 focus:outline-none focus:ring-2 focus:ring-blue-500/35"
                aria-label="بستن سایدبار"
              >
                <X size={18} className="text-slate-300" />
              </button>
            </div>

            {/* Profile frosted card */}
            <div className="rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/[0.08] backdrop-blur-xl p-4 shadow-inner">
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-[1.5px] shadow-lg shadow-blue-900/30">
                    <div className="h-full w-full rounded-[14px] bg-[#0B1528] grid place-items-center font-black text-lg text-white">
                      {session?.user?.name ? (
                        session.user.name.charAt(0)
                      ) : (
                        <User size={20} className="text-blue-400" />
                      )}
                    </div>
                  </div>

                  {/* System role badge indicator */}
                  {session?.user?.role === "admin" && (
                    <span
                      title="مدیر سیستم"
                      className="absolute -bottom-1 -left-1 inline-flex items-center justify-center rounded-full bg-emerald-500 text-white border-2 border-[#0B1528] shadow-md p-1"
                    >
                      <ShieldCheck size={12} />
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-extrabold text-sm text-white truncate">
                    {session?.user?.name || "کاربر جهان‌مارکت"}
                  </h3>
                  <p className="mt-1 text-[11px] font-medium text-slate-400 truncate">
                    {session?.user?.email || session?.user?.phone || "پنل خریدار"}
                  </p>
                </div>
              </div>

              {/* Internal Thin Divider */}
              <div className="mt-4 h-[1px] w-full bg-white/[0.06]" />

              {/* Status footer information */}
              <div className="mt-3 flex items-center justify-between text-[10px] font-bold text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  حساب فعال
                </span>
                <span className="text-blue-400 font-mono tracking-wider">JAHAN MARKET</span>
              </div>
            </div>
          </div>

          {/* Navigation Items List */}
          <nav className="relative px-5 pb-5 space-y-2 flex-1">
            {menuItems.map((item) => {
              const active = isActiveRoute(item.path);
              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={closeOnMobile}
                  className={[
                    "relative flex items-center justify-between",
                    "rounded-2xl px-4 py-3.5",
                    "transition-all duration-200 ease-out group",
                    "outline-none focus:ring-2 focus:ring-blue-500/50",
                    active
                      ? "text-white"
                      : "text-slate-400 hover:text-white hover:bg-white/[0.03]",
                  ].join(" ")}
                >
                  {/* Sliding active container with glassmorphic look */}
                  {active && (
                    <motion.div
                      layoutId="premiumSidebarActive"
                      className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600/80 to-indigo-600/80 border border-blue-500/30 shadow-lg shadow-blue-600/20 -z-10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}

                  <span className="relative flex items-center gap-3">
                    <span
                      className={[
                        "grid place-items-center h-8 w-8 rounded-xl transition-colors",
                        active ? "bg-white/10" : "bg-white/0 group-hover:bg-white/5",
                      ].join(" ")}
                    >
                      <Icon
                        size={18}
                        className={active ? "text-white" : "text-slate-400 group-hover:text-blue-300"}
                      />
                    </span>
                    <span className="text-sm font-bold tracking-wide">
                      {item.title}
                    </span>
                  </span>

                  <ChevronLeft
                    size={15}
                    className={[
                      "relative transition-all duration-200",
                      active
                        ? "opacity-100 translate-x-0 text-white"
                        : "opacity-0 -translate-x-2 text-slate-400 group-hover:opacity-100 group-hover:translate-x-0",
                    ].join(" ")}
                  />
                </Link>
              );
            })}

            {/* Bottom Actions Partition */}
            <div className="pt-4">
              <div className="h-[1px] w-full bg-white/[0.06] mb-4" />
              <button
                type="button"
                onClick={handleLogout}
                className={[
                  "w-full flex items-center gap-3",
                  "rounded-2xl px-4 py-3.5",
                  "bg-red-500/10 hover:bg-red-500/20 border border-red-500/20",
                  "text-red-300 hover:text-red-200",
                  "transition-all duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-red-500/40",
                ].join(" ")}
              >
                <span className="grid place-items-center h-8 w-8 rounded-xl bg-red-500/20">
                  <LogOut size={16} />
                </span>
                <span className="text-sm font-bold">خروج از حساب</span>
              </button>
            </div>
          </nav>
        </aside>
      </div>

      {/* Mobile Drawer Overlay Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.button
            type="button"
            aria-label="بستن پس‌زمینه"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeOnMobile}
            className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>
    </>
  );
}
