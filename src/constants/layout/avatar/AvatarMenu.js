import {
  Heart,
  LayoutDashboard,
  LogIn,
  LogOut,
  ShoppingBag,
  User,
  UserPlus,
} from "lucide-react";

export const AUTH_USER_MENU = [
  {
    label: "پروفایل",
    href: "/profile",
    icon: User,
  },
  {
    label: "داشبورد",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "علاقه‌مندی‌ها",
    href: "/favorites",
    icon: Heart,
  },
  {
    label: "سفارش‌ها",
    href: "/orders",
    icon: ShoppingBag,
  },
];

export const GUEST_USER_MENU = [
  {
    label: "ورود",
    href: "/login",
    icon: LogIn,
  },
  {
    label: "ثبت‌نام",
    href: "/register",
    icon: UserPlus,
  },
];

export const LOGOUT_MENU = {
  label: "خروج از حساب",
  action: "logout",
  icon: LogOut,
};
