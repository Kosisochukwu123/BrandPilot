// src/lib/auth.ts

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";

import { db } from "@/lib/db";
import { loginSchema } from "@/lib/validations/auth";
import authConfig from "@/lib/auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,

  adapter: PrismaAdapter(db),

  session: {
    strategy: "jwt",
  },

  providers: [
    ...authConfig.providers.filter(
      (provider) => provider.id !== "credentials"
    ),

    Credentials({
      name: "credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },

        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(raw) {
        const parsed = loginSchema.safeParse(raw);

        if (!parsed.success) {
          return null;
        }

        const { email, password } = parsed.data;

        const user = await db.user.findUnique({
          where: {
            email,
          },
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        if (user.suspended) {
          return null;
        }

        const validPassword = await bcrypt.compare(
          password,
          user.passwordHash
        );

        if (!validPassword) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],

  callbacks: {
    ...authConfig.callbacks,

    async signIn({ user }) {
      if (!user.email) {
        return false;
      }

      const dbUser = await db.user.findUnique({
        where: {
          email: user.email,
        },
      });

      // Block suspended existing users
      if (dbUser?.suspended) {
        return false;
      }

      // Allow existing users and new Google users
      return true;
    },
  },
});