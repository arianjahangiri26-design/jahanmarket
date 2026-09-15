const phoneRegex = /^09\d{9}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const clean = (value) => value?.trim() || "";

const isEmail = (value) => emailRegex.test(value);
const isPhone = (value) => phoneRegex.test(value);

export function resolveAuthContact({
  identifier,
  email,
  phoneNumber,
  preferredOtpTarget = "email",
}) {
  const cleanIdentifier = clean(identifier);
  const cleanEmail = clean(email);
  const cleanPhoneNumber = clean(phoneNumber);

  const finalEmail = cleanEmail || (isEmail(cleanIdentifier) ? cleanIdentifier : "");
  const finalPhoneNumber =
    cleanPhoneNumber || (isPhone(cleanIdentifier) ? cleanIdentifier : "");

  const hasEmail = isEmail(finalEmail);
  const hasPhone = isPhone(finalPhoneNumber);

  if (!hasEmail && !hasPhone) {
    return { error: "لطفاً ایمیل یا شماره موبایل معتبر وارد کنید" };
  }

  const selectedTarget =
    hasEmail && hasPhone
      ? preferredOtpTarget === "phone"
        ? "phone"
        : "email"
      : hasEmail
        ? "email"
        : "phone";

  return {
    email: selectedTarget === "email" ? finalEmail : null,
    phoneNumber: selectedTarget === "phone" ? finalPhoneNumber : null,
    selectedTarget,
  };
}
