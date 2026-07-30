import connectToDatabase from "@/lib/database/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import Cart from "@/models/cart";
import Order from "@/models/order";

export async function POST(req) {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "شما وارد حساب کاربری خود نشده‌اید." },
        { status: 401 }
      );
    }

    // واکشی سبد خرید کاربر به همراه اطلاعات محصول
    const userCart = await Cart.findOne({ user: session.user.id }).populate(
      "items.product"
    );

    // اصلاح شرط بررسی خالی بودن سبد خرید
    if (!userCart || !userCart.items || userCart.items.length === 0) {
      return NextResponse.json(
        { success: false, message: "سبد خرید شما خالی است." },
        { status: 400 } // کد وضعیت 400 برای Bad Request مناسب‌تر از 500 است
      );
    }

    // محاسبه قیمت کل بر اساس قیمت‌های معتبر دیتابیس
    const totalPrice = userCart.items.reduce((total, item) => {
      const price = Number(item?.product?.price || 0);
      const quantity = Number(item?.quantity || 0);
      return total + price * quantity;
    }, 0);

    const discountPrice = Number(userCart.discountPrice) || 0;
    const finalPrice = Math.max(totalPrice - discountPrice, 0);

   
    const newOrder = await Order.create({
      user: session.user.id,
      items: userCart.items.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
        sold: item.product.sold + 1 
      })),
      totalPrice,
      discountPrice,
      finalPrice,
    });

    // حذف سبد خرید پس از ثبت سفارش موفق
    await Cart.deleteOne({ user: session.user.id });

    return NextResponse.json({
      success: true,
      message: "سفارش با موفقیت ثبت شد.",
      orderId: newOrder._id,
    });

  } catch (error) {
    console.error("POST ORDER ERROR:", error);
    return NextResponse.json(
      { success: false, message: "خطایی در ثبت سفارش به وجود آمده است." },
      { status: 500 }
    );
  }
}
