"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useFetch } from "@/hooks/crud/UseCrud";
import FormProvider from "@/context/form/FormProvider";
import AddressForm from "../Form/AddressForm";
import { createAddressSchema } from "@/lib/validators/admin/address/address.validation";
 
 
export default function CreateAddressLogic() {
  const router = useRouter();
  const { request, loading } = useFetch();

  const [serverError, setServerError] = useState("");

  // Create a new user address
  const handleCreateAddress = async (formData) => {
    setServerError("");

    try {
      const response = await request({
        method: "POST",
        url: "/api/user-panel/addresses",
        data: {
          province: formData.province,
          city: formData.city,
          plaque: formData.plaque,
          fullAddress: formData.fullAddress,
        },
      });

      const isSuccess = response?.success || response?.data?.success;

      if (isSuccess) {
        router.push("/profile/addresses");
        router.refresh();
        return;
      }

      setServerError(
        response?.data?.message ||
          response?.message ||
          response?.error ||
          "خطا در ثبت آدرس"
      );
    } catch {
      setServerError("خطا در ارتباط با سرور");
    }
  };

  return (
    <FormProvider
      schema={createAddressSchema}
      defaultValues={{
        province: "",
        city: "",
        plaque: "",
        fullAddress: "",
      }}
    >
      <AddressForm
        onSubmit={handleCreateAddress}
        loading={loading}
        serverError={serverError}
        submitText="ثبت آدرس"
      />
    </FormProvider>
  );
}
