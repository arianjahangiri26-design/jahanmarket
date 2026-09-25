// src/components/admin/menus/EditMenuLogic.jsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFetch } from "@/hooks/crud/UseCrud";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateMenuSchema } from "@/lib/validators/admin/menu/menu.validation";
import MenuForm from "../form/FormMenu";
 
export default function EditMenuLogic() {
  const { id } = useParams();
  const router = useRouter();

  const methods = useForm({
    resolver: zodResolver(updateMenuSchema),
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

  const { reset } = methods;
  const { request, loading } = useFetch();

  const [menus, setMenus] = useState([]);
  const [currentIcon, setCurrentIcon] = useState("");
  const [serverError, setServerError] = useState("");

  const fetchMenus = async () => {
    const res = await request({
      method: "GET",
      url: "/api/admin/menu",
    });
    if (res?.success) {
      const list = res.data?.message?.data || res.message?.data || [];
      // فیلتر کردن خود آیتم برای جلوگیری از انتخاب خود به عنوان والد
      setMenus(list.filter((m) => m._id !== id));
    }
  };

  const fetchMenu = async () => {
    const res = await request({
      method: "GET",
      url: `/api/admin/menu/${id}`,
    });

    if (res?.success) {
      const menu = res.data?.message?.data || res.data || res.message?.data;
      if (!menu) return;

      if (menu.iconImage) {
        setCurrentIcon(menu.iconImage);
      }

      reset({
        title: menu.title || "",
        url: menu.url || "",
        parent: menu.parent?._id || menu.parent || "",
        type: menu.type || "normal",
        order: menu.order || 0,
        isActive: Boolean(menu.isActive),
      });
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchMenus();
    fetchMenu();
  }, [id]);

  const handleUpdateMenu = async (formData) => {
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
        method: "PUT",
        url: `/api/admin/menu/${id}`,
        data,
      });

      if (res?.success) {
        router.push("/admin/menu");
      } else {
        setServerError(res?.data?.message || res?.error || "خطا در ویرایش منو");
      }
    } catch {
      setServerError("خطا در ارتباط با سرور");
    }
  };

  return (
    <FormProvider {...methods}>
      <MenuForm
        onSubmit={handleUpdateMenu}
        loading={loading}
        serverError={serverError}
        menus={menus}
        currentIcon={currentIcon}
        submitText="ویرایش منو"
      />
    </FormProvider>
  );
}
