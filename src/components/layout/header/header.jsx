"use client";

import Link from "next/link";
import { FiMenu, FiShoppingCart } from "react-icons/fi";
import { RiAdminLine } from "react-icons/ri"; // اضافه کردن آیکون برای ادمین

import { useMobileMenu } from "@/hooks/useMobileMenu";
import AuthButton from "./AuthButton";
import Navigation from "./navigation/Navigation";
import MobileDrawer from "./mobile-drawer/MobileDrawer";
import SearchBox from "./search-box/SearchBox";
import { useSession } from "next-auth/react";
import AvatarMenu from "./avatar-user/AvatarUser";

const Header = () => {
  const { isOpen: mobileMenuOpen, openMenu, closeMenu } = useMobileMenu();
  const { data: session, status } = useSession();
  
  const isAuthenticated = status === "authenticated";
  
  // بررسی اینکه آیا کاربر نقش ادمین دارد یا خیر (حساس به حروف بزرگ و کوچک)
  const isAdmin = 
    session?.user?.role?.toLowerCase() === "admin" || 
    session?.user?.isAdmin === true;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-blue-100/70 bg-white/88 backdrop-blur-xl shadow-[0_10px_30px_-18px_rgba(37,99,235,0.22)]">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:h-20 lg:px-6">
          {/* Right side */}
          <div className="flex flex-1 items-center gap-3 lg:gap-5">
            <button
              onClick={openMenu}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-100 bg-gradient-to-br from-white to-blue-50 text-slate-700 shadow-[0_8px_20px_-14px_rgba(37,99,235,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-700 hover:shadow-[0_14px_30px_-16px_rgba(37,99,235,0.35)] active:scale-95 lg:hidden"
              aria-label="باز کردن منو"
            >
              <FiMenu className="h-6 w-6" />
            </button>

            <Link
              href="/"
              className="group flex items-center gap-2 text-xl font-extrabold tracking-tight lg:text-2xl"
            >
              <span className="bg-gradient-to-l from-blue-700 via-sky-600 to-cyan-500 bg-clip-text text-transparent drop-shadow-sm transition-all duration-300 group-hover:brightness-110">
                جهان مارکت
              </span>
              <span className="hidden h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)] sm:inline-block" />
            </Link>

            <SearchBox
              placeholder="جستجو در محصولات..."
              onSearch={(query) => {
                console.log("Searching for:", query);
              }}
            />
          </div>

          {/* Left side */}
          <div className="flex items-center gap-2.5 lg:gap-3">
            
            {/* دکمه اختصاصی پنل مدیریت (شیک و مشکی متالیک) */}
            {isAuthenticated && isAdmin && (
              <Link
                href="/admin"
                className="group flex h-11 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-slate-100 shadow-[0_8px_20px_-10px_rgba(15,23,42,0.8)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-900 hover:shadow-[0_14px_30px_-12px_rgba(15,23,42,0.9)] active:scale-95"
              >
                <RiAdminLine className="h-5 w-5 text-slate-400 transition-colors duration-300 group-hover:text-amber-400" />
                <span className="hidden sm:inline">پنل مدیریت</span>
              </Link>
            )}

            {isAuthenticated ? <AvatarMenu /> : <AuthButton />}

            <Link
              href="/cart"
              className="group relative flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-100 bg-gradient-to-br from-white to-blue-50 text-slate-700 shadow-[0_8px_20px_-14px_rgba(37,99,235,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-700 hover:shadow-[0_14px_30px_-16px_rgba(37,99,235,0.38)] active:scale-95 sm:h-auto sm:w-auto sm:px-4 sm:py-2.5"
              aria-label="سبد خرید"
            >
              <FiShoppingCart className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
              <span className="hidden pr-2 text-sm font-semibold sm:inline">
                سبد خرید
              </span>

              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-sky-500 px-1 text-[11px] font-bold text-white shadow-[0_8px_18px_rgba(37,99,235,0.35)]">
                3
              </span>
            </Link>
          </div>
        </div>
      </header>

      <div className="pt-16 lg:pt-20">
        <Navigation />
      </div>

      <MobileDrawer isOpen={mobileMenuOpen} onClose={closeMenu} />
    </>
  );
};

export default Header;
