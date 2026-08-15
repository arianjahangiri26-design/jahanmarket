// app/api/admin/discounts/[id]/route.js
import connectToDatabase from "@/lib/database/db";
import DiscountCode from "@/models/Discount";

import { ZodError } from "zod";
import { updateDiscountSchema } from "@/lib/validators/admin/discounts/discount.validation";
import { errorResponse, successResponse } from "@/lib/utils/apiResponse";
import DiscountCode from "@/models/discountcode";
import category from "@/models/Category";

/**
 * GET /api/admin/discounts/:id
 * Get single discount details
 */
export async function GET(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const DiscountCode = await DiscountCode.findById(id).populate("category", "_id name");

    if (!DiscountCode) {
      return errorResponse({
        status: 404,
        message: "DiscountCode not found",
      });
    }

    return successResponse({
      data: DiscountCode,
      message: "DiscountCode fetched successfully",
    });
  } catch (err) {
    return errorResponse({
      status: 500,
      message: err.message,
    });
  }
}

/**
 * PUT /api/admin/discounts/:id
 * Update existing discount
 */
export async function PUT(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await req.json();

    // اعتبارسنجی مقادیر ویرایش‌شده با Zod
    const validatedData = updateDiscountSchema.parse(body);

    // در صورت وجود کد تخفیف جدید، بررسی یکتا بودن آن
    if (validatedData.code) {
      const existingDiscount = await Discount.findOne({
        code: validatedData.code,
        _id: { $ne: id },
      });
      if (existingDiscount) {
        return errorResponse({
          status: 400,
          message: "کد تخفیف جدید با یک کد تخفیف دیگر همخوانی دارد",
        });
      }
    }

    const updatedDiscountCode = await DiscountCode.findByIdAndUpdate(
      id,
      validatedData,
      { new: true }
    );

    if (!updatedDiscountCode) {
      return errorResponse({
        status: 404,
        message: "Discount not found",
      });
    }

    return successResponse({
      data: updatedDiscountCode,
      message: "DiscountCode updated successfully",
    });
  } catch (err) {
    if (err instanceof ZodError) {
      return errorResponse({
        status: 400,
        message: err.errors[0].message,
      });
    }

    return errorResponse({
      status: 500,
      message: "Internal Server Error",
    });
  }
}

/**
 * DELETE /api/admin/discounts/:id
 * Delete discount
 */
export async function DELETE(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const deletedDiscount = await DiscountCode.findByIdAndDelete(id);

    if (!deletedDiscount) {
      return errorResponse({
        status: 404,
        message: "DiscountCode not found",
      });
    }

    return successResponse({
      message: "DiscountCode deleted successfully",
    });
  } catch (err) {
    return errorResponse({
      status: 500,
      message: err.message,
    });
  }
}
