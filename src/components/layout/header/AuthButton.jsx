"use client";

import Link from "next/link";
import { FiUser } from "react-icons/fi";

const AuthButton = () => {
  return (
    <Link
      href="/auth/register"
      className="group hidden items-center gap-2.5 rounded-2xl border border-[#D7E4F0] bg-[linear-gradient(135deg,#FFFFFF_0%,#F7FBFF_100%)] px-4 py-2.5 text-sm font-bold text-[#5F7893] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C5D8E8] hover:text-[#0B3C5D] active:scale-95 lg:flex"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#0F2740_0%,#0B3C5D_100%)] text-white shadow-sm transition-transform duration-300 group-hover:scale-105">
        <FiUser className="h-4.5 w-4.5" />
      </span>
      <span>ورود | ثبت‌نام</span>
    </Link>
  );
};

export default AuthButton;
