// src/server/actions/channels.ts
"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import type { ChannelType } from "@prisma/client";

export async function listChannels(userId: string) {
  return db.channel.findMany({ where: { userId }, orderBy: { type: "asc" } });
}

export async function disconnectChannel(channelId: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Not authenticated" };

  await db.channel.deleteMany({ where: { id: channelId, userId: session.user.id } });
  revalidatePath("/dashboard/channels");
  return { success: true };
}

// Schedules an already-generated (or freshly written) piece of content to
// a specific connected channel. Actual publishing happens later via the
// cron job in api/cron/publish-posts — this just queues it.
export async function schedulePost(input: {
  channelId: string;
  contentId?: string;
  body: string;
  mediaUrl?: string;
  scheduledAt: string; // ISO string from the client
}) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Not authenticated" };

  const channel = await db.channel.findFirst({
    where: { id: input.channelId, userId: session.user.id },
  });
  if (!channel) return { success: false, error: "Channel not found" };

  const scheduledAt = new Date(input.scheduledAt);
  if (scheduledAt.getTime() < Date.now() + 5 * 60_000) {
    return { success: false, error: "Schedule at least 5 minutes from now" };
  }

  await db.scheduledPost.create({
    data: {
      userId: session.user.id,
      channelId: channel.id,
      contentId: input.contentId,
      body: input.body,
      mediaUrl: input.mediaUrl,
      scheduledAt,
      status: "QUEUED",
    },
  });

  revalidatePath("/dashboard/channels");
  return { success: true };
}

export async function listScheduledPosts(userId: string, channelType?: ChannelType) {
  return db.scheduledPost.findMany({
    where: { userId, channel: channelType ? { type: channelType } : undefined },
    include: { channel: true },
    orderBy: { scheduledAt: "asc" },
  });
}