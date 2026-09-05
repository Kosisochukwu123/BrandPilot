// src/server/services/ai/reference-poster-director.ts
import { openai } from "./openai-client";
import type { Brand, BrandReport } from "@prisma/client";
import type { ReferenceCreativePlan } from "@/lib/poster/reference-types";

const DIRECTOR_SYSTEM = `You are the Creative Director for BrandPilot, an AI marketing agency.

Your job is to make creative decisions for ONE premium marketing poster — not to write a long essay.

Respond with ONLY valid JSON (no markdown):
{
  "campaignType": "short label, e.g. Brand Awareness, Offer Promo, Event, Luxury Launch",
  "emotion": "primary emotion the poster should evoke",
  "composition": "e.g. hero-right, centered-subject, type-led, split-panel, dark-editorial",
  "lighting": "e.g. soft studio, dramatic rim, natural warm, high-key, moody",
  "contrast": "low | medium | high",
  "background": "short description of background treatment",
  "typographyStyle": "e.g. bold sans, elegant serif, mixed script+sans, modern geometric",
  "negativeSpace": "where clean space should live for hierarchy, e.g. upper third, left half",
  "visualPriority": ["element1", "element2", "element3"],
  "graphicDirection": "how graphic design mixes with photography — shapes, frames, depth",
  "avoid": ["what to avoid, e.g. generic stock headshot layout", "cluttered footer text dump"],
  "headline": "3-7 word punchy headline, title case, original — not a copy of the caption",
  "subheadline": "one short supporting line, or empty string",
  "cta": "short CTA label ONLY if a button is truly needed; otherwise empty string"
  "imageDirection": "2-4 sentences: concrete visual direction for the image model",
  "reasoning": ["2-4 short bullets explaining key creative choices"]
}

Rules:
- Design for a professional commercial poster, not a social photo with text stuck on top.
- Prefer graphic design + commercial photography over generic stock layouts.
- Invent an original composition suited to THIS business — do not copy famous templates.
- Headline must be short and poster-ready.
- If preferred keywords are provided, ground the headline in those ideas and the business type.
- Never default to generic lines like "Elevate Your Brand" when keywords or business type give a clearer direction.

- If user details include price/date/phone/offer, assume those will appear on the poster; plan hierarchy so they do not compete with the headline.

- Respect poster type and goal (e.g. church+invite vs product+sell).
- Prefer the user's main message when writing the headline; do not invent generic lines like "Elevate Your Brand".
- Church/leadership with people → portrait + name/role layout; usually no button CTA.

- Most posters should NOT have a button-style CTA.
- Prefer headline + supporting line + contact/details when those exist.
- Only set a non-empty cta when the brief is clearly promotional and needs a direct action (e.g. explicit offer with a strong ask).
- Never default to "Get Started", "Learn More", or "Shop Now" just to fill the field.

- Match tone to the business type (luxury, local service, club/event, SaaS, etc.).`;

export async function planReferencePoster(options: {
  caption: string;
  brand: Brand | null;
  report?: BrandReport | null;
  details?: {
    offer?: string;
    price?: string;
    date?: string;
    time?: string;
    address?: string;
    phone?: string;
    website?: string;
    extra?: string;
  };

  posterType?: string;
  goal?: string;
  mainMessage?: string;
  people?: { name?: string; role?: string }[];

  userCta?: string;
  keywords?: string[];
}): Promise<ReferenceCreativePlan> {
  const {
    caption,
    brand,
    report,
    details,
    keywords,
    userCta,
    posterType,
    people,
    goal,
    mainMessage,
  } = options;

  const detailLines = details
    ? Object.entries(details)
        .filter(([, v]) => v && String(v).trim())
        .map(([k, v]) => `${k}: ${v}`)
        .join("\n")
    : "";

  const peopleLines =
    people
      ?.map((p, i) => {
        const line = [p.name, p.role].filter(Boolean).join(" — ");
        return line ? `Person ${i + 1}: ${line}` : "";
      })
      .filter(Boolean)
      .join("\n") ?? "";

  const userMessage = [
    `CAPTION / BRIEF:\n${caption}`,
    "",
    "BRAND:",
    `- Name: ${brand?.brandName ?? "Unknown"}`,
    `- Business type: ${brand?.businessType ?? "Unknown"}`,
    `- Tone: ${brand?.tone ?? "Neutral"}`,
    `- Colors: ${(report?.colors ?? []).join(", ") || "not set"}`,
    posterType ? `Poster type: ${posterType}` : "",
    goal ? `Goal: ${goal}` : "",
    mainMessage ? `Main message from user:\n${mainMessage}` : "",
    keywords?.length ? `Keywords:\n${keywords.join(", ")}` : "",
    peopleLines ? `People:\n${peopleLines}` : "",
    detailLines ? `\nUSER DETAILS:\n${detailLines}` : "",
    "",
    "Make creative decisions for one premium square marketing poster.",
  ]
    .filter(Boolean)
    .join("\n");

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.7,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: DIRECTOR_SYSTEM },
      { role: "user", content: userMessage },
    ],
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";
  let parsed: Partial<ReferenceCreativePlan> = {};
  try {
    parsed = JSON.parse(raw);
  } catch {
    parsed = {};
  }

  return {
    campaignType: parsed.campaignType ?? "Brand Awareness",
    emotion: parsed.emotion ?? "confidence",
    composition: parsed.composition ?? "balanced-hero",
    lighting: parsed.lighting ?? "professional studio",
    contrast: parsed.contrast ?? "high",
    background: parsed.background ?? "clean branded backdrop",
    typographyStyle: parsed.typographyStyle ?? "bold sans",
    negativeSpace: parsed.negativeSpace ?? "upper third",
    visualPriority: Array.isArray(parsed.visualPriority)
      ? parsed.visualPriority
      : ["headline", "subject", "cta"],
    graphicDirection:
      parsed.graphicDirection ??
      "Mix graphic shapes with commercial photography; strong hierarchy.",
    avoid: Array.isArray(parsed.avoid)
      ? parsed.avoid
      : ["generic stock layout", "cluttered text dump"],
    headline: parsed.headline ?? "Elevate Your Brand",
    subheadline: parsed.subheadline ?? "",
    cta: parsed.cta ?? userCta ?? "",
    imageDirection:
      parsed.imageDirection ??
      "Premium commercial poster, bold hierarchy, intentional negative space.",
    reasoning: Array.isArray(parsed.reasoning) ? parsed.reasoning : [],
  };
}
