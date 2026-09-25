import crypto from "crypto";

// هش کردن کد OTP قبل از ذخیره در دیتابیس تا در صورت نشت دیتابیس
// کدهای معتبر لو نروند
export function hashOtpCode(code) {
  return crypto.createHash("sha256").update(String(code)).digest("hex");
}
