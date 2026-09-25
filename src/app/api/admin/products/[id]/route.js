// app/api/admin/products/[id]/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import connectToDatabase from "@/lib/database/db";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Product from "@/models/product";
import "@/models/Category";
import "@/models/users";
 
 
  
export async function GET(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const product = await Product.findById(id)
      .populate("category")
      .populate("createdBy", "name email");

    if (!product) {
      return NextResponse.json(
        { success: false, message: "محصول پیدا نشد" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error("GET PRODUCT ERROR:", error);
    return NextResponse.json(
      { success: false, message: "خطای سرور در دریافت محصول" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "لطفاً ابتدا وارد شوید" },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const { id } = await params;

    const currentProduct = await Product.findById(id);
    if (!currentProduct) {
      return NextResponse.json(
        { success: false, message: "محصول یافت نشد" },
        { status: 404 }
      );
    }

    const data = await req.formData();

    let features = [];
    try {
      features = JSON.parse(data.get("features") || "[]");
    } catch {
      features = [];
    }

    // تصاویری که کاربر نگه‌داشته یا از کتابخانه افزوده است
    let existingImages = [];
    try {
      const raw = data.get("existingImages");
      const parsed = JSON.parse(raw || "[]");
      existingImages = Array.isArray(parsed) ? parsed : [];
    } catch {
      existingImages = [];
    }

    // ذخیره فایل‌های جدید آپلودشده
    const { uploaded, duplicates } = await saveUploadedFiles(data.getAll("images"));

    // ترکیب تصاویر موجود با فایل‌های تازه آپلود شده
    const finalImages = [...existingImages, ...uploaded];

    const updateData = {
      name: data.get("name"),
      stock: Number(data.get("stock")) || 0,
      price: Number(data.get("price")) || 0,
      discountprice: Number(data.get("discountprice")) || 0,
      category: data.get("category"),
      description: data.get("description") || "",
      isActive: data.get("isActive") === "true",
      features,
      images: finalImages,
    };

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("category")
      .populate("createdBy", "name email");

    return NextResponse.json({
      success: true,
      data: updatedProduct,
      message: "محصول با موفقیت به‌روزرسانی شد",
      duplicates,
    });
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);
    return NextResponse.json(
      { success: false, message: "خطای سرور در ذخیره تغییرات" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "لطفاً ابتدا وارد شوید" },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const { id } = await params;

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { success: false, message: "محصول پیدا نشد" },
        { status: 404 }
      );
    }

    // برای جلوگیری از آسیب به سایر محصولاتی که تصاویر اشتراکی دارند،
    // تصویر از دیسک پاک نشده و صرفاً سند محصول از دیتابیس حذف می‌شود
    await product.deleteOne();

    return NextResponse.json({
      success: true,
      message: "محصول با موفقیت حذف شد",
    });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);
    return NextResponse.json(
      { success: false, message: "خطای سرور در حذف محصول" },
      { status: 500 }
    );
  }
}
