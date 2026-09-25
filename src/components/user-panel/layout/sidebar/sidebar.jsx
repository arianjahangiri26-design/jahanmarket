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

  const menuItems = useMemo(
    () => [
      {
        title: "پروفایل من",
        path: "/user-panel",
        icon: User,
      },
      {
        title: "سفارش‌های من",
        path: "/user-panel/orders",
        icon: ShoppingBag,
      },
      {
        title: "آدرس‌های من",
        path: "/user-panel/setting/addresses",
        icon: MapPin,
      },
      {
        title: "علاقه‌مندی‌ها",
        path: "/user-panel/favorites",
        icon: Heart,
      },
      {
        title: "نظرات ثبت شده",
        path: "/user-panel/comments",
        icon: MessageSquare,
      },
    ],
    []
  );

  const isActiveRoute = (path) => {
    if (path === "/user-panel") {
      return pathname === path;
    }

    return pathname?.startsWith(path);
  };

  const closeOnMobile = () => {
    setIsOpen(false);
  };

  const handleLogout = async () => {
    const isConfirmed = window.confirm(
      "آیا مایل به خروج از حساب کاربری خود هستید؟"
    );

    if (isConfirmed) {
      await signOut({
        callbackUrl: "/",
      });
    }
  };

  return (
    <>
      {/* Mobile menu trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((previous) => !previous)}
        className="fixed right-4 top-4 z-[60] grid h-11 w-11 place-items-center rounded-xl bg-[#0B1528] text-blue-300 shadow-lg shadow-black/20 transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 lg:hidden"
        aria-label={isOpen ? "بستن منو" : "باز کردن منو"}
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={21} /> : <Menu size={21} />}
      </button>

      {/* Desktop width reservation */}
      <div className="w-0 shrink-0 lg:w-80">
        <aside
          className={[
            "fixed inset-y-0 right-0 z-50 w-80 max-w-[85vw]",
            "bg-[#0B1528] text-slate-100",
            "transition-transform duration-300 ease-out",
            "lg:sticky lg:top-6 lg:z-0 lg:h-[calc(100vh-3rem)]",
            "lg:max-w-none lg:translate-x-0 lg:rounded-3xl",
            "lg:border lg:border-blue-900/30",
            "lg:shadow-2xl lg:shadow-blue-950/40",
            "border-l border-blue-950",
            "overflow-y-auto overflow-x-hidden scrollbar-none",
            isOpen
              ? "translate-x-0"
              : "translate-x-full lg:translate-x-0",
          ].join(" ")}
          aria-label="سایدبار اختصاصی کاربر"
        >
          {/* Sidebar ambient lighting */}
          <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-blue-600/10 blur-[80px]" />
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-[80px]" />

          {/* Sidebar header */}
          <div className="relative p-5">
            <div className="mb-4 flex justify-end lg:hidden">
              <button
                type="button"
                onClick={closeOnMobile}
                className="grid h-9 w-9 place-items-center rounded-xl border border-white/5 bg-white/5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/35"
                aria-label="بستن سایدبار"
              >
                <X size={18} />
              </button>
            </div>

            {/* User profile */}
            <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-4 shadow-inner backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-[1.5px] shadow-lg shadow-blue-900/30">
                    <div className="grid h-full w-full place-items-center rounded-[14px] bg-[#0B1528] text-lg font-black text-white">
                      {session?.user?.name ? (
                        session.user.name.charAt(0)
                      ) : (
                        <User size={20} className="text-blue-400" />
                      )}
                    </div>
                  </div>

                  {session?.user?.role === "admin" && (
                    <span
                      title="مدیر سیستم"
                      className="absolute -bottom-1 -left-1 inline-flex items-center justify-center rounded-full border-2 border-[#0B1528] bg-emerald-500 p-1 text-white shadow-md"
                    >
                      <ShieldCheck size={12} />
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-extrabold text-white">
                    {session?.user?.name || "کاربر جهان‌مارکت"}
                  </h3>

                  <p className="mt-1 truncate text-[11px] font-medium text-slate-400">
                    {session?.user?.email ||
                      session?.user?.phone ||
                      "پنل خریدار"}
                  </p>
                </div>
              </div>

              <div className="mt-4 h-px w-full bg-white/[0.06]" />

              <div className="mt-3 flex items-center justify-between text-[10px] font-bold text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                  حساب فعال
                </span>

                <span className="font-mono tracking-wider text-blue-400">
                  JAHAN MARKET
                </span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="relative flex-1 space-y-2 px-5 pb-5">
            {menuItems.map((item) => {
              const active = isActiveRoute(item.path);
              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={closeOnMobile}
                  className={[
                    "group relative flex items-center justify-between",
                    "rounded-2xl px-4 py-3.5",
                    "outline-none transition-all duration-200 ease-out",
                    "focus:ring-2 focus:ring-blue-500/50",
                    active
                      ? "text-white"
                      : "text-slate-400 hover:bg-white/[0.03] hover:text-white",
                  ].join(" ")}
                >
                  {active && (
                    <motion.div
                      layoutId="premiumSidebarActive"
                      className="absolute inset-0 -z-10 rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-600/80 to-indigo-600/80 shadow-lg shadow-blue-600/20"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}

                  <span className="relative flex items-center gap-3">
                    <span
                      className={[
                        "grid h-8 w-8 place-items-center rounded-xl transition-colors",
                        active
                          ? "bg-white/10"
                          : "bg-white/0 group-hover:bg-white/5",
                      ].join(" ")}
                    >
                      <Icon
                        size={18}
                        className={
                          active
                            ? "text-white"
                            : "text-slate-400 group-hover:text-blue-300"
                        }
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
                        ? "translate-x-0 text-white opacity-100"
                        : "-translate-x-2 text-slate-400 opacity-0 group-hover:translate-x-0 group-hover:opacity-100",
                    ].join(" ")}
                  />
                </Link>
              );
            })}

            {/* Logout */}
            <div className="pt-4">
              <div className="mb-4 h-px w-full bg-white/[0.06]" />

              <button
                type="button"
                onClick={handleLogout}
                className={[
                  "flex w-full items-center gap-3",
                  "rounded-2xl border border-red-500/20",
                  "bg-red-500/10 px-4 py-3.5",
                  "text-red-300 transition-all duration-200",
                  "hover:bg-red-500/20 hover:text-red-200",
                  "focus:outline-none focus:ring-2 focus:ring-red-500/40",
                ].join(" ")}
              >
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-red-500/20">
                  <LogOut size={16} />
                </span>

                <span className="text-sm font-bold">خروج از حساب</span>
              </button>
            </div>
          </nav>
        </aside>
      </div>

      {/* Mobile overlay */}
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
