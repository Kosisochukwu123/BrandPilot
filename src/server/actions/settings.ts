// src/server/actions/settings.ts
"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const profileSchema = z.object({ name: z.string().min(2).max(80) });

export async function updateProfile(input: unknown) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Not authenticated" };

  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "Invalid name" };

  await db.user.update({ where: { id: session.user.id }, data: { name: parsed.data.name } });
  revalidatePath("/dashboard/settings");
  return { success: true };
}

const passwordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/),
});

export async function updatePassword(input: unknown) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Not authenticated" };

  const parsed = passwordSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "Password doesn't meet requirements" };

  const user = await db.user.findUnique({ where: { id: session.user.id } });
  if (!user?.passwordHash) {
    return { success: false, error: "This account uses Google sign-in and has no password to change" };
  }

  const valid = await bcrypt.compare(parsed.data.currentPassword, user.passwordHash);
  if (!valid) return { success: false, error: "Current password is incorrect" };

  const newHash = await bcrypt.hash(parsed.data.newPassword, 12);
  await db.user.update({ where: { id: session.user.id }, data: { passwordHash: newHash } });
  return { success: true };
}

const setPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Include at least one uppercase letter")
    .regex(/[0-9]/, "Include at least one number"),
});

export async function setInitialPassword(input: unknown) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Not authenticated" };

  const parsed = setPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid password" };
  }

  const user = await db.user.findUnique({ where: { id: session.user.id } });
  if (!user) return { success: false, error: "User not found" };

  if (user.passwordHash) {
    return { success: false, error: "This account already has a password — use 'Change password' instead" };
  }

  const hash = await bcrypt.hash(parsed.data.newPassword, 12);
  await db.user.update({ where: { id: session.user.id }, data: { passwordHash: hash } });

  return { success: true };
}