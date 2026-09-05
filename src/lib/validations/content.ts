// src/lib/validations/content.ts
import { z } from "zod";

export const generateContentSchema = z.object({
  type: z.enum([
    "INSTAGRAM_CAPTION", "FACEBOOK_POST", "LINKEDIN_POST", "X_POST",
    "EMAIL_CAMPAIGN", "PRODUCT_DESCRIPTION", "BLOG_IDEA", "AD_COPY",
    "SEO_META_TITLE", "SEO_META_DESCRIPTION", "SEO_KEYWORDS",
  ]),
  topic: z.string().min(3, "Add a bit more detail").max(300),
});

export type GenerateContentInput = z.infer<typeof generateContentSchema>;