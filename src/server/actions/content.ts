// src/server/actions/content.ts
"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import type { ContentType } from "@prisma/client";
import { logActivity } from "@/server/services/activity-log";

import { getContentTypeConfig } from "@/lib/constants/content-types";
import { openai } from "@/server/services/ai/openai-client";
import { buildSystemPrompt } from "@/server/services/ai/prompts";
import { getBrandContext } from "@/server/services/brand-context";
import { assertUnderLimit, incrementUsage } from "@/server/services/usage";



type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// Called once the client has the full streamed text and the user chooses
// to keep it. Streaming and saving are deliberately separate steps —
// nobody wants every regenerate-attempt cluttering their content library.
export async function saveGeneratedContent(
  type: ContentType,
  prompt: string,
  output: string,
): Promise<ActionResult<{ id: string }>> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Not authenticated" };
  if (!output.trim()) return { success: false, error: "Nothing to save" };

  const brand = await db.brand.findFirst({
    where: { userId: session.user.id },
  });

  const saved = await db.generatedContent.create({
    data: {
      userId: session.user.id,
      brandId: brand?.id,
      type,
      prompt,
      output,
    },
  });

  await logActivity(
    session.user.id,
    "CONTENT_GENERATED",
    `${getContentTypeConfig(type).label} generated`,
  );

  revalidatePath("/dashboard/content");
  revalidatePath("/dashboard");
  return { success: true, data: { id: saved.id } };
}

export async function deleteGeneratedContent(
  id: string,
): Promise<ActionResult<null>> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Not authenticated" };

  await db.generatedContent.deleteMany({
    where: { id, userId: session.user.id },
  });
  revalidatePath("/dashboard/content");
  return { success: true, data: null };
}

export async function listGeneratedContent(userId: string) {
  return db.generatedContent.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

export async function toggleFavorite(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Not authenticated" };

  const item = await db.generatedContent.findFirst({ where: { id, userId: session.user.id } });
  if (!item) return { success: false, error: "Not found" };

  await db.generatedContent.update({ where: { id }, data: { favorited: !item.favorited } });
  revalidatePath("/dashboard/content");
  return { success: true };
}


export async function duplicateContent(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Not authenticated" };

  const item = await db.generatedContent.findFirst({ where: { id, userId: session.user.id } });
  if (!item) return { success: false, error: "Not found" };

  await db.generatedContent.create({
    data: {
      userId: session.user.id,
      brandId: item.brandId,
      type: item.type,
      prompt: item.prompt,
      output: item.output,
    },
  });

    revalidatePath("/dashboard/content");
  return { success: true };
}

export async function regenerateContent(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Not authenticated" };

  const item = await db.generatedContent.findFirst({ where: { id, userId: session.user.id } });
  if (!item) return { success: false, error: "Not found" };

  try {
    await assertUnderLimit(session.user.id);
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Limit reached" };
  }

  const { brand } = await getBrandContext(session.user.id);
  const config = getContentTypeConfig(item.type);
  const systemPrompt = buildSystemPrompt(brand, config);

   const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.9, // slightly higher than initial generation, so a regenerate reliably reads as a different take
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: item.prompt },
    ],
  });

  const newOutput = completion.choices[0]?.message?.content ?? item.output;

  await db.generatedContent.update({ where: { id }, data: { output: newOutput } });
  await incrementUsage(session.user.id);

  revalidatePath("/dashboard/content");
  return { success: true, data: { output: newOutput } };
}