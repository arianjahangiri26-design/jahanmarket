import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import connectToDatabase from "@/lib/database/db";
import Address from "@/models/address";
import Cart from "@/models/cart";
import Order from "@/models/order";
import Product from "@/models/product";
import { authOptions } from "../../auth/[...nextauth]/route";
 
 
export const dynamic = "force-dynamic";

/**
 * GET /api/order
 * Returns all orders that belong to the authenticated user.
 */
export async function GET() {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "برای مشاهده سفارش‌ها ابتدا وارد حساب کاربری شوید.",
        },
        { status: 401 }
      );
    }

    const orders = await Order.find({ user: session.user.id })
      .populate("items.product")
      .populate("address")
      .sort({ createdAt: -1 })
      .lean();

    const summary = {
      totalOrders: orders.length,
      totalSpent: orders.reduce((total, order) => {
        return total + Number(order?.finalPrice || order?.totalPrice || 0);
      }, 0),
      pendingCount: orders.filter(
        (order) => order?.status === "در انتظار پرداخت"
      ).length,
    };

    return NextResponse.json(
      {
        success: true,
        data: {
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
 * Creates a new order from the authenticated user's cart.
 */
export async function POST(request) {
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

    const addressExists = await Address.findOne({
      _id: addressId,
      user: session.user.id,
    });

    if (!addressExists) {
      return NextResponse.json(
        {
          success: false,
          message: "آدرس انتخاب‌شده معتبر نیست یا یافت نشد.",
        },
        { status: 404 }
      );
    }

    const userCart = await Cart.findOne({
      user: session.user.id,
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

    const discountPrice = Number(userCart.discountPrice || 0);
    const finalPrice = Math.max(totalPrice - discountPrice, 0);

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

    for (const item of userCart.items) {
      const quantity = Number(item.quantity);

      await Product.findByIdAndUpdate(item.product._id, {
        $inc: {
          stock: -quantity,
          sold: quantity,
        },
      });
    }

    await Cart.deleteOne({
      user: session.user.id,
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
