import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";

import connectToDatabase from "@/lib/database/db";
import Address from "@/models/address";
import Cart from "@/models/cart";
import Order from "@/models/order";
import Product from "@/models/product";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const dynamic = "force-dynamic";

/**
 * Returns a safe public representation of the authenticated user.
 * Sensitive information should never be returned from this endpoint.
 */
const getSafeUser = (session) => {
  return {
    id: session?.user?.id || null,
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    image: session?.user?.image || null,
  };
};

/**
 * GET /api/order
 *
 * Returns only the orders that belong to the authenticated user.
 */
export async function GET() {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "برای مشاهده سفارش‌ها ابتدا وارد حساب کاربری شوید.",
        },
        { status: 401 }
      );
    }

    // Always filter orders by the authenticated user's ID.
    const orders = await Order.find({
      user: userId,
    })
      .populate("items.product")
      .populate("address")
      .sort({ createdAt: -1 })
      .lean();

    const summary = {
      totalOrders: orders.length,
      totalSpent: orders.reduce((total, order) => {
        return total + Number(order?.finalPrice ?? order?.totalPrice ?? 0);
      }, 0),
      pendingCount: orders.filter(
        (order) => order?.status === "در انتظار پرداخت"
      ).length,
    };

    return NextResponse.json(
      {
        success: true,
        data: {
          user: getSafeUser(session),
          orders,
          summary,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET ORDERS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "خطایی در دریافت سفارش‌ها رخ داده است.",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/order
 *
 * Creates a new order from the authenticated user's cart.
 */
export async function POST(request) {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "شما وارد حساب کاربری خود نشده‌اید.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const addressId = body?.addressId;

    if (!addressId) {
      return NextResponse.json(
        {
          success: false,
          message: "لطفاً آدرس تحویل سفارش را مشخص کنید.",
        },
        { status: 400 }
      );
    }

    // Prevent invalid MongoDB ObjectId errors.
    if (!mongoose.Types.ObjectId.isValid(addressId)) {
      return NextResponse.json(
        {
          success: false,
          message: "شناسه آدرس معتبر نیست.",
        },
        { status: 400 }
      );
    }

    // Make sure the selected address belongs to the authenticated user.
    const address = await Address.findOne({
      _id: addressId,
      user: userId,
    }).lean();

    if (!address) {
      return NextResponse.json(
        {
          success: false,
          message: "آدرس انتخاب‌شده معتبر نیست یا یافت نشد.",
        },
        { status: 404 }
      );
    }

    // Retrieve only the authenticated user's cart.
    const userCart = await Cart.findOne({
      user: userId,
    }).populate("items.product");

    if (!userCart?.items?.length) {
      return NextResponse.json(
        {
          success: false,
          message: "سبد خرید شما خالی است.",
        },
        { status: 400 }
      );
    }

    // Validate products and stock before creating the order.
    for (const item of userCart.items) {
      const product = item?.product;
      const quantity = Number(item?.quantity);

      if (!product) {
        return NextResponse.json(
          {
            success: false,
            message: "یکی از محصولات سبد خرید پیدا نشد.",
          },
          { status: 404 }
        );
      }

      if (!Number.isInteger(quantity) || quantity <= 0) {
        return NextResponse.json(
          {
            success: false,
            message: "تعداد یکی از محصولات نامعتبر است.",
          },
          { status: 400 }
        );
      }

      if (Number(product.stock) < quantity) {
        return NextResponse.json(
          {
            success: false,
            message: `موجودی محصول «${product.name}» کافی نیست.`,
          },
          { status: 400 }
        );
      }
    }

    const totalPrice = userCart.items.reduce((total, item) => {
      const price = Number(item?.product?.price || 0);
      const quantity = Number(item?.quantity || 0);

      return total + price * quantity;
    }, 0);

    const discountPrice = Math.max(
      Number(userCart.discountPrice || 0),
      0
    );

    const finalPrice = Math.max(totalPrice - discountPrice, 0);

    const newOrder = await Order.create({
      user: userId,
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

    // Decrease stock and increase sold count.
    for (const item of userCart.items) {
      const quantity = Number(item.quantity);

      await Product.findByIdAndUpdate(item.product._id, {
        $inc: {
          stock: -quantity,
          sold: quantity,
        },
      });
    }

    // Clear only the authenticated user's cart.
    await Cart.deleteOne({
      user: userId,
    });

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
      {
        success: false,
        message: "خطایی در ثبت سفارش به وجود آمده است.",
      },
      { status: 500 }
    );
  }
}
