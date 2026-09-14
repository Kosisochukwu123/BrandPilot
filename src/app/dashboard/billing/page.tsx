// src/app/dashboard/billing/page.tsx

import { auth } from "@/lib/auth";
import { getSubscription } from "@/server/actions/billing";
import { getUsage } from "@/server/services/usage";
import { FREE_PLAN_MONTHLY_GENERATIONS } from "@/lib/constants/plans";
import { BillingActions } from "@/components/dashboard/billing/billing-actions";
import {
  Check,
  CreditCard,
  Crown,
  Sparkles,
  Zap,
} from "lucide-react";

export default async function BillingPage() {
  const session = await auth();

  if (!session?.user?.id) return null;

  const [sub, used] = await Promise.all([
    getSubscription(session.user.id),
    getUsage(session.user.id),
  ]);

  const isPro = sub?.plan === "PRO" && sub.status === "ACTIVE";

  const usagePercentage = isPro
    ? 0
    : Math.min(
        100,
        Math.round((used / FREE_PLAN_MONTHLY_GENERATIONS) * 100)
      );

  const remainingGenerations = Math.max(
    0,
    FREE_PLAN_MONTHLY_GENERATIONS - used
  );

  return (
    <main className="min-h-screen px-4 pb-16 pt-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-card px-6 py-8 shadow-sm sm:px-8">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative">
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <CreditCard className="h-4 w-4 text-primary" />
              </span>

              <span className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
                Billing & Plan
              </span>
            </div>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Your plan
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Manage your BrandPilot subscription, monitor your usage, and
              upgrade when you need more generation power.
            </p>
          </div>
        </div>

        {/* Main billing area */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          {/* Current plan */}
          <section className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
            <div className="border-b border-border/60 px-6 py-5 sm:px-7">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                      isPro
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isPro ? (
                      <Crown className="h-5 w-5" />
                    ) : (
                      <Zap className="h-5 w-5" />
                    )}
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Current plan
                    </p>

                    <h2 className="mt-0.5 text-xl font-semibold">
                      {isPro ? "Pro plan" : "Free plan"}
                    </h2>
                  </div>
                </div>

                <span
                  className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${
                    isPro
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {sub?.status ?? "ACTIVE"}
                </span>
              </div>
            </div>

            <div className="px-6 py-6 sm:px-7">
              {isPro ? (
                <>
                  {/* Pro state */}
                  <div className="rounded-2xl border border-primary/20 bg-primary/[0.04] p-5">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Sparkles className="h-4 w-4 text-primary" />
                      </div>

                      <div>
                        <p className="font-medium">
                          You&apos;re on BrandPilot Pro
                        </p>

                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                          You have access to the full BrandPilot experience
                          and higher generation limits.
                        </p>
                      </div>
                    </div>
                  </div>

                  {sub?.currentPeriodEnd && (
                    <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-5">
                      <span className="text-sm text-muted-foreground">
                        Current billing period
                      </span>

                      <span className="text-sm font-medium">
                        {sub.currentPeriodEnd.toLocaleDateString(undefined, {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  )}

                  {sub?.cancelAtPeriodEnd && sub.currentPeriodEnd && (
                    <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
                      <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                        Your Pro plan is scheduled to cancel.
                      </p>

                      <p className="mt-1 text-xs leading-5 text-amber-700/80 dark:text-amber-400/80">
                        You&apos;ll continue to have Pro access until{" "}
                        {sub.currentPeriodEnd.toLocaleDateString(undefined, {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                        .
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* Free usage */}
                  <div>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-sm font-medium">
                          Monthly generations
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          Your free plan usage this month
                        </p>
                      </div>

                      <p className="text-sm font-semibold">
                        {used}{" "}
                        <span className="font-normal text-muted-foreground">
                          / {FREE_PLAN_MONTHLY_GENERATIONS}
                        </span>
                      </p>
                    </div>

                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{
                          width: `${usagePercentage}%`,
                        }}
                      />
                    </div>

                    <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                      <span>{usagePercentage}% used</span>
                      <span>
                        {remainingGenerations} remaining
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                      <p className="text-xs text-muted-foreground">
                        Used this month
                      </p>
                      <p className="mt-1 text-2xl font-semibold">{used}</p>
                    </div>

                    <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                      <p className="text-xs text-muted-foreground">
                        Remaining
                      </p>
                      <p className="mt-1 text-2xl font-semibold">
                        {remainingGenerations}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 rounded-xl border border-primary/15 bg-primary/[0.03] p-4">
                    <div className="flex items-start gap-3">
                      <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

                      <div>
                        <p className="text-sm font-medium">
                          Need more generations?
                        </p>

                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                          Upgrade to Pro to unlock more room for creating
                          content with your Brand Brain.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Billing actions */}
              <div className="mt-6 border-t border-border/60 pt-6">
                <BillingActions isPro={isPro} />
              </div>
            </div>
          </section>

          {/* Plan benefits */}
          <aside className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm sm:p-7">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Crown className="h-5 w-5 text-primary" />
            </div>

            <h3 className="mt-5 text-lg font-semibold">
              Why upgrade?
            </h3>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Get more room to create, experiment, and turn your Brand Brain
              into consistent marketing content.
            </p>

            <div className="mt-6 space-y-4">
              {[
                "More AI content generations",
                "Create content from your Brand Brain",
                "Generate across multiple content formats",
                "Save and reuse your generated content",
              ].map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-start gap-3"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Check className="h-3 w-3 text-primary" />
                  </span>

                  <span className="text-sm leading-5 text-foreground/80">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </aside>
        </div>

        {/* Footer note */}
        <div className="mt-6 flex items-center gap-2 px-1 text-xs text-muted-foreground">
          <CreditCard className="h-3.5 w-3.5" />
          <span>
            Your subscription and payment information is handled securely.
          </span>
        </div>
      </div>
    </main>
  );
}