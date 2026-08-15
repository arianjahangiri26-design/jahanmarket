import crypto from "crypto";
import connectToDatabase from "@/lib/database/db";
import users from "@/models/users";
import Otp from "@/models/otp";
import { sendOtpSchema } from "@/lib/validators/auth/auth.schema";
import { ZodError } from "zod";
import { resolveAuthContact } from "@/lib/auth/resolveAuthContact";
import { errorResponse, successResponse } from "@/lib/utils/apiResponse";
 

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
      return errorResponse("This account is already registered.", 400);
    }

    if (validated.type === "login" && !existingUser) {
      return errorResponse("User not found.", 404);
    }

    const code = crypto.randomInt(100000, 999999).toString();

    await Otp.findOneAndUpdate(
      { email: contact.email, phoneNumber: contact.phoneNumber },
      {
        phoneNumber: contact.phoneNumber,
        email: contact.email,
        code,
        kind: validated.type === "register" ? 1 : 2,
        expireAt: new Date(Date.now() + 10 * 60 * 1000),
      },
      { upsert: true, new: true }
    );

   

    return successResponse(
      "Verification code sent successfully.",
      201,
      { target: contact.selectedTarget }
    );
  } catch (err) {
    if (err instanceof ZodError) {
      return errorResponse(
        err.issues?.[0]?.message || "Validation Error",
        400
      );
    }

    console.error("OTP API ERROR:", err);
    return errorResponse(err.message || "Internal Server Error", 500);
  }
}
export async function GET() {
  try {
    await connectToDatabase();

    const otps = await Otp.find({}).sort({ createdAt: -1 });

    return successResponse("OTP records fetched successfully.", 200, otps);
  } catch (err) {
    console.error("OTP GET ERROR:", err);
    return errorResponse(err.message || "Internal Server Error", 500);
  }
}
