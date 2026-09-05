// src/server/services/activity-log.ts
// Centralized activity logging — called from existing actions at the
// moments that matter, so "Recent AI Activity" reflects real events
// rather than guessing from timestamps across unrelated tables.
import { db } from "@/lib/db";
import type { ActivityType } from "@prisma/client";

export async function logActivity(userId: string, type: ActivityType, message: string) {
  // Fire-and-forget by design: a logging failure should never break the
  // actual feature (content generation, poster creation, etc.) that
  // triggered it.
  try {
    await db.activityLog.create({ data: { userId, type, message } });
  } catch (err) {
    console.error("Failed to log activity:", err);
  }
}

export async function getRecentActivity(userId: string, take = 8) {
  return db.activityLog.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take,
  });
}