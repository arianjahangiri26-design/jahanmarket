import NextAuth from "next-auth";
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
      name: "credentials",
      credentials: {
        phoneNumber: { type: "text" },
        email: { type: "text" },
        code: { type: "text" },
      },

      async authorize(credentials) {
        await connectToDatabase();

        const identifier =
          typeof credentials?.identifier === "string" ? credentials.identifier : "";
        const phoneNumber =
          typeof credentials?.phoneNumber === "string" ? credentials.phoneNumber : "";
        const email = typeof credentials?.email === "string" ? credentials.email : "";
        const preferredOtpTarget =
          typeof credentials?.preferredOtpTarget === "string"
            ? credentials.preferredOtpTarget
            : "email";

        // کد باید دقیقاً یک رشته‌ی ۶ رقمی باشد (جلوگیری از NoSQL injection و ورودی نامعتبر)
        const rawCode = credentials?.code;
        const code = typeof rawCode === "string" ? rawCode.trim() : "";
        if (!/^\d{6}$/.test(code)) {
          throw new Error("کد نامعتبر است");
        }

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

        // ابتدا سند OTP را فقط بر اساس contact پیدا می‌کنیم (نه بر اساس کد)
        // تا بتوانیم شمارنده‌ی تلاش‌های ناموفق را مدیریت کنیم
        const otpDoc = await otp.findOne({ kind: 2, ...query });

        if (!otpDoc) {
          throw new Error("کد اشتباه است");
        }

        if (otpDoc.expireAt < new Date()) {
          await otp.deleteOne({ _id: otpDoc._id });
          throw new Error("کد منقضی شده است");
        }

        if ((otpDoc.attempts || 0) >= MAX_ATTEMPTS) {
          await otp.deleteOne({ _id: otpDoc._id });
          throw new Error("تعداد تلاش‌های شما بیش از حد مجاز است. کد جدید درخواست کنید");
        }

        const isCodeValid = otpDoc.code === hashOtpCode(code);

        if (!isCodeValid) {
          await otp.updateOne({ _id: otpDoc._id }, { $inc: { attempts: 1 } });
          throw new Error("کد اشتباه است");
        }

        const user = await users.findOne(query);

        // پیام عمومی به‌جای "کاربر وجود ندارد" برای جلوگیری از user enumeration
        if (!user || user.IsActive === false) {
          throw new Error("ورود ناموفق بود");
        }

        await otp.deleteOne({ _id: otpDoc._id });

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email || null,
          phoneNumber: user.phoneNumber || null,
          role: user.role,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 روز
  },

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user }) {
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
        id: token.id,
        name: token.name,
        email: token.email,
        phoneNumber: token.phoneNumber,
        role: token.role,
      };
      return session;
    },
  },

  pages: {
    signIn: "/auth",
    error: "/auth/error",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
