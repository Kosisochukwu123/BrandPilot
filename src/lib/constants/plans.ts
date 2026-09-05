// src/lib/constants/plans.ts
export const FREE_PLAN_MONTHLY_GENERATIONS = 15;

export function currentPeriodKey(date = new Date()): string {
  // "2026-07" — used as the UsageRecord unique key, resets naturally
  // each calendar month with no cron job required.
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}