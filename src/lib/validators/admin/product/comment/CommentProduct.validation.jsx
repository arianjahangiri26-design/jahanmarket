import { z } from "zod";

export const commentSchema = z.object({
  text: z
    .string()
    .min(3, "متن کامنت باید حداقل ۳ کاراکتر باشد")
    .max(700, "متن کامنت نمی‌تواند بیشتر از 700 کاراکتر باشد"),
  product: z
    .string()
    .min(1, "شناسه محصول الزامی است")
    .regex(/^[0-9a-fA-F]{24}$/, "شناسه محصول معتبر نیست"), // بررسی معتبر بودن فرمت ObjectId در mongoose
});
