import { z } from "zod";

const emptyStringToUndefined = (value) => {
  if (typeof value === "string" && value.trim() === "") {
    return undefined;
  }
  return value;
};

const baseDiscountSchema = z.object({
  code: z
    .string({ required_error: "کد تخفیف الزامی است" })
    .trim()
    .min(3, "کد تخفیف باید حداقل ۳ کاراکتر باشد")
    .transform((val) => val.toUpperCase()),

  title: z
    .string({ required_error: "عنوان تخفیف الزامی است" })
    .trim()
    .min(3, "عنوان تخفیف باید حداقل ۳ کاراکتر باشد"),

  type: z.enum(["percentage", "fixed"], {
    errorMap: () => ({
      message: "نوع تخفیف باید درصدی (percentage) یا ثابت (fixed) باشد",
    }),
  }),

  value: z.preprocess(
    (val) => (val === "" || val === undefined ? undefined : Number(val)),
    z
      .number({ required_error: "مقدار تخفیف الزامی است" })
      .min(0, "مقدار تخفیف نمی‌تواند منفی باشد")
  ),

  minPurchaseAmount: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? 0 : Number(val)),
    z.number().min(0, "حداقل مبلغ خرید نمی‌تواند منفی باشد").optional().default(0)
  ),

  startDate: z
    .string({ required_error: "تاریخ شروع تخفیف الزامی است" })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "تاریخ شروع نامعتبر است",
    }),

  endDate: z
    .string({ required_error: "تاریخ پایان تخفیف الزامی است" })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "تاریخ پایان نامعتبر است",
    }),

  isActive: z.boolean().optional().default(true),

  category: z.preprocess(
    emptyStringToUndefined,
    z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "شناسه دسته‌بندی نامعتبر است")
      .optional()
      .nullable()
  ),
});

const addDiscountRefinements = (schema) =>
  schema.superRefine((data, ctx) => {
    if (data.startDate && data.endDate) {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);

      if (end <= start) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "تاریخ پایان تخفیف باید بعد از تاریخ شروع باشد",
          path: ["endDate"],
        });
      }
    }

    if (data.type === "percentage" && data.value !== undefined && data.value > 100) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "درصد تخفیف نمی‌تواند بیشتر از ۱۰۰ باشد",
        path: ["value"],
      });
    }
  });

export const createDiscountSchema = addDiscountRefinements(baseDiscountSchema);

export const updateDiscountSchema = addDiscountRefinements(
  baseDiscountSchema.partial()
);
