"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFetch } from "@/hooks/crud/UseCrud";
   import { useFormContext } from "react-hook-form";

import UserForm from "../form/FormUserAdmin";
     

export default function EditUserLogic() {
  const { id } = useParams();
  const router = useRouter();
  const { request, loading } = useFetch();
  const methods = useFormContext();
  const { reset } = methods;

  /* =========================
     FETCH USER
  ========================= */
  useEffect(() => {
    const fetchUser = async () => {
      const res = await request({
        method: "GET",
        url: `/api/admin/users/${id}`,
      });

 
const user = res?.data?.message?.data;
      if (user) {
        reset({
          name: res.data?.message.data.name || "",
          phoneNumber: res.data?.message.data.phoneNumber || "",
          email: res.data?.message.data.email || "",
 
        });
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id]);

  /* =========================
     UPDATE USER
  ========================= */
  const handleUpdateUser = async (formData) => {

    
     const data = { ...formData };
    const res = await request({
      method: "PUT",
      url: `/api/admin/users/${id}`,
      data ,
    });

    if (res?.data?.success) {
      router.push("/admin/users");
    }
  };

  return (
    <UserForm
      onSubmit={handleUpdateUser}
      loading={loading}
      errors={methods.formState.errors}
    />
  );
}
