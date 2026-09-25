// src/models/order.js
import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    // The user who placed the order
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "کاربر الزامی است"],
    },
    // The selected delivery address
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: [true, "آدرس تحویل سفارش الزامی است"],
    },
    // List of ordered products
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          min: 1,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    discountPrice: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    finalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["در انتظار پرداخت", "پرداخت شده", "لغو شده"],
      default: "در انتظار پرداخت",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
