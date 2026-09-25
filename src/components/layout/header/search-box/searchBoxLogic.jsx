// src/components/layout/header/search-box/searchBoxLogic.js
"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

export const useSearchBox = (onSearch) => {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const handleInputChange = useCallback((event) => {
    setSearchQuery(event.target.value);
  }, []);

  const handleSearch = useCallback(
    (event) => {
      event.preventDefault();

      const query = searchQuery.trim();

      // از ارسال جست‌وجوی خالی جلوگیری می‌کند
      if (!query) return;

      if (typeof onSearch === "function") {
        onSearch(query);
      }

      // انتقال به صفحه همه محصولات همراه با عبارت جست‌وجو
      router.push(`/categories/all?q=${encodeURIComponent(query)}`);

      setIsMobileSearchOpen(false);
    },
    [onSearch, router, searchQuery]
  );

  const handleMobileSearchToggle = useCallback(() => {
    setIsMobileSearchOpen((previousState) => !previousState);
  }, []);

  const closeMobileSearch = useCallback(() => {
    setIsMobileSearchOpen(false);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  return {
    searchQuery,
    isMobileSearchOpen,
    handleInputChange,
    handleSearch,
    handleMobileSearchToggle,
    closeMobileSearch,
    clearSearch,
  };
};
