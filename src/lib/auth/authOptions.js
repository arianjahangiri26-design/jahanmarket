import CredentialsProvider from "next-auth/providers/credentials";

import connectToDatabase from "@/lib/database/db";
import users from "@/models/users";
import otp from "@/models/otp";
import { resolveAuthContact } from "@/lib/auth/resolveAuthContact";
import { hashOtpCode } from "@/lib/auth/otpHash";

const MAX_ATTEMPTS = 5;

export const authOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",

      credentials: {
        identifier: {
          label: "شماره موبایل یا ایمیل",
          type: "text",
        },
        phoneNumber: {
          label: "شماره موبایل",
          type: "text",
        },
        email: {
          label: "ایمیل",
          type: "email",
        },
        preferredOtpTarget: {
          label: "روش دریافت کد",
          type: "text",
        },
        code: {
          label: "کد تأیید",
          type: "text",
        },
      },

      async authorize(credentials) {
        try {
          await connectToDatabase();

          const identifier =
            typeof credentials?.identifier === "string"
              ? credentials.identifier.trim()
              : "";

          const phoneNumber =
            typeof credentials?.phoneNumber === "string"
              ? credentials.phoneNumber.trim()
              : "";

          const email =
            typeof credentials?.email === "string"
              ? credentials.email.trim()
              : "";

          const preferredOtpTarget =
            typeof credentials?.preferredOtpTarget === "string"
              ? credentials.preferredOtpTarget
              : "email";

          /*
           * کد تأیید باید دقیقاً یک رشته شش‌رقمی باشد.
           * این بررسی از ورود مقادیر نامعتبر و NoSQL Injection جلوگیری می‌کند.
           */
          const rawCode = credentials?.code;
          const code =
            typeof rawCode === "string" ? rawCode.trim() : "";

          if (!/^\d{6}$/.test(code)) {
            throw new Error("کد نامعتبر است");
          }

          /*
           * ایمیل یا شماره موبایل را اعتبارسنجی و نرمال‌سازی می‌کند.
           */
          const contact = resolveAuthContact({
            identifier,
            phoneNumber,
            email,
            preferredOtpTarget,
          });

          if (contact.error) {
            throw new Error(contact.error);
          }

          const query = contact.email
            ? { email: contact.email }
            : { phoneNumber: contact.phoneNumber };

          /*
           * سند OTP را فقط با اطلاعات تماس پیدا می‌کنیم تا بتوانیم
           * تاریخ انقضا و تعداد تلاش‌های ناموفق را بررسی کنیم.
           */
          const otpDoc = await otp.findOne({
            kind: 2,
            ...query,
          });

          if (!otpDoc) {
            throw new Error("کد اشتباه است");
          }

          /*
           * بررسی انقضای کد
           */
          if (
            !otpDoc.expireAt ||
            new Date(otpDoc.expireAt).getTime() <= Date.now()
          ) {
            await otp.deleteOne({ _id: otpDoc._id });

            throw new Error(
              "کد منقضی شده است. لطفاً کد جدید درخواست کنید"
            );
          }

          /*
           * بررسی محدودیت تعداد تلاش‌ها
           */
          const attempts = Number(otpDoc.attempts || 0);

          if (attempts >= MAX_ATTEMPTS) {
            await otp.deleteOne({ _id: otpDoc._id });

            throw new Error(
              "تعداد تلاش‌های شما بیش از حد مجاز است. کد جدید درخواست کنید"
            );
          }

          /*
           * مقایسه هش کد واردشده با هش ذخیره‌شده
           */
          const hashedCode = hashOtpCode(code);
          const isCodeValid = otpDoc.code === hashedCode;

          if (!isCodeValid) {
            const updatedOtp = await otp.findOneAndUpdate(
              {
                _id: otpDoc._id,
                attempts: { $lt: MAX_ATTEMPTS },
              },
              {
                $inc: { attempts: 1 },
              },
              {
                new: true,
              }
            );

            /*
             * اگر این تلاش باعث رسیدن به سقف مجاز شد،
             * کد را حذف می‌کنیم تا دیگر قابل استفاده نباشد.
             */
            if (
              updatedOtp &&
              Number(updatedOtp.attempts || 0) >= MAX_ATTEMPTS
            ) {
              await otp.deleteOne({ _id: otpDoc._id });

              throw new Error(
                "تعداد تلاش‌های شما بیش از حد مجاز است. کد جدید درخواست کنید"
              );
            }

            throw new Error("کد اشتباه است");
          }

          /*
           * پیدا کردن کاربر فعال
           */
          const user = await users.findOne({
            ...query,
            IsActive: { $ne: false },
          });

          /*
           * پیام عمومی برای جلوگیری از مشخص‌شدن وجود یا عدم وجود کاربر
           */
          if (!user) {
            throw new Error("ورود ناموفق بود");
          }

          /*
           * کد صحیح بوده است؛ آن را حذف می‌کنیم تا دوباره استفاده نشود.
           */
          await otp.deleteOne({ _id: otpDoc._id });

          return {
            id: user._id.toString(),
            name: user.name || "",
            email: user.email || null,
            phoneNumber: user.phoneNumber || null,
            role: user.role || "user",
          };
        } catch (error) {
          console.error("NEXTAUTH AUTHORIZE ERROR:", error);

          if (error instanceof Error) {
            throw error;
          }

          throw new Error("ورود ناموفق بود");
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  jwt: {
    maxAge: 30 * 24 * 60 * 60,
  },

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user }) {
      /*
       * user فقط هنگام ورود اولیه وجود دارد.
       */
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.phoneNumber = user.phoneNumber;
        token.role = user.role;
      }

      return token;
    },

    async session({ session, token }) {
      session.user = {
        id: token.id || token.sub || null,
        name: token.name || "",
        email: token.email || null,
        phoneNumber: token.phoneNumber || null,
        role: token.role || "user",
      };

      return session;
    },
  },

  pages: {
    signIn: "/auth",
    error: "/auth/error",
  },
};
