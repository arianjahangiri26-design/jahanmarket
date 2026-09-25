// lib/validators/admin/menus/menu.validation.js
import { z } from "zod";

export const createMenuSchema = z.object({
  title: z
    .string()
    .min(2, "عنوان منو باید حداقل ۲ کاراکتر باشد")
    .max(100, "عنوان منو بیش از حد طولانی است"),

  url: z
    .string()
    .max(200, "آدرس لینک بیش از حد طولانی است")
    .optional()
    .or(z.literal("")),

  parent: z
    .string()
    .optional()
    .nullable()
    .or(z.literal("")),

  type: z.enum(["normal", "mega"]).default("normal"),

  order: z.preprocess(
    (val) => (val === "" || val === undefined ? 0 : Number(val)),
    z.number().min(0, "ترتیب باید یک عدد مثبت باشد")
  ),

  isActive: z.boolean().default(true),
});

export const updateMenuSchema = createMenuSchema.extend({
  iconImage: z.any().optional(),
});
