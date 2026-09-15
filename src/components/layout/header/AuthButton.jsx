"use client";

import Link from "next/link";
import { FiUser } from "react-icons/fi";

const AuthButton = () => {
  
  return (
    <Link
      href="/auth/register"
      className="group hidden items-center gap-2.5 rounded-2xl border border-blue-100 bg-gradient-to-br from-white to-blue-50/60 px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-[0_8px_22px_-18px_rgba(37,99,235,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-700 hover:shadow-[0_14px_30px_-18px_rgba(37,99,235,0.32)] active:scale-95 lg:flex"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 text-white shadow-[0_8px_18px_-10px_rgba(37,99,235,0.35)] transition-transform duration-300 group-hover:scale-105">
        <FiUser className="h-4.5 w-4.5" />
      </span>
      <span>ورود | ثبت‌نام</span>
    </Link>
  );
};

export default AuthButton;
