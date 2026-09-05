"use server";

import { db } from "@/lib/db";
import { getUsage, isProUser } from "@/server/services/usage";
import { FREE_PLAN_MONTHLY_GENERATIONS } from "@/lib/constants/plans";
import { getRecentActivity } from "@/server/services/activity-log";
import { buildTodaysSuggestions } from "@/server/services/ai/suggestion-engine";

/**

* Dashboard data aggregator.
*
* The dashboard calls this once so the overview is assembled from
* parallel queries rather than every widget querying the database
* independently.
  */
export async function getDashboardData(userId: string) {
  const brand = await db.brand.findFirst({
    where: { userId },
    orderBy: {
      createdAt: "asc",
    },
  });

  const [
    latestReport,
    previousReports,
    usage,
    isPro,
    activity,
    channelsCount,
    savedContentCount,
    queuedPosts,
    recentPosters,
  ] = await Promise.all([
    brand
      ? db.brandReport.findFirst({
          where: {
            brandId: brand.id,
          },
          orderBy: {
            createdAt: "desc",
          },
        })
      : null,

    brand
      ? db.brandReport.findMany({
          where: {
            brandId: brand.id,
          },
          orderBy: {
            createdAt: "desc",
          },
          skip: 1,
          take: 1,
        })
      : [],

    getUsage(userId),

    isProUser(userId),

    /**
     * Dashboard preview only.
     * The activity page can show the full history.
     */
    getRecentActivity(userId, 2),

    db.channel.count({
      where: {
        userId,
      },
    }),

    db.generatedContent.count({
      where: {
        userId,
      },
    }),

    /**
     * Content that has been generated but has not yet been scheduled.
     *
     * Include related posters so the UI can display a visual thumbnail
     * when one exists.
     */
    db.generatedContent.findMany({
      where: {
        userId,
        scheduledPosts: {
          none: {},
        },
      },

      orderBy: {
        createdAt: "desc",
      },

      take: 5,

      include: {
        posters: {
          where: {
            status: "READY",
          },

          orderBy: {
            createdAt: "desc",
          },

          take: 1,

          select: {
            id: true,
            headline: true,
            backgroundUrl: true,
            finalUrl: true,
            visualStyle: true,
          },
        },
      },
    }),

    /**
     * A few recent posters can be used as visual decoration
     * around the dashboard without making extra widget queries.
     */
    db.poster.findMany({
      where: {
        userId,
        status: "READY",
      },

      orderBy: {
        createdAt: "desc",
      },

      take: 4,

      select: {
        id: true,
        headline: true,
        backgroundUrl: true,
        finalUrl: true,
        visualStyle: true,
        createdAt: true,
      },
    }),
  ]);

  const previousReport = previousReports[0] ?? null;

  const scoreDelta =
    latestReport && previousReport
      ? latestReport.score - previousReport.score
      : null;

  return {
    brandName: brand?.brandName ?? null,

    usage,
    isPro,

    usageLimit: FREE_PLAN_MONTHLY_GENERATIONS,

    channelsCount,
    savedContentCount,

    brandScore: latestReport?.score ?? null,
    brandScoreDelta: scoreDelta,

    suggestions: buildTodaysSuggestions(latestReport),

    queuedPosts,

    /**
     * Only two items are returned specifically for the overview.
     */
    activity,

    /**
     * Recent poster artwork available for dashboard visual polish.
     */
    recentPosters,
  };
}
