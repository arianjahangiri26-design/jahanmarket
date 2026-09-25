import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import connectToDatabase from "@/lib/database/db";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import CommentProduct from "@/models/CommentProduct.js/CommentProduct";

// جلوگیری از Static شدن Route
export const dynamic = "force-dynamic";

// mongoose باید در Node.js اجرا شود
export const runtime = "nodejs";

// ----------------------------------------------------
// بررسی لاگین بودن کاربر
// ----------------------------------------------------
async function checkAuth() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
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
// در این متد id، شناسه محصول است
// ----------------------------------------------------
export async function GET(request, { params }) {
  try {
    // در نسخه جدید Next.js باید params را await کنیم
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "شناسه محصول ارسال نشده است",
        },
        { status: 400 }
      );
    }

    // بررسی معتبر بودن شناسه محصول
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

    // تبدیل صریح رشته به ObjectId
    const productId = new mongoose.Types.ObjectId(id);

    // فقط کامنت‌هایی که product آن‌ها برابر شناسه واردشده است
    const comments = await CommentProduct.find({
      product: productId,
    })
      .populate("user", "name email phoneNumber role")
      .populate("product", "name imageProduct")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      {
        success: true,
        message:
          comments.length > 0
            ? "نظرات محصول با موفقیت دریافت شدند"
            : "نظری برای این محصول ثبت نشده است",
        productId: id,
        count: comments.length,
        data: comments,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("GET PRODUCT COMMENTS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "خطا در دریافت نظرات محصول",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : undefined,
      },
      { status: 500 }
    );
  }
}

// ----------------------------------------------------
// PATCH: تغییر وضعیت تأیید کامنت
// نکته: در این متد id، شناسه خود کامنت است
// ----------------------------------------------------
export async function PATCH(request, { params }) {
  try {
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

    // در نسخه جدید Next.js باید params را await کنیم
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "شناسه کامنت ارسال نشده است",
        },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "شناسه کامنت معتبر نیست",
        },
        { status: 400 }
      );
    }

    let body;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "اطلاعات ارسال‌شده معتبر نیست",
        },
        { status: 400 }
      );
    }

    const { isApproved } = body;

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
      {
        $set: {
          isApproved,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("user", "name email phoneNumber role")
      .populate("product", "name imageProduct");

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
        message: isApproved
          ? "کامنت با موفقیت تأیید شد"
          : "تأیید کامنت با موفقیت لغو شد",
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
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : undefined,
      },
      { status: 500 }
    );
  }
}

// ----------------------------------------------------
// DELETE: حذف کامنت
// نکته: در این متد id، شناسه خود کامنت است
// ----------------------------------------------------
export async function DELETE(request, { params }) {
  try {
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

    // این قسمت در کد قبلی شما اشتباه بود
    // در Next.js جدید باید params را await کنید
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "شناسه کامنت ارسال نشده است",
        },
        { status: 400 }
      );
    }

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

    const deletedComment =
      await CommentProduct.findByIdAndDelete(id);

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
        data: {
          id: deletedComment._id,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE COMMENT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "خطا در حذف کامنت",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : undefined,
      },
      { status: 500 }
    );
  }
}
