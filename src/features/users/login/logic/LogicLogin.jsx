// src/features/auth/login/LoginContent.jsx
"use client";

/**
 * Login flow (2 steps):
 *  Step 1: user enters an identifier (email or mobile number) -> server sends an OTP.
 *  Step 2: user enters the 6-digit OTP -> credentials sign-in via next-auth.
 *
 * Security notes:
 *  - Client-side validation is UX-only; the server must re-validate everything.
 *  - Generic server messages are shown so account existence is never leaked.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useFormContext } from "react-hook-form";

import FormProvider from "@/shared/form/FormProvider";
import Logindesign from "../design/FormLogin";
import OtpForm from "@/features/auth/otp-verify/OtpForm";
import { useFetch } from "@/hooks/crud/UseCrud";
import { sendOtpSchema, loginSchema } from "@/lib/validators/auth/auth.schema";

/**
 * Inner component: must live inside <FormProvider /> so it can access
 * react-hook-form context via useFormContext().
 */
function LoginFormInner() {
  // Current step of the login wizard (1 = identifier, 2 = OTP code)
  const [step, setStep] = useState(1);
  // Loading flag for the final sign-in request (distinct from useFetch loading)
  const [loadingLogin, setLoadingLogin] = useState(false);
  // Server-side error message shown to the user
  const [serverError, setServerError] = useState("");

  const router = useRouter();
  const methods = useFormContext();
  const { request, loading } = useFetch();

  /**
   * Step 1 handler: validate the identifier and ask the server to send an OTP.
   * On success we advance to step 2 (OTP entry).
   */
  const handleSendOtp = async () => {
    // Reset any previous errors before a new attempt
    setServerError("");
    methods.clearErrors();

    // Read and normalize the identifier (trim surrounding whitespace)
    const identifier = String(methods.getValues("identifier") || "").trim();

    // Validate with the shared Zod schema (UX-level validation only)
    const parsed = sendOtpSchema.safeParse({ identifier, type: "login" });

    if (!parsed.success) {
      // Map the first Zod issue back onto the corresponding form field
      const issue = parsed.error.issues?.[0];
      methods.setError(issue?.path?.[0] || "identifier", {
        type: "manual",
        message: issue?.message || "ایمیل یا شماره موبایل معتبر نیست",
      });
      return;
    }

    try {
      // Ask the backend to generate and send an OTP for this identifier
      const res = await request({
        method: "POST",
        url: "/api/auth/send-otp",
        data: { identifier: parsed.data.identifier, type: "login" },
      });

      // Accept 200/201 or an explicit success flag from the API
      if (res?.status === 200 || res?.status === 201 || res?.data?.success) {
        setStep(2);
        return;
      }

      // Generic message; avoid revealing whether the account exists
      setServerError(res?.data?.message || "شماره موبایل ثبت نشده است");
    } catch (error) {
      // Prefer the API's error message, fall back to a generic one
      setServerError(
        error?.response?.data?.message || error?.message || "ارسال کد تایید ناموفق بود"
      );
    }
  };

  /**
   * Step 2 handler: verify the OTP and sign in with next-auth credentials.
   * On success, redirect to home and refresh server components.
   */
  const handleLogin = async (data) => {
    setServerError("");
    methods.clearErrors();

    // Normalize inputs before validation
    const identifier = String(methods.getValues("identifier") || "").trim();
    const code = String(data?.code || methods.getValues("code") || "").trim();

    // Validate the full login payload (identifier + 6-digit code)
    const parsed = loginSchema.safeParse({ identifier, code });

    if (!parsed.success) {
      const issue = parsed.error.issues?.[0];
      methods.setError(issue?.path?.[0] || "code", {
        type: "manual",
        message: issue?.message || "اطلاعات ورود معتبر نیست",
      });
      return;
    }

    // Perform the credentials sign-in (redirect disabled so we can handle errors)
    setLoadingLogin(true);
    const res = await signIn("credentials", {
      identifier,
      code,
      redirect: false,
    });
    setLoadingLogin(false);

    if (res?.ok) {
      // Successful login: navigate home and refresh to sync session state
      router.push("/");
      router.refresh();
      return;
    }

    // Surface the sign-in failure to the user
    setServerError(res?.error || res?.message || "ورود ناموفق بود");
  };

  // Render the current step of the wizard
  return (
    <>
      {step === 1 && (
        <Logindesign
          handelLogin={handleSendOtp}
          loading={loading}
          serverError={serverError}
          errors={methods.formState.errors}
        />
      )}

      {step === 2 && (
        <OtpForm
          handelSendOtp={handleLogin}
          loading={loadingLogin}
          onResend={handleSendOtp}
          serverError={serverError}
        />
      )}
    </>
  );
}

/**
 * Public wrapper: supplies the form context with default values
 * for the identifier and OTP code fields.
 */
export default function LoginContent() {
  return (
    <FormProvider
      defaultValues={{ identifier: "", code: "" }}
    >
      <LoginFormInner />
    </FormProvider>
  );
}
