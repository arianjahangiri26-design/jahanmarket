import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import connectToDatabase from "@/lib/database/db";
import Address from "@/models/address";

import { updateAddressSchema } from "@/lib/validators/address/address.validation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
 
 
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
 
export async function GET(  context) {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "شما وارد حساب کاربری خود نشده‌اید.",
        },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "شناسه آدرس معتبر نیست.",
        },
        { status: 400 }
      );
    }

    // The user condition prevents access to another user's address
    const address = await Address.findOne({
      _id: id,
      user: session.user.id,
    }).lean();

    if (!address) {
      return NextResponse.json(
        {
          success: false,
          message: "آدرس موردنظر پیدا نشد.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "آدرس با موفقیت دریافت شد.",
        data: address,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET ADDRESS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "خطا در دریافت آدرس.",
      },
      { status: 500 }
    );
  }
}

// Update one address owned by the current user
export async function PUT(req, context) {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "شما وارد حساب کاربری خود نشده‌اید.",
        },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "شناسه آدرس معتبر نیست.",
        },
        { status: 400 }
      );
    }

    const body = await req.json();

    const validation = updateAddressSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "اطلاعات آدرس معتبر نیست.",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    // The user condition prevents editing another user's address
    const updatedAddress = await Address.findOneAndUpdate(
      {
        _id: id,
        user: session.user.id,
      },
      {
        $set: {
          province: validation.data.province,
          city: validation.data.city,
          plaque: validation.data.plaque,
          fullAddress: validation.data.fullAddress,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedAddress) {
      return NextResponse.json(
        {
          success: false,
          message: "آدرس موردنظر پیدا نشد.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "آدرس با موفقیت ویرایش شد.",
        data: updatedAddress,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT ADDRESS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "خطا در ویرایش آدرس.",
      },
      { status: 500 }
    );
  }
}

// Delete one address owned by the current user
export async function DELETE(_, context) {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "شما وارد حساب کاربری خود نشده‌اید.",
        },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "شناسه آدرس معتبر نیست.",
        },
        { status: 400 }
      );
    }

    // The user condition prevents deleting another user's address
    const deletedAddress = await Address.findOneAndDelete({
      _id: id,
      user: session.user.id,
    });

    if (!deletedAddress) {
      return NextResponse.json(
        {
          success: false,
          message: "آدرس موردنظر پیدا نشد.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "آدرس با موفقیت حذف شد.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE ADDRESS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "خطا در حذف آدرس.",
      },
      { status: 500 }
    );
  }
}
