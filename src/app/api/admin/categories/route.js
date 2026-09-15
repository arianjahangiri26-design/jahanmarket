import Category from "@/models/Category";
import connectToDatabase from "@/lib/database/db";
import { createCategorySchema } from "@/lib/validators/admin/categories/categorie.validation";
import { successResponse, errorResponse } from "@/lib/utils/apiResponse";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u0600-\u06FF-]+/g, "")
    .replace(/--+/g, "-");

// دریافت لیست تمام دسته‌بندی‌ها
export async function GET(req) {
  try {
    await connectToDatabase();

    // فچ کردن تمام دسته‌بندی‌ها به همراه اطلاعات دسته والد (فقط فیلدهای آیدی و نام والد)
    const categories = await Category.find({})
      .populate("parent", "_id name")
      .sort({ createdAt: -1 });

    return successResponse({
      message: "لیست دسته‌بندی‌ها دریافت شد",
      data: categories,
      status: 200,
    });
  } catch (error) {
    console.error("GET Categories Error:", error);
    return errorResponse({
      message: "خطا در دریافت لیست دسته‌بندی‌ها",
      status: 500,
    });
  }
}

// ایجاد دسته‌بندی جدید
export async function POST(req) {
  try {
    await connectToDatabase();

    const formData = await req.formData();

    const body = {
      name: formData.get("name"),
      description: formData.get("description"),
      parent: formData.get("parent"),
      isActive: formData.get("isActive") === "true",
      image: formData.get("image"),
    };

    const validation = createCategorySchema.safeParse(body);

    if (!validation.success) {
      return errorResponse({
        message: "اطلاعات معتبر نیست",
        error: validation.error.flatten(),
        status: 400,
      });
    }

    const { name, description, parent, isActive, image } = validation.data;

    const slug = slugify(name);

    if (parent && !isValidObjectId(parent)) {
      return errorResponse({
        message: "parent نامعتبر است",
        status: 400,
      });
    }

    let imagePath = "";

    if (image && image.size > 0) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const fileName = `${Date.now()}-${image.name}`;

      const uploadDir = path.join(process.cwd(), "public/uploads");

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, fileName);

      fs.writeFileSync(filePath, buffer);

      imagePath = `/uploads/${fileName}`;
    }

    const category = await Category.create({
      name,
      slug,
      description,
      image: imagePath,
      parent: parent || null,
      isActive,
    });

    return successResponse({
      message: "دسته‌بندی ساخته شد",
      data: category,
      status: 201,
    });
  } catch (error) {
    console.error("POST Category Error:", error);

    return errorResponse({
      message: "خطا در ساخت دسته‌بندی",
      status: 500,
    });
  }
}
