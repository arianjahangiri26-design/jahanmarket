import connectToDatabase from "@/lib/database/db";
import users from "@/models/users";
import { userAuth } from "@/lib/validators/auth/auth.schema";
import otp from "@/models/otp";
import { ZodError } from "zod";
import { resolveAuthContact } from "@/lib/auth/resolveAuthContact";
 
import { errorResponse, successResponse } from "@/lib/utils/apiResponse";
import { hashOtpCode } from "@/lib/auth/otpHash";
 
const MAX_ATTEMPTS = 5;

const verifyOtp = async (req) => {
  try {
    await connectToDatabase();

    const body = await req.json();
    const validatedData = userAuth.parse(body);

    const {
      identifier,
      phoneNumber,
      email,
      preferredOtpTarget,
      AvatarImage,
      role,
      name,
      code,
    } = validatedData;

    const contact = resolveAuthContact({
      identifier,
      phoneNumber,
      email,
      preferredOtpTarget,
    });

    if (contact.error) {
      return errorResponse(contact.error, 400);
    }

    const query = contact.email
      ? { email: contact.email }
      : { phoneNumber: contact.phoneNumber };

    const existingUser = await users.findOne(query);

    if (existingUser) {
      return errorResponse("حساب کاربری قبلاً ثبت شده است", 400);
    }

    const otpDoc = await otp.findOne({ kind: 1, ...query });

    if (!otpDoc) {
      return errorResponse("کد نامعتبر است", 400);
    }

    if (otpDoc.expireAt < new Date()) {
      await otp.deleteOne({ _id: otpDoc._id });
      return errorResponse("کد منقضی شده است", 400);
    }

    if ((otpDoc.attempts || 0) >= MAX_ATTEMPTS) {
      await otp.deleteOne({ _id: otpDoc._id });
      return errorResponse("تعداد تلاش‌های شما بیش از حد مجاز است. کد جدید درخواست کنید", 429);
    }

    const isCodeValid = otpDoc.code === hashOtpCode(code);

    if (!isCodeValid) {
      await otp.updateOne({ _id: otpDoc._id }, { $inc: { attempts: 1 } });
      return errorResponse("کد نامعتبر است", 400);
    }

    const user = await users.create({
      name,
      phoneNumber: contact.phoneNumber || null,
      email: contact.email || null,
      AvatarImage,
      role,
      IsActive: true,
      kind: 1,
    });

    // ✅ باگ رفع شد: قبلاً { id: otpDoc._id } بود که هیچ‌وقت حذف نمی‌کرد
    await otp.deleteOne({ _id: otpDoc._id });

    // فقط فیلدهای غیرحساس کاربر برگردانده می‌شود، نه کل داکیومنت Mongo
    const safeUser = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
    };

    return successResponse("ثبت نام با موفقیت انجام شد", 201, safeUser);
  } catch (error) {
    if (error instanceof ZodError) {
      return errorResponse(error.errors?.[0]?.message || "خطای اعتبارسنجی", 400);
    }

    console.error("Register Error:", error);
    return errorResponse(error.message || "خطای سرور", 500);
  }
};

export { verifyOtp as POST };
