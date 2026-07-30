import { NextResponse } from "next/server";
import { join } from "path";
import { writeFile, mkdir } from "fs/promises";

import connectToDatabase from "@/lib/database/db";
import Product from "@/models/product";

// NextAuth
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import category from "@/models/Category";
import "@/models/users";

// ==========================
// GET Single Product
// ==========================
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

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("GET PRODUCT ERROR:", error);
    return NextResponse.json(
      { success: false, message: "خطای سرور" },
      { status: 500 }
    );
  }
}

// ==========================
// UPDATE Product
// ==========================
export async function PUT(req, { params }) {
  try {
    // احراز هویت
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "لطفاً وارد حساب کاربری شوید" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const { id } = await params;

    const data = await req.formData();
    const file = data.get("imageProduct");

    let features = [];
    const featuresRaw = data.get("features");

    if (featuresRaw) {
      try {
        features = JSON.parse(featuresRaw);
      } catch (error) {
        return NextResponse.json(
          { success: false, message: "فرمت ویژگی‌ها نامعتبر است" },
          { status: 400 }
        );
      }
    }

    const updateData = {
      name: data.get("name"),
      stock: Number(data.get("stock")),
      price: Number(data.get("price")),
      discountprice: Number(data.get("discountprice")),
      category: data.get("category"),
      description: data.get("description") || "",
      features,
      isActive: data.get("isActive") === "true",

    };

    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = join(process.cwd(), "public/uploads");
      await mkdir(uploadDir, { recursive: true });

      const fileName = `${Date.now()}-${file.name}`;
      const filePath = join(uploadDir, fileName);

      await writeFile(filePath, buffer);

      updateData.imageProduct = `/uploads/${fileName}`;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("category")
      .populate("createdBy", "name email");

    if (!updatedProduct) {
      return NextResponse.json(
        { success: false, message: "محصول پیدا نشد" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);
    return NextResponse.json(
      { success: false, message: "خطای سرور" },
      { status: 500 }
    );
  }
}

// ==========================
// DELETE Product
// ==========================
export async function DELETE(req, { params }) {
  try {
    // احراز هویت
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "لطفاً وارد حساب کاربری شوید" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const { id } = await params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json(
        { success: false, message: "محصول پیدا نشد" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "محصول حذف شد",
    });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);
    return NextResponse.json(
      { success: false, message: "خطای سرور" },
      { status: 500 }
    );
  }
}
