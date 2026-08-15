import connectToDatabase from "@/lib/database/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import Product from "@/models/product";
import Cart from "@/models/cart";

export async function GET() {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "شما وارد نشده اید" },
        { status: 401 }
      );
    }

    let userCart = await Cart.findOne({ user: session.user.id }).populate(
      "items.product"
    );

    if (!userCart) {
      userCart = await Cart.create({
        user: session.user.id,
        items: [],
      });
    }

    return NextResponse.json(userCart, { status: 200 });
  } catch (error) {
    console.error("GET CART ERROR:", error);
    return NextResponse.json(
      { error: "خطایی در دریافت سبد خرید به وجود آمده است" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "شما وارد نشده اید" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const quantity = Number(body?.quantity);
    const productId = body?.productId;

    if (!productId || !Number.isFinite(quantity) || quantity === 0) {
      return NextResponse.json(
        { error: "اطلاعات ورودی برای سبد خرید نامعتبر است" },
        { status: 400 }
      );
    }

    const foundProduct = await Product.findById(productId);

    if (!foundProduct) {
      return NextResponse.json({ error: "محصول پیدا نشد" }, { status: 404 });
    }

    let userCart = await Cart.findOne({ user: session.user.id });

    if (!userCart) {
      userCart = new Cart({
        user: session.user.id,
        items: [],
      });
    }

    const existingItem = userCart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;

      if (newQuantity <= 0) {
        userCart.items = userCart.items.filter(
          (item) => item.product.toString() !== productId
        );
      } else {
        existingItem.quantity = newQuantity;
      }
    } else {
      if (quantity < 0) {
        return NextResponse.json(
          { error: "تعداد محصول باید بیشتر از 0 باشد" },
          { status: 400 }
        );
      }

      userCart.items.push({
        product: productId,
        quantity,
      });
    }

    await userCart.save();
    await userCart.populate("items.product");

    return NextResponse.json(userCart, { status: 200 });
  } catch (error) {
    console.error("POST CART ERROR:", error);
    return NextResponse.json(
      { error: "خطایی در ایجاد سبد خرید به وجود آمده است" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "شما وارد نشده اید" },
        { status: 401 }
      );
    }

    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { error: "شناسه محصول نامعتبر است" },
        { status: 400 }
      );
    }

    const userCart = await Cart.findOne({ user: session.user.id });

    if (!userCart) {
      return NextResponse.json(
        { error: "سبد خرید پیدا نشد" },
        { status: 404 }
      );
    }

    const itemExists = userCart.items.some(
      (item) => item.product.toString() === productId
    );

    if (!itemExists) {
      return NextResponse.json(
        { error: "محصول در سبد خرید وجود ندارد" },
        { status: 404 }
      );
    }

    userCart.items = userCart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await userCart.save();
    await userCart.populate("items.product");

    return NextResponse.json(userCart, { status: 200 });
  } catch (error) {
    console.error("DELETE CART ERROR:", error);
    return NextResponse.json(
      { error: "خطایی در حذف محصول از سبد خرید به وجود آمده است" },
      { status: 500 }
    );
  }
}
