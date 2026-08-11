import mongoose from "mongoose";

const ProductFeatureSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "عنوان ویژگی الزامی است"],
      trim: true,
      maxlength: [50, "عنوان ویژگی خیلی طولانی است"],
    },
    value: {
      type: String,
      required: [true, "مقدار ویژگی الزامی است"],
      trim: true,
      maxlength: [200, "مقدار ویژگی خیلی طولانی است"],
    },
  },
  { _id: false }
);

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "نام الزامی است"],
      minlength: [3, "نام باید حداقل 3 کاراکتر باشد"],
      maxlength: [50, "نام خیلی طولانی است"],
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: [2000, "توضیحات خیلی طولانی است"],
      default: "",
    },

    imageProduct: {
      type: String,
      required: [true, "عکس محصول الزامی است"],
      trim: true,
    },

    discountprice: {
      type: Number,
    },

    stock: {
      type: Number,
      required: [true, "موجودی الزامی است"],
      default: 1,
      min: [0, "موجودی نمی‌تواند منفی باشد"],
    },

    price: {
      type: Number,
      required: [true, "قیمت الزامی است"],
      default: 1,
      min: [0, "قیمت نمی‌تواند منفی باشد"],
    },

    isActive: {
      type: Boolean,
      default: false,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "دسته‌بندی الزامی است"],
    },
    sold: {
      type: Number,
      default: 0,
      min: [0, "تعداد فروش نمی‌تواند منفی باشد"],
    },
    features: {
      type: [ProductFeatureSchema],
      default: [],
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: [true, "کاربر سازنده الزامی است"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
