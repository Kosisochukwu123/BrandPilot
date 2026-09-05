// src/lib/poster/build-poster-theme.ts
import type { PosterTemplate } from "@/lib/constants/poster-templates";
import { getReadableTextColor, blendColors } from "@/lib/color-utils";

export interface DesignDecisions {
  concept?: string;
  creativeStrategy?: string;
  campaignGoal?: string;
  imageMood?: string;
  ctaSuggestion?: string;
  visualStyle?: string;
  hierarchy?: string;
  imageFocus?: string;
  spacingMood?: string;
  ctaEmphasis?: string;
  decorationHints?: string[];
}

export interface PosterTheme {
  background: React.CSSProperties;
  isPhoto: boolean;

  isGraphic: boolean;
  showOfferBadge: boolean;
  offerBadgeText?: string;
  showBottomCtaBar: boolean;
  splitPanelColor?: string;

  overlay: {
    opacity: number;
    softBrandOverlay?: string;
  };

  headline: {
    fontSize: string;
    fontWeight: number;
    letterSpacing: string;
    color: string;
    textShadow: string;
    textAlign: "left" | "center" | "right";
    maxWidth: string;
  };
  subheadline: {
    show: boolean;
    fontSize: string;
    color: string;
    opacity: number;
    textShadow: string;
    textAlign: "left" | "center" | "right";
  };
  bullets: {
    show: boolean;
    fontSize: string;
    color: string;
    accentColor: string;
  };

  cta: {
    style: React.CSSProperties;
    fontSize: string;
    opacity: number;
  };

  gap: number;
  textZone: { x: number; y: number; w: number; align: string };
  ctaZone: { x: number; y: number; w: number; align: string };
  footerZone: { x: number; y: number; w: number; align: string };

  // Safe area (used by renderer for padding/max-height)
  safeArea: {
    top: string;
    bottom: string;
    side: string;
    textMaxHeight: string;
  };

  showAccentBar: boolean;
  accentBarColor: string;
  showGlassPanel: boolean;
  glassPanel: React.CSSProperties;
  showAccentShape: boolean;
  accentShapeColor: string;

  footer: {
    color: string;
    opacity: number;
  };
}

