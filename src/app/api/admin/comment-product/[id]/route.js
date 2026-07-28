import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/database/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import CommentProduct from "@/models/CommentProduct.js/CommentProduct";
import product from "@/models/product";
import user from "@/models/users";

// GET: دریافت اطلاعات یک کامنت مشخص
export async function GET(req, { params }) {
  try {
    const { id } = await params;

    await connectToDatabase();

    const comment = await CommentProduct.findById(id)
      .populate("user", "name email phoneNumber role")
      .populate("product", "name imageProduct");
  
    if (!comment) {
      return NextResponse.json(
        { success: false, message: "کامنت مورد نظر یافت نشد" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: comment,
    });
  } catch (error) {
    console.error("GET SINGLE COMMENT ERROR:", error);
    return NextResponse.json(
      { success: false, message: "خطای سرور در دریافت اطلاعات کامنت" },
      { status: 500 }
    );
  }
}

// PATCH: آپدیت وضعیت تایید کامنت (توسط ادمین)
export async function PATCH(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: "دسترسی غیرمجاز" }, { status: 401 });
    }

    const { id } = await params;
    const { isApproved } = await req.json();

    await connectToDatabase();

    const updatedComment = await CommentProduct.findByIdAndUpdate(
      id,
      { isApproved },
      { new: true }
    );

    if (!updatedComment) {
      return NextResponse.json({ success: false, message: "کامنت پیدا نشد" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "وضعیت کامنت با موفقیت تغییر کرد",
      data: updatedComment,
    });
  } catch (error) {
    console.error("PATCH COMMENT ERROR:", error);
    return NextResponse.json({ success: false, message: "خطای سرور" }, { status: 500 });
  }
}

// DELETE: حذف کامنت (توسط ادمین یا نویسنده کامنت)
export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: "دسترسی غیرمجاز" }, { status: 401 });
    }
    await connectToDatabase();

    const { id } = await params;

    const comment = await CommentProduct.findById(id);

    if (!comment) {
      return NextResponse.json({ success: false, message: "کامنت پیدا نشد" }, { status: 404 });
    }

     

    await CommentProduct.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "کامنت با موفقیت حذف شد",
    });
  } catch (error) {
    console.error("DELETE COMMENT ERROR:", error);
    return NextResponse.json({ success: false, message: "خطای سرور" }, { status: 500 });
  }
}
