// src/server/services/usage.ts
// Free-plan enforcement. Kept as its own service (not inline in the route)
// because both the API route (for the actual limit check) and the
// dashboard overview widget (Phase 2's "0 / 15" card) need the same numbers.
import { db } from "@/lib/db";
import { FREE_PLAN_MONTHLY_GENERATIONS, currentPeriodKey } from "@/lib/constants/plans";

export async function getUsage(userId: string) {
  const period = currentPeriodKey();
  const record = await db.usageRecord.findUnique({
    where: { userId_periodYearMonth: { userId, periodYearMonth: period } },
  });
  return record?.generations ?? 0;
}

export async function isProUser(userId: string): Promise<boolean> {
  const sub = await db.subscription.findUnique({ where: { userId } });
  return sub?.plan === "PRO" && sub.status === "ACTIVE";
}

// Throws if the user is on the free plan and has hit their monthly cap.
// Call this BEFORE starting an AI generation, not after, so we never
// let a request through that we then have to reject mid-stream.
export async function assertUnderLimit(userId: string): Promise<void> {
  if (await isProUser(userId)) return;

  const used = await getUsage(userId);
  if (used >= FREE_PLAN_MONTHLY_GENERATIONS) {
    throw new Error(
      `You've used all ${FREE_PLAN_MONTHLY_GENERATIONS} free generations this month. Upgrade to Pro for unlimited generations.`
    );
  }
}

export async function incrementUsage(userId: string): Promise<void> {
  const period = currentPeriodKey();
  await db.usageRecord.upsert({
    where: { userId_periodYearMonth: { userId, periodYearMonth: period } },
    create: { userId, periodYearMonth: period, generations: 1 },
    update: { generations: { increment: 1 } },
  });
}