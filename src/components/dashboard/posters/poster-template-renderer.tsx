// src/components/dashboard/posters/poster-template-renderer.tsx
// Renders a poster as real, positioned DOM elements — and now actually
// reads the template's typography/button/spacing/decoration config, plus
// the AI's per-poster design decisions (design prop), instead of using
// one fixed visual treatment for every template regardless of its
// declared style. This is the fix for "24 templates that all look the same."
"use client";

import { EditableText } from "./editable-text";
import { CONTACT_ICONS } from "@/lib/constants/contact-icons";
import { getReadableTextColor, blendColors } from "@/lib/color-utils";
import {
  headlineFontSize,
  headlineFontWeight,
  headlineFontFamily,
  shadowValue,
  buttonStyle,
  emphasisScale,
  spacingMoodMultiplier,
} from "@/lib/constants/design-tokens";
import type { PosterTemplate } from "@/lib/constants/poster-templates";

interface DesignDecisions {
  visualStyle?: string;
  hierarchy?: string;
  imageFocus?: string;
  spacingMood?: string;
  ctaEmphasis?: string;
  decorationHints?: string[];
}

interface PosterTemplateRendererProps {
  template: PosterTemplate;
  backgroundUrl: string | null;
  brandColors: string[];
  brandName: string | null;
  headline: string;
  subheadline: string;
  bullets: string[];
  cta: string;
  instagramHandle: string | null;
  websiteUrl: string | null;
  onHeadlineChange: (v: string) => void;
  onSubheadlineChange: (v: string) => void;
  onCtaChange: (v: string) => void;
  containerRef?: React.RefObject<HTMLDivElement>;
  design?: DesignDecisions;
}

function slotStyle(slot: { x: number; y: number; w: number; align: string }): React.CSSProperties {
  return {
    position: "absolute",
    top: `${slot.y * 100}%`,
    left: slot.align === "right" ? "auto" : `${slot.x * 100}%`,
    right: slot.align === "right" ? `${(1 - slot.x - slot.w) * 100}%` : "auto",
    width: `${slot.w * 100}%`,
    textAlign: slot.align as React.CSSProperties["textAlign"],
  };
}

