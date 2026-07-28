import connectToDatabase from "@/lib/database/db";
import users from "@/models/users";
 
import { ZodError } from "zod";
import { createUserSchema } from "@/lib/validators/admin/users/user.validation";
import { errorResponse, successResponse } from "@/lib/utils/apiResponse";


 
/**
 * GET /api/admin/users
 * Fetch all users
 */
export async function GET() {
  try {
    await connectToDatabase();

    const allUsers = await users.find().sort({ createdAt: -1 }).lean();

    return successResponse({
      data: allUsers,
      message: "Users fetched successfully",
    });

  } catch (err) {
    return errorResponse({
      status: 500,
      message: err.message,
    });
  }
}

/**
 * POST /api/admin/users
 * Create new user
 */


export async function POST(req) {
  try {
    await connectToDatabase();

    const body = await req.json();

    // Validate request body
    const validatedData = createUserSchema.parse(body);

    // Check duplicate phone number
  const existingUser = await users.findOne({
  $or: [
    ...(phoneNumber ? [{ phoneNumber }] : []),
    ...(email ? [{ email }] : []),
  ],
});
    if (existingUser) {
      return errorResponse({
        status: 400,
        message: "User already exists",
      });
    }

    // Create user
    const newUser = await users.create(validatedData);

    return successResponse({
      data: newUser,
      message: "User created successfully",
    });

  } catch (err) {

    // Handle validation error properly
    if (err instanceof ZodError) {
      return errorResponse({
        status: 400,
        message: err.errors[0].message,
      });
    }

    // Unexpected server error
    return errorResponse({
      status: 500,
      message: "Internal Server Error",
    });
  }
}
