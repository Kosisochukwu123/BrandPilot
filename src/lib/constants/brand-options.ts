// src/lib/constants/brand-options.ts
// Single source of truth for selectable brand options. Both the AI
// analyzer and the manual form map to these same values, so a user's
// manual edit and an AI-detected value are always directly comparable.

export const BUSINESS_TYPES = [
  "E-commerce / Retail",
  "SaaS / Software",
  "Local Service Business",
  "Restaurant / Food & Beverage",
  "Health & Wellness",
  "Fashion & Apparel",
  "Beauty & Cosmetics",
  "Real Estate",
  "Education / Coaching",
  "Other",
] as const;

export const BRAND_TONES = [
  "Professional",
  "Friendly & Casual",
  "Playful & Fun",
  "Luxury & Premium",
  "Bold & Energetic",
  "Minimal & Calm",
] as const;

export const TARGET_AUDIENCES = [
  "Gen Z (18-24)",
  "Young Professionals (25-34)",
  "Parents & Families",
  "Small Business Owners",
  "Enterprise Buyers",
  "Luxury Consumers",
  "Budget-Conscious Shoppers",
] as const;

export type BusinessType = (typeof BUSINESS_TYPES)[number];
export type BrandTone = (typeof BRAND_TONES)[number];
export type TargetAudience = (typeof TARGET_AUDIENCES)[number];