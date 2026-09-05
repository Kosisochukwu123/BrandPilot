// src/lib/constants/content-types.ts
// Groups mirror the sidebar sections you asked for — Social, Marketing, SEO
// are rendered as separate tabs in the generator UI, not one flat dropdown.
import type { ContentType } from "@prisma/client";

export interface ContentTypeConfig {
  value: ContentType;
  label: string;
  group: "Social" | "Marketing" | "SEO";
  placeholder: string;
}

export const CONTENT_TYPES: ContentTypeConfig[] = [
  { value: "INSTAGRAM_CAPTION", label: "Instagram Caption", group: "Social", placeholder: "e.g. new summer collection launch" },
  { value: "FACEBOOK_POST", label: "Facebook Post", group: "Social", placeholder: "e.g. weekend sale announcement" },
  { value: "LINKEDIN_POST", label: "LinkedIn Post", group: "Social", placeholder: "e.g. milestone: 10,000 customers" },
  { value: "X_POST", label: "X Post", group: "Social", placeholder: "e.g. quick product tip" },
  { value: "EMAIL_CAMPAIGN", label: "Email Campaign", group: "Marketing", placeholder: "e.g. abandoned cart reminder" },
  { value: "PRODUCT_DESCRIPTION", label: "Product Description", group: "Marketing", placeholder: "e.g. ceramic pour-over coffee dripper" },
  { value: "BLOG_IDEA", label: "Blog Ideas", group: "Marketing", placeholder: "e.g. topics for our skincare blog" },
  { value: "AD_COPY", label: "Ad Copy", group: "Marketing", placeholder: "e.g. Instagram ad for spring sale" },
  { value: "SEO_META_TITLE", label: "Meta Title", group: "SEO", placeholder: "e.g. homepage meta title" },
  { value: "SEO_META_DESCRIPTION", label: "Meta Description", group: "SEO", placeholder: "e.g. product page meta description" },
  { value: "SEO_KEYWORDS", label: "Keyword Suggestions", group: "SEO", placeholder: "e.g. keywords for our services page" },
];

export function getContentTypeConfig(value: ContentType): ContentTypeConfig {
  const found = CONTENT_TYPES.find((c) => c.value === value);
  if (!found) throw new Error(`Unknown content type: ${value}`);
  return found;
}