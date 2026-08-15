import connectToDatabase from "@/lib/database/db";
import users from "@/models/users";
import { userAuth } from "@/lib/validators/auth/auth.schema";
import otp from "@/models/otp";
import { ZodError } from "zod";
import { resolveAuthContact } from "@/lib/auth/resolveAuthContact";
import { errorResponse, successResponse } from "@/lib/utils/apiResponse";
 
// Import your utility helpers
 
const verifyOtp = async (req) => {
  try {
    // 1. Establish database connection
    await connectToDatabase();

    // 2. Parse and validate request body
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

    // 3. Resolve contact info
    const contact = resolveAuthContact({
      identifier,
      phoneNumber,
      email,
      preferredOtpTarget,
    });

    if (contact.error) {
      return errorResponse(contact.error, 400);
    }

    // 4. Verify if user is already registered
    const query = contact.email
      ? { email: contact.email }
      : { phoneNumber: contact.phoneNumber };

    const existingUser = await users.findOne(query);

    if (existingUser) {
      return errorResponse("حساب کاربری قبلاً ثبت شده است", 400);
    }

    // 5. Find the OTP record in database
    const otpDoc = await otp.findOne({
      code,
      kind: 1, // Verification for registration
      ...query,
    });

    // 6. Validate OTP existence and expiration
    if (!otpDoc) {
      return errorResponse("کد نامعتبر است", 400);
    }

    if (otpDoc.expireAt < new Date()) {
      return errorResponse("کد منقضی شده است", 400);
    }

    // 7. Create the new user
    const user = await users.create({
      name,
      phoneNumber: contact.phoneNumber || null,
      email: contact.email || null,
      AvatarImage,
      role,
      IsActive: true,
      kind: 1,
    });

    // 8. Cleanup: Delete used OTP
    await otp.deleteOne({ id: otpDoc._id });

    // 9. Return success with user data
    return successResponse("ثبت نام با موفقیت انجام شد", 201, user);

  } catch (error) {
    // 10. Handle Zod validation errors
    if (error instanceof ZodError) {
      return errorResponse(error.errors?.[0]?.message || "خطای اعتبارسنجی", 400);
    }

    console.error("Register Error:", error);

    // 11. Handle server errors
    return errorResponse(error.message || "خطای سرور", 500);
  }
};

export { verifyOtp as POST };
