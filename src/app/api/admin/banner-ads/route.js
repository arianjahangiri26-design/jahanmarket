import Banner from "@/models/BannerAds";

import connectToDatabase from "@/lib/database/db";
 
import { successResponse, errorResponse } from "@/lib/utils/apiResponse";
import fs from "fs";
import path from "path";
import { createBannerAdsSchema } from "@/lib/validators/admin/bannerAdes/bannerAds.validation";

// ذخیره‌سازی فایل‌ها به صورت بافر
const saveFile = async (file) => {
  if (!file || file.size === 0) return "";
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
  const uploadDir = path.join(process.cwd(), "public/uploads/banners");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filePath = path.join(uploadDir, fileName);
  fs.writeFileSync(filePath, buffer);
  return `/uploads/banners/${fileName}`;
};

// دریافت تمام بنرها
export async function GET(req) {
  try {
    await connectToDatabase();

    const url = new URL(req.url);
    const position = url.searchParams.get("position");
    
    const filter = {};
    if (position) filter.position = position;

    const banners = await Banner.find(filter).sort({ order: 1, createdAt: -1 });

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

// ایجاد بنر جدید
export async function POST(req) {
  try {
    await connectToDatabase();
    const formData = await req.formData();

    const body = {
      title: formData.get("title"),
      description: formData.get("description"),
      link: formData.get("link"),
      order: formData.get("order"),
      position: formData.get("position"),
      isActive: formData.get("isActive") === "true",
    };

    const validation = createBannerAdsSchema.safeParse(body);
    if (!validation.success) {
      return errorResponse({
        message: "اطلاعات معتبر نیست",
        error: validation.error.flatten(),
        status: 400,
      });
    }

    const desktopImageFile = formData.get("desktopImage");
    const mobileImageFile = formData.get("mobileImage");

    if (!desktopImageFile || desktopImageFile.size === 0) {
      return errorResponse({
        message: "تصویر دسکتاپ اجباری است",
        status: 400,
      });
    }

    // آپلود فایل‌ها
    const desktopImagePath = await saveFile(desktopImageFile);
    const mobileImagePath = await saveFile(mobileImageFile);

    const banner = await Banner.create({
      ...validation.data,
      desktopImage: desktopImagePath,
      mobileImage: mobileImagePath || undefined,
    });

    return successResponse({
      message: "بنر با موفقیت ساخته شد",
      data: banner,
      status: 201,
    });
  } catch (error) {
    return errorResponse({
      message: "خطا در ساخت بنر",
      error: error.message,
      status: 500,
    });
  }
}
