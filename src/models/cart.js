import mongoose from "mongoose";

const CartSchema = new mongoose.Schema(
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

    discountPrice: {
      type: Number,
      default: 0,



    },

  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Cart || mongoose.model("Cart", CartSchema);
