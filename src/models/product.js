import mongoose from "mongoose";

const ProductFeatureSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "عنوان ویژگی الزامی است"],
      trim: true,
    },
    value: {
      type: String,
      required: [true, "مقدار ویژگی الزامی است"],
      trim: true,
    },
  },
  { _id: false }
);

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "نام محصول الزامی است"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    images: {
      type: [String],
      default: [],
    },
    price: {
      type: Number,
      required: [true, "قیمت الزامی است"],
      min: 0,
      default: 0,
    },
    discountprice: {
      type: Number,
      default: 0,
      min: 0,
    },
    stock: {
      type: Number,
      required: [true, "موجودی الزامی است"],
      default: 1,
      min: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "دسته‌بندی الزامی است"],
    },
    features: {
      type: [ProductFeatureSchema],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    sold: {
      type: Number,
      default: 0,
      min: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: [true, "کاربر ثبت‌کننده الزامی است"],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
