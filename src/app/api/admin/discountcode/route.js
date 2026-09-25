// app/api/admin/discounts/route.js
import connectToDatabase from "@/lib/database/db";
 
import { ZodError } from "zod";
import { createDiscountSchema } from "@/lib/validators/admin/discounts/discount.validation";
import { errorResponse, successResponse } from "@/lib/utils/apiResponse";
import DiscountCode from "@/models/discountcode";
import category from "@/models/Category";

/**
 * GET /api/admin/discounts
 * Fetch all discounts
 */
export async function GET() {
  try {
    await connectToDatabase();

    const allDiscounts = await DiscountCode.find()
      .populate("category", "_id name")
      .sort({ createdAt: -1 })
      .lean();
 
    return successResponse({
      data: allDiscounts,
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
 * POST /api/admin/discounts
 * Create new discount
 */
export async function POST(req) {
  try {
    await connectToDatabase();

    const body = await req.json();

    // اعتبارسنجی بدنه درخواست با Zod
    const validatedData = createDiscountSchema.parse(body);

    // بررسی عدم تکراری بودن کد تخفیف
    const existingDiscount = await DiscountCode.findOne({ code: validatedData.code });
    if (existingDiscount) {
      return errorResponse({
        status: 400,
        message: "کد تخفیف وارد شده قبلاً ایجاد شده است",
      });
    }

    // ایجاد کد تخفیف در پایگاه داده
    const newDiscount = await DiscountCode.create(validatedData);

    return successResponse({
      data: newDiscount,
      message: "DiscountCode created successfully",
    });
  } catch (err) {
    // مدیریت خطاهای اعتبارسنجی Zod
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
