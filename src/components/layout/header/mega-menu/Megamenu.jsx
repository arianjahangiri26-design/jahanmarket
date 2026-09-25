"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  FiMenu,
  FiChevronDown,
  FiArrowLeft,
  FiShoppingBag,
  FiLayers,
  FiActivity,
} from "react-icons/fi";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  Card,
} from "@heroui/react";
import { useState } from "react";

import { useNavigationLogic } from "../navigation/navigationLogic";

const CategoryIcon = ({ index }) => {
  const icons = [
    <FiShoppingBag className="h-4 w-4 text-[#0B3C5D]" />,
    <FiLayers className="h-4 w-4 text-[#3C6E91]" />,
    <FiActivity className="h-4 w-4 text-[#0F4F78]" />,
  ];

  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EEF5FB] transition-colors duration-300 group-hover:bg-[#E4F0F8]">
      {icons[index % icons.length]}
    </div>
  );
};

const Megamenu = () => {
  const { megaLinks, loading } = useNavigationLogic();
  const [isOpen, setIsOpen] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.35,
        ease: [0.19, 1, 0.22, 1],
        staggerChildren: 0.04,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <Popover
      placement="bottom-end"
      offset={15}
      onOpenChange={(open) => setIsOpen(open)}
      isOpen={isOpen}
      classNames={{
        content: "border-0 bg-transparent p-0 shadow-none",
      }}
    >
      <PopoverTrigger>
        <Button
          variant="light"
          className={`group h-11 rounded-xl border px-4 font-bold transition-all duration-300 active:scale-95 ${
            isOpen
              ? "border-[#0B3C5D]/15 bg-[#F4F9FD] text-[#0B3C5D]"
              : "border-transparent bg-[#F8FBFF] text-[#0F2740] hover:bg-[#F1F7FC]"
          }`}
        >
          <FiMenu
            className={`h-5 w-5 transition-transform duration-300 ${
              isOpen
                ? "rotate-90 text-[#0B3C5D]"
                : "text-[#5F7893] group-hover:text-[#0B3C5D]"
            }`}
          />
          <span className="text-sm font-bold">دسته‌بندی محصولات</span>
          <FiChevronDown
            className={`h-4 w-4 text-[#5F7893] transition-transform duration-300 ${
              isOpen ? "rotate-180 text-[#0B3C5D]" : ""
            }`}
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent>
        {isOpen && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-[94vw] max-w-[1050px] overflow-hidden rounded-[26px] border border-[#D7E4F0] bg-white/95 shadow-[0_40px_90px_-24px_rgba(11,60,93,0.18)] backdrop-blur-md"
            dir="rtl"
          >
            <div className="grid grid-cols-12">
              <div className="relative col-span-3 hidden flex-col justify-between overflow-hidden bg-[linear-gradient(180deg,#0F2740_0%,#0B3C5D_100%)] p-8 text-white lg:flex">
                <div className="absolute inset-0 z-0 bg-gradient-to-tl from-white/5 via-transparent to-transparent" />
                <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute -left-12 -bottom-12 h-44 w-44 rounded-full bg-[#5EA3D6]/10 blur-3xl" />

                <div className="relative z-10">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-bold tracking-wider text-[#D9ECFA]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#B9D9F2]" />
                    پیشنهاد روز
                  </span>

                  <h3 className="mt-6 text-2xl font-black leading-tight text-white">
                    انتخاب هوشمند، خرید آسان
                  </h3>

                  <p className="mt-3 text-xs leading-relaxed text-slate-200">
                    مجموعه‌ای گلچین‌شده از بهترین برندهای جهان با گارانتی معتبر و
                    پشتیبانی ۲۴ ساعته.
                  </p>
                </div>

                <Link
                  href="/products"
                  className="relative z-10 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 text-xs font-bold text-slate-100 transition-all duration-300 hover:-translate-x-1 hover:bg-white/10 hover:text-white"
                >
                  <span>ورود به فروشگاه</span>
                  <FiArrowLeft className="h-4 w-4" />
                </Link>
              </div>

              <div className="col-span-12 p-6 lg:col-span-9 lg:p-8">
                <div className="mb-6 flex items-center justify-between border-b border-[#EDF3F8] pb-4">
                  <div>
                    <h4 className="text-base font-extrabold text-[#0F2740]">
                      لیست دسته‌بندی‌ها
                    </h4>
                    <p className="mt-1 text-[11px] text-[#5F7893]">
                      جهت دسترسی سریع به کالاها دسته مورد نظر را انتخاب کنید
                    </p>
                  </div>
                </div>

                {loading ? (
                  <div className="flex h-52 items-center justify-center">
                    <Spinner
                      color="primary"
                      size="md"
                      className="text-[#5F7893]"
                    />
                  </div>
                ) : (
                  <div className="grid gap-3.5 sm:grid-cols-2 md:grid-cols-3">
                    {megaLinks.map((link, idx) => (
                      <motion.div key={link._id} variants={itemVariants}>
                        <Link
                          href={link.url || `/category/${link.slug}`}
                          className="group block"
                        >
                          <Card
                            shadow="none"
                            className="rounded-xl border border-[#E3EDF6] bg-[#FAFCFE] p-3.5 transition-all duration-300 hover:border-[#BCD4E7] hover:bg-[#F4F9FD] hover:shadow-[0_10px_24px_-14px_rgba(11,60,93,0.12)]"
                          >
                            <div className="flex items-start gap-3">
                              <CategoryIcon index={idx} />

                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between">
                                  <h5 className="truncate pl-2 text-sm font-bold text-[#0F2740] transition-colors duration-300 group-hover:text-[#0B3C5D]">
                                    {link.title}
                                  </h5>
                                  <FiArrowLeft className="h-4.5 w-4.5 shrink-0 translate-x-2 transform text-[#A4B8C9] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:text-[#0B3C5D] group-hover:opacity-100" />
                                </div>

                                {link.description && (
                                  <p className="mt-1 line-clamp-1 text-[11px] leading-relaxed text-[#5F7893] transition-colors duration-300 group-hover:text-[#35516A]">
                                    {link.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </Card>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default Megamenu;
