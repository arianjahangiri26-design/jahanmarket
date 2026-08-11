// src/app/api/order/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import connectToDatabase from "@/lib/database/db";
import Cart from "@/models/cart";
import Order from "@/models/order";
import Product from "@/models/product";
import Address from "@/models/address";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/**
 * POST handler to create an order from the user's cart.
 * Requires a valid selected address ID in the payload.
 */
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

    const { addressId } = await req.json();

    // Verify delivery address presence
    if (!addressId) {
      return NextResponse.json(
        { success: false, message: "لطفاً آدرس تحویل سفارش را مشخص کنید." },
        { status: 400 }
      );
    }

    // Verify the address belongs to the authenticated user
    const addressExists = await Address.findOne({
      _id: addressId,
      user: session.user.id,
    });

    if (!addressExists) {
      return NextResponse.json(
        { success: false, message: "آدرس انتخاب شده معتبر نیست یا یافت نشد." },
        { status: 404 }
      );
    }

    // Retrieve user's cart populated with product details
    const userCart = await Cart.findOne({
      user: session.user.id,
    }).populate("items.product");

    if (!userCart || !userCart.items || userCart.items.length === 0) {
      return NextResponse.json(
        { success: false, message: "سبد خرید شما خالی است." },
        { status: 400 }
      );
    }

    // Validate available stock for each cart item
    for (const item of userCart.items) {
      const product = item.product;
      const quantity = Number(item.quantity);

      if (!product) {
        return NextResponse.json(
          { success: false, message: "یکی از محصولات سبد خرید پیدا نشد." },
          { status: 404 }
        );
      }

      if (!Number.isInteger(quantity) || quantity <= 0) {
        return NextResponse.json(
          { success: false, message: "تعداد یکی از محصولات نامعتبر است." },
          { status: 400 }
        );
      }

      if (product.stock < quantity) {
        return NextResponse.json(
          {
            success: false,
            message: `موجودی محصول «${product.name}» کافی نیست.`,
          },
          { status: 400 }
        );
      }
    }

    // Calculate invoice totals
    const totalPrice = userCart.items.reduce((total, item) => {
      const price = Number(item?.product?.price || 0);
      const quantity = Number(item?.quantity || 0);
      return total + price * quantity;
    }, 0);

    const discountPrice = Number(userCart.discountPrice) || 0;
    const finalPrice = Math.max(totalPrice - discountPrice, 0);

    // Create the order object in DB
    const newOrder = await Order.create({
      user: session.user.id,
      address: addressId,
      items: userCart.items.map((item) => ({
        product: item.product._id,
        quantity: Number(item.quantity),
        price: Number(item.product.price),
      })),
      totalPrice,
      discountPrice,
      finalPrice,
      status: "در انتظار پرداخت",
    });

    // Update product stock levels and sales count
    for (const item of userCart.items) {
      const quantity = Number(item.quantity);
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: {
          stock: -quantity,
          sold: quantity,
        },
      });
    }

    // Clear cart upon successful checkout
    await Cart.deleteOne({ user: session.user.id });

    return NextResponse.json(
      {
        success: true,
        message: "سفارش با موفقیت ثبت شد.",
        orderId: newOrder._id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST ORDER ERROR:", error);
    return NextResponse.json(
      { success: false, message: "خطایی در ثبت سفارش به وجود آمده است." },
      { status: 500 }
    );
  }
}
