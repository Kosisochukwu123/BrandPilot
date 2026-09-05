// src/lib/constants/poster-templates.ts

export type BackgroundMode = "PHOTO" | "COLOR_PANEL" | "GRADIENT" | "SPLIT";
export type LayoutStyle =
  | "hero"
  | "editorial"
  | "centered-badge"
  | "split"
  | "bottom-caption"
  | "product-spotlight"
  | "magazine"
  | "minimal-luxury"
  | "bold-action"
  | "feature-list"
  | "card-overlay"
  | "diagonal"
  | "dark-premium"
  | "warm-organic"
  | "tech-grid"
  | "event-impact"
  | "sale-burst"

  | "graphic-bold"
  | "graphic-split"
  | "graphic-offer"
  | "graphic-type";

export type TypographyPair =
  | "display"
  | "modern"
  | "serif-elegant"
  | "bold-sans"
  | "handwritten-accent";
export type ButtonStyle = "pill" | "rounded" | "sharp" | "ghost" | "underline";
export type ShadowStyle = "none" | "soft" | "medium" | "hard";
export type ImageCrop =
  | "close-up"
  | "wide"
  | "portrait"
  | "product"
  | "lifestyle"
  | "architectural";

export interface SlotPosition {
  x: number;
  y: number;
  w: number;
  align: "left" | "center" | "right";
}

export interface PosterTemplate {
  id: string;
  name: string;
  layout: LayoutStyle;
  suitableFor: string[];
  backgroundMode: BackgroundMode;
  previewUrl?: string;

  typography: {
    headline: TypographyPair;
    body: TypographyPair;
    align: "left" | "center" | "right";
    headlineScale: "xl" | "lg" | "md";
    headlineWeight: "black" | "bold" | "semibold";
  };

  image?: {
    crop: ImageCrop;
    overlay: boolean;
    overlayOpacity: number;
    focalPoint: "center" | "top" | "bottom" | "left" | "right";
    subjectHint?: string;
  };

  button: {
    style: ButtonStyle;
    size: "sm" | "md" | "lg";
  };

  spacing: {
    padding: number;
    gap: number;
  };

  decoration: {
    gradient: boolean;
    gradientDirection?: "vertical" | "diagonal" | "radial";
    border: boolean;
    shadow: ShadowStyle;
    cornerRadius: number;
  };

  slots: {
    textZone: SlotPosition;
    cta: SlotPosition;
    footer: SlotPosition;
  };
}

