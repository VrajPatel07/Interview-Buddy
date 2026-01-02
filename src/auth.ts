import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";


export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: any) {
        try {
          const user = await prisma.user.findFirst({
            where: {
              email: credentials.email
            }
          });

          if (!user) {
            throw new Error("User not found");
          }

          const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);

          if (!isPasswordCorrect) {
            throw new Error("Invalid password");
          }

          return user;
        }
        catch (error) {
          NextResponse.json({ message: "Internal server error. Try again later." }, { status: 500 });
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: "/sign-in"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.companyId = user.companyId || null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user && token?.id) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.role = token.role as string;
        session.user.companyId = (token.companyId as string | null) || null;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET
})