"use client";

import Link from "next/link";
import { useState } from "react";
import { FiMapPin, FiChevronDown, FiArrowUpLeft } from "react-icons/fi";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";

import Megamenu from "../mega-menu/Megamenu";
import { useNavigationLogic } from "./navigationLogic";

const Navigation = () => {
  const { navLinks } = useNavigationLogic();

  return (
    <div className="sticky top-0 z-50 bg-white/75">
      <nav className="border-b border-[#E6EEF5] bg-white/88 shadow-sm backdrop-blur-xl">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex h-14 items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Megamenu />

              <div className="hidden items-center gap-1 lg:flex">
                {navLinks.map((link) => (
                  <NavDropdown key={link._id} link={link} />
                ))}
              </div>
            </div>

            <Button
              variant="light"
              className="hidden h-10 items-center gap-2 rounded-xl border border-[#DDE9F3] bg-[linear-gradient(135deg,#FFFFFF_0%,#F5FAFE_100%)] px-4 font-bold  text-blue-500 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C6DCEC] hover:text-[#0B3C5D] lg:flex"
            >
              <FiMapPin className="h-4.5 w-4.5 text-blue-600" />
              <span>ارسال به شهر شما</span>
            </Button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navigation;

const NavDropdown = ({ link }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = link.children && link.children.length > 0;
  const href = link.url || `/category/${link.slug}`;

  if (!hasChildren) {
    return (
      <Link
        href={href}
        className="rounded-xl px-4 py-2 text-sm font-bold text-[#5F7893] transition-all duration-300 hover:bg-[#F4F9FD] hover:text-[#0B3C5D] active:scale-95"
      >
        {link.title}
      </Link>
    );
  }

  return (
    <Popover
      placement="bottom-start"
      offset={8}
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      classNames={{
        content: "border-0 bg-transparent p-0 shadow-none",
      }}
    >
      <PopoverTrigger>
        <button
          className={`flex items-center gap-1 rounded-xl px-4 py-2 text-sm font-bold text-[#5F7893] outline-none transition-all duration-300 hover:bg-[#F4F9FD] hover:text-[#0B3C5D] ${
            isOpen ? "bg-[#F4F9FD] text-[#0B3C5D]" : ""
          }`}
        >
          <span>{link.title}</span>
          <FiChevronDown
            className={`h-4.5 w-4.5 text-[#5F7893] transition-transform duration-300 ${
              isOpen ? "rotate-180 text-[#0B3C5D]" : ""
            }`}
          />
        </button>
      </PopoverTrigger>

      <PopoverContent>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.97 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="min-w-[200px] overflow-hidden rounded-2xl border border-[#D7E4F0] bg-white/95 p-1.5 shadow-[0_20px_40px_-15px_rgba(11,60,93,0.14)] backdrop-blur-md"
            >
              <div className="flex flex-col gap-0.5">
                {link.children.map((subLink) => (
                  <Link
                    key={subLink._id}
                    href={subLink.url || `/category/${subLink.slug}`}
                    className="group flex items-center justify-between rounded-xl px-3 py-2.5 transition-all duration-200 hover:bg-[#F7FBFF]"
                  >
                    <div className="flex flex-col">
                      <span className="text-[13px] font-bold text-[#0F2740] transition-colors duration-200 group-hover:text-[#0B3C5D]">
                        {subLink.title}
                      </span>
                      {subLink.description && (
                        <span className="mt-0.5 line-clamp-1 text-[10px] text-[#5F7893]">
                          {subLink.description}
                        </span>
                      )}
                    </div>

                    <FiArrowUpLeft className="h-4 w-4 text-[#9CB3C5] opacity-0 transition-all duration-200 group-hover:text-[#0B3C5D] group-hover:opacity-100" />
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </PopoverContent>
    </Popover>
  );
};
