// src/lib/constants/content-types.ts

import type { ContentType } from "@prisma/client";

export type ContentGroup = "Social" | "Marketing" | "SEO";

export interface ContentTypeConfig {
  value: ContentType;
  label: string;
  group: ContentGroup;
  placeholder: string;
  description: string;
  icon: string;
}

export const CONTENT_TYPES: ContentTypeConfig[] = [
  // ─────────────────────────────────────────────
  // SOCIAL
  // ─────────────────────────────────────────────

  {
    value: "INSTAGRAM_CAPTION",
    label: "Instagram Caption",
    group: "Social",
    placeholder: "e.g. new summer collection launch",
    description: "Captions that fit your brand's Instagram voice.",
    icon: "instagram",
  },

  {
    value: "FACEBOOK_POST",
    label: "Facebook Post",
    group: "Social",
    placeholder: "e.g. weekend sale announcement",
    description: "Engaging posts designed for Facebook audiences.",
    icon: "facebook",
  },

  {
    value: "LINKEDIN_POST",
    label: "LinkedIn Post",
    group: "Social",
    placeholder: "e.g. milestone: 10,000 customers",
    description: "Professional posts for your LinkedIn audience.",
    icon: "linkedin",
  },

  {
    value: "X_POST",
    label: "X Post",
    group: "Social",
    placeholder: "e.g. quick product tip",
    description: "Short, punchy posts designed for X.",
    icon: "x",
  },

  // ─────────────────────────────────────────────
  // MARKETING
  // ─────────────────────────────────────────────

  {
    value: "EMAIL_CAMPAIGN",
    label: "Email Campaign",
    group: "Marketing",
    placeholder: "e.g. abandoned cart reminder",
    description: "Persuasive emails designed to drive action.",
    icon: "mail",
  },

  {
    value: "PRODUCT_DESCRIPTION",
    label: "Product Description",
    group: "Marketing",
    placeholder: "e.g. ceramic pour-over coffee dripper",
    description: "Clear, persuasive descriptions for your products.",
    icon: "package",
  },

  {
    value: "BLOG_IDEA",
    label: "Blog Ideas",
    group: "Marketing",
    placeholder: "e.g. topics for our skincare blog",
    description: "Relevant content ideas for your brand.",
    icon: "file-text",
  },

  {
    value: "AD_COPY",
    label: "Ad Copy",
    group: "Marketing",
    placeholder: "e.g. Instagram ad for spring sale",
    description: "Attention-grabbing copy for your advertising.",
    icon: "megaphone",
  },

  // ─────────────────────────────────────────────
  // SEO
  // ─────────────────────────────────────────────

  {
    value: "SEO_META_TITLE",
    label: "Meta Title",
    group: "SEO",
    placeholder: "e.g. homepage meta title",
    description: "Search-friendly titles for your web pages.",
    icon: "search",
  },

  {
    value: "SEO_META_DESCRIPTION",
    label: "Meta Description",
    group: "SEO",
    placeholder: "e.g. product page meta description",
    description: "SEO descriptions designed to improve search visibility.",
    icon: "file-search",
  },

  {
    value: "SEO_KEYWORDS",
    label: "Keyword Suggestions",
    group: "SEO",
    placeholder: "e.g. keywords for our services page",
    description: "Relevant keyword ideas for your content.",
    icon: "key",
  },
];

export function getContentTypeConfig(
  value: ContentType
): ContentTypeConfig {
  const found = CONTENT_TYPES.find(
    (c) => c.value === value
  );

  if (!found) {
    throw new Error(`Unknown content type: ${value}`);
  }

  return found;
}