// src/server/actions/channel-recommendations.ts
"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateChannelRecommendations } from "@/server/services/ai/channel-recommendations";
import { revalidatePath } from "next/cache";

const STALE_AFTER_DAYS = 14; // recommendations don't need to regenerate every page load

export async function getOrRefreshChannelRecommendations(channelId: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Not authenticated" };

  const channel = await db.channel.findFirst({
    where: { id: channelId, userId: session.user.id },
  });
  if (!channel) return { success: false, error: "Channel not found" };

  const isStale =
    !channel.recommendations ||
    !channel.recommendationsAt ||
    Date.now() - channel.recommendationsAt.getTime() >
      STALE_AFTER_DAYS * 24 * 60 * 60 * 1000;

  if (!isStale) {
    return { success: true, data: channel.recommendations };
  }

  const brand = await db.brand.findFirst({
    where: { userId: session.user.id },
  });
  const report = brand
    ? await db.brandReport.findFirst({
        where: { brandId: brand.id },
        orderBy: { createdAt: "desc" },
      })
    : null;

  const recommendations = await generateChannelRecommendations(
    channel.type,
    report,
  );

  await db.channel.update({
    where: { id: channelId },
    data: {
      recommendations: recommendations as any,
      recommendationsAt: new Date(),
    },
  });

  revalidatePath("/dashboard/channels");
  return { success: true, data: recommendations };
}
