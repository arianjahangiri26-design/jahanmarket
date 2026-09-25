// app/api/admin/products/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import connectToDatabase from "@/lib/database/db";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Product from "@/models/product";
import "@/models/Category";
import "@/models/users";
 
 export async function GET() {
  try {
    await connectToDatabase();
    const products = await Product.find()
      .populate("category")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);
    return NextResponse.json(
      { success: false, message: "خطا در دریافت لیست محصولات" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "لطفاً ابتدا وارد حساب کاربری خود شوید" },
        { status: 401 }
      );
    }

    const data = await req.formData();

    const name = data.get("name");
    const price = Number(data.get("price")) || 0;
    const stock = Number(data.get("stock")) || 0;
    const discountprice = Number(data.get("discountprice")) || 0;
    const category = data.get("category");
    const isActive = data.get("isActive") === "true";
    const description = data.get("description") || "";

    if (!name || !category || !price) {
      return NextResponse.json(
        { success: false, message: "لطفاً فیلدهای اجباری (نام، قیمت و دسته‌بندی) را تکمیل کنید" },
        { status: 400 }
      );
    }

    // مشخصات فنی
    let features = [];
    try {
      features = JSON.parse(data.get("features") || "[]");
    } catch {
      features = [];
    }

    // ۱. استخراج تصاویری که از کتابخانه انتخاب شده‌اند
    let existingImages = [];
    try {
      const rawExisting = data.get("existingImages");
      const parsed = JSON.parse(rawExisting || "[]");
      existingImages = Array.isArray(parsed) ? parsed : [];
    } catch {
      existingImages = [];
    }

    // ۲. ذخیره‌سازی تصاویر جدید آپلودی از سیستم کاربر
    const files = data.getAll("images");
    const { uploaded, duplicates } = await saveUploadedFiles(files);

    // ۳. ادغام تصاویر کتابخانه و تصاویر جدید
    const finalImages = [...existingImages, ...uploaded];

    const newProduct = await Product.create({
      name,
      stock,
      price,
      discountprice,
      category,
      isActive,
      description,
      features,
      images: finalImages,
      sold: 0,
      createdBy: session.user.id,
    });

    return NextResponse.json(
      {
        success: true,
        data: newProduct,
        message: "محصول با موفقیت ذخیره شد",
        duplicates,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message || "خطای سرور" },
      { status: 500 }
    );
  }
}
