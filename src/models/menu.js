// models/Menu.js
import mongoose from "mongoose";

const MenuSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    url: {
      type: String,
      default: "", // می‌تواند خالی باشد (مثلاً برای منوهای والد که فقط بازکننده زیرمنو هستند)
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Menu",
      default: null,
    },
    type: {
      type: String,
      enum: ["normal", "mega"],
      default: "normal",
    },
    order: {
      type: Number,
      default: 0, // جهت مرتب‌سازی منوها
    },
    iconImage: {
      type: String, // مسیر آپلود تصویر آیکون منو
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Menu || mongoose.model("Menu", MenuSchema);
