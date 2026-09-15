"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Avatar } from "@heroui/react";
import { signOut, useSession } from "next-auth/react";
import { ChevronDown } from "lucide-react";
import {
  AUTH_USER_MENU,
  GUEST_USER_MENU,
  LOGOUT_MENU,
} from "@/constants/layout/avatar/AvatarMenu";

  import imageAvatar from "@/app/images.jpg";
import { LogOutButton } from "@/features/auth/LogOutButoon";
import Image from "next/image";

export default function AvatarMenu() {
  const [open, setOpen] = useState(false);
  const { data: session, status } = useSession();

  const isAuthenticated = status === "authenticated" && !!session?.user;

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
    <div className="relative">
        
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full border border-default-200 bg-white px-2 py-1.5 shadow-sm transition hover:bg-default-50"
      >
       
        <ChevronDown
          className={`h-4 w-4 text-default-500 transition ${
            open ? "rotate-180" : ""
          }`}
        />
         <Image
          src={imageAvatar}
       alt={"avatar"}
          size="sm"
          className="h-10 w-10"
        />

      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-3 w-64 overflow-hidden rounded-2xl border border-default-200 bg-white shadow-xl">
          {isAuthenticated && (
            <div className="border-b border-default-100 px-4 py-3">
              <p className="text-sm font-semibold text-default-800">
                {session?.user?.name || "کاربر"}
              </p>
              <p className="mt-1 text-xs text-default-500">
                {session?.user?.email || ""}
              </p>
            </div>
          )}

          <ul className="p-2">
            {menuItems.map((item) => {
              const Icon = item.icon;

              if (item.action === "logout") {
                return (
                  <li key={item.label}>
                    <LogOutButton
                      onClick={handleLogOut}
                      className="flex h-11 w-full items-center justify-start gap-2 rounded-xl px-3 text-sm font-medium text-danger"
                    >
                      {Icon && <Icon className="h-4 w-4" />}
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
                    className="flex h-11 items-center gap-2 rounded-xl px-3 text-sm font-medium text-default-700 transition hover:bg-default-100"
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {!isAuthenticated && status !== "loading" && (
            <div className="border-t border-default-100 px-4 py-3">
              <p className="text-xs leading-6 text-default-500">
                برای دسترسی به پروفایل و سفارش‌ها، ابتدا وارد حساب کاربری شوید.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
