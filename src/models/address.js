import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema(
  {
    // Address owner
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: [true, "کاربر آدرس الزامی است"],
      index: true,
    },

    // Province name
    province: {
      type: String,
      required: [true, "استان الزامی است"],
      trim: true,
      minlength: [2, "نام استان باید حداقل ۲ کاراکتر باشد"],
      maxlength: [60, "نام استان نمی‌تواند بیشتر از ۶۰ کاراکتر باشد"],
    },

    // City name
    city: {
      type: String,
      required: [true, "شهر الزامی است"],
      trim: true,
      minlength: [2, "نام شهر باید حداقل ۲ کاراکتر باشد"],
      maxlength: [60, "نام شهر نمی‌تواند بیشتر از ۶۰ کاراکتر باشد"],
    },

    // Building plaque can contain Persian numbers and letters
    plaque: {
      type: String,
      required: [true, "پلاک الزامی است"],
      trim: true,
      maxlength: [30, "پلاک نمی‌تواند بیشتر از ۳۰ کاراکتر باشد"],
    },

    // Complete postal address entered by the user
    fullAddress: {
      type: String,
      required: [true, "آدرس کامل الزامی است"],
      trim: true,
      minlength: [10, "آدرس کامل باید حداقل ۱۰ کاراکتر باشد"],
      maxlength: [700, "آدرس کامل نمی‌تواند بیشتر از ۷۰۰ کاراکتر باشد"],
    },
  },
  {
    timestamps: true,
  }
);

// Useful for fetching user addresses sorted by newest records
AddressSchema.index({ user: 1, createdAt: -1 });

export default mongoose.models.Address ||
  mongoose.model("Address", AddressSchema);
