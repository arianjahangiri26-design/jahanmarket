import connectToDatabase from "@/lib/database/db";
import users from "@/models/users";
 
import { updateUserSchema } from "@/lib/validators/admin/users/user.validation";
import { errorResponse, successResponse } from "@/lib/utils/apiResponse";
 
  
/**
 * GET /api/admin/users/:id
 * Get single user
 */
export async function GET(req, { params }) {
  try {
    await connectToDatabase();
const { id } = await params;

    const user = await users.findById(id);

    if (!user) {
      return errorResponse({
        status: 404,
        message: "User not found",
      });
    }

    return successResponse({
      data: user,
      message: "User fetched successfully",
    });

  } catch (err) {
    return errorResponse({
      status: 500,
      message: err.message,
    });
  }
}

/**
 * PUT /api/admin/users/:id
 * Update user
 */
export async function PUT(req, { params }) {
  try {
    await connectToDatabase();

    const body = await req.json();

        const validatedUserupdate = updateUserSchema.parse(body);
    
const updateData = { ...validatedUserupdate };

 
const { id } = await params;

    const updatedUser = await users.findByIdAndUpdate(
   id,
     updateData,
      { new: true }
    );

    if (!updatedUser) {
      return errorResponse({
        status: 404,
        message: "User not found",
      });
    }

    return successResponse({
      data: updatedUser,
      message: "User updated successfully",
    });

  } catch (err) {
    return errorResponse({
      status: 500,
      message: err.message,
    });
  }
}

/**
 * DELETE /api/admin/users/:id
 * Delete user
 */
export async function DELETE(req, { params }) {
  try {
    await connectToDatabase();
const { id } = await params;

    const deletedUser = await users.findByIdAndDelete(id);

    if (!deletedUser) {
      return errorResponse({
        status: 404,
        message: "User not found",
      });
    }

    return successResponse({
      message: "User deleted successfully",
    });

  } catch (err) {
    return errorResponse({
      status: 500,
      message: err.message,
    });
  }
}
