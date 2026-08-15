import { z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(2, "نام دسته‌بندی باید حداقل ۲ کاراکتر باشد")
    .max(100, "نام دسته‌بندی بیش از حد طولانی است"),

  description: z
    .string()
    .max(500, "توضیحات بیش از حد طولانی است")
    .optional()
    .or(z.literal("")),

  parent: z
    .string()
    .optional()
    .nullable()
    .or(z.literal("")),

  isActive: z.boolean().default(true),
});

export const updateCategorySchema = z
  .object({
     
      name: z.string().min(2, "نام حداقل ۲ کاراکتر").max(100),
  description: z.string().max(500).optional().or(z.literal("")),
  parent: z.string().optional().nullable().or(z.literal("")),
  isActive: z.boolean().optional(),
  image: z.any().optional(), // اضافه کردن فیلد تصویر برای جلوگیری از خطای ولیدیشن
  })
   
  
