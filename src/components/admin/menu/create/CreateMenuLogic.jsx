// src/components/admin/menus/CreateMenuLogic.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFetch } from "@/hooks/crud/UseCrud";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
 
import MenuForm from "../form/FormMenu";
import { createMenuSchema } from "@/lib/validators/admin/menu/menu.validation";
 
 
  
export default function CreateMenuLogic() {
  const router = useRouter();
  const { request, loading } = useFetch();

  const [menus, setMenus] = useState([]);
  const [serverError, setServerError] = useState("");

  const methods = useForm({
    resolver: zodResolver(createMenuSchema),
    defaultValues: {
      title: "",
      url: "",
      parent: "",
      type: "normal",
      order: 0,
      isActive: true,
      iconImage: undefined,
    },
  });

  const fetchMenus = async () => {
    const res = await request({
      method: "GET",
      url: "/api/admin/menu",
    });
    if (res?.success) {
      setMenus(res?.message?.data || []);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const handleCreateMenu = async (formData) => {
    setServerError("");
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("url", formData.url || "");
      data.append("parent", formData.parent || "");
      data.append("type", formData.type || "normal");
      data.append("order", String(formData.order || 0));
      data.append("isActive", formData.isActive ? "true" : "false");

      if (formData.iconImage?.[0]) {
        data.append("iconImage", formData.iconImage[0]);
      }

      const res = await request({
        method: "POST",
        url: "/api/admin/menu",
        data,
      });

      if (res?.success) {
        router.push("/admin/menu");
      } else {
        setServerError(res?.data?.message || res?.error || "خطا در ایجاد منو");
      }
    } catch {
      setServerError("خطا در ارتباط با سرور");
    }
  };

  return (
    <FormProvider {...methods}>
      <MenuForm
        onSubmit={handleCreateMenu}
        loading={loading}
        serverError={serverError}
        menus={menus}
        submitText="ایجاد منو جدید"
      />
    </FormProvider>
  );
}
