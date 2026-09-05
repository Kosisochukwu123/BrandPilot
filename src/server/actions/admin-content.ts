// src/server/actions/admin-content.ts
"use server";

import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function listAllGeneratedContent(search?: string) {
  const admin = await requireAdmin();
  if (!admin.ok) return [];

  return db.generatedContent.findMany({
    where: search ? { output: { contains: search, mode: "insensitive" } } : undefined,
    include: { user: { select: { email: true } } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

export async function listAllPosters() {
  const admin = await requireAdmin();
  if (!admin.ok) return [];

  return db.poster.findMany({
    include: { user: { select: { email: true } } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

export async function adminDeleteContent(id: string) {
  const admin = await requireAdmin();
  if (!admin.ok) return { success: false, error: admin.error };

  await db.generatedContent.delete({ where: { id } });
  revalidatePath("/admin/content");
  return { success: true };
}

export async function adminDeletePoster(id: string) {
  const admin = await requireAdmin();
  if (!admin.ok) return { success: false, error: admin.error };

  await db.poster.delete({ where: { id } });
  revalidatePath("/admin/content");
  return { success: true };
}