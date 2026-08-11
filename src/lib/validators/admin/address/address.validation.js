import { z } from "zod";

// Persian/Arabic digits normalization for better validation consistency
const normalizeDigits = (value = "") =>
  String(value)
    .replace(/[۰-۹]/g, (digit) => "۰۱۲۳۴۵۶۷۸۹".indexOf(digit))
    .replace(/[٠-٩]/g, (digit) => "٠١٢٣٤٥٦٧٨٩".indexOf(digit));

const requiredText = (label, min, max) =>
  z
    .string()
    .trim()
    .min(min, `${label} باید حداقل ${min} کاراکتر باشد`)
    .max(max, `${label} نمی‌تواند بیشتر از ${max} کاراکتر باشد`);

export const createAddressSchema = z.object({
  province: requiredText("نام استان", 2, 60),

  city: requiredText("نام شهر", 2, 60),

  plaque: z
    .string()
    .trim()
    .min(1, "پلاک الزامی است")
    .max(30, "پلاک نمی‌تواند بیشتر از ۳۰ کاراکتر باشد")
    .transform(normalizeDigits),

  fullAddress: requiredText("آدرس کامل", 10, 700),
});

export const updateAddressSchema = z.object({
  province: requiredText("نام استان", 2, 60),

  city: requiredText("نام شهر", 2, 60),

  plaque: z
    .string()
    .trim()
    .min(1, "پلاک الزامی است")
    .max(30, "پلاک نمی‌تواند بیشتر از ۳۰ کاراکتر باشد")
    .transform(normalizeDigits),

  fullAddress: requiredText("آدرس کامل", 10, 700),
});
