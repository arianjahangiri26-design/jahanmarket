"use client";

import { useState } from "react";
import { FiLogOut } from "react-icons/fi";
import { signOut, useSession } from "next-auth/react";

export const LogOutButton = ({ children, className = "" }) => {
  const { status } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogOut = async () => {
    try {
      setIsLoading(true);
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoading(false);
    }
  };

  if (status !== "authenticated") return null;

  if (children) {
    return (
      <div
        onClick={handleLogOut}
        className={`cursor-pointer ${isLoading ? "pointer-events-none opacity-60" : ""} ${className}`}
      >
        {children}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleLogOut}
      disabled={isLoading}
      className={`
        group flex w-full items-center justify-center gap-2 rounded-2xl
        border border-red-100 bg-gradient-to-r from-red-50 to-rose-50
        px-4 py-2.5 text-sm font-semibold text-red-600
        shadow-sm transition-all duration-300
        hover:-translate-y-0.5 hover:border-red-200 hover:from-red-100 hover:to-rose-100 hover:text-red-700 hover:shadow-md
        active:scale-[0.98]
        disabled:cursor-not-allowed disabled:opacity-60
      `}
    >
      <FiLogOut className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
      <span>{isLoading ? "در حال خروج..." : "خروج از حساب"}</span>
    </button>
  );
};
