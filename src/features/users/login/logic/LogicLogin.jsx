"use client";

import OtpForm from "@/features/auth/otp-verify/OtpForm";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";

import { useFetch } from "@/hooks/crud/UseCrud";
import Logindesign from "../design/FormLogin";
import { sendOtpSchema, loginSchema } from "@/lib/validators/auth/auth.schema";

function LoginContent() {
  const [step, setStep] = useState(1);
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [serverError, setServerError] = useState("");

  const router = useRouter();
  const { request, loading } = useFetch();

  // مقداردهی اصلی فرم به همراه defaultValues
  const methods = useForm({
    defaultValues: {
      identifier: "",
      code: "",
    },
    mode: "onTouched",
  });

  const { getValues, setError, clearErrors } = methods;

  const handelSendOtp = async () => {
    setServerError("");
    clearErrors();

    const identifier = getValues("identifier")?.trim() || "";

    const parsed = sendOtpSchema.safeParse({
      identifier,
      type: "login",
    });

    if (!parsed.success) {
      const issue = parsed.error.issues?.[0];

      setError(issue?.path?.[0] || "identifier", {
        type: "manual",
        message: issue?.message || "ایمیل یا شماره موبایل معتبر نیست",
      });

      return;
    }

    try {
      const res = await request({
        method: "POST",
        url: "/api/auth/send-otp",
        data: {
          identifier,
          type: "login",
        },
      });

      if (res?.status === 200 || res?.status === 201 || res?.data?.success) {
        setStep(2);
        return;
      }

      setServerError(
        res?.data?.message || res?.message || "شماره موبایل ثبت نشده است"
      );
    } catch (error) {
      setServerError(
        error?.response?.data?.message ||
          error?.message ||
          "ارسال کد تایید ناموفق بود"
      );
    }
  };

  const handelLogin = async (data) => {
    setServerError("");
    clearErrors();

    const identifier = getValues("identifier")?.trim() || "";
    const code = data?.code?.trim() || getValues("code")?.trim() || "";

    const parsed = loginSchema.safeParse({
      identifier,
      code,
    });

    if (!parsed.success) {
      const issue = parsed.error.issues?.[0];

      setError(issue?.path?.[0] || "code", {
        type: "manual",
        message: issue?.message || "اطلاعات ورود معتبر نیست",
      });

      return;
    }

    setLoadingLogin(true);

    const res = await signIn("credentials", {
      identifier,
      code,
      redirect: false,
    });

    setLoadingLogin(false);

    if (res?.ok) {
      router.push("/");
      router.refresh();
      return;
    }

    setServerError(res?.error || res?.message || "ورود ناموفق بود");
  };

  return (
    <FormProvider {...methods}>
      <div>
        {step === 1 && (
          <Logindesign
            handelLogin={handelSendOtp}
            loading={loading}
            serverError={serverError}
          />
        )}

        {step === 2 && (
          <OtpForm
            handelSendOtp={handelLogin}
            loading={loadingLogin}
            onResend={() => handelSendOtp()}
            serverError={serverError}
          />
        )}
      </div>
    </FormProvider>
  );
}

export default LoginContent;
