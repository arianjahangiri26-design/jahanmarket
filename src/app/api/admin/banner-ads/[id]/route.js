import { promises as fs } from "fs";
import path from "path";
import mongoose from "mongoose";
import Banner from "@/models/BannerAds";
import connectToDatabase from "@/lib/database/db";
import { errorResponse, successResponse } from "@/lib/utils/apiResponse";
import { updateBannerAdsSchema } from "@/lib/validators/admin/bannerAdes/bannerAds.validation";
 
 
export const runtime = "nodejs";
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
const uploadDir = path.join(process.cwd(), "public", "uploads", "banners");

const removeFile = async (filePath) => {
  if (!filePath) return;
  try {
    const fullPath = path.join(process.cwd(), "public", filePath);
    await fs.unlink(fullPath);
  } catch {}
};

// دریافت تک بنر
export async function GET(_, context) {
  try {
    await connectToDatabase();
    const { id } = await context.params;

    if (!isValidObjectId(id)) {
      return errorResponse({ message: "شناسه معتبر نیست", status: 400 });
    }

    const banner = await Banner.findById(id);
    if (!banner) {
      return errorResponse({ message: "بنر پیدا نشد", status: 404 });
    }

    return successResponse({ data: banner, status: 200 });
  } catch (error) {
    return errorResponse({
      message: "خطا در دریافت بنر",
      error: error.message,
      status: 500,
    });
  }
}

// ویرایش بنر
export async function PUT(req, context) {
  try {
    await connectToDatabase();
    const { id } = await context.params;

    if (!isValidObjectId(id)) {
      return errorResponse({ message: "شناسه معتبر نیست", status: 400 });
    }

    const banner = await Banner.findById(id);
    if (!banner) {
      return errorResponse({ message: "بنر پیدا نشد", status: 404 });
    }

    const formData = await req.formData();
    const body = {
      title: formData.get("title") || undefined,
      description: formData.get("description") || "",
      link: formData.get("link") || "",
      order: formData.get("order") || undefined,
      position: formData.get("position") || undefined,
    };

    if (formData.has("isActive")) {
      body.isActive = formData.get("isActive") === "true";
    }

    const validation = updateBannerAdsSchema.safeParse(body);
    if (!validation.success) {
      return errorResponse({
        message: "اطلاعات معتبر نیست",
        error: validation.error.flatten().fieldErrors,
        status: 400,
      });
    }

    // به‌روزرسانی فیلدهای متنی
    Object.assign(banner, validation.data);

    // آپلود مجدد تصویر دسکتاپ در صورت تغییر
    const desktopImageFile = formData.get("desktopImage");
    if (desktopImageFile && typeof desktopImageFile === "object" && desktopImageFile.size > 0) {
      await removeFile(banner.desktopImage);
      
      const bytes = await desktopImageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${desktopImageFile.name.replace(/\s+/g, "-")}`;
      const filePath = path.join(uploadDir, filename);

      await fs.mkdir(uploadDir, { recursive: true });
      await fs.writeFile(filePath, buffer);
      banner.desktopImage = `/uploads/banners/${filename}`;
    }

    // آپلود مجدد تصویر موبایل در صورت تغییر
    const mobileImageFile = formData.get("mobileImage");
    if (mobileImageFile && typeof mobileImageFile === "object" && mobileImageFile.size > 0) {
      if (banner.mobileImage) {
        await removeFile(banner.mobileImage);
      }
      
      const bytes = await mobileImageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${mobileImageFile.name.replace(/\s+/g, "-")}`;
      const filePath = path.join(uploadDir, filename);

      await fs.mkdir(uploadDir, { recursive: true });
      await fs.writeFile(filePath, buffer);
      banner.mobileImage = `/uploads/banners/${filename}`;
    }

    await banner.save();

    return successResponse({
      message: "بنر با موفقیت ویرایش شد",
      data: banner,
      status: 200,
    });
  } catch (error) {
    return errorResponse({
      message: "خطا در ویرایش بنر",
      error: error.message,
      status: 500,
    });
  }
}

// حذف بنر
export async function DELETE(_, context) {
  try {
    await connectToDatabase();
    const { id } = await context.params;

    if (!isValidObjectId(id)) {
      return errorResponse({ message: "شناسه معتبر نیست", status: 400 });
    }

    const banner = await Banner.findById(id);
    if (!banner) {
      return errorResponse({ message: "بنر پیدا نشد", status: 404 });
    }

    // حذف تصاویر مربوطه از روی دیسک سرور
    await removeFile(banner.desktopImage);
    if (banner.mobileImage) {
      await removeFile(banner.mobileImage);
    }

    await Banner.findByIdAndDelete(id);

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
