"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import AdminFilterUI from "./AdminFilterUI";

export default function AdminFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentSort = searchParams.get("sort") || "newest";
  const currentStatus = searchParams.get("status") || "all";

  const setFilter = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value && value !== "all" && value !== "newest") {
        params.set(name, value);
      } else {
        params.delete(name);
      }

      if (params.has("page")) {
        params.set("page", "1");
      }

      const queryString = params.toString();
      const url = queryString ? `${pathname}?${queryString}` : pathname;

      startTransition(() => {
        router.push(url);
      });
    },
    [searchParams, pathname, router]
  );

  const setStatus = useCallback(
    (value) => {
      setFilter("status", value);
    },
    [setFilter]
  );

  const setSort = useCallback(
    (value) => {
      setFilter("sort", value);
    },
    [setFilter]
  );

  return (
    <AdminFilterUI
      currentSort={currentSort}
      currentStatus={currentStatus}
      setSort={setSort}
      setStatus={setStatus}
      pathname={pathname}
      isPending={isPending}
    />
  );
}
