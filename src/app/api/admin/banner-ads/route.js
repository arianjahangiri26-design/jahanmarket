import Banner from "@/models/BannerAds";
import connectToDatabase from "@/lib/database/db";
import { successResponse, errorResponse } from "@/lib/utils/apiResponse";
import { createBannerAdsSchema } from "@/lib/validators/admin/bannerAdes/bannerAds.validation";
import { removeUploadFile, saveBannerImage } from "@/lib/upload-manager/server/uploadFileHelperServer";
 
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    await connectToDatabase();

    const url = new URL(req.url);
    const position = url.searchParams.get("position");
    const category = url.searchParams.get("category");
    const isActive = url.searchParams.get("isActive");

    const filter = {};
    if (position) filter.position = position;
    if (category) filter.category = category;
    if (isActive !== null && isActive !== undefined && isActive !== "") {
      filter.isActive = isActive === "true";
    }

    const banners = await Banner.find(filter)
      .populate("category", "title name slug")
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return successResponse({
      message: "لیست بنرها دریافت شد",
      data: banners,
      status: 200,
    });
  } catch (error) {
    return errorResponse({
      message: "خطا در دریافت لیست بنرها",
      error: error.message,
      status: 500,
    });
  }
}

export async function POST(req) {
  let uploadedDesktop = null;
  let uploadedMobile = null;

  try {
    await connectToDatabase();
    const formData = await req.formData();

    const rawData = {
      title: formData.get("title"),
      description: formData.get("description") || "",
      link: formData.get("link") || "",
      order: formData.get("order") || 0,
      position: formData.get("position"),
      category: formData.get("category") || null,
      startsAt: formData.get("startsAt") || null,
      endsAt: formData.get("endsAt") || null,
      isActive: formData.get("isActive"),
    };

    const validation = createBannerAdsSchema.safeParse(rawData);
    if (!validation.success) {
      return errorResponse({
        message: "اطلاعات فرم معتبر نیست",
        error: validation.error.flatten().fieldErrors,
        status: 400,
      });
    }

    const desktopFile = formData.get("desktopImage");
    const mobileFile = formData.get("mobileImage");

    if (!desktopFile || typeof desktopFile !== "object" || desktopFile.size === 0) {
      return errorResponse({
        message: "تصویر دسکتاپ اجباری است",
        status: 400,
      });
    }

    try {
      uploadedDesktop = await saveBannerImage(desktopFile);
      if (mobileFile && typeof mobileFile === "object" && mobileFile.size > 0) {
        uploadedMobile = await saveBannerImage(mobileFile);
      }
    } catch (uploadErr) {
      if (uploadedDesktop) await removeUploadFile(uploadedDesktop);
      return errorResponse({
        message: uploadErr.message || "خطا در ذخیره‌سازی فایل",
        status: uploadErr.status || 400,
      });
    }

    const payload = {
      ...validation.data,
      desktopImage: uploadedDesktop,
      mobileImage: uploadedMobile || "",
    };

    if (payload.position !== "category-page") {
      payload.category = null;
    }

    const banner = await Banner.create(payload);

    return successResponse({
      message: "بنر با موفقیت ذخیره شد",
      data: banner,
      status: 201,
    });
  } catch (error) {
    if (uploadedDesktop) await removeUploadFile(uploadedDesktop);
    if (uploadedMobile) await removeUploadFile(uploadedMobile);

    return errorResponse({
      message: "خطا در ایجاد بنر",
      error: error.message,
      status: 500,
    });
  }
}
