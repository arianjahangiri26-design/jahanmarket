"use client";

import { useEffect, useState } from "react";
import { useFetch } from "@/hooks/crud/UseCrud";

/**
 * EditPhoneLogic
 * - Fetches current profile
 * - Sends PATCH to update phoneNumber
 * - Keeps UI-focused state (loading/errors)
 */
export default function EditPhoneLogic() {
  const { request, loading } = useFetch();
  const [phone, setPhone] = useState("");
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");

  // Load profile on mount
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await request({ method: "GET", url: "/api/user-panel/profile" });
        if (res?.success && mounted) {
          setPhone(res.data?.phoneNumber || "");
        }
      } catch (e) {
        // ignore
      }
    };
    load();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async () => {
    setServerError("");
    setSuccess("");

    try {
      const res = await request({ method: "PATCH", url: "/api/user-panel/profile", data: { phoneNumber: phone } });
      if (res?.success) {
        setSuccess("شماره تلفن با موفقیت بروزرسانی شد.");
        return;
      }

      setServerError(res?.message || res?.error || "خطا در بروزرسانی");
    } catch (err) {
      setServerError("خطا در ارتباط با سرور");
    }
  };

  return {
    phone,
    setPhone,
    loading,
    serverError,
    success,
    onSave: handleSave,
  };
}
