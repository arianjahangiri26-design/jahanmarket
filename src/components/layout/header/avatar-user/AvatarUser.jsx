"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { ChevronDown, User, LogIn } from "lucide-react";
import {
  AUTH_USER_MENU,
  GUEST_USER_MENU,
  LOGOUT_MENU,
} from "@/constants/layout/avatar/AvatarMenu";
import imageAvatar from "@/app/images.jpg";
import { LogOutButton } from "@/features/auth/LogOutButoon";

export default function AvatarMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const { data: session, status } = useSession();

  const isAuthenticated = status === "authenticated" && !!session?.user;

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = useMemo(() => {
    if (isAuthenticated) {
      return [...AUTH_USER_MENU, LOGOUT_MENU];
    }
    return GUEST_USER_MENU;
  }, [isAuthenticated]);

  const handleLogOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="relative" ref={menuRef} dir="rtl">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex items-center gap-2 rounded-full border bg-white px-2 py-1.5 shadow-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#0B3C5D]/10 ${
          open
            ? "border-[#0B3C5D]/25 ring-2 ring-[#0B3C5D]/5"
            : "border-[#D7E4F0] hover:border-[#0B3C5D]/20 hover:bg-[#F7FBFF]"
        }`}
      >
        <ChevronDown
          className={`h-4 w-4 text-[#5F7893] transition-transform duration-300 ${
            open ? "rotate-180 text-[#0B3C5D]" : ""
          }`}
        />

        <div className="relative h-9 w-9 overflow-hidden rounded-full border border-[#0B3C5D]/10 bg-[#F8FBFF]">
          {isAuthenticated && session?.user?.image ? (
            <Image
              src={session.user.image || imageAvatar}
              alt={session.user.name || "avatar"}
              fill
              sizes="36px"
              className="object-cover"
            />
          ) : (
            <Image
              src={imageAvatar}
              alt="default avatar"
              fill
              sizes="36px"
              className="object-cover"
            />
          )}
        </div>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-3 w-64 origin-top-left overflow-hidden rounded-[24px] border border-[#D7E4F0] bg-white p-2.5 shadow-[0_24px_50px_-18px_rgba(11,60,93,0.18)] animate-in fade-in slide-in-from-top-2 duration-200">
          {isAuthenticated && (
            <div className="mb-2 flex items-center gap-3 border-b border-[#EDF3F8] px-3 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF5FB] text-[#0B3C5D]">
                <User className="h-5 w-5" />
              </div>

              <div className="flex flex-col overflow-hidden">
                <p className="truncate text-sm font-black text-[#0F2740]">
                  {session?.user?.name || "کاربر سایت"}
                </p>
                <p className="truncate text-[11px] font-medium text-[#5F7893]">
                  {session?.user?.email || ""}
                </p>
              </div>
            </div>
          )}

          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;

              if (item.action === "logout") {
                return (
                  <li key={item.label}>
                    <LogOutButton
                      onClick={handleLogOut}
                      className="flex h-11 w-full items-center justify-start gap-3 rounded-xl px-3.5 text-right text-sm font-bold text-rose-600 transition-colors hover:bg-rose-50"
                    >
                      {Icon && <Icon className="h-4.5 w-4.5 shrink-0" />}
                      <span>{item.label}</span>
                    </LogOutButton>
                  </li>
                );
              }

              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="group flex h-11 items-center gap-3 rounded-xl px-3.5 text-sm font-bold text-[#5F7893] transition-all duration-200 hover:bg-[#F7FBFF] hover:text-[#0B3C5D]"
                  >
                    {Icon && (
                      <Icon className="h-4.5 w-4.5 shrink-0 text-[#5F7893] transition-colors group-hover:text-[#0B3C5D]" />
                    )}
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {!isAuthenticated && status !== "loading" && (
            <div className="mt-2 border-t border-[#EDF3F8] px-3 py-3 text-center">
              <p className="text-[11px] leading-5 text-[#5F7893]">
                جهت دسترسی به پنل و پیگیری سفارش‌ها لطفا وارد شوید.
              </p>

              <Link
                href="/auth/signin"
                onClick={() => setOpen(false)}
                className="mt-2.5 flex items-center justify-center gap-1.5 rounded-xl bg-[#0B3C5D] py-2.5 text-xs font-black text-white shadow-[0_12px_28px_-12px_rgba(11,60,93,0.42)] transition hover:bg-[#0F4F78] active:scale-95"
              >
                <LogIn className="h-4 w-4" />
                ورود به حساب کاربری
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
