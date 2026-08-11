import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import connectToDatabase from "@/lib/database/db";
 
 
import { createAddressSchema } from "@/lib/validators/admin/address/address.validation";
 
 
import Address from "@/models/address";
import { authOptions } from "../../auth/[...nextauth]/route";
 
// Get all addresses of the currently authenticated user
export async function GET() {
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

    const addresses = await Address.find({
      user: session.user.id,
    })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      {
        success: true,
        message: "لیست آدرس‌ها با موفقیت دریافت شد.",
        data: addresses,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET ADDRESSES ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "خطا در دریافت لیست آدرس‌ها.",
      },
      { status: 500 }
    );
  }
}

// Create a new address for the currently authenticated user
export async function POST(req) {
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

    const body = await req.json();

    const validation = createAddressSchema.safeParse(body);

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

    const address = await Address.create({
      user: session.user.id,
      province: validation.data.province,
      city: validation.data.city,
      plaque: validation.data.plaque,
      fullAddress: validation.data.fullAddress,
    });

    return NextResponse.json(
      {
        success: true,
        message: "آدرس با موفقیت ثبت شد.",
        data: address,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST ADDRESS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "خطایی در ثبت آدرس به وجود آمد.",
      },
      { status: 500 }
    );
  }
}
