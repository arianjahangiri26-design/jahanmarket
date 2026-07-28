import mongoose from "mongoose";

const CommentProductSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, "متن کامنت الزامی است"],
      trim: true,
      maxlength: [1000, "متن کامنت نمی‌تواند بیشتر از ۱۰۰۰ کاراکتر باشد"],
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "شناسه محصول الزامی است"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: [true, "شناسه نویسنده الزامی است"],
    },
    isApproved: {
      type: Boolean,
      default: false, // کامنت‌ها در ابتدا نیاز به تایید ادمین دارند
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.CommentProduct || mongoose.model("CommentProduct", CommentProductSchema);
