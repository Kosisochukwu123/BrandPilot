// src/app/dashboard/page.tsx

import { auth } from "@/lib/auth";

import { db } from "@/lib/db"; // ADD THIS IMPORT
import { redirect } from "next/navigation"; // ADD THIS IMPORT
import { getDashboardData } from "@/server/actions/dashboard";

import { SuggestionCard } from "@/components/dashboard/overview/suggestion-card";
import { ContentQueue } from "@/components/dashboard/overview/content-queue";
import { BrandHealthWidget } from "@/components/dashboard/overview/brand-health-widget";
import { ActivityFeed } from "@/components/dashboard/overview/activity-feed";
import { StatCard } from "@/components/dashboard/overview/stat-card";
import {
  Reveal,
  SpotlightCard,
} from "@/components/dashboard/overview/motion-primitives";

export const metadata = {
  title: "Overview — BrandPilot Dashboard",
  description:
    "Your BrandPilot overview: brand health score, AI suggestions, content queue, and recent activity.",
};

export default async function DashboardOverviewPage() {
  const session = await auth();

  if (!session?.user?.id) return null;

  // First-time users (no Brand row yet) get sent straight to onboarding
  // instead of landing on an empty dashboard — works identically for
  // Google sign-ups and email/password sign-ups, since it checks actual
  // account state rather than which auth method was used.
  const existingBrand = await db.brand.findFirst({ where: { userId: session.user.id } });
  if (!existingBrand) {
    redirect("/dashboard/brand");
  }

  const data = await getDashboardData(session.user.id);

  return (
    <main className="min-h-[100dvh] overflow-hidden bg-background text-foreground">
      {/* Ambient background */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 h-[500px] bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,0.12),transparent_60%)]"
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 pb-24 pt-24 sm:px-6 md:px-8">
        {/* ================= HEADER ================= */}

        <section className="relative overflow-visible">
          <div className="grid gap-10 lg:grid-cols-[1fr_300px] lg:items-start">
            {/* Welcome */}
            <Reveal>
              <div className="max-w-2xl">
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-violet-500">
                  Overview
                </p>

                <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
                  Welcome back
                  {data.brandName ? (
                    <span className="text-muted-foreground">
                      , {data.brandName}
                    </span>
                  ) : null}
                </h1>

                <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
                  Here's a quick look at your brand performance and the next
                  opportunities waiting for you today.
                </p>
              </div>
            </Reveal>

            {/* Hanging Brand Widget */}
            <Reveal delay={100}>
              <div className="flex justify-center lg:justify-end">
                <BrandHealthWidget
                  score={data.brandScore}
                  delta={data.brandScoreDelta}
                />
              </div>
            </Reveal>
          </div>
        </section>

        {/* ================= STATS ================= */}

        <section className="mt-12">
          <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-none">
            <div className="min-w-[220px] flex-1">
              <StatCard
                label="Generations"
                value={
                  data.isPro
                    ? `${data.usage} / ∞`
                    : `${data.usage} / ${data.usageLimit}`
                }
                hint={data.isPro ? "Pro plan" : "This month"}
                progress={
                  data.isPro
                    ? 100
                    : (data.usage / data.usageLimit) * 100
                }
              />
            </div>

            <div className="min-w-[220px] flex-1">
              <StatCard
                label="Channels"
                value={`${data.channelsCount} / 4`}
                hint="Connected platforms"
                progress={(data.channelsCount / 4) * 100}
              />
            </div>

            <div className="min-w-[220px] flex-1">
              <StatCard
                label="Saved content"
                value={String(data.savedContentCount)}
                hint="Ready to publish"
              />
            </div>
          </div>
        </section>

        {/* ================= AI SUGGESTIONS ================= */}

        <section className="mt-12">
          <Reveal>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-violet-500">
                  Intelligence
                </p>

                <h2 className="mt-2 text-xl font-semibold tracking-tight">
                  Today's AI suggestions
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Fresh ideas based on your recent activity.
                </p>
              </div>

              <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-600">
                {data.suggestions.length} ideas
              </span>
            </div>
          </Reveal>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {data.suggestions.map((suggestion, index) => (
              <Reveal
                key={suggestion.id}
                delay={index * 80}
                className="h-full"
              >
                <SuggestionCard suggestion={suggestion} />
              </Reveal>
            ))}
          </div>
        </section>

        {/* ================= CONTENT + ACTIVITY ================= */}

        <section className="mt-14 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          {/* Content Queue */}
          <Reveal>
            <div className="rounded-3xl border border-border/60 bg-card/60 p-5 shadow-sm backdrop-blur-xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-violet-500">
                    Publishing
                  </p>

                  <h2 className="mt-2 text-lg font-semibold">
                    Content queue
                  </h2>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Your saved content ready to publish.
                  </p>
                </div>

                <button
                  type="button"
                  className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-600 transition hover:bg-violet-100"
                >
                  View all
                </button>
              </div>

              <div className="mt-5">
                <ContentQueue items={data.queuedPosts} />
              </div>
            </div>
          </Reveal>

          {/* Recent Activity */}
          <Reveal delay={100}>
            <SpotlightCard className="relative overflow-hidden p-5">
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-violet-500/10 blur-3xl" />

              <div className="relative">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-violet-500">
                  Activity
                </p>

                <h2 className="mt-2 text-lg font-semibold">
                  Recent work
                </h2>

                <p className="mt-1 text-xs text-muted-foreground">
                  Your latest activity.
                </p>

                <div className="mt-5">
                  <ActivityFeed items={data.activity.slice(0, 2)} />
                </div>

                <button
                  type="button"
                  className="mt-5 flex w-full items-center justify-center rounded-xl border border-border bg-background py-2.5 text-xs font-medium transition hover:bg-violet-50 hover:text-violet-600"
                >
                  See more activity
                </button>
              </div>
            </SpotlightCard>
          </Reveal>
        </section>
      </div>
    </main>
  );
}