"use client";

import Link from "next/link";
import { FiMapPin } from "react-icons/fi";
import { Button } from "@heroui/react";

import { navLinks } from "@/constants/layout/navigation";
import Megamenu from "../mega-menu/Megamenu";

const Navigation = () => {
  return (
    <div className="bg-white/75">
      <nav className="border-b border-blue-100/70 bg-white/82 backdrop-blur-xl shadow-[0_8px_24px_-20px_rgba(37,99,235,0.18)]">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex h-14 items-center justify-between gap-4 text-sm">
            {/* Left */}
            <div className="flex items-center gap-1.5">
              <Megamenu />

              <div className="hidden items-center gap-1 lg:flex">
                {navLinks.map((link) => (
                  <NavLink key={link.id} href={link.href}>
                    {link.title}
                  </NavLink>
                ))}
              </div>
            </div>

            {/* Right */}
            <Button
              variant="light"
              radius="xl"
              className="hidden items-center gap-2 rounded-2xl border border-blue-100 bg-gradient-to-br from-white to-blue-50/50 px-5 py-2.5 font-semibold text-slate-600 shadow-[0_8px_22px_-18px_rgba(37,99,235,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-700 hover:shadow-[0_14px_30px_-18px_rgba(37,99,235,0.32)] lg:flex"
            >
              <FiMapPin className="h-4 w-4" />
              <span>ارسال به شهر شما</span>
            </Button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navigation;

const NavLink = ({ href, children }) => (
  <Link
    href={href}
    className="rounded-2xl px-4 py-2.5 font-semibold text-slate-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-gradient-to-br hover:from-blue-50 hover:to-cyan-50/60 hover:text-blue-700 hover:shadow-[0_10px_24px_-18px_rgba(37,99,235,0.3)] active:scale-95"
  >
    {children}
  </Link>
);