export function buildPosterTheme(options: {
  template: PosterTemplate;
  design?: DesignDecisions;
  brandColors: string[];
  backgroundUrl: string | null;
  /** Optional: pass actual headline so we can scale type by length */
  headlineText?: string;
}): PosterTheme {
  const {
    template,
    design,
    brandColors,
    backgroundUrl,
    headlineText = "",
  } = options;

  const primary = brandColors[0] ?? "#1E293B";
  const secondary = brandColors[1] ?? "#F59E0B";
  const panelColor = brandColors[2] ?? "#F8FAFC";

  const isPhoto = template.backgroundMode === "PHOTO";
  const hierarchy = design?.hierarchy ?? "balanced";
  const spacingMood = design?.spacingMood ?? "airy";
  const ctaEmphasis = design?.ctaEmphasis ?? "medium";
  const visualStyle = design?.visualStyle ?? "clean";
  const decorations = design?.decorationHints ?? [];

  // ── Graphic layout flags ──────────────────────────────────────
  const isGraphic = [
    "graphic-bold",
    "graphic-split",
    "graphic-offer",
    "graphic-type",
  ].includes(template.layout);

  const showOfferBadge = template.layout === "graphic-offer";
  const showBottomCtaBar =
    template.layout === "graphic-offer" || template.layout === "graphic-bold";
  const splitPanelColor =
    template.backgroundMode === "SPLIT" ? secondary : undefined;

  // ── Background ────────────────────────────────────────────────
  const background: React.CSSProperties =
    isPhoto && backgroundUrl
      ? {
          backgroundImage: `url(${backgroundUrl})`,
          backgroundSize: "cover",
          backgroundPosition: template.image?.focalPoint ?? "center",
        }
      : template.backgroundMode === "GRADIENT"
        ? {
            background:
              template.decoration.gradientDirection === "diagonal"
                ? `linear-gradient(135deg, ${primary}, ${secondary})`
                : template.decoration.gradientDirection === "radial"
                  ? `radial-gradient(circle at 30% 30%, ${primary}, ${secondary})`
                  : `linear-gradient(180deg, ${primary}, ${secondary})`,
          }
        : template.backgroundMode === "SPLIT"
          ? { backgroundColor: primary } // left half; right half drawn in renderer
          : { backgroundColor: isGraphic ? primary : panelColor };

  // ── Contrast ──────────────────────────────────────────────────
  const backgroundForContrast = isPhoto
    ? "#000000"
    : template.backgroundMode === "GRADIENT"
      ? blendColors(primary, secondary)
      : isGraphic
        ? primary
        : panelColor;

  const textColor = isPhoto
    ? "#ffffff"
    : getReadableTextColor(backgroundForContrast);
  const ctaTextColor = getReadableTextColor(secondary);

  // ── Overlay (contrast + style aware) ──────────────────────────
  const baseOverlay = template.image?.overlayOpacity ?? 0.42;
  let overlayOpacity = baseOverlay;

  if (visualStyle === "luxury" || visualStyle === "minimal") {
    overlayOpacity = Math.min(baseOverlay, 0.28);
  } else if (visualStyle === "bold" || visualStyle === "energetic") {
    overlayOpacity = Math.max(baseOverlay, 0.55);
  } else if (hierarchy === "image-dominant") {
    overlayOpacity = Math.min(baseOverlay, 0.24);
  }

  if (headlineText.length > 28) {
    overlayOpacity = Math.min(overlayOpacity + 0.06, 0.65);
  }

  // ── Safe margins ──────────────────────────────────────────────
  const safeSide = 0.06;
  const safeTop = hierarchy === "image-dominant" ? 0.55 : 0.08;
  const safeBottom = 0.06;

  const textZone = clampSlot(template.slots.textZone, safeSide);
  const ctaZone = clampSlot(template.slots.cta, safeSide);
  const footerZone = clampSlot(template.slots.footer, safeSide);

  // ── Typography — length-aware font scaling ────────────────────
  const isDominant =
    hierarchy === "headline-dominant" || hierarchy === "offer-dominant";

  let headlineSize: string;
  const len = headlineText.trim().length;

  if (isDominant || isGraphic) {
    if (len <= 18) headlineSize = "clamp(1.85rem, 6vw, 3.4rem)";
    else if (len <= 28) headlineSize = "clamp(1.55rem, 5vw, 2.9rem)";
    else headlineSize = "clamp(1.25rem, 4vw, 2.3rem)";
  } else if (template.typography.headlineScale === "xl") {
    headlineSize =
      len > 30
        ? "clamp(1.15rem, 3.6vw, 2.1rem)"
        : "clamp(1.35rem, 4.4vw, 2.6rem)";
  } else if (template.typography.headlineScale === "lg") {
    headlineSize =
      len > 30
        ? "clamp(1.05rem, 3.2vw, 1.9rem)"
        : "clamp(1.2rem, 3.8vw, 2.2rem)";
  } else {
    headlineSize = "clamp(1.05rem, 3.2vw, 1.9rem)";
  }

  const headlineWeight =
    template.typography.headlineWeight === "black"
      ? 900
      : template.typography.headlineWeight === "bold"
        ? 700
        : 600;

  // ── Spacing rhythm ────────────────────────────────────────────
  let gap = template.spacing.gap;
  if (spacingMood === "dramatic") gap = Math.round(gap * 1.5);
  else if (spacingMood === "compact") gap = Math.round(gap * 0.65);

  if (visualStyle === "luxury" || visualStyle === "minimal") {
    gap = Math.max(gap, 22);
  }

  // ── CTA polish ────────────────────────────────────────────────
  const ctaRadius =
    template.button.style === "pill"
      ? 999
      : template.button.style === "rounded"
        ? 12
        : template.button.style === "sharp"
          ? 4
          : 8;

  const ctaPadding =
    ctaEmphasis === "high" || template.button.size === "lg"
      ? "0.78rem 1.75rem"
      : ctaEmphasis === "low" || template.button.size === "sm"
        ? "0.4rem 1rem"
        : "0.55rem 1.35rem";

  const ctaFontSize =
    ctaEmphasis === "high" || template.button.size === "lg"
      ? "clamp(0.9rem, 1.9vw, 1.15rem)"
      : "clamp(0.75rem, 1.5vw, 0.95rem)";

  const ctaStyle: React.CSSProperties =
    template.button.style === "ghost"
      ? {
          backgroundColor: "transparent",
          color: textColor,
          border: `1.5px solid ${textColor}`,
          borderRadius: ctaRadius,
          padding: ctaPadding,
          fontWeight: 600,
        }
      : template.button.style === "underline"
        ? {
            backgroundColor: "transparent",
            color: textColor,
            borderBottom: `2px solid ${secondary}`,
            borderRadius: 0,
            padding: "0.3rem 0",
            fontWeight: 600,
          }
        : {
            backgroundColor: secondary,
            color: ctaTextColor,
            borderRadius: ctaRadius,
            padding: ctaPadding,
            fontWeight: 600,
            boxShadow:
              template.decoration.shadow === "hard"
                ? "0 4px 0 rgba(0,0,0,0.25)"
                : template.decoration.shadow === "medium"
                  ? "0 6px 18px rgba(0,0,0,0.2)"
                  : template.decoration.shadow === "soft"
                    ? "0 4px 14px rgba(0,0,0,0.14)"
                    : "none",
          };

  // ── Visibility rules ──────────────────────────────────────────
  const showSubheadline = hierarchy !== "image-dominant";
  const showBullets =
    hierarchy !== "image-dominant" && hierarchy !== "headline-dominant";

  // ── Glass panel ───────────────────────────────────────────────
  const showGlassPanel =
    decorations.includes("glass-panel") || template.layout === "centered-badge";

  const glassPanel: React.CSSProperties = {
    left: `${textZone.x * 100}%`,
    top: `${Math.max(textZone.y * 100 - 3, 4)}%`,
    width: `${textZone.w * 100}%`,
    padding: "1.5rem 1.25rem",
    borderRadius: template.decoration.cornerRadius || 16,
    background: isPhoto ? "rgba(0,0,0,0.38)" : "rgba(255,255,255,0.58)",
    backdropFilter: "blur(14px)",
    border: isPhoto
      ? "1px solid rgba(255,255,255,0.14)"
      : "1px solid rgba(0,0,0,0.06)",
    pointerEvents: "none",
  };

  // ── Text max-height ───────────────────────────────────────────
  const textMaxHeight =
    hierarchy === "image-dominant"
      ? "28%"
      : hierarchy === "headline-dominant" || isGraphic
        ? "42%"
        : "48%";

  return {
    background,
    isPhoto,

    // Graphic extras
    isGraphic,
    showOfferBadge,
    offerBadgeText: showOfferBadge ? "LIMITED" : undefined,
    showBottomCtaBar,
    splitPanelColor,

    overlay: {
      opacity: overlayOpacity,
      softBrandOverlay: decorations.includes("soft-gradient-overlay")
        ? `linear-gradient(135deg, ${primary}40, transparent 65%)`
        : undefined,
    },

    headline: {
      fontSize: headlineSize,
      fontWeight: headlineWeight,
      letterSpacing:
        template.typography.headline === "serif-elegant"
          ? "-0.01em"
          : "-0.025em",
      color: textColor,
      textShadow: isPhoto ? "0 2px 14px rgba(0,0,0,0.5)" : "none",
      textAlign: template.typography.align,
      maxWidth: "100%",
    },

    subheadline: {
      show: showSubheadline,
      fontSize: "clamp(0.8rem, 1.7vw, 1.05rem)",
      color: textColor,
      opacity: 0.9,
      textShadow: isPhoto ? "0 1px 8px rgba(0,0,0,0.4)" : "none",
      textAlign: template.typography.align,
    },

    bullets: {
      show: showBullets,
      fontSize: "clamp(0.72rem, 1.45vw, 0.92rem)",
      color: textColor,
      accentColor: secondary,
    },

    cta: {
      style: ctaStyle,
      fontSize: ctaFontSize,
      opacity: ctaEmphasis === "low" ? 0.85 : 1,
    },

    gap,
    textZone,
    ctaZone,
    footerZone,

    safeArea: {
      top: `${safeTop * 100}%`,
      bottom: `${safeBottom * 100}%`,
      side: `${safeSide * 100}%`,
      textMaxHeight,
    },

    // Accent bar only for non-graphic color panels
    showAccentBar: template.backgroundMode === "COLOR_PANEL" && !isGraphic,
    accentBarColor: primary,
    showGlassPanel,
    glassPanel,
    showAccentShape: decorations.includes("accent-shape"),
    accentShapeColor: `${secondary}22`,

    footer: {
      color: textColor,
      opacity: 0.82,
    },
  };
}
/** Keep slots inside safe horizontal margins */
function clampSlot(
  slot: { x: number; y: number; w: number; align: "left" | "center" | "right" },
  safeSide: number,
) {
  const minX = safeSide;
  const maxRight = 1 - safeSide;
  let x = Math.max(slot.x, minX);
  let w = slot.w;

  if (x + w > maxRight) {
    w = maxRight - x;
  }

  // Center-aligned slots stay visually centered
  if (slot.align === "center") {
    const center = slot.x + slot.w / 2;
    w = Math.min(slot.w, 1 - safeSide * 2);
    x = Math.max(safeSide, center - w / 2);
  }

  return { ...slot, x, w };
}
