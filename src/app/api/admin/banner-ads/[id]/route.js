import mongoose from "mongoose";
import Banner from "@/models/BannerAds";
import connectToDatabase from "@/lib/database/db";
import { successResponse, errorResponse } from "@/lib/utils/apiResponse";
import { updateBannerAdsSchema } from "@/lib/validators/admin/bannerAdes/bannerAds.validation";
import { removeUploadFile, saveBannerImage } from "@/lib/upload-manager/server/uploadFileHelperServer";
 
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export async function GET(_, context) {
  try {
    await connectToDatabase();
    const { id } = await context.params;

    if (!isValidObjectId(id)) {
      return errorResponse({ message: "شناسه بنر نامعتبر است", status: 400 });
    }

    const banner = await Banner.findById(id).lean();
    if (!banner) {
      return errorResponse({ message: "بنر مورد نظر یافت نشد", status: 404 });
    }

    return successResponse({
      message: "اطلاعات بنر دریافت شد",
      data: banner,
      status: 200,
    });
  } catch (error) {
    return errorResponse({
      message: "خطا در دریافت بنر",
      error: error.message,
      status: 500,
    });
  }
}

export async function PUT(req, context) {
  let newlyUploadedDesktop = null;
  let newlyUploadedMobile = null;

  try {
    await connectToDatabase();
    const { id } = await context.params;

    if (!isValidObjectId(id)) {
      return errorResponse({ message: "شناسه بنر نامعتبر است", status: 400 });
    }

    const banner = await Banner.findById(id);
    if (!banner) {
      return errorResponse({ message: "بنر مورد نظر یافت نشد", status: 404 });
    }

    const formData = await req.formData();
    const rawData = {};

    if (formData.has("title")) rawData.title = formData.get("title");
    if (formData.has("description")) rawData.description = formData.get("description");
    if (formData.has("link")) rawData.link = formData.get("link");
    if (formData.has("order")) rawData.order = formData.get("order");
    if (formData.has("position")) rawData.position = formData.get("position");
    if (formData.has("category")) rawData.category = formData.get("category");
    if (formData.has("startsAt")) rawData.startsAt = formData.get("startsAt");
    if (formData.has("endsAt")) rawData.endsAt = formData.get("endsAt");
    if (formData.has("isActive")) rawData.isActive = formData.get("isActive");

    const validation = updateBannerAdsSchema.safeParse(rawData);
    if (!validation.success) {
      return errorResponse({
        message: "اطلاعات فرم معتبر نیست",
        error: validation.error.flatten().fieldErrors,
        status: 400,
      });
    }

    const desktopFile = formData.get("desktopImage");
    const mobileFile = formData.get("mobileImage");
    const removeMobileExplicit = formData.get("removeMobileImage") === "true";

    try {
      if (desktopFile && typeof desktopFile === "object" && desktopFile.size > 0) {
        newlyUploadedDesktop = await saveBannerImage(desktopFile);
      }
      if (mobileFile && typeof mobileFile === "object" && mobileFile.size > 0) {
        newlyUploadedMobile = await saveBannerImage(mobileFile);
      }
    } catch (uploadErr) {
      if (newlyUploadedDesktop) await removeUploadFile(newlyUploadedDesktop);
      if (newlyUploadedMobile) await removeUploadFile(newlyUploadedMobile);
      return errorResponse({
        message: uploadErr.message || "خطا در ذخیره‌سازی فایل",
        status: uploadErr.status || 400,
      });
    }

    const oldDesktopPath = banner.desktopImage;
    const oldMobilePath = banner.mobileImage;

    Object.assign(banner, validation.data);

    if (banner.position !== "category-page") {
      banner.category = null;
    }

    if (newlyUploadedDesktop) {
      banner.desktopImage = newlyUploadedDesktop;
    }

    if (newlyUploadedMobile) {
      banner.mobileImage = newlyUploadedMobile;
    } else if (removeMobileExplicit) {
      banner.mobileImage = "";
    }

    await banner.save();

    if (newlyUploadedDesktop && oldDesktopPath && oldDesktopPath !== newlyUploadedDesktop) {
      await removeUploadFile(oldDesktopPath);
    }
    if ((newlyUploadedMobile || removeMobileExplicit) && oldMobilePath && oldMobilePath !== newlyUploadedMobile) {
      await removeUploadFile(oldMobilePath);
    }

    return successResponse({
      message: "بنر با موفقیت ویرایش شد",
      data: banner,
      status: 200,
    });
  } catch (error) {
    if (newlyUploadedDesktop) await removeUploadFile(newlyUploadedDesktop);
    if (newlyUploadedMobile) await removeUploadFile(newlyUploadedMobile);

    return errorResponse({
      message: "خطا در ویرایش بنر",
      error: error.message,
      status: 500,
    });
  }
}

export async function DELETE(_, context) {
  try {
    await connectToDatabase();
    const { id } = await context.params;

    if (!isValidObjectId(id)) {
      return errorResponse({ message: "شناسه نامعتبر است", status: 400 });
    }

    const banner = await Banner.findByIdAndDelete(id);
    if (!banner) {
      return errorResponse({ message: "بنر پیدا نشد", status: 404 });
    }

    if (banner.desktopImage) {
      await removeUploadFile(banner.desktopImage);
    }
    if (banner.mobileImage) {
      await removeUploadFile(banner.mobileImage);
    }

    return successResponse({
      message: "بنر با موفقیت حذف شد",
      status: 200,
    });
  } catch (error) {
    return errorResponse({
      message: "خطا در حذف بنر",
      error: error.message,
      status: 500,
    });
  }
}
