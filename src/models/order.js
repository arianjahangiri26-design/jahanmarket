import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,

      required: [true, "نام الزامی است"],
      ref: "User",
      required: true,

    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },
        quantity: {
          type: Number,
          min: 1,
          required: true
        }


      }],

    discountPrice: { type: Number, default: 0, },
    totalPrice: { type: Number, require: true },
    finalPrice: { type: Number, require: true },
    status: {
      type: String,
      require: true,

      enum: ["در انتظار پرداخت", "پرداخت شده", "لغو شده"]
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
