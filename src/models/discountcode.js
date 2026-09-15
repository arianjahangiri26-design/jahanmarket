// models/Discount.js
import mongoose from "mongoose";

const discountcodeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "کد تخفیف الزامی است"],
      unique: true,
      trim: true,
      uppercase: true, // همیشه کدها به صورت حروف بزرگ ذخیره می‌شوند
    },
    title: {
      type: String,
      required: [true, "عنوان تخفیف الزامی است"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["percentage", "fixed"],
      required: [true, "نوع تخفیف (درصدی یا مبلغ ثابت) الزامی است"],
    },
    value: {
      type: Number,
      required: [true, "مقدار تخفیف الزامی است"],
      min: [0, "مقدار تخفیف نمی‌تواند منفی باشد"],
    },
    minPurchaseAmount: {
      type: Number,
      default: 0, // حداقل خرید مورد نیاز برای فعال شدن کد
    },
    startDate: {
      type: Date,
      required: [true, "تاریخ شروع تخفیف الزامی است"],
    },
    endDate: {
      type: Date,
      required: [true, "تاریخ پایان تخفیف الزامی است"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // محدود کردن تخفیف به یک دسته‌بندی خاص (اختیاری)
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
  },
  { timestamps: true }
);

const DiscountCode = mongoose.models.DiscountCode || mongoose.model("DiscountCode", discountcodeSchema);
export default DiscountCode;
