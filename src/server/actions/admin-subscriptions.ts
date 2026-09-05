// src/server/actions/admin-subscriptions.ts
"use server";

import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import type { Plan, SubscriptionStatus } from "@prisma/client";

export async function listSubscriptions() {
  const admin = await requireAdmin();
  if (!admin.ok) return [];

  return db.subscription.findMany({
    include: { user: { select: { email: true, name: true } } },
    orderBy: { updatedAt: "desc" },
    take: 100,
  });
}

// Manual override — for support cases (e.g. a user paid via bank
// transfer, or a Paystack webhook failed to fire). Always confirm the
// underlying reason before granting Pro manually.
export async function overrideSubscription(userId: string, plan: Plan, status: SubscriptionStatus) {
  const admin = await requireAdmin();
  if (!admin.ok) return { success: false, error: admin.error };

  const existing = await db.subscription.findUnique({ where: { userId } });

  if (existing) {
    await db.subscription.update({ where: { userId }, data: { plan, status } });
  } else {
    await db.subscription.create({
      data: { userId, plan, status, paystackCustomerCode: `admin_manual_${userId}` },
    });
  }

  revalidatePath("/admin/subscriptions");
  return { success: true };
}