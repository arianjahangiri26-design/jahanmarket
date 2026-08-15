import mongoose from "mongoose";

const BannerAdsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "وارد کردن عنوان بنر الزامی است"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    // تصویر نسخه دسکتاپ (ابعاد بزرگ)
    desktopImage: {
      type: String,
      required: [true, "تصویر نسخه دسکتاپ الزامی است"],
    },
    // تصویر بهینه‌شده برای موبایل (عمودی یا ابعاد کوچک‌تر)
    mobileImage: {
      type: String,
    },
    link: {
      type: String,
      trim: true,
    },
    // اولویت نمایش بنرها به ترتیب (مثلاً ۱، ۲، ۳)
    order: {
      type: Number,
      default: 0,
    },
    // دسته‌بندی جایگاه بنر (مثال: 'main-slider', 'hero-right', 'footer-banner')
    position: {
      type: String,
      default: "main-slider",
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.BannerAds || mongoose.model("BannerAds", BannerAdsSchema);
