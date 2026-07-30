"use client";

import Link from "next/link";
import { FiMenu, FiShoppingCart } from "react-icons/fi";
import { RiAdminLine } from "react-icons/ri";

import { useMobileMenu } from "@/hooks/useMobileMenu";
import AuthButton from "./AuthButton";
import Navigation from "./navigation/Navigation";
import MobileDrawer from "./mobile-drawer/MobileDrawer";
import SearchBox from "./search-box/SearchBox";
import { useSession } from "next-auth/react";
import AvatarMenu from "./avatar-user/AvatarUser";
import { useCart } from "@/context/cart/CartContext";

const Header = () => {
  const { isOpen: mobileMenuOpen, openMenu, closeMenu } = useMobileMenu();
  const { data: session, status } = useSession();
  const { cart } = useCart();
   
  const totalItems = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const isAuthenticated = status === "authenticated";
  
  const isAdmin = 
    session?.user?.role?.toLowerCase() === "admin" || 
    session?.user?.isAdmin === true;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[#E2E8F0] bg-white/90 backdrop-blur-xl shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:h-20 lg:px-6">
          <div className="flex flex-1 items-center gap-3 lg:gap-5">
            <button
              onClick={openMenu}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#E2E8F0] bg-gradient-to-br from-white to-[#0B3C5D]/5 text-[#627D98] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#0B3C5D]/30 hover:text-[#0B3C5D] active:scale-95 lg:hidden"
              aria-label="باز کردن منو"
            >
              <FiMenu className="h-6 w-6" />
            </button>

            <Link
              href="/"
              className="group flex items-center gap-2 text-xl font-black tracking-tight lg:text-2xl"
            >
              <span className="bg-gradient-to-l from-[#0B3C5D] to-[#0A2540] bg-clip-text text-transparent transition-all duration-300 group-hover:brightness-110">
                جهان مارکت
              </span>
              <span className="hidden h-2.5 w-2.5 rounded-full bg-[#E25B45] sm:inline-block" />
            </Link>

            <SearchBox
              placeholder="جستجو در محصولات..."
              onSearch={(query) => {
                console.log("Searching for:", query);
              }}
            />
          </div>

          <div className="flex items-center gap-2.5 lg:gap-3">
            {isAuthenticated && isAdmin && (
              <Link
                href="/admin"
                className="group flex h-11 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-slate-100 shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-900 active:scale-95"
              >
                <RiAdminLine className="h-5 w-5 text-slate-400 transition-colors duration-300 group-hover:text-[#E25B45]" />
                <span className="hidden sm:inline">پنل مدیریت</span>
              </Link>
            )}

            {isAuthenticated ? <AvatarMenu /> : <AuthButton />}

            <Link
              href="/cart"
              className="group relative flex h-11 w-11 items-center justify-center rounded-2xl border border-[#E2E8F0] bg-gradient-to-br from-white to-[#0B3C5D]/5 text-blue-600 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#0B3C5D]/30   active:scale-95 sm:h-auto sm:w-auto sm:px-4 sm:py-2.5"
              aria-label="سبد خرید"
            >
              <FiShoppingCart className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
              <span className="hidden pr-2 text-sm font-bold sm:inline">
                سبد خرید
              </span>
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-br from-[#0B3C5D] to-[#07263D] px-1 text-[11px] font-black text-white shadow-sm">
                  {totalItems}
                </span>
              )}
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
