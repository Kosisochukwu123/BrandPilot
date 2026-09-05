// src/server/services/ai/channel-recommendations.ts
// Generates per-channel posting guidance from the Brand Report — this is
// what makes "Connect a channel" feel like it unlocks real intelligence
// instead of just adding a row to a settings table.
import { openai } from "./openai-client";
import type { BrandReport } from "@prisma/client";
import type { ChannelType } from "@prisma/client";

export interface ChannelRecommendations {
  bestPostingTimes: string[]; // e.g. ["Tue 9-11am", "Thu 6-8pm"]
  suggestedFrequency: string; // e.g. "4x per week"
  hashtags: string[]; // only relevant for Instagram/X/Facebook, empty for WhatsApp
  expectedEngagement: string; // short qualitative line, never a fabricated precise stat
  contentTip: string;
}

const SYSTEM_PROMPT = `You are a social media strategist. Given a business's brand profile and a specific platform, recommend posting guidance for that platform specifically.

Respond with ONLY a JSON object, no markdown fences:
{
  "bestPostingTimes": string[] (2-3 short time windows, e.g. "Tue 9-11am"),
  "suggestedFrequency": "e.g. '4x per week'",
  "hashtags": string[] (5-8 relevant hashtags, no # symbol needed in the string, empty array if the platform doesn't use hashtags),
  "expectedEngagement": "one short qualitative sentence — never invent a specific percentage or number, describe relative engagement potential only",
  "contentTip": "one specific, actionable content format suggestion for this platform and this business"
}`;

export async function generateChannelRecommendations(
  channelType: ChannelType,
  report: BrandReport | null
): Promise<ChannelRecommendations> {
  if (channelType === "WHATSAPP") {
    // WhatsApp isn't a discovery feed — hashtags/posting-time framing
    // doesn't apply, so it gets its own fixed shape instead of asking
    // the model to force-fit a concept that doesn't exist there.
    return {
      bestPostingTimes: ["Weekday mornings", "Weekend afternoons"],
      suggestedFrequency: "1-2x per week, avoid over-messaging",
      hashtags: [],
      expectedEngagement: "Broadcasts perform best when timed around promotions, not sent as routine updates.",
      contentTip: "Keep broadcast messages short and include a single clear offer or update per message.",
    };
  }

  const contentPillars = report?.contentPillars?.join(", ") ?? "general business updates";
  const tone = report?.voiceTags?.join(", ") ?? "professional";

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.4,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Platform: ${channelType}\nContent pillars: ${contentPillars}\nBrand voice: ${tone}`,
      },
    ],
  });

  return JSON.parse(completion.choices[0]?.message?.content ?? "{}") as ChannelRecommendations;
}