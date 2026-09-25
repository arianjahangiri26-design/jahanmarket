// app/api/admin/menus/[id]/route.js
import { promises as fs } from "fs";
import path from "path";
import mongoose from "mongoose";
import Menu from "@/models/menu";

import connectToDatabase from "@/lib/database/db";
import { errorResponse, successResponse } from "@/lib/utils/apiResponse";
import { updateMenuSchema } from "@/lib/validators/admin/menu/menu.validation";
 
 
 
 
export const runtime = "nodejs";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
const uploadDir = path.join(process.cwd(), "public", "uploads", "menus");

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u0600-\u06FF-]+/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const ensureUploadDir = async () => {
  await fs.mkdir(uploadDir, { recursive: true });
};

const removeUploadedFile = async (filePathRelative) => {
  if (!filePathRelative) return;
  try {
    const filePath = path.join(process.cwd(), "public", filePathRelative);
    await fs.unlink(filePath);
  } catch (e) {
    // فایل وجود نداشته یا قبلا حذف شده است
  }
};

export async function GET(  context) {
  try {
    await connectToDatabase();
    const { id } = await context.params;

    if (!isValidObjectId(id)) {
      return errorResponse({ message: "شناسه منو نامعتبر است", status: 400 });
    }

    const menu = await Menu.findById(id).populate("parent", "title slug");

    if (!menu) {
      return errorResponse({ message: "منو پیدا نشد", status: 404 });
    }

    return successResponse({ data: menu, status: 200 });
  } catch (error) {
    return errorResponse({
      message: "خطا در دریافت اطلاعات منو",
      error: error.message,
      status: 500,
    });
  }
}

export async function PUT(req, context) {
  try {
    await connectToDatabase();
    const { id } = await context.params;

    if (!isValidObjectId(id)) {
      return errorResponse({ message: "شناسه منو نامعتبر است", status: 400 });
    }

    const menu = await Menu.findById(id);
    if (!menu) {
      return errorResponse({ message: "منو پیدا نشد", status: 404 });
    }

    const formData = await req.formData();
    const iconImage = formData.get("iconImage");

    const body = {
      title: formData.get("title") || undefined,
      url: formData.get("url") || "",
      parent: formData.get("parent") || null,
      type: formData.get("type") || "normal",
      order: formData.get("order") ? Number(formData.get("order")) : 0,
    };

    if (formData.has("isActive")) {
      body.isActive = formData.get("isActive") === "true";
    }

    const validation = updateMenuSchema.safeParse(body);
    if (!validation.success) {
      return errorResponse({
        message: "فیلدهای ورودی معتبر نیستند",
        error: validation.error.flatten().fieldErrors,
        status: 400,
      });
    }

    const { title, url, parent, type, order, isActive } = validation.data;

    if (parent && !isValidObjectId(parent)) {
      return errorResponse({ message: "شناسه والد نامعتبر است", status: 400 });
    }

    if (parent && parent.toString() === id.toString()) {
      return errorResponse({ message: "یک منو نمی‌تواند والد خودش باشد", status: 400 });
    }

    if (title !== undefined) {
      const slug = slugify(title);
      const duplicate = await Menu.exists({ slug, _id: { $ne: id } });
      if (duplicate) {
        return errorResponse({ message: "منویی با این عنوان در سیستم موجود است", status: 409 });
      }
      menu.title = title.trim();
      menu.slug = slug;
    }

    menu.url = url || "";
    menu.parent = parent || null;
    menu.type = type;
    menu.order = order;
    if (isActive !== undefined) {
      menu.isActive = isActive;
    }

    if (iconImage && typeof iconImage === "object" && iconImage.size > 0) {
      await ensureUploadDir();
      await removeUploadedFile(menu.iconImage);

      const bytes = await iconImage.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${iconImage.name.replace(/\s+/g, "_")}`;
      const filePath = path.join(uploadDir, filename);

      await fs.writeFile(filePath, buffer);
      menu.iconImage = `/uploads/menus/${filename}`;
    }

    await menu.save();

    return successResponse({
      message: "منو با موفقیت ویرایش شد",
      data: menu,
      status: 200,
    });
  } catch (error) {
    return errorResponse({
      message: "خطا در ویرایش منو",
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
      return errorResponse({ message: "شناسه منو نامعتبر است", status: 400 });
    }

    const menu = await Menu.findById(id);
    if (!menu) {
      return errorResponse({ message: "منو پیدا نشد", status: 404 });
    }

    // چک کردن وجود فرزند (زیرمنو) در ساختار درختی
    const hasChildren = await Menu.exists({ parent: id });
    if (hasChildren) {
      return errorResponse({
        message: "این منو دارای زیرمنو است؛ ابتدا زیرمنوهای آن را حذف یا منتقل کنید",
        status: 400,
      });
    }

    await removeUploadedFile(menu.iconImage);
    await Menu.findByIdAndDelete(id);

    return successResponse({
      message: "منو با موفقیت حذف شد",
      status: 200,
    });
  } catch (error) {
    return errorResponse({
      message: "خطا در حذف منو",
      error: error.message,
      status: 500,
    });
  }
}
