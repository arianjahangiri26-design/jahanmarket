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
      default: "",
    },
    desktopImage: {
      type: String,
      required: [true, "تصویر نسخه دسکتاپ الزامی است"],
    },
    mobileImage: {
      type: String,
      default: "",
    },
    link: {
      type: String,
      trim: true,
      default: "",
    },
    order: {
      type: Number,
      default: 0,
    },
    position: {
      type: String,
      default: "main-slider",
      trim: true,
      index: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
      index: true,
    },
    startsAt: {
      type: Date,
      default: null,
    },
    endsAt: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

BannerAdsSchema.index({ position: 1, isActive: 1, order: 1, createdAt: -1 });

export default mongoose.models.BannerAds || mongoose.model("BannerAds", BannerAdsSchema);
