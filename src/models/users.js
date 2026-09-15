import mongoose from "mongoose";

const UsersSchema = new mongoose.Schema(
{
name: {
type: String,
required: [true, "نام الزامی است"],
minlength: [3, "نام باید حداقل 3 کاراکتر باشد"],
maxlength: [50, "نام خیلی طولانی است"],
trim: true,
},
 phoneNumber: {
  type: String,
  unique: true,
  sparse: true,
  match: [/^09\d{9}$/, "شماره موبایل معتبر نیست"],
}, 

email: {
  type: String,
  unique: true,
 sparse: true,
  lowercase: true,
  trim: true,
  match: [/^\S+@\S+\.\S+$/, "ایمیل معتبر نیست"],
},

AvatarImage: {
  type: String,
  default: "",
},

IsActive: {
  type: Boolean,
  default: false,
},

kind: {
  type: Number,
  required: true,
  comment: "1 register 2 login",
},

role: {
  type: String,
  enum: ["user", "manager", "admin", "seller"],
  default: "user",
},
 

},
{
timestamps: true,
}
);

UsersSchema.pre("save", function (next) {
if (!this.phoneNumber && !this.email) {
return next(new Error("ایمیل یا شماره موبایل الزامی است"));
}

next();
});

export default mongoose.models.Users ||
mongoose.model("Users", UsersSchema);
