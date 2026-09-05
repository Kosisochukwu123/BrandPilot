// src/server/actions/poster-caption.ts
"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { openai } from "@/server/services/ai/openai-client";
import { getBrandContext } from "@/server/services/brand-context";
import { assertUnderLimit, incrementUsage } from "@/server/services/usage";
import { logActivity } from "@/server/services/activity-log";

// Generates a caption to accompany an already-created poster — reuses
// the poster's own headline/subheadline/concept as context so the
// caption actually matches what's on the image, rather than asking the
// user to re-describe it from scratch.
export async function generateCaptionForPoster(posterId: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Not authenticated" };

  const poster = await db.poster.findFirst({ where: { id: posterId, userId: session.user.id } });
  if (!poster) return { success: false, error: "Poster not found" };

  try {
    await assertUnderLimit(session.user.id);
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Limit reached" };
  }

  const { brand } = await getBrandContext(session.user.id);

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.8,
    messages: [
      {
        role: "system",
        content: `Write a single Instagram-style caption to accompany a marketing poster. Under 150 words, include 3-5 relevant hashtags at the end. Write in the brand's voice. Output only the caption, no commentary.`,
      },
      {
        role: "user",
        content: `Brand: ${brand?.brandName ?? "Unknown"}, tone: ${brand?.tone ?? "Neutral"}
Poster headline: ${poster.headline}
Poster subheading: ${poster.subheadline ?? ""}
Concept: ${poster.concept ?? ""}`,
      },
    ],
  });

  const output = completion.choices[0]?.message?.content ?? "";
  if (!output) return { success: false, error: "Caption generation failed" };

  const saved = await db.generatedContent.create({
    data: {
      userId: session.user.id,
      brandId: brand?.id,
      type: "INSTAGRAM_CAPTION",
      prompt: `Caption for poster: ${poster.headline}`,
      output,
    },
  });

  await incrementUsage(session.user.id);
  await logActivity(session.user.id, "CONTENT_GENERATED", "Caption generated for poster");

  return { success: true, data: { contentId: saved.id, output } };
}