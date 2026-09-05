// src/server/actions/schedule-poster.ts
"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import type { ChannelType } from "@prisma/client";

// Finds the user's connected channel of the given type, if any — used
// to decide whether "Schedule to X" should show a scheduling form or a
// "connect first" prompt.
export async function getConnectedChannel(channelType: ChannelType) {
  const session = await auth();
  if (!session?.user?.id) return null;

  return db.channel.findFirst({ where: { userId: session.user.id, type: channelType } });
}

export async function schedulePosterToChannel(input: {
  posterId: string;
  channelType: ChannelType;
  scheduledAt: string; // ISO string
  captionOverride?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Not authenticated" };

  const poster = await db.poster.findFirst({ where: { id: input.posterId, userId: session.user.id } });
  if (!poster) return { success: false, error: "Poster not found" };

  const mediaUrl = poster.finalUrl ?? poster.backgroundUrl;
  if (!mediaUrl) return { success: false, error: "Poster has no image to schedule" };

  const channel = await db.channel.findFirst({ where: { userId: session.user.id, type: input.channelType } });
  if (!channel) {
    return { success: false, error: `No connected ${input.channelType} account. Connect it first.` };
  }

  const scheduledAt = new Date(input.scheduledAt);
  if (scheduledAt.getTime() < Date.now() + 5 * 60_000) {
    return { success: false, error: "Schedule at least 5 minutes from now" };
  }

  const body = input.captionOverride || [poster.headline, poster.subheadline].filter(Boolean).join("\n\n");

  await db.scheduledPost.create({
    data: {
      userId: session.user.id,
      channelId: channel.id,
      body,
      mediaUrl,
      scheduledAt,
      status: "QUEUED",
    },
  });

  revalidatePath("/dashboard/channels");
  return { success: true };
}