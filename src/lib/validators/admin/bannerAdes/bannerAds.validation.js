import { z } from "zod";

// اعتبارسنجی برای ساخت بنر جدید
export const createBannerAdsSchema = z.object({
  title: z
    .string()
    .min(3, "عنوان بنر باید حداقل ۳ کاراکتر باشد")
    .max(100, "عنوان بنر نمی‌تواند بیش از ۱۰۰ کاراکتر باشد"),
  description: z.string().optional(),
  link: z.string().url("لینک معتبر وارد کنید").or(z.literal("")).optional(),
  order: z.preprocess((val) => Number(val) || 0, z.number().nonnegative()),
  position: z.string().min(1, "تعیین جایگاه بنر الزامی است"),
  isActive: z.boolean().default(true),
  // فیلدهای فایل در کلاینت هندل و در سرور به صورت مجزا ولیدیت می‌شوند
  desktopImage: z.any().optional(),
  mobileImage: z.any().optional(),
});

// اعتبارسنجی برای ویرایش بنر
export const updateBannerAdsSchema = createBannerAdsSchema.partial();
