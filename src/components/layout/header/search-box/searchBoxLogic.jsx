import { useState, useCallback } from "react";

/**
 * useSearchBox Hook
 * مدیریت منطق و state کامپوننت SearchBox
 * 
 * @param {Function} onSearch - تابع اجرا شده هنگام جستجو
 * @returns {Object} Object شامل state ها و handler ها
 */
export const useSearchBox = (onSearch) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const handleSearch = useCallback(
    (e) => {
      e.preventDefault();
      if (onSearch && searchQuery.trim()) {
        onSearch(searchQuery.trim());
      }
    },
    [onSearch, searchQuery]
  );

  const handleInputChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleMobileSearchToggle = useCallback(() => {
    setIsMobileSearchOpen((prev) => !prev);
  }, []);

  const closeMobileSearch = useCallback(() => {
    setIsMobileSearchOpen(false);
  }, []);

  return {
    searchQuery,
    isMobileSearchOpen,
    handleSearch,
    handleInputChange,
    handleMobileSearchToggle,
    closeMobileSearch,
  };
};

