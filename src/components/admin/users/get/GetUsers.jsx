"use client";

import { useEffect } from "react";
import { useFetch } from "@/hooks/crud/UseCrud";
import AdminTable from "@/shared/admin/AdminTable";
import Link from "next/link";
import { FormProvider } from "react-hook-form";

export default function UsersListLogic() {
  const { request, data, loading } = useFetch();

  const fetchUsers = async () => {
    await request({
      method: "GET",
      url: "/api/admin/users",
    });
  };
 
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
   

    const res = await request({
      method: "DELETE",
      url: `/api/admin/users/${id}`,
    });

    if (res?.data?.success) {
      fetchUsers();
    }
  };

  const columns = [
    { key: "name", label: "نام" },
    { key: "phoneNumber", label: "شماره موبایل" },
    { key: "email", label: "ایمیل" },
  ];

  if (loading) return <p>Loading...</p>;

  return (
     <FormProvider     defaultValues={{
            phoneNumber: "",
            code: "",
          }}>

    <AdminTable
      columns={columns}
      data={data?.message.data  }
      actions={(user) => (
        <>
          <Link
            href={`/admin/users/edite/${user._id}`}
            className="text-blue-400 hover:text-blue-300"
          >
            ویرایش
          </Link>

          <button
            onClick={() => handleDelete(user._id)}
              type="button"
            className="text-red-400 hover:text-red-300"
          >
            حذف
          </button>
        </>
      )}
    />
    </FormProvider>
  );
}
