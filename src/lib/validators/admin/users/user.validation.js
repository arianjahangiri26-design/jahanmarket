import { z } from "zod";

/**
 * Schema for creating a user
 */
export const createUserSchema = z.object({
  name: z.string().min(1, "نام اجباری است"),
  phoneNumber: z.string().min(1, "شماره موبایل اجباری است"),

   email: z.string().min(1, "ایمیل الزامی است").email("ایمیل معتبر نیست"),

 
});


/**
 * Schema for updating user
 */
export const updateUserSchema = z.object({
  name: z.string().min(2, "نام باید حداقل ۲ کاراکتر باشد"),
  phoneNumber: z.string().regex(/^09\d{9}$/, "شماره موبایل معتبر نیست"),
   email: z.string().min(1, "ایمیل الزامی است").email("ایمیل معتبر نیست"),

 
});
