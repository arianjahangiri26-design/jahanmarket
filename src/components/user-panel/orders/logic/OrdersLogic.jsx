"use client";

import { useCallback, useEffect, useState } from "react";

import { useSession } from "next-auth/react";

import { useFetch } from "@/hooks/crud/UseCrud";
import OrdersDashboard from "../ui/OrdersDashboard";
 
 
const DEFAULT_SUMMARY = {
  totalOrders: 0,
  totalSpent: 0,
  pendingCount: 0,
};

const DEFAULT_USER = {
  id: null,
  name: "",
  email: "",
  image: null,
};

/**
 * Extracts the normalized API data from the response.
 *
 * Expected API response:
 * {
 *   success: true,
 *   data: {
 *     user,
 *     orders,
 *     summary
 *   }
 * }
 */
const normalizeResponse = (response) => {
  const data = response?.data || {};

  return {
    user: data?.user || DEFAULT_USER,
    orders: Array.isArray(data?.orders) ? data.orders : [],
    summary: data?.summary || DEFAULT_SUMMARY,
  };
};

export default function OrdersLogic() {
  const { request, loading } = useFetch();

  // Read the authenticated user from the NextAuth session.
  const { data: session, status } = useSession();

  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(DEFAULT_USER);
  const [summary, setSummary] = useState(DEFAULT_SUMMARY);
  const [serverError, setServerError] = useState("");

  const userId = session?.user?.id || null;

  const fetchOrders = useCallback(async () => {
    setServerError("");

    // Do not call the API when the user is not authenticated.
    if (!userId) {
      setOrders([]);
      setUser(DEFAULT_USER);
      setSummary(DEFAULT_SUMMARY);
      setServerError("برای مشاهده سفارش‌ها ابتدا وارد حساب کاربری شوید.");
      return;
    }

    try {
      const response = await request({
        method: "GET",
        // Pass the user id to the backend as a query parameter.
        url: `/api/order?userId=${encodeURIComponent(userId)}`,
      });

      if (!response?.success) {
        setOrders([]);
        setUser(DEFAULT_USER);
        setSummary(DEFAULT_SUMMARY);

        setServerError(
          response?.message ||
            response?.error ||
            "خطا در دریافت سفارش‌ها"
        );

        return;
      }

      const normalizedData = normalizeResponse(response);

      setOrders(normalizedData.orders);
      setUser(normalizedData.user);
      setSummary(normalizedData.summary);
    } catch (error) {
      console.error("FETCH ORDERS ERROR:", error);

      setOrders([]);
      setUser(DEFAULT_USER);
      setSummary(DEFAULT_SUMMARY);
      setServerError("خطا در ارتباط با سرور");
    }
  }, [request, userId]);

  useEffect(() => {
    // Wait until the session is fully loaded before fetching.
    if (status !== "loading") {
      fetchOrders();
    }
  }, [fetchOrders, status]);

  return (
    <OrdersDashboard
      orders={orders}
      user={user}
      loading={loading || status === "loading"}
      serverError={serverError}
      summary={summary}
      onRetry={fetchOrders}
    />
  );
}
