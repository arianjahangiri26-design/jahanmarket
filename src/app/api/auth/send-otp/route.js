import crypto from "crypto";
import connectToDatabase from "@/lib/database/db";
import users from "@/models/users";
import Otp from "@/models/otp";
import { sendOtpSchema } from "@/lib/validators/auth/auth.schema";
import { ZodError } from "zod";
import { resolveAuthContact } from "@/lib/auth/resolveAuthContact";
import { hashOtpCode } from "@/lib/auth/otpHash";
import { errorResponse, successResponse } from "@/lib/utils/apiResponse";

const RESEND_COOLDOWN_MS = 60 * 1000; // حداقل فاصله بین دو ارسال (دفاع سمت سرور، مستقل از تایمر فرانت)

export async function POST(req) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const validated = sendOtpSchema.parse(body);
    const contact = resolveAuthContact(validated);

    if (contact.error) {
      return errorResponse(contact.error, 400);
    }

    const userQuery = contact.email
      ? { email: contact.email }
      : { phoneNumber: contact.phoneNumber };

    const existingUser = await users.findOne(userQuery);

    if (validated.type === "register" && existingUser) {
      return errorResponse("این حساب کاربری قبلاً ثبت شده است", 400);
    }

    if (validated.type === "login" && !existingUser) {
      return errorResponse("کاربری با این اطلاعات یافت نشد", 404);
    }

    // جلوگیری از اسپم/بمباران ارسال کد: اگر کد قبلی هنوز خیلی تازه است، ارسال جدید را رد کن
    const previousOtp = await Otp.findOne({
      email: contact.email,
      phoneNumber: contact.phoneNumber,
    });

    if (
      previousOtp &&
      Date.now() - previousOtp.updatedAt?.getTime?.() < RESEND_COOLDOWN_MS
    ) {
      return errorResponse("لطفاً کمی صبر کنید و دوباره تلاش کنید", 429);
    }

    // بازه‌ی 100000 تا 999999 هر دو سر شامل
    const code = crypto.randomInt(100000, 1000000).toString();

    await Otp.findOneAndUpdate(
      { email: contact.email, phoneNumber: contact.phoneNumber },
      {
        phoneNumber: contact.phoneNumber,
        email: contact.email,
        code: hashOtpCode(code), // کد فقط به‌صورت هش‌شده ذخیره می‌شود
        attempts: 0,
        kind: validated.type === "register" ? 1 : 2,
        expireAt: new Date(Date.now() + 10 * 60 * 1000),
      },
      { upsert: true, new: true }
    );

    // TODO: اینجا کد خام (code) باید واقعاً از طریق SMS/Email برای کاربر ارسال شود
    // و هرگز در پاسخ API برگردانده نشود.

    return successResponse(
      "کد تایید با موفقیت ارسال شد",
      201,
      { target: contact.selectedTarget }
    );
  } catch (err) {
    if (err instanceof ZodError) {
      return errorResponse(err.issues?.[0]?.message || "خطای اعتبارسنجی", 400);
    }

    console.error("OTP API ERROR:", err);
    return errorResponse(err.message || "خطای سرور", 500);
  }
}
 
