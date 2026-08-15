import { z } from "zod";

const phoneRegex = /^09\d{9}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const emptyStringToUndefined = (value) => {
  if (typeof value === "string" && value.trim() === "") {
    return undefined;
  }

  return value;
};

const identifierSchema = z.preprocess(
  emptyStringToUndefined,
  z
    .string({
      required_error: "ایمیل یا شماره موبایل الزامی است",
      invalid_type_error: "ایمیل یا شماره موبایل معتبر نیست",
    })
    .trim()
    .optional()
);

const phoneNumberSchema = z.preprocess(
  emptyStringToUndefined,
  z.string().trim().optional()
);

const emailSchema = z.preprocess(
  emptyStringToUndefined,
  z.string().trim().optional()
);

const contactFields = {
  identifier: identifierSchema,
  phoneNumber: phoneNumberSchema,
  email: emailSchema,
  preferredOtpTarget: z.enum(["email", "phone"]).optional().default("email"),
};

const validateContact = (data, ctx) => {
  const identifier = data.identifier?.trim() || "";
  const phoneNumber = data.phoneNumber?.trim() || "";
  const email = data.email?.trim() || "";

  const hasIdentifier = Boolean(identifier);
  const hasPhoneNumber = Boolean(phoneNumber);
  const hasEmail = Boolean(email);

  if (!hasIdentifier && !hasPhoneNumber && !hasEmail) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "ایمیل یا شماره موبایل الزامی است",
      path: ["identifier"],
    });

    return;
  }

  if (identifier) {
    const isEmail = emailRegex.test(identifier);
    const isPhoneNumber = phoneRegex.test(identifier);

    if (!isEmail && !isPhoneNumber) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "ایمیل یا شماره موبایل معتبر نیست",
        path: ["identifier"],
      });
    }
  }

  if (phoneNumber && !phoneRegex.test(phoneNumber)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "شماره موبایل معتبر نیست",
      path: ["phoneNumber"],
    });
  }

  if (email && !emailRegex.test(email)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "ایمیل معتبر نیست",
      path: ["email"],
    });
  }
};

const otpCodeSchema = z
  .string({
    required_error: "کد الزامی است",
    invalid_type_error: "کد معتبر نیست",
  })
  .trim()
  .regex(/^\d{6}$/, "کد باید 6 رقم باشد").min(1,"کد اجباری است ");

const optionalOtpCodeSchema = z.preprocess(
  emptyStringToUndefined,
  otpCodeSchema.optional()
);

const nameSchema = z
  .string({
    required_error: "نام الزامی است",
    invalid_type_error: "نام معتبر نیست",
  })
  .trim()
  .min(3, "نام باید حداقل 3 کاراکتر باشد");

const optionalStringSchema = z.preprocess(
  emptyStringToUndefined,
  z.string().optional()
);

export const sendOtpSchema = z
  .object({
    ...contactFields,
    type: z.enum(["login", "register"], {
      required_error: "نوع درخواست الزامی است",
      invalid_type_error: "نوع درخواست معتبر نیست",
    }),
  })
  .superRefine(validateContact);

export const loginSendOtpSchema = sendOtpSchema;

export const registerSchema = z
  .object({
    ...contactFields,
    name: nameSchema,
    code: optionalOtpCodeSchema,
    role: optionalStringSchema,
    AvatarImage: optionalStringSchema,
  })
  .superRefine(validateContact);

export const registerSendOtpSchema = registerSchema;

export const registerVerifyOtpSchema = z
  .object({
    ...contactFields,
    name: nameSchema,
    code: otpCodeSchema,
    role: optionalStringSchema,
    AvatarImage: optionalStringSchema,
  })
  .superRefine(validateContact);

export const loginSchema = z
  .object({
    ...contactFields,
    code: otpCodeSchema,
  })
  .superRefine(validateContact);

export const userAuth = registerSchema;
