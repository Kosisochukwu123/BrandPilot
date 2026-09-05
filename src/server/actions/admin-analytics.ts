// src/server/actions/admin-analytics.ts
"use server";

import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import { currentPeriodKey } from "@/lib/constants/plans";

export async function getAdminOverview() {
  const admin = await requireAdmin();
  if (!admin.ok) return null;

  const period = currentPeriodKey();

  const [totalUsers, proUsers, totalContent, totalPosters, generationsThisMonth, suspendedUsers] =
    await Promise.all([
      db.user.count(),
      db.subscription.count({ where: { plan: "PRO", status: "ACTIVE" } }),
      db.generatedContent.count(),
      db.poster.count(),
      db.usageRecord.aggregate({ where: { periodYearMonth: period }, _sum: { generations: true } }),
      db.user.count({ where: { suspended: true } }),
    ]);

  return {
    totalUsers,
    proUsers,
    freeUsers: totalUsers - proUsers,
    totalContent,
    totalPosters,
    generationsThisMonth: generationsThisMonth._sum.generations ?? 0,
    suspendedUsers,
  };
}

// Rough revenue estimate — NGN price per Pro plan multiplied by active
// Pro subscribers. Deliberately simple; a real revenue dashboard would
// pull actual paid invoices from Paystack instead of inferring from plan status.
export async function getRevenueEstimate(monthlyPriceNaira: number) {
  const admin = await requireAdmin();
  if (!admin.ok) return null;

  const proCount = await db.subscription.count({ where: { plan: "PRO", status: "ACTIVE" } });
  return { estimatedMonthlyRevenue: proCount * monthlyPriceNaira, proCount };
}