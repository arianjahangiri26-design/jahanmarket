import connectToDatabase from "@/lib/database/db";
import { errorResponse, successResponse } from "@/lib/utils/apiResponse";
 
import Category from "@/models/Category";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import CartModel from "@/models/cart"; // تغییر نام مدل برای جلوگیری از تداخل با متغیر cart
import Product from "@/models/product";
import { NextResponse } from "next/server";
import DiscountCode from "@/models/discountcode";

export async function POST(req) {
    try {
        await connectToDatabase();

        const session = await getServerSession(authOptions);
        
        if (!session || !session.user) {
            return NextResponse.json({
                success: false,
                message: "برای اعمال کد تخفیف اول وارد شوید"
            }, { status: 401 });
        }

        const { code } = await req.json();
        if (!code || code.trim() === "") {
            return NextResponse.json({
                success: false,
                message: "کد تخفیف را وارد کنید"
            }, { status: 400 });
        }

        const discountCode = await DiscountCode.findOne({ code: code.trim(), isActive: true });
        if (!discountCode) {
            return NextResponse.json({
                success: false,
                message: "کد تخفیف وارد شده صحیح نمی‌باشد"
            }, { status: 400 });
        }

        const now = new Date();
        if (now > new Date(discountCode.endDate)) {
            return NextResponse.json({
                success: false,
                message: "کد وارد شده منقضی شده است"
            }, { status: 400 });
        }
        if (now < new Date(discountCode.startDate)) {
            return NextResponse.json({
                success: false,
                message: "کد تخفیف وارد شده معتبر نمی‌باشد"
            }, { status: 400 });
        }

        // پیدا کردن سبد خرید کاربر
        let userCart = await CartModel.findOne({ user: session.user.id }).populate("items.product");
        
        if (!userCart || !userCart.items || userCart.items.length === 0) {
            return NextResponse.json({
                success: false,
                message: "سبد خرید شما خالی است"
            }, { status: 400 });
        }

        // بررسی اینکه آیا حداقل یکی از محصولات سبد خرید شامل دسته‌بندی کد تخفیف می‌شود یا خیر
        // (چون items آرایه است، باید تک‌تک بررسی شوند)
        const hasValidCategory = userCart.items.some(item => {
            const prodCat = item.product?.category?.toString();
            const discountCat = discountCode.category?.toString();
            return prodCat === discountCat;
        });

        if (discountCode.category && !hasValidCategory) {
            return NextResponse.json({
                success: false,
                message: "کد وارد شده مربوط به محصولات سبد خرید شما نمی‌شود"
            }, { status: 400 });
        }

        // محاسبه کل مبلغ سبد خرید
        let totalPrice = userCart.items.reduce((total, item) => {
            return total + (item.product?.price || 0) * (item.quantity || 0);
        }, 0);

        if (totalPrice === 0) {
            return NextResponse.json({
                success: false,
                message: "سبد خرید شما خالی است"
            }, { status: 400 });
        }

        // محاسبه مبلغ تخفیف
        const discountAmount = (totalPrice * discountCode.value) / 100;
        userCart.discountPrice = discountAmount;
        userCart.discountCode = discountCode.code; // ذخیره کد تخفیف اعمال شده
        await userCart.save();

        return NextResponse.json({
            success: true,
            discountPercentage: discountCode.value,
            discountPrice: discountAmount
        });

    } catch (err) {
        console.error("Discount apply error:", err);
        return NextResponse.json({
            success: false,
            message: "خطای سرور رخ داده است"
        }, { status: 500 });
    }
}
