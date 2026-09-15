"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { Avatar, Chip } from "@heroui/react";
import { FiChevronDown } from "react-icons/fi";
import { adminMenu } from "@/constants/admin/layout/sidebar/sidebarConstants";

function isChildActive(children, pathname) {
  if (!children?.length) return false;
  return children.some((child) => pathname === child.href);
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState({});

  const initialOpenMenus = useMemo(() => {
    const opened = {};
    adminMenu.forEach((item) => {
      if (item.children?.length) {
        opened[item.title] = isChildActive(item.children, pathname);
      }
    });
    return opened;
  }, [pathname]);

  const mergedOpenMenus = { ...initialOpenMenus, ...openMenus };

  const toggleMenu = (title) => {
    setOpenMenus((prev) => ({
      ...prev,
      [title]: !mergedOpenMenus[title],
    }));
  };

  const isItemActive = (href) => pathname === href;

  return (
    <aside className="flex h-screen w-72 flex-col border-l border-white/10 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-200 shadow-2xl">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-white/10 px-4 py-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.14),transparent_30%)]" />

        <div className="relative flex items-center gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-1.5 backdrop-blur-sm">
            <Avatar
              src="https://i.pravatar.cc/100?img=12"
              size="md"
              className="ring-2 ring-blue-500/30"
            />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-white">Admin Panel</p>
            <p className="truncate text-xs text-slate-400">admin@site.com</p>
          </div>

          <Chip
            size="sm"
            variant="flat"
            className="border border-emerald-400/20 bg-emerald-500/10 text-emerald-300"
          >
            Online
          </Chip>
        </div>
      </div>

      {/* Title */}
      <div className="px-4 pt-4 pb-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-400">
            Dashboard Navigation
          </p>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 space-y-2 overflow-y-auto px-3 py-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
        {adminMenu.map((item) => {
          const Icon = item.icon;
          const hasChildren = !!item.children?.length;
          const parentActive = hasChildren
            ? isChildActive(item.children, pathname)
            : isItemActive(item.href);

          return (
            <div key={item.title} className="space-y-1">
              {hasChildren ? (
                <>
                  <button
                    type="button"
                    onClick={() => toggleMenu(item.title)}
                    className={`group flex w-full items-center justify-between rounded-2xl px-3 py-3 text-right transition-all duration-200 ${
                      parentActive
                        ? "bg-blue-600/15 text-white ring-1 ring-blue-400/20"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all ${
                          parentActive
                            ? "bg-blue-500/20 text-blue-300"
                            : "bg-white/5 text-slate-400 group-hover:bg-white/10 group-hover:text-white"
                        }`}
                      >
                        <Icon size={18} />
                      </div>

                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium">{item.title}</span>
                        {item.description && (
                          <span className="text-[11px] text-slate-400">
                            {item.description}
                          </span>
                        )}
                      </div>
                    </div>

                    <FiChevronDown
                      className={`shrink-0 transition-transform duration-300 ${
                        mergedOpenMenus[item.title] ? "rotate-180" : ""
                      }`}
                      size={18}
                    />
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      mergedOpenMenus[item.title]
                        ? "max-h-96 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="mr-5 mt-1 space-y-1 border-r border-white/10 pr-3">
                      {item.children.map((sub) => {
                        const subActive = pathname === sub.href;

                        return (
                          <Link
                            key={sub.title}
                            href={sub.href}
                            className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-all ${
                              subActive
                                ? "bg-blue-500/15 font-medium text-blue-300"
                                : "text-slate-400 hover:bg-white/5 hover:text-white"
                            }`}
                          >
                            <span>{sub.title}</span>

                            <span
                              className={`h-2 w-2 rounded-full transition-all ${
                                subActive
                                  ? "bg-blue-400 shadow-[0_0_12px_rgba(96,165,250,0.8)]"
                                  : "bg-slate-600 group-hover:bg-slate-300"
                              }`}
                            />
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </>
              ) : (
                <Link
                  href={item.href}
                  className={`group flex items-center gap-3 rounded-2xl px-3 py-3 transition-all duration-200 ${
                    parentActive
                      ? "bg-blue-600/15 text-white ring-1 ring-blue-400/20"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all ${
                      parentActive
                        ? "bg-blue-500/20 text-blue-300"
                        : "bg-white/5 text-slate-400 group-hover:bg-white/10 group-hover:text-white"
                    }`}
                  >
                    <Icon size={18} />
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{item.title}</span>
                    {item.description && (
                      <span className="text-[11px] text-slate-400">
                        {item.description}
                      </span>
                    )}
                  </div>
                </Link>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 p-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <p className="text-xs font-semibold text-white">مدیریت فروشگاه</p>
          <p className="mt-1 text-[11px] leading-5 text-slate-400">
            از این بخش می‌توانید محصولات، دسته‌بندی‌ها، بنرها و کاربران را مدیریت کنید.
          </p>
        </div>
      </div>
    </aside>
  );
}
