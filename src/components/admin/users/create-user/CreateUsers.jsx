"use client";

import { useFetch } from "@/hooks/crud/UseCrud";
   import { useFormContext } from "react-hook-form";

import { useRouter } from "next/navigation";
import UserForm from "../components/UserForm";

/**
 * Logic component responsible for creating a new user
 */

export default function CreateUserLogic() {
  const router = useRouter();
  const methods = useFormContext();
  const formData = methods.watch();
  const errors = methods.formState.errors;

  const { request, loading } = useFetch();

  const handleCreateUser = async () => {
    const res = await request({
      method: "POST",
      url: "/api/admin/users",
      data: formData,
    });

    if (res?.data?.success) {
      router.push("/admin/users");
    }
  };

  return (
    <UserForm
      onSubmit={handleCreateUser}
      loading={loading}
      errors={errors}
    />
  );
}
