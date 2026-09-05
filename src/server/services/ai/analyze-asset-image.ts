// src/server/services/ai/analyze-asset-image.ts
// Uses GPT-4o's vision capability to look at an uploaded image and
// suggest structured tags — this is the "careful analyzing" step. The
// admin still reviews and can edit every field before saving; this only
// pre-fills the form so tagging 50-100 assets by hand isn't pure manual labor.
import { openai } from "./openai-client";

export interface SuggestedAssetTags {
  type: "BACKGROUND" | "OBJECT" | "POSTER_REFERENCE";
  description: string;
  businessTypes: string[];
  styleTags: string[];
  colorTags: string[];
  transparent: boolean;
}

const BUSINESS_TYPES = [
  "E-commerce / Retail", "SaaS / Software", "Local Service Business",
  "Restaurant / Food & Beverage", "Health & Wellness", "Fashion & Apparel",
  "Beauty & Cosmetics", "Real Estate", "Education / Coaching", "Other",
];

const ANALYZE_SYSTEM_PROMPT = `You are a visual asset librarian for a marketing poster tool. Look at the image and classify it for a searchable asset library.

Respond with ONLY valid JSON:
{
  "type": "BACKGROUND", "OBJECT", or "POSTER_REFERENCE" — BACKGROUND if this is a scene/texture/environment meant to fill an entire poster, OBJECT if this is a specific isolated item (tool, product, ingredient, prop) meant to be placed on a background, POSTER_REFERENCE if this is a complete, finished poster/flyer design with its own layout, typography, and composition that should be studied as a style example — NOT filled with new content, only referenced for visual style,
  "description": "one concise sentence describing exactly what's in the image",
  "businessTypes": array of business types from this list that this image would suit: ${JSON.stringify(BUSINESS_TYPES)},
  "styleTags": 3-5 short style/mood words, e.g. ["warm", "minimal", "industrial", "energetic", "luxurious"],
  "colorTags": 2-4 dominant color words, e.g. ["blue", "earth-tone", "neutral", "vibrant"],
  "transparent": true only if the image clearly has a transparent or removed background (isolated object on nothing), false otherwise
}`;

export async function analyzeAssetImage(imageUrl: string): Promise<SuggestedAssetTags> {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: ANALYZE_SYSTEM_PROMPT },
          { type: "image_url", image_url: { url: imageUrl } },
        ],
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";
  let parsed: Partial<SuggestedAssetTags> = {};
  try {
    parsed = JSON.parse(raw);
  } catch {
    parsed = {};
  }

  return {
    type: parsed.type === "OBJECT" ? "OBJECT" : parsed.type === "POSTER_REFERENCE" ? "POSTER_REFERENCE" : "BACKGROUND",
    description: parsed.description ?? "",
    businessTypes: Array.isArray(parsed.businessTypes) ? parsed.businessTypes : [],
    styleTags: Array.isArray(parsed.styleTags) ? parsed.styleTags : [],
    colorTags: Array.isArray(parsed.colorTags) ? parsed.colorTags : [],
    transparent: parsed.transparent === true,
  };
}