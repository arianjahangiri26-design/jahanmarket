"use client";

import { FiSearch, FiX } from "react-icons/fi";
import { useSearchBox } from "./searchBoxLogic";

const SearchBox = ({
  placeholder = "جستجو در محصولات...",
  onSearch,
}) => {
  const {
    searchQuery,
    isMobileSearchOpen,
    handleSearch,
    handleInputChange,
    handleMobileSearchToggle,
    closeMobileSearch,
  } = useSearchBox(onSearch);

  return (
    <>
      {/* Desktop Search */}
      <div className="hidden flex-1 lg:block lg:max-w-2xl">
        <form onSubmit={handleSearch} className="group relative">
          <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
            <FiSearch className="h-5 w-5 text-slate-400 transition-colors duration-300 group-focus-within:text-blue-500" />
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="w-full rounded-2xl border border-blue-100/80 bg-gradient-to-br from-white to-blue-50/40 py-3.5 pr-12 pl-4 text-sm font-medium text-slate-800 shadow-[0_8px_24px_-18px_rgba(37,99,235,0.32)] outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:shadow-[0_14px_32px_-18px_rgba(37,99,235,0.32)] focus:ring-4 focus:ring-blue-100/70"
            aria-label="جستجو"
          />
        </form>
      </div>

      {/* Mobile Search Button */}
      <button
        onClick={handleMobileSearchToggle}
        className="flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-100 bg-gradient-to-br from-white to-blue-50 text-slate-700 shadow-[0_8px_20px_-14px_rgba(37,99,235,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-700 hover:shadow-[0_14px_30px_-16px_rgba(37,99,235,0.35)] active:scale-95 lg:hidden"
        aria-label="جستجو"
      >
        <FiSearch className="h-6 w-6" />
      </button>

      {/* Mobile Search Overlay */}
      {isMobileSearchOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-[2px] lg:hidden"
            onClick={closeMobileSearch}
            aria-hidden="true"
          />
          <div className="fixed inset-x-0 top-0 z-50 border-b border-blue-100 bg-white/95 p-4 shadow-[0_16px_35px_-18px_rgba(37,99,235,0.22)] backdrop-blur-xl lg:hidden">
            <form onSubmit={handleSearch} className="relative">
              <button
                type="button"
                onClick={closeMobileSearch}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-xl p-1.5 text-slate-400 transition-all duration-200 hover:bg-slate-100 hover:text-slate-700"
                aria-label="بستن"
              >
                <FiX className="h-5 w-5" />
              </button>

              <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                <FiSearch className="h-5 w-5 text-slate-400" />
              </div>

              <input
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
                placeholder={placeholder}
                className="w-full rounded-2xl border border-blue-100 bg-gradient-to-br from-slate-50 to-blue-50/30 py-3.5 pr-12 pl-12 text-sm font-medium text-slate-800 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100/70"
                autoFocus
                aria-label="جستجو"
              />
            </form>
          </div>
        </>
      )}
    </>
  );
};

export default SearchBox;
