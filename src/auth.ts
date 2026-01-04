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
        password: { label: "password", type: "password" },
        role: { label: "role", type: "text" }
      },
      async authorize(credentials: any) {
        try {
          if (credentials.role === "CANDIDATE") {

            const candidate = await prisma.candidate.findFirst({
              where: {
                email: credentials.email
              }
            });

            if (!candidate) {
              throw new Error("User not found");
            }

            const isPasswordCorrect = await bcrypt.compare(credentials.password, candidate.password);

            if (!isPasswordCorrect) {
              throw new Error("Invalid password");
            }

            return {...candidate, role : "CANDIDATE"};

          }
          else {

            const company = await prisma.company.findFirst({
              where: {
                email: credentials.email
              }
            });

            if (!company) {
              throw new Error("User not found");
            }

            const isPasswordCorrect = await bcrypt.compare(credentials.password, company.password);

            if (!isPasswordCorrect) {
              throw new Error("Invalid password");
            }

            return {...company, role : "RECRUITER"};
            
          }
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
      if (user?.email) {
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user && token?.email) {
        session.user.email = token.email as string;
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET
})