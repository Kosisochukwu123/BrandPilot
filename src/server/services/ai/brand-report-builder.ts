// src/server/services/ai/brand-report-builder.ts
// Compiles a Brand row into the full structured "Brand Brain" report —
// score, personality sliders, content pillars, platform rankings, etc.
// This is what makes the onboarding feel like real intelligence instead
// of a form that just gets stored: everything here is model-generated
// reasoning about the brand, not a re-display of the input fields.
import { openai } from "./openai-client";
import type { Brand } from "@prisma/client";

export interface BrandReportData {
  score: number;
  scoreExplanation: string;
  summary: string;
  audienceRatings: { label: string; stars: number }[];
  personality: { trait: string; value: number }[];
  voiceTags: string[];
  colors: string[];
  typography: string;
  contentPillars: string[];
  platformRankings: { platform: string; stars: number; reason: string }[];
  opportunities: { title: string; detail: string }[];
}

const SYSTEM_PROMPT = `You are a senior brand strategist. Given a business's profile, produce a full brand intelligence report.

Respond with ONLY a JSON object, no markdown fences, in exactly this shape:
{
  "score": number (0-100, overall brand clarity/consistency score),
  "scoreExplanation": "1-2 sentences on why this score, and one concrete area to improve",
  "summary": "2-3 sentence plain-English summary of the brand and what it does",
  "audienceRatings": [{ "label": string, "stars": number (1-5) }] (2-4 audience segments, best-fit first),
  "personality": [
    { "trait": "Professional", "value": number (0-10) },
    { "trait": "Creative", "value": number (0-10) },
    { "trait": "Luxury", "value": number (0-10) },
    { "trait": "Playful", "value": number (0-10) }
  ],
  "voiceTags": string[] (4-6 short adjectives describing writing voice),
  "colors": string[] (3-5 hex color codes that fit the brand, e.g. "#1E3A8A"),
  "typography": "one of: Modern, Luxury, Friendly, Corporate",
  "contentPillars": string[] (4-6 recurring content themes this brand should post about),
  "platformRankings": [{ "platform": string, "stars": number (1-5), "reason": "one short sentence why" }] (rank Instagram, LinkedIn, Facebook, X for this specific business, best fit first),
  "opportunities": [{ "title": string, "detail": string }] (2-4 concrete, specific action recommendations, e.g. posting frequency or content format suggestions)
}
Base every judgment on the actual business details given — never return generic placeholder values.`;

export async function buildBrandReport(brand: Brand): Promise<BrandReportData> {
  const context = `Brand name: ${brand.brandName ?? "Unknown"}
Website: ${brand.websiteUrl ?? "None"}
Instagram: ${brand.instagramHandle ?? "None"}
WhatsApp: ${brand.whatsappNumber ?? "None"}
Business type: ${brand.businessType ?? "Unknown"}
Tone: ${brand.tone ?? "Unspecified"}
Audience: ${brand.audience ?? "Unspecified"}
Keywords: ${brand.keywords?.join(", ") || "None"}
Website summary: ${brand.rawSummary ?? "None available"}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.5,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: context },
    ],
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";
  return JSON.parse(raw) as BrandReportData;
}