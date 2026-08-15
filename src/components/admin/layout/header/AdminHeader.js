"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { Avatar, Input, Tooltip } from "@heroui/react";
import {
  FiBell,
  FiSearch,
  FiMenu,
  FiChevronLeft,
  FiSettings,
} from "react-icons/fi";

import { adminMenu } from "@/constants/admin/layout/sidebar/sidebarConstants";

function flattenAdminMenu(menu = []) {
  const items = [];

  menu.forEach((item) => {
    if (item.href) {
      items.push({
        title: item.title,
        href: item.href,
        parent: null,
      });
    }

    if (item.children?.length) {
      item.children.forEach((child) => {
        items.push({
          title: child.title,
          href: child.href,
          parent: item.title,
        });
      });
    }
  });

  return items;
}

function getCurrentPage(pathname) {
  const flatMenu = flattenAdminMenu(adminMenu);

  const exactMatch = flatMenu.find((item) => item.href === pathname);

  if (exactMatch) {
    return exactMatch;
  }

  const nestedMatch = flatMenu
    .filter((item) => item.href !== "/admin")
    .find((item) => pathname.startsWith(item.href));

  if (nestedMatch) {
    return nestedMatch;
  }

  return {
    title: "داشبورد",
    href: "/admin",
    parent: null,
  };
}

export default function AdminHeader({ onOpenSidebar }) {
  const pathname = usePathname();
  const currentPage = useMemo(() => getCurrentPage(pathname), [pathname]);

  return (
    <header className="sticky top-0 z-40 h-20 border-b border-slate-200/70 bg-white/80 px-4 shadow-sm backdrop-blur-xl lg:px-6">
      <div className="flex h-full items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onOpenSidebar}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 lg:hidden"
          >
            <FiMenu size={20} />
          </button>

          <div className="min-w-0">
            <div className="mb-1 flex items-center gap-1.5 text-xs text-slate-400">
              <span>پنل مدیریت</span>

              {currentPage.parent && (
                <>
                  <FiChevronLeft size={14} />
                  <span>{currentPage.parent}</span>
                </>
              )}
            </div>

            <h1 className="truncate text-lg font-bold text-slate-800 md:text-xl">
              {currentPage.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
        

          <Tooltip content="تنظیمات" placement="bottom">
            <button
              type="button"
              className="hidden h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 sm:flex"
            >
              <FiSettings size={19} />
            </button>
          </Tooltip>

          <Tooltip content="اعلان‌ها" placement="bottom">
            <button
              type="button"
              className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
            >
              <FiBell size={19} />

              <span className="absolute right-2.5 top-2.5 flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
              </span>
            </button>
          </Tooltip>

          <button
            type="button"
            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-1.5 pl-3 shadow-sm transition-all hover:border-blue-200 hover:bg-blue-50/60"
          >
            <Avatar
              src="https://i.pravatar.cc/100?img=12"
              size="sm"
              className="ring-2 ring-blue-100"
            />

            <div className="hidden text-right lg:block">
              <p className="text-xs font-bold text-slate-700">Admin</p>
              <p className="text-[11px] text-slate-400">مدیر سایت</p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
