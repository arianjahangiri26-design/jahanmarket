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

const normalizeResponse = (response) => {
  const payload = response?.data?.data || response?.data || {};

  return {
    orders: Array.isArray(payload.orders) ? payload.orders : [],
    user: payload.user || DEFAULT_USER,
    summary: payload.summary || DEFAULT_SUMMARY,
  };
};

export default function OrdersLogic() {
  const { request, loading: apiLoading } = useFetch();
  const { data: session, status: sessionStatus } = useSession();

  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(DEFAULT_USER);
  const [summary, setSummary] = useState(DEFAULT_SUMMARY);
  const [serverError, setServerError] = useState("");

  const userId = session?.user?.id || null;
  const isLoading = apiLoading || sessionStatus === "loading";

  const resetData = useCallback(() => {
    setOrders([]);
    setUser(DEFAULT_USER);
    setSummary(DEFAULT_SUMMARY);
  }, []);

  const fetchOrders = useCallback(async () => {
    setServerError("");

    if (!userId) {
      resetData();
      setServerError("Please log in to view your orders.");
      return;
    }

    try {
      const response = await request({
        method: "GET",
        url: `/api/order?userId=${encodeURIComponent(userId)}`,
      });

      console.log("Orders response:", response);

      if (!response?.success) {
        resetData();

        setServerError(
          response?.message ||
            response?.error ||
            "Error fetching orders."
        );

        return;
      }

      const normalizedData = normalizeResponse(response);

      console.log("Normalized orders:", normalizedData);

      setOrders(normalizedData.orders);
      setUser(normalizedData.user);
      setSummary(normalizedData.summary);
    } catch (error) {
      console.error("FETCH ORDERS ERROR:", error);

      resetData();
      setServerError("Server connection error.");
    }
  }, [request, resetData, userId]);

  useEffect(() => {
    if (sessionStatus !== "loading") {
      fetchOrders();
    }
  }, [fetchOrders, sessionStatus]);

  return (
    <OrdersDashboard
      orders={orders}
      user={user}
      summary={summary}
      loading={isLoading}
      serverError={serverError}
      onRetry={fetchOrders}
    />
  );
}
