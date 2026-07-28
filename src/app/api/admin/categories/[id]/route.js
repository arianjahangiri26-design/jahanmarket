import { promises as fs } from "fs";
import path from "path";
import mongoose from "mongoose";
import Category from "@/models/Category";
import connectToDatabase from "@/lib/database/db";
 
import { errorResponse, successResponse } from "@/lib/utils/apiResponse";
import { updateCategorySchema  } from "@/lib/validators/admin/categories/categorie.validation";

export const runtime = "nodejs";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const uploadDir = path.join(process.cwd(), "public", "uploads");

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

const removeUploadedFile = async (imagePath) => {
  if (!imagePath) return;

  try {
    const filePath = path.join(process.cwd(), "public", imagePath);
    await fs.unlink(filePath);
  } catch {
    // اگر فایل وجود نداشت، حذف دیتابیس نباید fail شود
  }
};

const createSafeFileName = (fileName) => {
  const ext = path.extname(fileName || "");
  const baseName = path
    .basename(fileName || "category", ext)
    .replace(/[^\w\u0600-\u06FF-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return `${Date.now()}-${baseName || "category"}${ext}`;
};

export async function GET(_, context) {
  try {
    await connectToDatabase();

    const { id } = await context.params;

    if (!isValidObjectId(id)) {
      return errorResponse({ message: "شناسه نامعتبر است", status: 400 });
    }

    const category = await Category.findById(id).populate("parent", "name slug");

    if (!category) {
      return errorResponse({ message: "دسته‌بندی پیدا نشد", status: 404 });
    }

    return successResponse({ data: category, status: 200 });
  } catch (error) {
    return errorResponse({
      message: "خطا در دریافت دسته‌بندی",
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
      return errorResponse({ message: "شناسه نامعتبر است", status: 400 });
    }

    const category = await Category.findById(id);

    if (!category) {
      return errorResponse({ message: "دسته‌بندی پیدا نشد", status: 404 });
    }

    const formData = await req.formData();

    const image = formData.get("image");

    const body = {
      name: formData.get("name") || undefined,
      description: formData.get("description") || "",
      parent: formData.get("parent") || null,
    };

    if (formData.has("isActive")) {
      body.isActive = formData.get("isActive") === "true";
    }

    const validation = updateCategorySchema.safeParse(body);

    if (!validation.success) {
      return errorResponse({
        message: "اطلاعات ارسال‌شده معتبر نیست",
        error: validation.error.flatten().fieldErrors,
        status: 400,
      });
    }

    const { name, description, parent, isActive } = validation.data;

    if (parent && !isValidObjectId(parent)) {
      return errorResponse({ message: "شناسه والد معتبر نیست", status: 400 });
    }

    if (parent && parent.toString() === id.toString()) {
      return errorResponse({
        message: "دسته‌بندی نمی‌تواند والد خودش باشد",
        status: 400,
      });
    }

    if (parent) {
      const parentExists = await Category.exists({ _id: parent });

      if (!parentExists) {
        return errorResponse({
          message: "دسته‌بندی والد پیدا نشد",
        status: 404,
      });
    }
    }

    if (name !== undefined) {
      const slug = slugify(name);

      if (!slug) {
        return errorResponse({
          message: "نام دسته‌بندی معتبر نیست",
          status: 400,
        });
      }

      const duplicate = await Category.exists({
        slug,
        _id: { $ne: id },
      });

      if (duplicate) {
        return errorResponse({
          message: "دسته‌ای با این نام یا اسلاگ وجود دارد",
          status: 409,
        });
      }

      category.name = name.trim();
      category.slug = slug;
    }

    if (description !== undefined) {
    category.description = description;
    }

    if (isActive !== undefined) {
      category.isActive = isActive;
    }

    category.parent = parent || null;

    if (image && typeof image === "object" && image.size > 0) {
      await ensureUploadDir();

      await removeUploadedFile(category.image);

      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = createSafeFileName(image.name);
      const filePath = path.join(uploadDir, filename);

      await fs.writeFile(filePath, buffer);

      category.image = `/uploads/${filename}`;
    }

    await category.save();

    return successResponse({
      message: "دسته‌بندی با موفقیت ویرایش شد",
      data: category,
      status: 200,
    });
  } catch (error) {
    return errorResponse({
      message: "خطا در ویرایش دسته‌بندی",
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

    const category = await Category.findById(id);

    if (!category) {
      return errorResponse({ message: "دسته‌بندی پیدا نشد", status: 404 });
    }

    const hasChildren = await Category.exists({ parent: id });

    if (hasChildren) {
      return errorResponse({
        message: "ابتدا زیردسته‌ها را حذف یا منتقل کنید",
        status: 400,
      });
    }

    await removeUploadedFile(category.image);

    await Category.findByIdAndDelete(id);

    return successResponse({
      message: "دسته‌بندی با موفقیت حذف شد",
      status: 200,
    });
  } catch (error) {
    return errorResponse({
      message: "خطا در حذف دسته‌بندی",
      error: error.message,
      status: 500,
    });
  }
}
