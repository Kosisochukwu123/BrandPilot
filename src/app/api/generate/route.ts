// src/app/api/generate/route.ts
// Streaming generation endpoint. Returns a plain text stream (not SSE) so
// the client can read it with a simple ReadableStream reader — no extra
// parsing library needed on the frontend.
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { openai } from "@/server/services/ai/openai-client";
import { buildSystemPrompt } from "@/server/services/ai/prompts";
import { generateContentSchema } from "@/lib/validations/content";
import { getContentTypeConfig } from "@/lib/constants/content-types";
import { assertUnderLimit, incrementUsage } from "@/server/services/usage";
import { generationRateLimit, safeRateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Not authenticated", { status: 401 });
  }

  const { success: withinRateLimit } = await safeRateLimit(generationRateLimit, session.user.id);
  if (!withinRateLimit) {
    return new Response("Too many requests. Wait a moment and try again.", { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = generateContentSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(parsed.error.issues[0]?.message ?? "Invalid input", {
      status: 400,
    });
  }

  try {
    await assertUnderLimit(session.user.id);
  } catch (err) {
    return new Response(err instanceof Error ? err.message : "Limit reached", {
      status: 402,
    });
  }

  const brand = await db.brand.findFirst({
    where: { userId: session.user.id },
  });
  const config = getContentTypeConfig(parsed.data.type);
  const systemPrompt = buildSystemPrompt(brand, config);

  const aiStream = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.8,
    stream: true,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: parsed.data.topic },
    ],
  });

  // Usage is incremented once the stream starts, not after full completion,
  // so a client that disconnects mid-stream still consumes their quota —
  // the OpenAI call itself was already made and billed on our side.
  await incrementUsage(session.user.id);

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of aiStream) {
          const text = chunk.choices[0]?.delta?.content ?? "";
          if (text) controller.enqueue(encoder.encode(text));
        }
      } catch {
        controller.enqueue(encoder.encode("\n\n[Generation interrupted]"));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
