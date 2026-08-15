"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { useFetch } from "@/hooks/crud/UseCrud";
import FormProvider from "@/context/form/FormProvider";
import AddressForm from "../Form/AddressForm";
import { updateAddressSchema } from "@/lib/validators/address/address.validation";

export default function EditAddressLogic() {
  const { id } = useParams();
  const router = useRouter();

  const { request, loading } = useFetch();

  const [address, setAddress] = useState(null);
  const [serverError, setServerError] = useState("");

  // Fetch current address details for the edit form
  const fetchAddress = async () => {
    setServerError("");

    try {
      const response = await request({
        method: "GET",
        url: `/api/user-panel/addresses/${id}`,
      });

      const fetchedAddress =
        response?.data?.data ||
        response?.data ||
        response?.message?.data;

      if (response?.success && fetchedAddress) {
        setAddress(fetchedAddress);
        return;
      }

      setServerError(
        response?.data?.message ||
          response?.message ||
          response?.error ||
          "آدرس موردنظر پیدا نشد."
      );
    } catch {
      setServerError("خطا در دریافت اطلاعات آدرس");
    }
  };

  useEffect(() => {
    if (!id) return;

    fetchAddress();
  }, [id]);

  // Update the selected address
  const handleUpdateAddress = async (formData) => {
    setServerError("");

    try {
      const response = await request({
        method: "PUT",
        url: `/api/addresses/${id}`,
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
          "خطا در ویرایش آدرس"
      );
    } catch {
      setServerError("خطا در ارتباط با سرور");
    }
  };

  if (loading && !address) {
    return (
      <div className="flex w-full items-center justify-center py-16">
        <p className="text-sm text-slate-500">
          در حال دریافت اطلاعات آدرس...
        </p>
      </div>
    );
  }

  if (!address && serverError) {
    return (
      <div className="mx-auto mt-10 w-full max-w-xl rounded-xl border border-red-200 bg-red-50 p-4">
        <p className="text-center text-sm font-medium text-red-600">
          {serverError}
        </p>
      </div>
    );
  }

  return (
    <FormProvider
      key={address?._id}
      schema={updateAddressSchema}
      defaultValues={{
        province: address?.province || "",
        city: address?.city || "",
        plaque: address?.plaque || "",
        fullAddress: address?.fullAddress || "",
      }}
    >
      <AddressForm
        onSubmit={handleUpdateAddress}
        loading={loading}
        serverError={serverError}
        submitText="ویرایش آدرس"
      />
    </FormProvider>
  );
}
