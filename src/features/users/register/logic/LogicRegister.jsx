// src/features/auth/register/RegisterContent.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormContext, useWatch } from "react-hook-form";

import RegisterDesign from "../FormRegister";
import { useFetch } from "@/hooks/crud/UseCrud";
import OtpForm from "@/features/auth/otp-verify/OtpForm";
import { registerSchema } from "@/lib/validators/auth/auth.schema";

// Iranian mobile number format: starts with 09, followed by 9 digits
const PHONE_REGEX = /^09\d{9}$/;

function RegisterContent() {
  // Wizard step: 1 = registration form, 2 = OTP verification
  const [step, setStep] = useState(1);
  // Server-side error message shown to the user
  const [serverError, setServerError] = useState("");
  // User's preferred OTP channel (email or phone); only a UX hint
  const [preferredOtpTarget, setPreferredOtpTarget] = useState("email");
  // Destination the server actually sent the OTP to (locked after first send)
  const [sentOtpTarget, setSentOtpTarget] = useState("");
  // Server-issued challenge id binding this OTP session to the user's data
  const [challengeId, setChallengeId] = useState("");

  const router = useRouter();
  const methods = useFormContext();
  const { request, loading } = useFetch();

  // Subscribe to live form values so contact availability updates reactively
  const emailValue = useWatch({ control: methods.control, name: "email" });
  const phoneValue = useWatch({ control: methods.control, name: "phoneNumber" });

  // Normalized (trimmed) contact values
  const cleanEmail = String(emailValue || "").trim();
  const cleanPhone = String(phoneValue || "").trim();

  const hasEmail = cleanEmail.length > 0;
  const hasPhoneNumber = PHONE_REGEX.test(cleanPhone);
  const hasBothContact = hasEmail && hasPhoneNumber;

  // Keep the preferred OTP target consistent with what the user filled in.
  useEffect(() => {
    if (!hasBothContact) {
      if (hasEmail) setPreferredOtpTarget("email");
      else if (hasPhoneNumber) setPreferredOtpTarget("phone");
    }
  }, [hasEmail, hasPhoneNumber, hasBothContact]);

  /** Normalize different API response shapes into a single payload object. */
  const extractPayload = (response) => response?.data?.data || response?.data || {};

  /** Treat 200/201 or an explicit `success: true` flag as a successful response. */
  const isSuccess = (response) =>
    response?.data?.success === true ||
    response?.status === 200 ||
    response?.status === 201;

  /**
   * Step 1 handler: validate the registration data and request an OTP.
   * Once an OTP has been sent, the destination is locked and cannot change.
   */
  const handleSendOtp = async (formData, targetOverride) => {
    setServerError("");
    methods.clearErrors?.();

    const lockedTarget = sentOtpTarget;
    const requested =
      targetOverride === "phone" || targetOverride === "email"
        ? targetOverride
        : preferredOtpTarget;
    const target = lockedTarget || requested;

    if (target === "phone" && !hasPhoneNumber) {
      setServerError("شماره موبایل واردشده معتبر نیست.");
      return;
    }
    if (target === "email" && !hasEmail) {
      setServerError("ایمیل را وارد کنید.");
      return;
    }

    const formDataToValidate = {
      name: String(formData?.name || "").trim(),
      email: hasEmail ? cleanEmail : undefined,
      phoneNumber: hasPhoneNumber ? cleanPhone : undefined,
      preferredOtpTarget: target,
      type: "register",
    };

    const parsed = registerSchema.safeParse(formDataToValidate);
    if (!parsed.success) {
      const issue = parsed.error.issues?.[0];
      methods.setError?.(issue?.path?.[0] || "name", {
        type: "manual",
        message: issue?.message || "اطلاعات واردشده معتبر نیست.",
      });
      return;
    }

    try {
      const response = await request({
        method: "POST",
        url: "/api/auth/send-otp",
        data: {
          type: "register",
          name: parsed.data.name,
          email: parsed.data.email,
          phoneNumber: parsed.data.phoneNumber,
          preferredOtpTarget: target,
        },
      });

      if (!isSuccess(response)) {
        setServerError(extractPayload(response)?.message || "ارسال کد تأیید با خطا مواجه شد.");
        return;
      }

      const payload = extractPayload(response);
      const returnedTarget = payload?.target;
      const returnedChallengeId = payload?.challengeId;

      if (!returnedChallengeId) {
        setServerError("شناسه امنیتی OTP از سرور دریافت نشد. پاسخ API را بررسی کنید.");
        return;
      }

      setSentOtpTarget(returnedTarget || target);
      setChallengeId(returnedChallengeId);
      setStep(2);
    } catch (error) {
      setServerError(error?.response?.data?.message || "خطا در برقراری ارتباط با سرور.");
    }
  };

  /**
   * Step 2 handler: verify the OTP against the stored challengeId.
   * The backend must resolve the user's identity from the challengeId,
   * NOT from client-supplied fields.
   */
  const handleVerifyAndRegister = async (otpData) => {
    setServerError("");

    if (!challengeId) {
      setServerError("درخواست OTP معتبر نیست. دوباره تلاش کنید.");
      setStep(1);
      return;
    }

    try {
      const response = await request({
        method: "POST",
        url: "/api/auth/otp-verify",
        data: {
          challengeId,
          code: String(otpData?.code || "").trim(),
        },
      });

      if (!isSuccess(response)) {
        setServerError(extractPayload(response)?.message || "کد واردشده نامعتبر است.");
        return;
      }

      router.replace("/auth/login");
    } catch (error) {
      setServerError(error?.response?.data?.message || "خطا در تأیید کد.");
    }
  };

  /** Resend the OTP to the SAME destination it was originally sent to. */
  const handleResendOtp = async () => {
    const formData = methods.getValues();
    await handleSendOtp(formData, sentOtpTarget || undefined);
  };

  return (
    <div>
      {step === 1 && (
        <RegisterDesign
          onSubmit={handleSendOtp}
          serverError={serverError}
          loading={loading}
          hasBothContact={hasBothContact}
          preferredOtpTarget={preferredOtpTarget}
          setPreferredOtpTarget={setPreferredOtpTarget}
          handleSubmit={methods.handleSubmit}
        />
      )}

      {step === 2 && (
        <OtpForm
          loading={loading}
          handelSendOtp={handleVerifyAndRegister}
          serverError={serverError}
          onResend={handleResendOtp}
        />
      )}
    </div>
  );
}

export default RegisterContent;
