"use client";

import { Toast } from "@heroui/react";

export function HeroProviders({ children }) {
  return <>
  
    <Toast.Provider />
  {children}</>;
}
