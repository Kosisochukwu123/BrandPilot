// src/server/actions/admin-users.ts
"use server";

import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function listUsers(search?: string) {
  const admin = await requireAdmin();
  if (!admin.ok) return [];

  return db.user.findMany({
    where: search
      ? {
          OR: [
            { email: { contains: search, mode: "insensitive" } },
            { name: { contains: search, mode: "insensitive" } },
          ],
        }
      : undefined,
    include: { subscription: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}

export async function suspendUser(userId: string) {
  const admin = await requireAdmin();
  if (!admin.ok) return { success: false, error: admin.error };

  // Guard against an admin accidentally locking themselves out.
  if (userId === admin.userId) return { success: false, error: "You can't suspend your own account" };

  await db.user.update({ where: { id: userId }, data: { suspended: true } });
  revalidatePath("/admin/users");
  return { success: true };
}

export async function unsuspendUser(userId: string) {
  const admin = await requireAdmin();
  if (!admin.ok) return { success: false, error: admin.error };

  await db.user.update({ where: { id: userId }, data: { suspended: false } });
  revalidatePath("/admin/users");
  return { success: true };
}

export async function toggleAdmin(userId: string) {
  const admin = await requireAdmin();
  if (!admin.ok) return { success: false, error: admin.error };
  if (userId === admin.userId) return { success: false, error: "You can't change your own admin status" };

  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) return { success: false, error: "User not found" };

  await db.user.update({ where: { id: userId }, data: { isAdmin: !user.isAdmin } });
  revalidatePath("/admin/users");
  return { success: true };
}