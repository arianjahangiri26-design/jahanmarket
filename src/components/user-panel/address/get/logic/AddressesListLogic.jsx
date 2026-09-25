"use client";

import { useEffect, useState, useCallback } from "react";
import { useFetch } from "@/hooks/crud/UseCrud";
import AddressesListView from "../ui/AddressesListView";
 
  
 
export default function AddressesListLogic() {
  const { request, loading } = useFetch();
  const [addresses, setAddresses] = useState([]);
  const [serverError, setServerError] = useState("");
  const [deletingId, setDeletingId] = useState("");

  // Fetch addresses on mount
  const fetchAddresses = useCallback(async () => {
    setServerError("");
    const res = await request({ method: "GET", url: "/api/user-panel/addresses" });
console.log(res);

    if (res.success) {
      setAddresses(res.data?.data || []);
    } else {
      setServerError(res.error || "خطا در دریافت آدرس‌ها");
    }
  }, [request]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  // Handle single address removal
  const handleDeleteAddress = async (id) => {
    setDeletingId(id);
    setServerError("");

    const res = await request({ method: "DELETE", url: `/api/addresses/${id}` });

    if (res.success) {
      setAddresses((prev) => prev.filter((item) => item._id !== id));
    } else {
      setServerError(res.error || "خطا در حذف آدرس");
    }

    setDeletingId("");
  };

  return (
    <AddressesListView
      addresses={addresses}
      loading={loading}
      serverError={serverError}
      deletingId={deletingId}
      onDelete={handleDeleteAddress}
    />
  );
}
