// src/app/dashboard/billing/page.tsx
import { auth } from "@/lib/auth";
import { getSubscription } from "@/server/actions/billing";
import { getUsage } from "@/server/services/usage";
import { FREE_PLAN_MONTHLY_GENERATIONS } from "@/lib/constants/plans";
import { BillingActions } from "@/components/dashboard/billing/billing-actions";

export default async function BillingPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const [sub, used] = await Promise.all([
    getSubscription(session.user.id),
    getUsage(session.user.id),
  ]);

  const isPro = sub?.plan === "PRO" && sub.status === "ACTIVE";

  return (
    <div>
      <h1 className="text-2xl font-semibold">Billing</h1>
      <p className="mt-1 text-sm text-muted-foreground">Manage your plan and payment method.</p>

      <div className="mt-6 max-w-md rounded-lg border border-border p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">{isPro ? "Pro plan" : "Free plan"}</h2>
          <span
            className={`rounded-full px-2 py-0.5 text-xs ${
              isPro ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
            }`}
          >
            {sub?.status ?? "ACTIVE"}
          </span>
        </div>

        {!isPro && (
          <p className="mt-2 text-sm text-muted-foreground">
            {used} / {FREE_PLAN_MONTHLY_GENERATIONS} generations used this month
          </p>
        )}

        {sub?.cancelAtPeriodEnd && sub.currentPeriodEnd && (
          <p className="mt-2 text-sm text-amber-600">
            Cancels on {sub.currentPeriodEnd.toLocaleDateString()}
          </p>
        )}

        <div className="mt-5">
          <BillingActions isPro={isPro} />
        </div>
      </div>
    </div>
  );
}