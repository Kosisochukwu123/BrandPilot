// src/server/services/brand-analyzer.ts
// Turns raw scraped site text into the structured fields our Brand model
// expects. We constrain the model to the same option lists the manual form
// uses (see lib/constants/brand-options.ts), so an auto-detected value can
// be shown as a pre-selected pill in the manual form rather than free text
// that doesn't match any selectable option.
import { openai } from "@/server/services/ai/openai-client";
import { scrapeWebsite } from "@/server/services/scraper";
import { BUSINESS_TYPES, BRAND_TONES, TARGET_AUDIENCES } from "@/lib/constants/brand-options";

export interface BrandAnalysisResult {
  brandName: string;
  businessType: string;
  tone: string;
  audience: string[];
  keywords: string[];
  summary: string;
}

const SYSTEM_PROMPT = `You are a brand analyst. Given a website's title, meta description, headings, and body text, extract a structured brand profile.

Respond with ONLY a JSON object, no markdown fences, no preamble, in exactly this shape:
{
  "brandName": string,
  "businessType": one of ${JSON.stringify(BUSINESS_TYPES)},
  "tone": one of ${JSON.stringify(BRAND_TONES)},
  "audience": array of 1-3 values from ${JSON.stringify(TARGET_AUDIENCES)},
  "keywords": array of 5-10 short lowercase keywords relevant to the business,
  "summary": a 2-3 sentence plain-English summary of what this business does, for use as AI prompt context
}
If a field cannot be confidently determined, make the best reasonable inference — never leave a field empty.`;

export async function analyzeBrandFromUrl(url: string): Promise<BrandAnalysisResult> {
  const site = await scrapeWebsite(url);

  const userContent = `Title: ${site.title}
Meta description: ${site.metaDescription}
Headings: ${site.headings.join(" | ")}
Body text: ${site.bodyText}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.3,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userContent },
    ],
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";

  let parsed: BrandAnalysisResult;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("The AI returned an unexpected format. Please try analyzing again.");
  }

  return parsed;
}