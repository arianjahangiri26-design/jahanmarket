// app/api/admin/menus/route.js
import Menu from "@/models/menu";
import connectToDatabase from "@/lib/database/db";
 
import { successResponse, errorResponse } from "@/lib/utils/apiResponse";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { createMenuSchema } from "@/lib/validators/admin/menu/menu.validation";
 
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u0600-\u06FF-]+/g, "")
    .replace(/--+/g, "-");

// دریافت لیست کامل منوها همراه با اطلاعات والد
export async function GET(req) {
  try {
    await connectToDatabase();

    const menus = await Menu.find({})
      .populate("parent", "_id title")
      .sort({ order: 1, createdAt: -1 });

    return successResponse({
      message: "لیست منوها با موفقیت دریافت شد",
      data: menus,
      status: 200,
    });
  } catch (error) {
    console.error("GET Menus Error:", error);
    return errorResponse({
      message: "خطا در دریافت لیست منوها",
      status: 500,
    });
  }
}

// ایجاد منوی جدید
export async function POST(req) {
  try {
    await connectToDatabase();

    const formData = await req.formData();

    const body = {
      title: formData.get("title"),
      url: formData.get("url") || "",
      parent: formData.get("parent") || null,
      type: formData.get("type") || "normal",
      order: formData.get("order") ? Number(formData.get("order")) : 0,
      isActive: formData.get("isActive") === "true",
    };

    const validation = createMenuSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse({
        message: "اطلاعات ارسال شده معتبر نیست",
        error: validation.error.flatten(),
        status: 400,
      });
    }

    const { title, url, parent, type, order, isActive } = validation.data;
    const slug = slugify(title);

    if (parent && !isValidObjectId(parent)) {
      return errorResponse({
        message: "شناسه والد نامعتبر است",
        status: 400,
      });
    }

    let iconPath = "";
    const iconImage = formData.get("iconImage");

    if (iconImage && iconImage.size > 0) {
      const bytes = await iconImage.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const fileName = `${Date.now()}-${iconImage.name.replace(/\s+/g, "_")}`;
      const uploadDir = path.join(process.cwd(), "public/uploads/menus");

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, buffer);
      iconPath = `/uploads/menus/${fileName}`;
    }

    const menu = await Menu.create({
      title,
      slug,
      url,
      parent: parent || null,
      type,
      order,
      iconImage: iconPath,
      isActive,
    });

    return successResponse({
      message: "منو با موفقیت ساخته شد",
      data: menu,
      status: 201,
    });
  } catch (error) {
    console.error("POST Menu Error:", error);
    return errorResponse({
      message: "خطا در ساخت منو جدید",
      status: 500,
    });
  }
}
