// src/lib/constants/design-tokens.ts
// Translates a template's typography/button/decoration metadata (and the
// AI's per-poster design decisions) into real CSS values. This is the
// missing link that was computed by choosePosterTemplate + compilePosterContent
// but never actually reached the screen — every template rendered
// identically regardless of its typography/button/decoration config.
import type { PosterTemplate, TypographyPair, ButtonStyle, ShadowStyle } from "./poster-templates";

export function headlineFontSize(scale: PosterTemplate["typography"]["headlineScale"]): string {
  switch (scale) {
    case "xl": return "clamp(1.3rem, 4.6vw, 2.75rem)";
    case "lg": return "clamp(1.1rem, 3.6vw, 2.1rem)";
    case "md": return "clamp(0.95rem, 2.8vw, 1.6rem)";
  }
}

export function headlineFontWeight(weight: PosterTemplate["typography"]["headlineWeight"]): number {
  switch (weight) {
    case "black": return 900;
    case "bold": return 700;
    case "semibold": return 600;
  }
}

export function headlineFontFamily(pair: TypographyPair): string {
  switch (pair) {
    case "serif-elegant": return "'Playfair Display', Georgia, serif";
    case "handwritten-accent": return "'Caveat', cursive";
    case "display": return "'Archivo Black', Inter, sans-serif";
    case "bold-sans": return "'Inter', sans-serif";
    case "modern":
    default: return "'Inter', sans-serif";
  }
}

export function shadowValue(shadow: ShadowStyle): string {
  switch (shadow) {
    case "none": return "none";
    case "soft": return "0 4px 20px rgba(0,0,0,0.12)";
    case "medium": return "0 8px 30px rgba(0,0,0,0.2)";
    case "hard": return "6px 6px 0px rgba(0,0,0,0.9)";
  }
}

export function buttonStyle(
  style: ButtonStyle,
  size: PosterTemplate["button"]["size"],
  bgColor: string,
  textColor: string
): React.CSSProperties {
  const sizePadding = { sm: "6px 14px", md: "10px 22px", lg: "14px 30px" }[size];
  const sizeFont = { sm: "0.75rem", md: "0.9rem", lg: "1.05rem" }[size];

  const base: React.CSSProperties = {
    padding: sizePadding,
    fontSize: sizeFont,
    fontWeight: 600,
    display: "inline-block",
  };

  switch (style) {
    case "pill":
      return { ...base, borderRadius: 999, backgroundColor: bgColor, color: textColor, border: "none" };
    case "rounded":
      return { ...base, borderRadius: 10, backgroundColor: bgColor, color: textColor, border: "none" };
    case "sharp":
      return { ...base, borderRadius: 0, backgroundColor: bgColor, color: textColor, border: "none" };
    case "ghost":
      return { ...base, borderRadius: 8, backgroundColor: "transparent", color: textColor, border: `1.5px solid ${textColor}` };
    case "underline":
      return {
        ...base,
        padding: "4px 0",
        borderRadius: 0,
        backgroundColor: "transparent",
        color: textColor,
        border: "none",
        borderBottom: `2px solid ${textColor}`,
      };
  }
}

// Emphasis from the AI's per-poster ctaEmphasis decision scales the
// button up/down independent of the template's own base size — e.g. a
// "high" emphasis CTA on an otherwise "sm" button template still needs
// to read as urgent.
export function emphasisScale(emphasis?: string): number {
  if (emphasis === "high") return 1.15;
  if (emphasis === "low") return 0.9;
  return 1;
}

// Spacing mood from the AI nudges the template's base gap wider/tighter
// — "airy" designs need more breathing room than the template's static
// default alone would give them.
export function spacingMoodMultiplier(mood?: string): number {
  if (mood === "airy") return 1.4;
  if (mood === "compact") return 0.75;
  return 1;
}