// src/server/services/ai/prompts.ts
// Builds the system prompt that injects brand context into every
// generation. This is the piece that actually connects Phase 3's
// Brand.tone/audience/keywords to the text the model writes.
import type { Brand } from "@prisma/client";
import type { ContentTypeConfig } from "@/lib/constants/content-types";

const TYPE_INSTRUCTIONS: Record<string, string> = {
  INSTAGRAM_CAPTION: "Write a single Instagram caption, under 150 words, with 3-5 relevant hashtags at the end.",
  FACEBOOK_POST: "Write a single Facebook post, conversational, 2-4 sentences, no hashtags.",
  LINKEDIN_POST: "Write a single LinkedIn post, professional but human, 3-6 short paragraphs, no emojis.",
  X_POST: "Write a single X post under 280 characters. No hashtags unless essential.",
  EMAIL_CAMPAIGN: "Write a marketing email with a subject line and body, formatted as 'Subject: ...' then the body.",
  PRODUCT_DESCRIPTION: "Write a product description, 2-3 short paragraphs, benefit-led.",
  BLOG_IDEA: "Write a list of 8 blog post title ideas, one per line, no numbering commentary.",
  AD_COPY: "Write ad copy with a headline and body text, formatted as 'Headline: ...' then 'Body: ...'.",
  SEO_META_TITLE: "Write 3 meta title options, each under 60 characters, one per line.",
  SEO_META_DESCRIPTION: "Write 3 meta description options, each under 155 characters, one per line.",
  SEO_KEYWORDS: "Write a list of 15 relevant SEO keywords, one per line, ordered by relevance.",
};

export function buildSystemPrompt(brand: Brand | null, config: ContentTypeConfig): string {
  const brandContext = brand
    ? `Brand name: ${brand.brandName ?? "Unknown"}
Business type: ${brand.businessType ?? "Unknown"}
Brand tone: ${brand.tone ?? "Neutral, professional"}
Target audience: ${brand.audience ?? "General audience"}
Keywords: ${brand.keywords?.join(", ") ?? "None specified"}
Summary: ${brand.rawSummary ?? "None available"}`
    : "No brand profile is set — write in a clear, generic professional tone.";

  return `You are a marketing copywriter working for the brand described below. Always write in the brand's tone and speak to its stated audience. Never mention that you are an AI.

${brandContext}

Task: ${TYPE_INSTRUCTIONS[config.value] ?? "Write high-quality marketing content."}
Do not add commentary, explanations, or markdown formatting — output only the requested content.`;
}