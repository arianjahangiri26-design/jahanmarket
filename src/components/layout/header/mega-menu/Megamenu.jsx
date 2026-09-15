"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiMenu } from "react-icons/fi";
import { Button, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";

import { navLinks } from "@/constants/layout/navigation";

const Megamenu = () => {
  return (
    <Popover placement="bottom-start" showArrow={true}>
      <PopoverTrigger>
        <Button
          variant="light"
          radius="xl"
          className="flex items-center gap-2 rounded-2xl border border-blue-100 bg-gradient-to-br from-white to-blue-50/50 px-5 py-2.5 font-semibold text-slate-700 shadow-[0_8px_22px_-18px_rgba(37,99,235,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-700 hover:shadow-[0_14px_30px_-18px_rgba(37,99,235,0.32)]"
        >
          <FiMenu className="h-4 w-4" />
          <span>دسته‌بندی‌ها</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="overflow-hidden rounded-[28px] border border-blue-100 bg-white/95 p-0 shadow-[0_26px_70px_-28px_rgba(37,99,235,0.35)] backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, y: -12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.98 }}
          transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          className="w-[92vw] max-w-[1100px]"
        >
          {/* Header */}
          <div className="border-b border-blue-100 bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 px-6 py-6 text-white sm:px-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold tracking-tight sm:text-xl">
                  دسته‌بندی‌ها و دسترسی سریع
                </h3>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-50/90">
                  سریع و آسان به تمام بخش‌های فروشگاه دسترسی داشته باشید
                </p>
              </div>

              <span className="rounded-full border border-white/20 bg-white/15 px-4 py-1.5 text-xs font-bold backdrop-blur-md">
                Mega Menu
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4 sm:p-6">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className="group relative overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-white to-blue-50/50 p-5 shadow-[0_10px_24px_-20px_rgba(37,99,235,0.25)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:from-blue-50 hover:to-cyan-50/50 hover:shadow-[0_18px_36px_-22px_rgba(37,99,235,0.3)] active:scale-[0.98]"
              >
                <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-br from-transparent via-blue-50/0 to-transparent" />

                <div className="relative z-10 flex h-full flex-col justify-between">
                  <div>
                    <h4 className="text-base font-bold text-slate-800 transition-colors duration-300 group-hover:text-blue-700">
                      {link.title}
                    </h4>

                    {link.description && (
                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
                        {link.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-blue-600">
                    <span className="h-2 w-2 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.7)]" />
                    مشاهده بخش
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Footer */}
          <div className="flex flex-col gap-3 border-t border-blue-100 bg-gradient-to-r from-blue-50/50 to-white px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div className="flex items-center gap-3">
              <div className="h-2.5 w-2.5 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.7)]" />
              <span className="text-sm text-slate-600">
                همه دسته‌بندی‌ها همیشه در دسترس شما هستند
              </span>
            </div>

            <Link
              href="/categories"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-blue-100 bg-gradient-to-br from-white to-blue-50 px-5 py-3 text-sm font-bold text-blue-700 shadow-[0_10px_24px_-18px_rgba(37,99,235,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_16px_34px_-20px_rgba(37,99,235,0.32)]"
            >
              مشاهده همه دسته‌بندی‌ها
              <span>→</span>
            </Link>
          </div>
        </motion.div>
      </PopoverContent>
    </Popover>
  );
};

export default Megamenu;
