// src/lib/validations/brand.ts
import { z } from "zod";
import { BUSINESS_TYPES, BRAND_TONES, TARGET_AUDIENCES } from "@/lib/constants/brand-options";

export const analyzeWebsiteSchema = z.object({
  websiteUrl: z.string().url("Enter a full URL, including https://").max(300),
});

// Manual preferences — this is now the primary path for businesses with
// no website. websiteUrl, instagramHandle, and whatsappNumber are all
// optional individually, but at least one "how do customers find you"
// signal, plus at least one brand-voice field, should be set for the
// content generator to have anything useful to work with.
export const brandPreferencesSchema = z
  .object({
    brandName: z.string().max(100).optional(),
    websiteUrl: z.string().url("Enter a full URL, including https://").max(300).optional().or(z.literal("")),
    instagramHandle: z
      .string()
      .max(50)
      .regex(/^@?[\w.]+$/, "Use a valid handle, e.g. @yourbrand")
      .optional()
      .or(z.literal("")),
    whatsappNumber: z
      .string()
      .regex(/^\+[1-9]\d{6,14}$/, "Use E.164 format, e.g. +2348012345678")
      .optional()
      .or(z.literal("")),
    businessType: z.enum(BUSINESS_TYPES).optional(),
    tone: z.enum(BRAND_TONES).optional(),
    audience: z.array(z.enum(TARGET_AUDIENCES)).max(3).optional(),
    keywords: z.array(z.string().max(40)).max(10).optional(),
  })
  .refine(
    (data) =>
      data.brandName || data.businessType || data.tone || data.audience?.length || data.keywords?.length,
    { message: "Set at least one brand-voice preference before saving" }
  );

export type AnalyzeWebsiteInput = z.infer<typeof analyzeWebsiteSchema>;
export type BrandPreferencesInput = z.infer<typeof brandPreferencesSchema>;