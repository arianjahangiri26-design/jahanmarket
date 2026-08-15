import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectToDatabase from "@/lib/database/db";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import CommentProduct from "@/models/CommentProduct.js/CommentProduct";

 
// ----------------------------------------------------
// بررسی لاگین بودن کاربر
// ----------------------------------------------------
async function checkAuth() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return {
      isAuthorized: false,
      status: 401,
      message: "لطفاً ابتدا وارد حساب کاربری شوید",
    };
  }

  return {
    isAuthorized: true,
    session,
  };
}

// ----------------------------------------------------
// GET: دریافت کامنت‌های یک محصول
// ----------------------------------------------------
export async function GET(req, { params }) {
  try {
    const { id } = await params;

    // اعتبارسنجی ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "شناسه محصول معتبر نیست",
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const comments = await CommentProduct.find({
      product: id,
    })
      .populate("user", "name email phoneNumber role")
      .populate("product", "name imageProduct")
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        count: comments.length,
        data: comments,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET PRODUCT COMMENTS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "خطا در دریافت کامنت‌ها",
      },
      { status: 500 }
    );
  }
}

// ----------------------------------------------------
// PATCH: تغییر وضعیت تایید کامنت
// فقط کاربر لاگین کرده
// ----------------------------------------------------
export async function PATCH(req, { params }) {
  try {
    // چک لاگین
    const auth = await checkAuth();

    if (!auth.isAuthorized) {
      return NextResponse.json(
        {
          success: false,
          message: auth.message,
        },
        { status: auth.status }
      );
    }

    const { id } = await  params;

    // اعتبارسنجی ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "شناسه کامنت معتبر نیست",
        },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { isApproved } = body;

    // اعتبارسنجی مقدار
    if (typeof isApproved !== "boolean") {
      return NextResponse.json(
        {
          success: false,
          message: "مقدار isApproved باید true یا false باشد",
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const updatedComment = await CommentProduct.findByIdAndUpdate(
      id,
      { isApproved },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("user", "name email")
      .populate("product", "name");

    if (!updatedComment) {
      return NextResponse.json(
        {
          success: false,
          message: "کامنت پیدا نشد",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: `کامنت ${
          isApproved ? "تأیید" : "رد"
        } شد`,
        data: updatedComment,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH COMMENT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "خطا در بروزرسانی کامنت",
      },
      { status: 500 }
    );
  }
}

// ----------------------------------------------------
// DELETE: حذف کامنت
// فقط کاربر لاگین کرده
// ----------------------------------------------------
export async function DELETE(req, { params }) {
  try {
    // چک لاگین
    const auth = await checkAuth();

    if (!auth.isAuthorized) {
      return NextResponse.json(
        {
          success: false,
          message: auth.message,
        },
        { status: auth.status }
      );
    }

    const { id } = params;

    // اعتبارسنجی ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "شناسه کامنت معتبر نیست",
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const deletedComment = await CommentProduct.findByIdAndDelete(id);

    if (!deletedComment) {
      return NextResponse.json(
        {
          success: false,
          message: "کامنت پیدا نشد",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "کامنت با موفقیت حذف شد",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE COMMENT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "خطا در حذف کامنت",
      },
      { status: 500 }
    );
  }
}