export function PosterTemplateRenderer({
  template,
  backgroundUrl,
  brandColors,
  brandName,
  headline,
  subheadline,
  bullets,
  cta,
  instagramHandle,
  websiteUrl,
  onHeadlineChange,
  onSubheadlineChange,
  onCtaChange,
  containerRef,
  design,
}: PosterTemplateRendererProps) {
  const primary = brandColors[0] ?? "#1E293B";
  const secondary = brandColors[1] ?? "#F59E0B";
  const panelColor = brandColors[2] ?? "#F8FAFC";

  const isPhoto = template.backgroundMode === "PHOTO";
  const isSplit = template.backgroundMode === "SPLIT";
  const isGraphic = template.layout.startsWith("graphic-");

  const backgroundForContrast = isPhoto
    ? "#000000"
    : template.backgroundMode === "GRADIENT"
    ? blendColors(primary, secondary)
    : isSplit || isGraphic
    ? primary
    : panelColor;
  const textColor = isPhoto ? "#ffffff" : getReadableTextColor(backgroundForContrast);
  const ctaTextColor = getReadableTextColor(secondary);

  // ── Background — now handles SPLIT mode and real gradient direction ──
  const backgroundStyle: React.CSSProperties =
    template.backgroundMode === "PHOTO" && backgroundUrl
      ? { backgroundImage: `url(${backgroundUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
      : template.backgroundMode === "GRADIENT" && template.decoration.gradient
      ? {
          background:
            template.decoration.gradientDirection === "diagonal"
              ? `linear-gradient(135deg, ${primary}, ${secondary})`
              : template.decoration.gradientDirection === "radial"
              ? `radial-gradient(circle at 30% 30%, ${secondary}, ${primary})`
              : `linear-gradient(180deg, ${primary}, ${secondary})`,
        }
      : isSplit
      ? { backgroundColor: primary }
      : { backgroundColor: isGraphic ? primary : panelColor };

  // ── Typography — reads template.typography instead of one fixed size ──
  const font = headlineFontFamily(template.typography.headline);
  const fontSize = headlineFontSize(template.typography.headlineScale);
  const fontWeight = headlineFontWeight(template.typography.headlineWeight);

  // ── Spacing — real padding/gap from the template, nudged by the AI's spacingMood ──
  const gapMultiplier = spacingMoodMultiplier(design?.spacingMood);
  const contentGap = Math.round(template.spacing.gap * gapMultiplier);

  // ── CTA — real button shape from template.button, scaled by ctaEmphasis ──
  const ctaScale = emphasisScale(design?.ctaEmphasis);
  const ctaBaseStyle = buttonStyle(template.button.style, template.button.size, secondary, ctaTextColor);
  const ctaStyle: React.CSSProperties = {
    ...ctaBaseStyle,
    transform: `scale(${ctaScale})`,
    transformOrigin: template.slots.cta.align === "center" ? "center" : "left",
    boxShadow: shadowValue(template.decoration.shadow),
  };

  // ── Decoration hints from the AI — conditional visual elements ──
  const hints = design?.decorationHints ?? [];
  const hasGlassPanel = hints.includes("glass-panel");
  const hasAccentShape = hints.includes("accent-shape");
  const hasLightFlare = hints.includes("light-flare");
  const hasSoftOverlay = hints.includes("soft-gradient-overlay");

  const contactItems = [
    websiteUrl && { icon: CONTACT_ICONS.website, label: websiteUrl },
    instagramHandle && { icon: CONTACT_ICONS.instagram, label: instagramHandle },
  ].filter(Boolean) as { icon: typeof CONTACT_ICONS.website; label: string }[];

  return (
    <div
      ref={containerRef}
      className="relative aspect-square w-full overflow-hidden border border-border"
      style={{ ...backgroundStyle, borderRadius: template.decoration.cornerRadius }}
    >
      {/* SPLIT layout: solid secondary-color panel on the right */}
      {isSplit && (
        <div className="absolute right-0 top-0 h-full w-[45%]" style={{ backgroundColor: secondary }} />
      )}

      {/* Photo image overlay strength, from template.image.overlayOpacity — not a fixed value */}
      {isPhoto && template.image?.overlay && (
        <div className="absolute inset-0" style={{ background: `rgba(0,0,0,${template.image.overlayOpacity})` }} />
      )}

      {/* AI-requested soft gradient overlay, distinct from the template's own overlay */}
      {hasSoftOverlay && (
        <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 40%, ${blendColors(primary, secondary)}66 100%)` }} />
      )}

      {/* AI-requested glass panel — frosted backing behind the text zone for legibility on busy photos */}
      {hasGlassPanel && (
        <div
          className="absolute"
          style={{
            ...slotStyle(template.slots.textZone),
            top: `${Math.max(template.slots.textZone.y - 0.04, 0) * 100}%`,
            bottom: "auto",
            height: "auto",
            padding: 16,
            background: "rgba(255,255,255,0.12)",
            backdropFilter: "blur(12px)",
            borderRadius: 16,
          }}
        />
      )}

      {/* AI-requested accent shape — simple geometric accent, brand-colored */}
      {hasAccentShape && (
        <div
          className="absolute rounded-full opacity-20"
          style={{ width: "35%", aspectRatio: "1/1", right: "-8%", top: "-8%", backgroundColor: secondary }}
        />
      )}

      {/* AI-requested light flare — soft radial glow accent */}
      {hasLightFlare && (
        <div
          className="absolute inset-0 opacity-40"
          style={{ background: `radial-gradient(circle at 75% 15%, ${secondary}99, transparent 45%)` }}
        />
      )}

      {/* Text zone — headline/subheadline/bullets flow together so a
          longer headline never overlaps what follows it */}
      <div
        style={{ ...slotStyle(template.slots.textZone), display: "flex", flexDirection: "column", gap: contentGap, padding: hasGlassPanel ? 16 : 0 }}
      >
        <EditableText
          value={headline}
          onChange={onHeadlineChange}
          placeholder="Headline"
          className="leading-tight"
          style={{
            color: textColor,
            fontFamily: font,
            fontSize,
            fontWeight,
            textShadow: isPhoto ? "0 2px 8px rgba(0,0,0,0.4)" : "none",
          }}
        />

        {subheadline && (
          <EditableText
            value={subheadline}
            onChange={onSubheadlineChange}
            placeholder="Subheading"
            className="font-medium"
            style={{
              color: textColor,
              fontFamily: "'Inter', sans-serif",
              fontSize: "clamp(0.75rem, 1.6vw, 1rem)",
              textShadow: isPhoto ? "0 1px 6px rgba(0,0,0,0.35)" : "none",
            }}
          />
        )}

        {bullets.length > 0 && (
          <ul style={{ color: textColor, fontSize: "clamp(0.7rem, 1.4vw, 0.9rem)" }} className="space-y-1.5">
            {bullets.slice(0, 4).map((b) => (
              <li key={b}>• {b}</li>
            ))}
          </ul>
        )}
      </div>

      {/* CTA — real button shape (pill/rounded/sharp/ghost/underline) from
          template.button, scaled by the AI's ctaEmphasis decision */}
      <div style={slotStyle(template.slots.cta)}>
        <EditableText value={cta} onChange={onCtaChange} placeholder="Call to action" style={ctaStyle} />
      </div>

      {/* Bottom CTA bar accent, for offer/bold graphic layouts */}
      {(template.layout === "graphic-offer" || template.layout === "graphic-bold") && (
        <div className="absolute bottom-0 left-0 right-0 h-[10%]" style={{ backgroundColor: secondary }} />
      )}

      {/* Accent bar for plain color-panel templates */}
      {template.backgroundMode === "COLOR_PANEL" && !isGraphic && (
        <div className="absolute left-0 top-0 h-full w-[5%]" style={{ backgroundColor: primary }} />
      )}

      {(brandName || contactItems.length > 0) && (
        <div
          style={{ ...slotStyle(template.slots.footer), color: textColor }}
          className="flex flex-wrap items-center gap-3 text-xs opacity-90"
        >
          {brandName && <span className="font-medium">{brandName}</span>}
          {contactItems.map(({ icon: Icon, label }) => (
            <span key={label} className="flex items-center gap-1">
              <Icon className="h-3 w-3" /> {label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}