export const POSTER_TEMPLATES: PosterTemplate[] = [
  // ── 1. Photo Hero ─────────────────────────────────────────────
  {
    id: "photo-hero",
    name: "Photo Hero",
    layout: "hero",
    suitableFor: [
      "E-commerce / Retail",
      "Fashion & Apparel",
      "Beauty & Cosmetics",
      "Restaurant / Food & Beverage",
    ],
    backgroundMode: "PHOTO",
    typography: {
      headline: "display",
      body: "modern",
      align: "left",
      headlineScale: "xl",
      headlineWeight: "black",
    },
    image: {
      crop: "lifestyle",
      overlay: true,
      overlayOpacity: 0.42,
      focalPoint: "center",
      subjectHint: "product or lifestyle scene with negative space in lower half",
    },
    button: { style: "pill", size: "lg" },
    spacing: { padding: 48, gap: 20 },
    decoration: { gradient: false, border: false, shadow: "soft", cornerRadius: 0 },
    slots: {
      textZone: { x: 0.08, y: 0.52, w: 0.84, align: "left" },
      cta: { x: 0.08, y: 0.82, w: 0.42, align: "left" },
      footer: { x: 0.08, y: 0.93, w: 0.84, align: "left" },
    },
  },

  // ── 2. Minimal Luxury ─────────────────────────────────────────
  {
    id: "minimal-luxury",
    name: "Minimal Luxury",
    layout: "minimal-luxury",
    suitableFor: ["Fashion & Apparel", "Beauty & Cosmetics", "E-commerce / Retail"],
    backgroundMode: "PHOTO",
    typography: {
      headline: "serif-elegant",
      body: "modern",
      align: "center",
      headlineScale: "lg",
      headlineWeight: "semibold",
    },
    image: {
      crop: "close-up",
      overlay: true,
      overlayOpacity: 0.28,
      focalPoint: "center",
      subjectHint: "clean product or model close-up, generous negative space",
    },
    button: { style: "ghost", size: "md" },
    spacing: { padding: 64, gap: 16 },
    decoration: { gradient: false, border: false, shadow: "none", cornerRadius: 0 },
    slots: {
      textZone: { x: 0.12, y: 0.62, w: 0.76, align: "center" },
      cta: { x: 0.3, y: 0.84, w: 0.4, align: "center" },
      footer: { x: 0.12, y: 0.94, w: 0.76, align: "center" },
    },
  },

  // ── 3. Restaurant Promo ───────────────────────────────────────
  {
    id: "restaurant-promo",
    name: "Restaurant Promo",
    layout: "hero",
    suitableFor: ["Restaurant / Food & Beverage"],
    backgroundMode: "PHOTO",
    typography: {
      headline: "bold-sans",
      body: "modern",
      align: "left",
      headlineScale: "xl",
      headlineWeight: "black",
    },
    image: {
      crop: "close-up",
      overlay: true,
      overlayOpacity: 0.55,
      focalPoint: "center",
      subjectHint: "food close-up or plated dish, warm lighting",
    },
    button: { style: "rounded", size: "lg" },
    spacing: { padding: 40, gap: 18 },
    decoration: { gradient: false, border: false, shadow: "medium", cornerRadius: 16 },
    slots: {
      textZone: { x: 0.08, y: 0.48, w: 0.84, align: "left" },
      cta: { x: 0.08, y: 0.8, w: 0.45, align: "left" },
      footer: { x: 0.08, y: 0.93, w: 0.84, align: "left" },
    },
  },

  // ── 4. Bold Action (Gym / Fitness) ────────────────────────────
  {
    id: "bold-action",
    name: "Bold Action",
    layout: "bold-action",
    suitableFor: ["Health & Wellness", "Local Service Business"],
    backgroundMode: "PHOTO",
    typography: {
      headline: "bold-sans",
      body: "modern",
      align: "left",
      headlineScale: "xl",
      headlineWeight: "black",
    },
    image: {
      crop: "portrait",
      overlay: true,
      overlayOpacity: 0.48,
      focalPoint: "center",
      subjectHint: "athlete or high-energy action shot",
    },
    button: { style: "sharp", size: "lg" },
    spacing: { padding: 40, gap: 16 },
    decoration: {
      gradient: true,
      gradientDirection: "diagonal",
      border: false,
      shadow: "hard",
      cornerRadius: 4,
    },
    slots: {
      textZone: { x: 0.08, y: 0.5, w: 0.84, align: "left" },
      cta: { x: 0.08, y: 0.82, w: 0.48, align: "left" },
      footer: { x: 0.08, y: 0.94, w: 0.84, align: "left" },
    },
  },

  // ── 5. SaaS Clean ─────────────────────────────────────────────
  {
    id: "saas-clean",
    name: "SaaS Clean",
    layout: "feature-list",
    suitableFor: ["SaaS / Software", "Education / Coaching"],
    backgroundMode: "GRADIENT",
    typography: {
      headline: "modern",
      body: "modern",
      align: "left",
      headlineScale: "lg",
      headlineWeight: "bold",
    },
    button: { style: "pill", size: "md" },
    spacing: { padding: 56, gap: 24 },
    decoration: {
      gradient: true,
      gradientDirection: "vertical",
      border: false,
      shadow: "soft",
      cornerRadius: 12,
    },
    slots: {
      textZone: { x: 0.08, y: 0.28, w: 0.84, align: "left" },
      cta: { x: 0.08, y: 0.78, w: 0.4, align: "left" },
      footer: { x: 0.08, y: 0.92, w: 0.84, align: "left" },
    },
  },

  // ── 6. Centered Badge ─────────────────────────────────────────
  {
    id: "centered-badge",
    name: "Centered Badge",
    layout: "centered-badge",
    suitableFor: [
      "SaaS / Software",
      "Local Service Business",
      "Education / Coaching",
      "Health & Wellness",
    ],
    backgroundMode: "COLOR_PANEL",
    typography: {
      headline: "modern",
      body: "modern",
      align: "center",
      headlineScale: "lg",
      headlineWeight: "bold",
    },
    button: { style: "pill", size: "md" },
    spacing: { padding: 48, gap: 20 },
    decoration: { gradient: false, border: true, shadow: "soft", cornerRadius: 24 },
    slots: {
      textZone: { x: 0.12, y: 0.32, w: 0.76, align: "center" },
      cta: { x: 0.25, y: 0.72, w: 0.5, align: "center" },
      footer: { x: 0.12, y: 0.9, w: 0.76, align: "center" },
    },
  },

  // ── 7. Split Block ────────────────────────────────────────────
  {
    id: "split-block",
    name: "Split Block",
    layout: "split",
    suitableFor: ["SaaS / Software", "Local Service Business", "Real Estate"],
    backgroundMode: "SPLIT",
    typography: {
      headline: "modern",
      body: "modern",
      align: "left",
      headlineScale: "lg",
      headlineWeight: "bold",
    },
    button: { style: "rounded", size: "md" },
    spacing: { padding: 44, gap: 20 },
    decoration: { gradient: false, border: false, shadow: "medium", cornerRadius: 0 },
    slots: {
      textZone: { x: 0.08, y: 0.3, w: 0.5, align: "left" },
      cta: { x: 0.08, y: 0.78, w: 0.4, align: "left" },
      footer: { x: 0.08, y: 0.92, w: 0.5, align: "left" },
    },
  },

  // ── 8. Diagonal Energy ────────────────────────────────────────
  {
    id: "diagonal-energy",
    name: "Diagonal Energy",
    layout: "diagonal",
    suitableFor: [
      "Health & Wellness",
      "Local Service Business",
      "E-commerce / Retail",
    ],
    backgroundMode: "GRADIENT",
    typography: {
      headline: "bold-sans",
      body: "modern",
      align: "left",
      headlineScale: "xl",
      headlineWeight: "black",
    },
    button: { style: "sharp", size: "lg" },
    spacing: { padding: 40, gap: 18 },
    decoration: {
      gradient: true,
      gradientDirection: "diagonal",
      border: false,
      shadow: "hard",
      cornerRadius: 0,
    },
    slots: {
      textZone: { x: 0.08, y: 0.42, w: 0.7, align: "left" },
      cta: { x: 0.08, y: 0.8, w: 0.42, align: "left" },
      footer: { x: 0.08, y: 0.93, w: 0.7, align: "left" },
    },
  },

  // ── 9. Photo Caption ──────────────────────────────────────────
  {
    id: "photo-caption",
    name: "Photo Caption",
    layout: "bottom-caption",
    suitableFor: [
      "E-commerce / Retail",
      "Fashion & Apparel",
      "Beauty & Cosmetics",
      "Restaurant / Food & Beverage",
    ],
    backgroundMode: "PHOTO",
    typography: {
      headline: "display",
      body: "modern",
      align: "left",
      headlineScale: "lg",
      headlineWeight: "bold",
    },
    image: {
      crop: "wide",
      overlay: true,
      overlayOpacity: 0.5,
      focalPoint: "top",
      subjectHint: "strong product or lifestyle image with space in lower third",
    },
    button: { style: "pill", size: "md" },
    spacing: { padding: 36, gap: 14 },
    decoration: { gradient: false, border: false, shadow: "soft", cornerRadius: 0 },
    slots: {
      textZone: { x: 0.08, y: 0.68, w: 0.84, align: "left" },
      cta: { x: 0.08, y: 0.86, w: 0.4, align: "left" },
      footer: { x: 0.08, y: 0.95, w: 0.84, align: "left" },
    },
  },

  // ── 10. Real Estate Card ──────────────────────────────────────
  {
    id: "real-estate-card",
    name: "Real Estate Card",
    layout: "card-overlay",
    suitableFor: ["Real Estate"],
    backgroundMode: "PHOTO",
    typography: {
      headline: "modern",
      body: "modern",
      align: "left",
      headlineScale: "lg",
      headlineWeight: "bold",
    },
    image: {
      crop: "architectural",
      overlay: true,
      overlayOpacity: 0.35,
      focalPoint: "center",
      subjectHint: "exterior or interior of property, clean and aspirational",
    },
    button: { style: "rounded", size: "md" },
    spacing: { padding: 40, gap: 16 },
    decoration: { gradient: false, border: false, shadow: "medium", cornerRadius: 12 },
    slots: {
      textZone: { x: 0.08, y: 0.55, w: 0.84, align: "left" },
      cta: { x: 0.08, y: 0.82, w: 0.48, align: "left" },
      footer: { x: 0.08, y: 0.93, w: 0.84, align: "left" },
    },
  },

  // ── 11. Product Spotlight ─────────────────────────────────────
  {
    id: "product-spotlight",
    name: "Product Spotlight",
    layout: "product-spotlight",
    suitableFor: ["E-commerce / Retail", "Fashion & Apparel", "Beauty & Cosmetics"],
    backgroundMode: "COLOR_PANEL",
    typography: {
      headline: "display",
      body: "modern",
      align: "center",
      headlineScale: "xl",
      headlineWeight: "black",
    },
    button: { style: "pill", size: "lg" },
    spacing: { padding: 48, gap: 20 },
    decoration: {
      gradient: true,
      gradientDirection: "radial",
      border: false,
      shadow: "soft",
      cornerRadius: 20,
    },
    slots: {
      textZone: { x: 0.1, y: 0.55, w: 0.8, align: "center" },
      cta: { x: 0.25, y: 0.8, w: 0.5, align: "center" },
      footer: { x: 0.1, y: 0.93, w: 0.8, align: "center" },
    },
  },

  // ── 12. Editorial ─────────────────────────────────────────────
  {
    id: "editorial",
    name: "Editorial",
    layout: "editorial",
    suitableFor: ["Fashion & Apparel", "Beauty & Cosmetics", "Education / Coaching"],
    backgroundMode: "PHOTO",
    typography: {
      headline: "serif-elegant",
      body: "modern",
      align: "left",
      headlineScale: "xl",
      headlineWeight: "semibold",
    },
    image: {
      crop: "portrait",
      overlay: true,
      overlayOpacity: 0.3,
      focalPoint: "center",
      subjectHint: "editorial-style photography, strong composition",
    },
    button: { style: "underline", size: "md" },
    spacing: { padding: 52, gap: 18 },
    decoration: { gradient: false, border: false, shadow: "none", cornerRadius: 0 },
    slots: {
      textZone: { x: 0.08, y: 0.58, w: 0.7, align: "left" },
      cta: { x: 0.08, y: 0.85, w: 0.4, align: "left" },
      footer: { x: 0.08, y: 0.94, w: 0.7, align: "left" },
    },
  },

  // ── 13. Dark Premium (NEW) ────────────────────────────────────
  {
    id: "dark-premium",
    name: "Dark Premium",
    layout: "dark-premium",
    suitableFor: ["Fashion & Apparel", "Beauty & Cosmetics", "E-commerce / Retail"],
    backgroundMode: "PHOTO",
    typography: {
      headline: "serif-elegant",
      body: "modern",
      align: "left",
      headlineScale: "xl",
      headlineWeight: "semibold",
    },
    image: {
      crop: "close-up",
      overlay: true,
      overlayOpacity: 0.62,
      focalPoint: "center",
      subjectHint: "dark moody product or model shot, dramatic lighting",
    },
    button: { style: "ghost", size: "md" },
    spacing: { padding: 56, gap: 18 },
    decoration: { gradient: false, border: false, shadow: "none", cornerRadius: 0 },
    slots: {
      textZone: { x: 0.08, y: 0.5, w: 0.75, align: "left" },
      cta: { x: 0.08, y: 0.82, w: 0.4, align: "left" },
      footer: { x: 0.08, y: 0.94, w: 0.75, align: "left" },
    },
  },

  // ── 14. Warm Organic (NEW) ────────────────────────────────────
  {
    id: "warm-organic",
    name: "Warm Organic",
    layout: "warm-organic",
    suitableFor: ["Health & Wellness", "Restaurant / Food & Beverage", "Beauty & Cosmetics"],
    backgroundMode: "PHOTO",
    typography: {
      headline: "handwritten-accent",
      body: "modern",
      align: "left",
      headlineScale: "lg",
      headlineWeight: "bold",
    },
    image: {
      crop: "lifestyle",
      overlay: true,
      overlayOpacity: 0.38,
      focalPoint: "center",
      subjectHint: "natural textures, plants, warm organic materials, soft light",
    },
    button: { style: "rounded", size: "md" },
    spacing: { padding: 48, gap: 20 },
    decoration: { gradient: false, border: false, shadow: "soft", cornerRadius: 20 },
    slots: {
      textZone: { x: 0.08, y: 0.5, w: 0.8, align: "left" },
      cta: { x: 0.08, y: 0.82, w: 0.42, align: "left" },
      footer: { x: 0.08, y: 0.94, w: 0.8, align: "left" },
    },
  },

  // ── 15. Tech Grid (NEW) ───────────────────────────────────────
  {
    id: "tech-grid",
    name: "Tech Grid",
    layout: "tech-grid",
    suitableFor: ["SaaS / Software", "Education / Coaching"],
    backgroundMode: "GRADIENT",
    typography: {
      headline: "modern",
      body: "modern",
      align: "left",
      headlineScale: "lg",
      headlineWeight: "bold",
    },
    button: { style: "sharp", size: "md" },
    spacing: { padding: 52, gap: 22 },
    decoration: {
      gradient: true,
      gradientDirection: "diagonal",
      border: false,
      shadow: "soft",
      cornerRadius: 8,
    },
    slots: {
      textZone: { x: 0.08, y: 0.3, w: 0.7, align: "left" },
      cta: { x: 0.08, y: 0.78, w: 0.38, align: "left" },
      footer: { x: 0.08, y: 0.92, w: 0.7, align: "left" },
    },
  },

  // ── 16. Event Impact (NEW) ────────────────────────────────────
  {
    id: "event-impact",
    name: "Event Impact",
    layout: "event-impact",
    suitableFor: [
      "Local Service Business",
      "Education / Coaching",
      "Health & Wellness",
      "Real Estate",
    ],
    backgroundMode: "PHOTO",
    typography: {
      headline: "bold-sans",
      body: "modern",
      align: "center",
      headlineScale: "xl",
      headlineWeight: "black",
    },
    image: {
      crop: "wide",
      overlay: true,
      overlayOpacity: 0.58,
      focalPoint: "center",
      subjectHint: "crowd, stage, or event atmosphere with strong energy",
    },
    button: { style: "sharp", size: "lg" },
    spacing: { padding: 44, gap: 16 },
    decoration: { gradient: false, border: false, shadow: "hard", cornerRadius: 4 },
    slots: {
      textZone: { x: 0.1, y: 0.42, w: 0.8, align: "center" },
      cta: { x: 0.25, y: 0.78, w: 0.5, align: "center" },
      footer: { x: 0.1, y: 0.92, w: 0.8, align: "center" },
    },
  },

  // ── 17. Sale Burst (NEW) ──────────────────────────────────────
  {
    id: "sale-burst",
    name: "Sale Burst",
    layout: "sale-burst",
    suitableFor: ["E-commerce / Retail", "Fashion & Apparel", "Beauty & Cosmetics"],
    backgroundMode: "COLOR_PANEL",
    typography: {
      headline: "display",
      body: "modern",
      align: "center",
      headlineScale: "xl",
      headlineWeight: "black",
    },
    button: { style: "pill", size: "lg" },
    spacing: { padding: 40, gap: 14 },
    decoration: {
      gradient: true,
      gradientDirection: "radial",
      border: false,
      shadow: "medium",
      cornerRadius: 16,
    },
    slots: {
      textZone: { x: 0.1, y: 0.35, w: 0.8, align: "center" },
      cta: { x: 0.22, y: 0.75, w: 0.56, align: "center" },
      footer: { x: 0.1, y: 0.92, w: 0.8, align: "center" },
    },
  },

  // ── 18. Magazine Cover (NEW) ──────────────────────────────────
  {
    id: "magazine-cover",
    name: "Magazine Cover",
    layout: "magazine",
    suitableFor: ["Fashion & Apparel", "Beauty & Cosmetics", "Education / Coaching"],
    backgroundMode: "PHOTO",
    typography: {
      headline: "serif-elegant",
      body: "modern",
      align: "left",
      headlineScale: "xl",
      headlineWeight: "bold",
    },
    image: {
      crop: "portrait",
      overlay: true,
      overlayOpacity: 0.25,
      focalPoint: "center",
      subjectHint: "strong vertical portrait composition, magazine quality",
    },
    button: { style: "underline", size: "sm" },
    spacing: { padding: 48, gap: 14 },
    decoration: { gradient: false, border: false, shadow: "none", cornerRadius: 0 },
    slots: {
      textZone: { x: 0.08, y: 0.62, w: 0.65, align: "left" },
      cta: { x: 0.08, y: 0.86, w: 0.35, align: "left" },
      footer: { x: 0.08, y: 0.95, w: 0.65, align: "left" },
    },
  },

  // ── 19. Corporate Trust (NEW) ─────────────────────────────────
  {
    id: "corporate-trust",
    name: "Corporate Trust",
    layout: "feature-list",
    suitableFor: ["SaaS / Software", "Real Estate", "Education / Coaching", "Local Service Business"],
    backgroundMode: "COLOR_PANEL",
    typography: {
      headline: "modern",
      body: "modern",
      align: "left",
      headlineScale: "lg",
      headlineWeight: "bold",
    },
    button: { style: "rounded", size: "md" },
    spacing: { padding: 52, gap: 20 },
    decoration: { gradient: false, border: false, shadow: "soft", cornerRadius: 8 },
    slots: {
      textZone: { x: 0.08, y: 0.28, w: 0.75, align: "left" },
      cta: { x: 0.08, y: 0.78, w: 0.4, align: "left" },
      footer: { x: 0.08, y: 0.92, w: 0.75, align: "left" },
    },
  },

  // ── 20. Beauty Soft (NEW) ─────────────────────────────────────
  {
    id: "beauty-soft",
    name: "Beauty Soft",
    layout: "minimal-luxury",
    suitableFor: ["Beauty & Cosmetics", "Fashion & Apparel", "Health & Wellness"],
    backgroundMode: "PHOTO",
    typography: {
      headline: "serif-elegant",
      body: "modern",
      align: "center",
      headlineScale: "lg",
      headlineWeight: "semibold",
    },
    image: {
      crop: "close-up",
      overlay: true,
      overlayOpacity: 0.22,
      focalPoint: "center",
      subjectHint: "soft beauty product or skin close-up, delicate lighting",
    },
    button: { style: "pill", size: "md" },
    spacing: { padding: 60, gap: 16 },
    decoration: { gradient: false, border: false, shadow: "soft", cornerRadius: 24 },
    slots: {
      textZone: { x: 0.12, y: 0.58, w: 0.76, align: "center" },
      cta: { x: 0.28, y: 0.82, w: 0.44, align: "center" },
      footer: { x: 0.12, y: 0.94, w: 0.76, align: "center" },
    },
  },

    // ── 21. Graphic Bold (type + color block) ─────────────────────
  {
    id: "graphic-bold",
    name: "Graphic Bold",
    layout: "graphic-bold",
    suitableFor: [
      "SaaS / Software",
      "Local Service Business",
      "Education / Coaching",
      "E-commerce / Retail",
      "Health & Wellness",
    ],
    backgroundMode: "COLOR_PANEL",
    typography: {
      headline: "bold-sans",
      body: "modern",
      align: "left",
      headlineScale: "xl",
      headlineWeight: "black",
    },
    button: { style: "sharp", size: "lg" },
    spacing: { padding: 48, gap: 16 },
    decoration: {
      gradient: false,
      border: false,
      shadow: "hard",
      cornerRadius: 0,
    },
    slots: {
      textZone: { x: 0.08, y: 0.22, w: 0.84, align: "left" },
      cta: { x: 0.08, y: 0.78, w: 0.5, align: "left" },
      footer: { x: 0.08, y: 0.92, w: 0.84, align: "left" },
    },
  },

  // ── 22. Graphic Split (color panel + type) ────────────────────
  {
    id: "graphic-split",
    name: "Graphic Split",
    layout: "graphic-split",
    suitableFor: [
      "SaaS / Software",
      "Local Service Business",
      "Real Estate",
      "Education / Coaching",
    ],
    backgroundMode: "SPLIT",
    typography: {
      headline: "bold-sans",
      body: "modern",
      align: "left",
      headlineScale: "xl",
      headlineWeight: "black",
    },
    button: { style: "rounded", size: "lg" },
    spacing: { padding: 44, gap: 18 },
    decoration: {
      gradient: false,
      border: false,
      shadow: "medium",
      cornerRadius: 0,
    },
    slots: {
      textZone: { x: 0.08, y: 0.28, w: 0.5, align: "left" },
      cta: { x: 0.08, y: 0.78, w: 0.42, align: "left" },
      footer: { x: 0.08, y: 0.92, w: 0.5, align: "left" },
    },
  },

  // ── 23. Graphic Offer (badge + big type + CTA bar) ────────────
  {
    id: "graphic-offer",
    name: "Graphic Offer",
    layout: "graphic-offer",
    suitableFor: [
      "E-commerce / Retail",
      "Fashion & Apparel",
      "Beauty & Cosmetics",
      "Restaurant / Food & Beverage",
      "Local Service Business",
    ],
    backgroundMode: "GRADIENT",
    typography: {
      headline: "display",
      body: "modern",
      align: "center",
      headlineScale: "xl",
      headlineWeight: "black",
    },
    button: { style: "pill", size: "lg" },
    spacing: { padding: 40, gap: 14 },
    decoration: {
      gradient: true,
      gradientDirection: "diagonal",
      border: false,
      shadow: "hard",
      cornerRadius: 12,
    },
    slots: {
      textZone: { x: 0.1, y: 0.32, w: 0.8, align: "center" },
      cta: { x: 0.2, y: 0.78, w: 0.6, align: "center" },
      footer: { x: 0.1, y: 0.92, w: 0.8, align: "center" },
    },
  },

  // ── 24. Graphic Type (typography-led, minimal chrome) ─────────
  {
    id: "graphic-type",
    name: "Graphic Type",
    layout: "graphic-type",
    suitableFor: [
      "SaaS / Software",
      "Education / Coaching",
      "Local Service Business",
      "Fashion & Apparel",
    ],
    backgroundMode: "COLOR_PANEL",
    typography: {
      headline: "bold-sans",
      body: "modern",
      align: "left",
      headlineScale: "xl",
      headlineWeight: "black",
    },
    button: { style: "underline", size: "md" },
    spacing: { padding: 52, gap: 20 },
    decoration: {
      gradient: false,
      border: false,
      shadow: "none",
      cornerRadius: 0,
    },
    slots: {
      textZone: { x: 0.08, y: 0.25, w: 0.84, align: "left" },
      cta: { x: 0.08, y: 0.8, w: 0.45, align: "left" },
      footer: { x: 0.08, y: 0.93, w: 0.84, align: "left" },
    },
  },
];

/**
 * Picks a template matching the business type, excluding any already shown this session.
 */
export function pickTemplate(
  businessType: string | null,
  excludeIds: string[] = [],
): PosterTemplate {
  const matching = businessType
    ? POSTER_TEMPLATES.filter((t) => t.suitableFor.includes(businessType))
    : [];

  const pool = matching.length > 0 ? matching : POSTER_TEMPLATES;

  const unused = pool.filter((t) => !excludeIds.includes(t.id));
  if (unused.length > 0) {
    return unused[Math.floor(Math.random() * unused.length)];
  }

  const anyUnused = POSTER_TEMPLATES.filter((t) => !excludeIds.includes(t.id));
  if (anyUnused.length > 0) {
    return anyUnused[Math.floor(Math.random() * anyUnused.length)];
  }

  return pool[Math.floor(Math.random() * pool.length)];
}

/** @deprecated use pickTemplate */
export function matchTemplate(businessType: string | null): PosterTemplate {
  return pickTemplate(businessType, []);
}