"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFetch } from "@/hooks/crud/UseCrud";

// ۱. ایمپورت کامپوننت کاستوم خودتان (مسیر زیر را با توجه به ساختار پروژه‌تان اصلاح کنید)
 
 
import MenuForm from "../form/FormMenu";
import { createMenuSchema } from "@/lib/validators/admin/menu/menu.validation";
import FormProvider from "@/context/form/FormProvider";

export default function CreateMenuLogic() {
  const router = useRouter();
  const { request, loading } = useFetch();

  const [menus, setMenus] = useState([]);
  const [serverError, setServerError] = useState("");

  const fetchMenus = async () => {
    const res = await request({
      method: "GET",
      url: "/api/admin/menu",
    });
    console.log(res);
    
    if (res?.success) {
      setMenus(res.data.message?.data || []);
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
    // ۲. پاس دادن اسکیما و دیفالت ولیوز به پراپ‌های تعریف شده در کامپوننت کاستوم شما
    <FormProvider
      schema={createMenuSchema}
      defaultValues={{
        title: "",
        url: "",
        parent: "",
        type: "normal",
        order: 0,
        isActive: true,
        iconImage: undefined,
      }}
    >
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
