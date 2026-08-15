import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema(
{
phoneNumber: {
type: String,
},
 
email: {
  type: String,
  lowercase: true,
  trim: true,
},

code: {
  type: String,
  required: true,
},

expireAt: {
  type: Date,
  required: true,
},

kind: {
  type: Number,
  required: true,
},
 

},
{
timestamps: true,
}
);

OtpSchema.pre("save", function (next) {
if (!this.phoneNumber && !this.email) {
return next(new Error("ایمیل یا شماره موبایل الزامی است"));
}

next();
});

export default mongoose.models.Otp ||
mongoose.model("Otp", OtpSchema);
