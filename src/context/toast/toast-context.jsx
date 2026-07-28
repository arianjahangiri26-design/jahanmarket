"use client";

import { createContext, useContext, useMemo } from "react";
import { ToastProvider as HeroToastProvider, addToast } from "@heroui/toast";

const ToastContext = createContext(null);

const baseOptions = {
  variant: "flat",
  radius: "lg",
  timeout: 3000,
};

function showToast({ title, description, color = "default", ...options }) {
  addToast({
    ...baseOptions,
    title,
    description,
    color,
    ...options,
  });
}

export function AppToastProvider({ children }) {
  const toast = useMemo(
    () => ({
      show: showToast,

      success: (description, title = "موفق", options = {}) =>
        showToast({
          title,
          description,
          color: "success",
          ...options,
        }),

      error: (description, title = "خطا", options = {}) =>
        showToast({
          title,
          description,
          color: "danger",
          ...options,
        }),

      warning: (description, title = "هشدار", options = {}) =>
        showToast({
          title,
          description,
          color: "warning",
          ...options,
        }),

      info: (description, title = "اطلاع", options = {}) =>
        showToast({
          title,
          description,
          color: "primary",
          ...options,
        }),
    }),
    []
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <HeroToastProvider placement="top-right" />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside AppToastProvider");
  }

  return context;
}
