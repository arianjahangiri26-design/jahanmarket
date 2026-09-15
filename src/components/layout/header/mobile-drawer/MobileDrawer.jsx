"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { FiChevronLeft, FiMapPin, FiX } from "react-icons/fi";

import { navLinks } from "@/constants/layout/navigation";

const MobileDrawer = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-[3px] lg:hidden"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="fixed left-0 top-0 z-50 flex h-full w-[86vw] max-w-sm flex-col border-r border-blue-100 bg-gradient-to-b from-white via-blue-50/40 to-white shadow-[18px_0_55px_-28px_rgba(37,99,235,0.35)] lg:hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-blue-100 px-4 py-4">
              <div>
                <p className="text-xs font-semibold text-blue-500">جهان مارکت</p>
                <h3 className="mt-1 text-lg font-bold text-slate-900">
                  منوی فروشگاه
                </h3>
              </div>

              <button
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-blue-100 bg-white text-slate-700 shadow-sm transition-all duration-200 hover:border-blue-200 hover:text-blue-700 active:scale-95"
                aria-label="بستن"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-4 py-5">
              <div className="mb-5 rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-600 via-sky-500 to-cyan-400 p-4 text-white shadow-[0_16px_36px_-20px_rgba(37,99,235,0.42)]">
                <p className="text-sm leading-6 text-blue-50/95">
                  سریع و راحت بین دسته‌بندی‌ها و صفحات اصلی فروشگاه جابه‌جا شوید.
                </p>
              </div>

              <div className="space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.id}
                    href={link.href}
                    onClick={onClose}
                    className="group flex items-center justify-between rounded-2xl border border-blue-100 bg-white px-4 py-3.5 font-semibold text-slate-700 shadow-[0_8px_22px_-18px_rgba(37,99,235,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-gradient-to-br hover:from-blue-50 hover:to-cyan-50/60 hover:text-blue-700"
                  >
                    <span>{link.title}</span>
                    <FiChevronLeft className="h-4 w-4 text-slate-400 transition-all duration-300 group-hover:-translate-x-1 group-hover:text-blue-600" />
                  </Link>
                ))}
              </div>

              <div className="mt-6 rounded-3xl border border-blue-100 bg-white p-4 shadow-[0_8px_22px_-18px_rgba(37,99,235,0.22)]">
                <div className="flex items-center gap-2 text-slate-800">
                  <FiMapPin className="h-4 w-4 text-blue-600" />
                  <span className="font-semibold">ارسال به شهر شما</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  برای نمایش دقیق‌تر محصولات و زمان ارسال، شهر و آدرس خود را انتخاب کنید.
                </p>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileDrawer;
