"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MEGA_MENU_ITEMS } from "@/constants/layout/avatar/mega-menu/MegaMenuAvatar";

export default function MegaMenu() {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-6 md:flex" dir="rtl">
      {MEGA_MENU_ITEMS.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.label}
            href={item.href}
            className={`group relative py-2 text-sm font-semibold transition-all duration-200 ${
              isActive
                ? "font-black text-[#0B3C5D]"
                : "text-[#5F7893] hover:text-[#0B3C5D]"
            }`}
          >
            {item.label}
            <span
              className={`absolute bottom-0 right-0 h-0.5 rounded-full bg-[#0B3C5D] transition-all duration-300 ${
                isActive ? "w-full" : "w-0 group-hover:w-full"
              }`}
            />
          </Link>
        );
      })}
    </nav>
  );
}
