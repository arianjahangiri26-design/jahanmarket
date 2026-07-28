 "use client";

import { HeroUIProvider } from "@heroui/react";

export function HeroProviders({ children }) {
  return <HeroUIProvider>{children}</HeroUIProvider>;
}
