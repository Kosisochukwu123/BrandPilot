"use server";

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import {
  resetPasswordRequestSchema,
  resetPasswordSchema,
} from "@/lib/validations/auth";
import { sendPasswordResetEmail } from "@/server/services/email";
import { safeRateLimit, authRateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export async function requestPasswordReset(input: unknown) {
  const parsed = resetPasswordRequestSchema.safeParse(input);
  if (!parsed.success)
    return { success: false, error: "Enter a valid email address" };

  const { success: withinRateLimit } = await safeRateLimit(
    authRateLimit,
    `reset:${parsed.data.email}`,
  );
  if (!withinRateLimit)
    return { success: false, error: "Too many attempts. Wait a few minutes." };

  const user = await db.user.findUnique({
    where: { email: parsed.data.email },
  });
  if (!user || !user.passwordHash) return { success: true }; // never leak which emails exist

  const token = crypto.randomBytes(32).toString("hex");
  await db.passwordResetToken.create({
    data: {
      userId: user.id,
      token,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    },
  });

  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

  console.log("PASSWORD RESET LINK:", resetUrl);
  
  try {
    await sendPasswordResetEmail(user.email, resetUrl);
  } catch (err) {
    logger.error("Failed to send password reset email", {
      error: err instanceof Error ? err.message : String(err),
      userId: user.id,
    });
    // Clean up the orphaned token so it doesn't linger until expiry.
    await db.passwordResetToken.delete({ where: { token } }).catch(() => {});
    // Still return success to the user — never leak whether the send failed,
    // but now it's visible in your logs for you to catch and fix.
  }

  return { success: true };
}

export async function resetPassword(input: unknown) {
  const parsed = resetPasswordSchema.safeParse(input);
  if (!parsed.success)
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };

  const record = await db.passwordResetToken.findUnique({
    where: { token: parsed.data.token },
  });
  if (!record || record.usedAt || record.expiresAt < new Date()) {
    return {
      success: false,
      error: "This reset link is invalid or has expired. Request a new one.",
    };
  }

  const newHash = await bcrypt.hash(parsed.data.password, 12);
  await db.$transaction([
    db.user.update({
      where: { id: record.userId },
      data: { passwordHash: newHash },
    }),
    db.passwordResetToken.update({
      where: { id: record.id },
      data: { usedAt: new Date() },
    }),
  ]);

  return { success: true };
}