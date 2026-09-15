"use client";

   import { useFormContext } from "react-hook-form";

import RegisterDesign from "../FormRegister";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFetch } from "@/hooks/crud/UseCrud";
import OtpForm from "@/features/auth/otp-verify/OtpForm";
import { useWatch } from "react-hook-form";

// Constants for validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^09\d{9}$/;

/**
 * RegisterContent: Manages the 2-step registration flow.
 */
function RegisterContent() {
  const [step, setStep] = useState(1);
  const [serverError, setServerError] = useState("");
  const [preferredOtpTarget, setPreferredOtpTarget] = useState("email");
  const [sentOtpTarget, setSentOtpTarget] = useState("");
  
  const router = useRouter();
  const methods = useFormContext();
  const { request, loading } = useFetch();

  // Watch inputs to reactively update target preferences
  const emailValue = useWatch({ control: methods.control, name: "email" });
  const phoneValue = useWatch({ control: methods.control, name: "phoneNumber" });

  const cleanEmail = emailValue?.trim() || "";
  const cleanPhone = phoneValue?.trim() || "";

  const isEmailValid = EMAIL_REGEX.test(cleanEmail);
  const isPhoneValid = PHONE_REGEX.test(cleanPhone);

  const hasEmail = Boolean(cleanEmail && isEmailValid);
  const hasPhoneNumber = Boolean(cleanPhone && isPhoneValid);
  const hasBothContact = hasEmail && hasPhoneNumber;

  // Automatically adjust target if only one contact method is provided
  useEffect(() => {
    if (!hasBothContact) {
      if (hasEmail) setPreferredOtpTarget("email");
      else if (hasPhoneNumber) setPreferredOtpTarget("phone");
    }
  }, [hasEmail, hasPhoneNumber, hasBothContact]);

  /**
   * Step 1: Request OTP from server
   */
  const handleSendOtp = async (data) => {
    setServerError("");
    try {
      const response = await request({
        method: "POST",
        url: "/api/auth/send-otp",
        data: {
          type: "register",
          email: data.email?.trim() || undefined,
          phoneNumber: data.phoneNumber?.trim() || undefined,
          preferredOtpTarget,
          name: data.name,
        },
      });

      if (response?.data?.success || response?.status === 201) {
        setSentOtpTarget(response?.data?.data?.target || preferredOtpTarget);
        setStep(2); // Move to OTP verification step
      } else {
        setServerError(response?.data?.message || "Failed to send code.");
      }
    } catch (error) {
      setServerError(error?.response?.data?.message || "Communication error occurred.");
    }
  };

  /**
   * Step 2: Verify OTP and finalize registration
   */
  const handleVerifyAndRegister = async (data) => {
    setServerError("");
    try {
      const response = await request({
        method: "POST",
        url: "/api/auth/otp-verify",
        data: {
          name: data.name,
          phoneNumber: sentOtpTarget === "phone" ? cleanPhone : undefined,
          email: sentOtpTarget === "email" ? cleanEmail : undefined,
          code: data.code,
        },
      });

      if (response?.data?.success || response?.status === 201) {
        router.push("/auth/login"); // Success: Redirect to login
      } else {
        setServerError(response?.data?.message || "Registration failed.");
      }
    } catch (error) {
      setServerError(error?.response?.data?.message || "Verification failed.");
    }
  };

  return (
    <div>
      {/* Step 1: Name and Contact Info */}
      {step === 1 && (
        <RegisterDesign
          onSubmit={handleSendOtp}
          serverError={serverError}
          loading={loading}
          hasBothContact={hasBothContact}
          preferredOtpTarget={preferredOtpTarget}
          setPreferredOtpTarget={setPreferredOtpTarget}
        />
      )}

      {/* Step 2: OTP Entry */}
      {step === 2 && (
        <OtpForm
          loading={loading}
          handelSendOtp={handleVerifyAndRegister} // This is the submit handler
          serverError={serverError}
          onResend={() => handleSendOtp(methods.getValues())} // Pass current form values to resend
        />
      )}
    </div>
  );
}

export default RegisterContent;
