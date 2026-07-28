import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import connectToDatabase from "@/lib/database/db";
import users from "@/models/users";
import otp from "@/models/otp";
import { resolveAuthContact } from "@/lib/auth/resolveAuthContact";
 
   

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

  const {
    identifier,
    phoneNumber,
    email,
    preferredOtpTarget,
    code,
  } = credentials;

  if (!code) {
    throw new Error("کد الزامی است");
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

  const otpDoc = await otp.findOne({
    code,
    kind: 2,
    ...query,
  });

  if (!otpDoc) {
    throw new Error("کد اشتباه است");
  }

  if (otpDoc.expireAt < new Date()) {
    throw new Error("کد منقضی شده است");
  }

  const user = await users.findOne(query);

  if (!user) {
    throw new Error("کاربر وجود ندارد");
  }

  await otp.deleteOne({ _id: otpDoc._id });

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email || null,
    phoneNumber: user.phoneNumber || null,
    role: user.role,
  };
}

    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
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