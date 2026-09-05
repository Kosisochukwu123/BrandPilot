// src/server/actions/register.ts
"use server";

import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { registerSchema } from "@/lib/validations/auth";
import { authRateLimit, safeRateLimit } from "@/lib/rate-limit";

type RegisterResult = { success: true } | { success: false; error: string };

export async function registerUser(formData: unknown): Promise<RegisterResult> {
  const parsed = registerSchema.safeParse(formData);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const { name, email, password } = parsed.data;

    const { success: withinRateLimit } = await safeRateLimit(authRateLimit, `register:${parsed.data.email}`);
  if (!withinRateLimit) {
    return {
      success: false,
      error: "Too many attempts. Please wait a few minutes.",
    };
  }

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return {
      success: false,
      error: "An account with this email already exists",
    };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await db.user.create({
    data: {
      name,
      email,
      passwordHash,
      // Every new user starts on the FREE plan; the Subscription row is
      // created lazily on first Stripe checkout, not here.
    },
  });

  return { success: true };
}
