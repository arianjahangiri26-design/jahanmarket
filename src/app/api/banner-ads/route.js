import connectToDatabase from "@/lib/database/db";
import Banner from "@/models/BannerAds";
import { successResponse, errorResponse } from "@/lib/utils/apiResponse";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectToDatabase();
    const now = new Date();

    const banners = await Banner.find({
      isActive: true,
      $and: [
        { $or: [{ startsAt: null }, { startsAt: { $lte: now } }] },
        { $or: [{ endsAt: null }, { endsAt: { $gte: now } }] },
      ],
    })
      .select("title description desktopImage mobileImage link position order")
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return successResponse({
      data: banners,
      status: 200,
    });
  } catch (error) {
    return errorResponse({
      message: "خطا در دریافت بنرها",
      error: error.message,
      status: 500,
    });
  }
}
