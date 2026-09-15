import { useState, useCallback } from "react";
import { categories } from "@/constants/layout/navigation";

export const useCategoryNavigation = () => {
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  const handleCategoryChange = useCallback((category) => {
    setActiveCategory(category);
  }, []);

  return {
    activeCategory,
    handleCategoryChange,
    categories,
  };
};

