"use client";

import { useMemo } from "react";
import { useFetch } from "@/hooks/crud/UseCrud";

const MENUS_REQUEST = {
  method: "GET",
  url: "/api/admin/menu",
};

export const useNavigationLogic = () => {
  const { data, loading, error } = useFetch(MENUS_REQUEST);

  // ۱. فیلتر و مرتب‌سازی اولیه منوهای فعال بر اساس اولویت
  const activeSortedMenus = useMemo(() => {
    const rawData = data?.message?.data ?? data?.data ?? data?.menus ?? data;
    if (!Array.isArray(rawData)) return [];
    return rawData
      .filter((menu) => menu && menu.isActive === true)
      .sort((a, b) => (Number(a?.order) || 0) - (Number(b?.order) || 0));
  }, [data]);

  // ۲. ساختاردهی درختی با پشتیبانی از فیلد parent به صورت شیء (Object)
  const menuTree = useMemo(() => {
    if (activeSortedMenus.length === 0) return [];

    const map = {};
    const roots = [];

    // ساخت یک نقشه (Map) از منوها جهت دسترسی O(1)
    activeSortedMenus.forEach((menu) => {
      map[menu._id] = { ...menu, children: [] };
    });

    activeSortedMenus.forEach((menu) => {
      const mapped = map[menu._id];
      // استخراج ID والد با توجه به اینکه parent می‌تواند Object یا String یا null باشد
      const parentId = typeof menu.parent === "object" ? menu.parent?._id : menu.parent;

      if (parentId && map[parentId]) {
        // افزودن به لیست فرزندان والد مربوطه
        map[parentId].children.push(mapped);
      } else {
        // قرارگیری به عنوان منوی سطح اول (ریشه)
        roots.push(mapped);
      }
    });

    return roots;
  }, [activeSortedMenus]);

  // ۳. تفکیک لینک‌های ناوبری عادی و مگامنو
  const navLinks = useMemo(() => {
    return menuTree.filter((menu) => menu.type === "normal");
  }, [menuTree]);

  const megaLinks = useMemo(() => {
    return menuTree.filter((menu) => menu.type === "mega");
  }, [menuTree]);

  return {
    menus: menuTree,
    navLinks,
    megaLinks,
    loading,
    error: error || null,
    hasMenus: menuTree.length > 0,
  };
};
