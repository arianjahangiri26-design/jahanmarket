import { BANNER_POSITION_VALUES } from "@/constants/admin/banner-ads/bannerAds";
import { z } from "zod";
 

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const baseBannerAdsSchema = {
  title: z
    .string({ required_error: "عنوان بنر الزامی است" })
    .trim()
    .min(2, "عنوان بنر باید حداقل ۲ حرف باشد"),
  description: z.string().trim().optional().default(""),
  link: z
    .string()
    .trim()
    .optional()
    .default("")
    .refine((val) => !val || val.startsWith("/") || /^https?:\/\//.test(val), {
      message: "لینک باید با / یا http:// یا https:// شروع شود",
    }),
  order: z.coerce.number().int().default(0),
  position: z.enum(BANNER_POSITION_VALUES, {
    errorMap: () => ({ message: "جایگاه بنر نامعتبر است" }),
  }),
  category: z
    .string()
    .trim()
    .optional()
    .nullable()
    .transform((val) => (val === "" ? null : val))
    .refine((val) => !val || objectIdRegex.test(val), {
      message: "شناسه دسته‌بندی معتبر نیست",
    }),
  startsAt: z
    .string()
    .trim()
    .optional()
    .nullable()
    .transform((val) => (val ? new Date(val) : null)),
  endsAt: z
    .string()
    .trim()
    .optional()
    .nullable()
    .transform((val) => (val ? new Date(val) : null)),
  isActive: z.preprocess((val) => val === true || val === "true" || val === 1 || val === "1", z.boolean()).default(true),
};

export const createBannerAdsSchema = z
  .object(baseBannerAdsSchema)
  .refine(
    (data) => {
      if (data.startsAt && data.endsAt) {
        return data.endsAt > data.startsAt;
      }
      return true;
    },
    {
      message: "تاریخ پایان باید بعد از تاریخ شروع باشد",
      path: ["endsAt"],
    }
  );

export const updateBannerAdsSchema = z
  .object({
    ...baseBannerAdsSchema,
    title: baseBannerAdsSchema.title.optional(),
    position: baseBannerAdsSchema.position.optional(),
  })
  .refine(
    (data) => {
      if (data.startsAt && data.endsAt) {
        return data.endsAt > data.startsAt;
      }
      return true;
    },
    {
      message: "تاریخ پایان باید بعد از تاریخ شروع باشد",
      path: ["endsAt"],
    }
  );
