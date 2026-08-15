"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { FiChevronLeft, FiMapPin, FiX } from "react-icons/fi";

import { useNavigationLogic } from "../navigation/navigationLogic";

const MobileDrawer = ({ isOpen, onClose }) => {
  const { menus } = useNavigationLogic();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-40 bg-[#0F2740]/35 backdrop-blur-[3px] lg:hidden"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.aside
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="fixed left-0 top-0 z-50 flex h-full w-[86vw] max-w-sm flex-col border-r border-[#D7E4F0] bg-gradient-to-b from-white via-[#F7FBFF] to-white shadow-[18px_0_55px_-28px_rgba(11,60,93,0.22)] lg:hidden"
          >
            <div className="flex items-center justify-between border-b border-[#E6EEF5] px-4 py-4">
              <div>
                <p className="text-xs font-bold text-[#0B3C5D]">جهان مارکت</p>
                <h3 className="mt-1 text-lg font-black text-[#0F2740]">
                  منوی فروشگاه
                </h3>
              </div>

              <button
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#D7E4F0] bg-white text-[#5F7893] shadow-sm transition-all duration-200 hover:border-[#0B3C5D]/20 hover:text-[#0B3C5D] active:scale-95"
                aria-label="بستن"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-5">
              <div className="mb-5 rounded-[24px] border border-[#0B3C5D]/10 bg-[linear-gradient(135deg,#0F2740_0%,#0B3C5D_100%)] p-4 text-white shadow-lg shadow-[#0B3C5D]/15">
                <p className="text-xs leading-6 text-slate-100">
                  سریع و راحت بین دسته‌بندی‌ها و صفحات اصلی فروشگاه جابه‌جا شوید.
                </p>
              </div>

              <div className="space-y-2">
                {menus.map((link) => (
                  <Link
                    key={link._id}
                    href={link.url || `/category/${link.slug}`}
                    onClick={onClose}
                    className="group flex items-center justify-between rounded-2xl border border-[#E3EDF6] bg-white px-4 py-3.5 font-bold text-[#5F7893] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C4D9EA] hover:bg-[#F7FBFF] hover:text-[#0B3C5D]"
                  >
                    <span>{link.title}</span>
                    <FiChevronLeft className="h-4 w-4 text-[#5F7893] transition-all duration-300 group-hover:-translate-x-1 group-hover:text-[#0B3C5D]" />
                  </Link>
                ))}
              </div>

              <div className="mt-6 rounded-[24px] border border-[#E3EDF6] bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2 text-[#0F2740]">
                  <FiMapPin className="h-4 w-4 text-[#0B3C5D]" />
                  <span className="font-bold">ارسال به شهر شما</span>
                </div>
                <p className="mt-2 text-xs leading-6 text-[#5F7893]">
                  برای نمایش دقیق‌تر محصولات و زمان ارسال، شهر و آدرس خود را
                  انتخاب کنید.
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
