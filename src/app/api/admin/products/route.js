import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/database/db";

import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

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
      { success: false, message: "خطا در دریافت محصولات" },
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
        { success: false, message: "لطفاً وارد حساب کاربری شوید" },
        { status: 401 }
      );
    }

    const createdBy = session?.user.id;

    const data = await req.formData();

    const file = data.get("imageProduct");
    const name = data.get("name");
    const stock = Number(data.get("stock"));
    const discountprice = Number(data.get("discountprice"));
    const category = data.get("category");
    const isActive = data.get("isActive") === "true";
    const price = Number(data.get("price"));
    const description = data.get("description") || "";

    let features = [];
    const featuresRaw = data.get("features");

    if (featuresRaw) {
      try {
        features = JSON.parse(featuresRaw);
      } catch {
        return NextResponse.json(
          { success: false, message: "فرمت ویژگی‌ها نامعتبر است" },
          { status: 400 }
        );
      }
    }

    let imagePath = "";

    if (file && file.name) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = join(process.cwd(), "public/uploads");
      await mkdir(uploadDir, { recursive: true });

      const fileName = `${Date.now()}-${file.name}`;
      const filePath = join(uploadDir, fileName);

      await writeFile(filePath, buffer);
      imagePath = `/uploads/${fileName}`;
    }

    const newProduct = await Product.create({
      name,
      stock,
      category,
      discountprice,
      isActive,
      price,
      description,
      sold: 0,
      features,
      imageProduct: imagePath,
      createdBy,
    });

    return NextResponse.json(
      { success: true, data: newProduct },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
