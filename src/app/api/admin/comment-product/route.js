import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectToDatabase from "@/lib/database/db";
import { commentSchema } from "@/lib/validators/admin/product/comment/CommentProduct.validation";
import { authOptions } from "@/lib/auth/authOptions";

// ایمپورت مدل‌ها برای ثبت در Mongoose
import "@/models/product";
import CommentProduct from "@/models/CommentProduct";
import "@/models/users";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// GET: دریافت لیست تمام کامنت‌ها
export async function GET() {
  try {
    await connectToDatabase();

    const comments = await CommentProduct.find()
      .populate("user", "name email phoneNumber")
      .populate("product", "name imageProduct")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: comments });
  } catch (error) {
    console.error("GET COMMENTS ERROR:", error);
    return NextResponse.json(
      { success: false, message: "خطا در دریافت کامنت‌ها" },
      { status: 500 }
    );
  }
}

// POST: ثبت کامنت جدید
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "لطفاً ابتدا وارد حساب کاربری خود شوید" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validation = commentSchema.safeParse(body);

    if (!validation.success) {
      const errorMessages = validation.error.errors
        .map((err) => err.message)
        .join("، ");
      return NextResponse.json(
        {
          success: false,
          message: errorMessages,
          errors: validation.error.format(),
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const newComment = await CommentProduct.create({
      text: validation.data.text,
      product: validation.data.product,
      user: session.user.id,
    });

    return NextResponse.json(
      {
        success: true,
        message: "کامنت شما ثبت شد و پس از تایید نمایش داده می‌شود",
        data: newComment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE COMMENT ERROR:", error);
    return NextResponse.json(
      { success: false, message: "خطای سرور در ثبت کامنت" },
      { status: 500 }
    );
  }
}
