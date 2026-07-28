"use client";

import { FiSearch, FiX } from "react-icons/fi";
import { useSearchBox } from "./searchBoxLogic";

const SearchBox = ({
  placeholder = "جستجو بر اساس نام محصول...",
  onSearch,
}) => {
  const {
    searchQuery,
    isMobileSearchOpen,
    handleSearch,
    handleInputChange,
    handleMobileSearchToggle,
    closeMobileSearch,
    clearSearch,
  } = useSearchBox(onSearch);

  return (
    <>
      <div className="hidden flex-1 lg:block lg:max-w-2xl">
        <form onSubmit={handleSearch} className="group relative" role="search">
          <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
            <FiSearch className="h-5 w-5 text-[#5F7893] transition-colors duration-300 group-focus-within:text-[#0B3C5D]" />
          </div>

          <input
            type="search"
            value={searchQuery}
            onChange={handleInputChange}
            placeholder={placeholder}
            autoComplete="off"
            enterKeyHint="search"
            className="w-full rounded-2xl border border-[#D7E4F0] bg-[linear-gradient(135deg,#FFFFFF_0%,#F7FBFF_100%)] py-3.5 pr-12 pl-12 text-sm font-medium text-[#0F2740] outline-none transition-all duration-300 placeholder:text-[#7A92A8] focus:border-[#0B3C5D]/35 focus:bg-white focus:ring-4 focus:ring-[#0B3C5D]/5"
            aria-label="جستجو بر اساس نام محصول"
          />

          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute inset-y-0 left-3 flex items-center rounded-xl px-2 text-[#7A92A8] transition-colors hover:text-[#0B3C5D]"
              aria-label="پاک کردن عبارت جستجو"
            >
              <FiX className="h-5 w-5" />
            </button>
          )}
        </form>
      </div>

      <button
        type="button"
        onClick={handleMobileSearchToggle}
        className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#D7E4F0] bg-[linear-gradient(135deg,#FFFFFF_0%,#F7FBFF_100%)] text-[#5F7893] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C5D8E8] hover:text-[#0B3C5D] active:scale-95 lg:hidden"
        aria-label="باز کردن جستجو"
        aria-expanded={isMobileSearchOpen}
      >
        <FiSearch className="h-6 w-6" />
      </button>

      {isMobileSearchOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 cursor-default bg-[#0F2740]/35 backdrop-blur-[2px] lg:hidden"
            onClick={closeMobileSearch}
            aria-label="بستن جستجو"
          />

          <div className="fixed inset-x-0 top-0 z-50 border-b border-[#E6EEF5] bg-white/95 p-4 shadow-lg backdrop-blur-xl lg:hidden">
            <form onSubmit={handleSearch} className="relative" role="search">
              <button
                type="button"
                onClick={closeMobileSearch}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-xl p-1.5 text-[#5F7893] transition-all duration-200 hover:bg-slate-100 hover:text-[#0F2740]"
                aria-label="بستن"
              >
                <FiX className="h-5 w-5" />
              </button>

              <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                <FiSearch className="h-5 w-5 text-[#5F7893]" />
              </div>

              <input
                type="search"
                value={searchQuery}
                onChange={handleInputChange}
                placeholder={placeholder}
                autoComplete="off"
                enterKeyHint="search"
                autoFocus
                className="w-full rounded-2xl border border-[#D7E4F0] bg-[linear-gradient(135deg,#F9FCFF_0%,#F1F7FC_100%)] py-3.5 pr-12 pl-12 text-sm font-medium text-[#0F2740] outline-none transition-all duration-300 placeholder:text-[#7A92A8] focus:border-[#0B3C5D]/35 focus:bg-white focus:ring-4 focus:ring-[#0B3C5D]/5"
                aria-label="جستجو بر اساس نام محصول"
              />
            </form>
          </div>
        </>
      )}
    </>
  );
};

export default SearchBox;
