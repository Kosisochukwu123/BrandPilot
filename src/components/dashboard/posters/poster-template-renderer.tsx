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

  logoUrl?: string | null;
  productUrl?: string | null;

  details?: {
    offer?: string;
    price?: string;
    date?: string;
    time?: string;
    address?: string;
    phone?: string;
    website?: string;
    extra?: string;
  };
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

function resolveBlueprintSource(
  source: string | undefined,
  data: {
    headline: string;
    subheadline: string;
    cta: string;
    brandName: string | null;
    logoUrl: string | null;
    productUrl: string | null;
    websiteUrl: string | null;
    instagramHandle: string | null;
    details?: {
      offer?: string;
      price?: string;
      date?: string;
      time?: string;
      address?: string;
      phone?: string;
      website?: string;
      extra?: string;
    };
  }
): string | null {
  if (!source) return null;

  const sources: Record<string, string | null | undefined> = {
    "brand.name": data.brandName,
    "brand.logo": data.logoUrl,

    "content.headline": data.headline,
    "content.subheadline": data.subheadline,
    "content.cta": data.cta,

    "asset.product": data.productUrl,

    "details.offer": data.details?.offer,
    "details.price": data.details?.price,
    "details.date": data.details?.date,
    "details.time": data.details?.time,
    "details.address": data.details?.address,
    "details.phone": data.details?.phone,
    "details.website": data.details?.website ?? data.websiteUrl,
    "details.extra": data.details?.extra,

    "contact.website": data.websiteUrl,
    "contact.instagram": data.instagramHandle,
  };

  return sources[source] ?? null;
}

function BlueprintRenderer({
  template,
  backgroundUrl,
  brandColors,
  brandName,
  headline,
  subheadline,
  cta,
  instagramHandle,
  websiteUrl,
  logoUrl,
  productUrl,
  details,
  onHeadlineChange,
  onSubheadlineChange,
  onCtaChange,
}: {
  template: PosterTemplate;
  backgroundUrl: string | null;
  brandColors: string[];
  brandName: string | null;
  headline: string;
  subheadline: string;
  cta: string;
  instagramHandle: string | null;
  websiteUrl: string | null;
  logoUrl: string | null;
  productUrl: string | null;

  details?: {
    offer?: string;
    price?: string;
    date?: string;
    time?: string;
    address?: string;
    phone?: string;
    website?: string;
    extra?: string;
  };

  onHeadlineChange: (value: string) => void;
  onSubheadlineChange: (value: string) => void;
  onCtaChange: (value: string) => void;
}) {
  const blueprint = template.blueprint;

  if (!blueprint) {
    return null;
  }

  const primary = brandColors[0] ?? "#1E293B";
  const secondary = brandColors[1] ?? "#F59E0B";
  const surface = brandColors[2] ?? "#F8FAFC";

  const defaultTextColor = getReadableTextColor(surface);

  const getElementValue = (source?: string, value?: string) => {
    if (value) return value;

    return resolveBlueprintSource(source, {
      headline,
      subheadline,
      cta,
      brandName,
      logoUrl,
      productUrl,
      websiteUrl,
      instagramHandle,
      details,
    });
  };

  const getFontSize = (size?: string): string => {
    switch (size) {
      case "xs":
        return "clamp(0.55rem, 1.3vw, 0.75rem)";

      case "sm":
        return "clamp(0.65rem, 1.6vw, 0.9rem)";

      case "md":
        return "clamp(0.8rem, 2vw, 1.1rem)";

      case "lg":
        return "clamp(1rem, 3vw, 1.6rem)";

      case "xl":
        return "clamp(1.3rem, 4vw, 2.2rem)";

      case "2xl":
        return "clamp(1.6rem, 5vw, 3rem)";

      case "hero":
        return "clamp(2rem, 7vw, 4.5rem)";

      default:
        return "clamp(0.8rem, 2vw, 1rem)";
    }
  };

  const getFontWeight = (
    weight?: string
  ): React.CSSProperties["fontWeight"] => {
    switch (weight) {
      case "normal":
        return 400;

      case "medium":
        return 500;

      case "semibold":
        return 600;

      case "bold":
        return 700;

      case "black":
        return 900;

      default:
        return 500;
    }
  };

  const getFontFamily = (family?: string) => {
    switch (family) {
      case "serif-elegant":
        return "Georgia, 'Times New Roman', serif";

      case "display":
      case "bold-sans":
        return "'Inter', sans-serif";

      case "modern":
      default:
        return "'Inter', sans-serif";
    }
  };

  const getPositionStyle = (
    element: NonNullable<typeof blueprint>["elements"][number]
  ): React.CSSProperties => ({
    position: "absolute",

    left: `${element.position.x * 100}%`,
    top: `${element.position.y * 100}%`,
    width: `${element.position.w * 100}%`,

    ...(element.position.h !== undefined
      ? {
        height: `${element.position.h * 100}%`,
      }
      : {}),

    zIndex: element.zIndex ?? 1,

    opacity: element.opacity ?? 1,

    transform:
      element.rotation !== undefined
        ? `rotate(${element.rotation}deg)`
        : undefined,

    textAlign: element.align ?? "left",
  });

  const renderShape = (
    element: NonNullable<typeof blueprint>["elements"][number]
  ) => {
    const shape = element.style?.shape ?? "rectangle";

    const style: React.CSSProperties = {
      ...getPositionStyle(element),

      backgroundColor:
        element.style?.backgroundColor ??
        (shape === "line" ? secondary : secondary),

      borderRadius:
        shape === "circle"
          ? "9999px"
          : shape === "pill"
            ? "9999px"
            : element.style?.borderRadius ?? 0,

      border:
        element.style?.borderWidth && element.style?.borderColor
          ? `${element.style.borderWidth}px solid ${element.style.borderColor}`
          : undefined,
    };

    return <div key={element.id} style={style} />;
  };

  return (
    <>
      {backgroundUrl && (
        <img
          src={backgroundUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={{ zIndex: 0 }}
        />
      )}

      {blueprint.elements.map((element) => {
        const resolvedValue = getElementValue(
          element.source,
          element.value
        );

        if (element.type === "decorative-shape") {
          return renderShape(element);
        }

        if (
          element.type === "logo" ||
          element.type === "product" ||
          element.type === "image" ||
          element.type === "person"
        ) {
          if (!resolvedValue) {
            return null;
          }

          return (
            <img
              key={element.id}
              src={resolvedValue}
              alt=""
              style={{
                ...getPositionStyle(element),

                objectFit:
                  element.style?.objectFit ??
                  (element.type === "logo" ? "contain" : "cover"),

                objectPosition:
                  element.style?.objectPosition ?? "center",

                borderRadius:
                  element.style?.borderRadius ?? 0,

                boxShadow:
                  element.style?.shadow === "soft"
                    ? "0 10px 30px rgba(0,0,0,0.15)"
                    : element.style?.shadow === "medium"
                      ? "0 16px 40px rgba(0,0,0,0.22)"
                      : element.style?.shadow === "hard"
                        ? "0 12px 0 rgba(0,0,0,0.2)"
                        : undefined,
              }}
            />
          );
        }

        if (!resolvedValue) {
          return null;
        }

        const commonTextStyle: React.CSSProperties = {
          ...getPositionStyle(element),

          color: element.style?.color ?? defaultTextColor,

          fontSize: getFontSize(
            element.style?.fontSize
          ),

          fontWeight: getFontWeight(
            element.style?.fontWeight
          ),

          fontFamily: getFontFamily(
            element.style?.fontFamily
          ),

          backgroundColor:
            element.style?.backgroundColor,

          borderRadius:
            element.style?.shape === "pill"
              ? "9999px"
              : element.style?.borderRadius,

          padding: element.style?.padding,

          lineHeight:
            element.type === "headline" ? 0.95 : 1.25,

          overflowWrap: "break-word",
        };

        if (element.type === "headline") {
          return (
            <EditableText
              key={element.id}
              value={headline}
              onChange={onHeadlineChange}
              placeholder="Headline"
              style={commonTextStyle}
            />
          );
        }

        if (element.type === "subheadline") {
          return (
            <EditableText
              key={element.id}
              value={subheadline}
              onChange={onSubheadlineChange}
              placeholder="Subheadline"
              style={commonTextStyle}
            />
          );
        }

        if (element.type === "cta") {
          return (
            <EditableText
              key={element.id}
              value={cta}
              onChange={onCtaChange}
              placeholder="Call to action"
              style={{
                ...commonTextStyle,

                display: "flex",

                alignItems: "center",

                justifyContent:
                  element.align === "left"
                    ? "flex-start"
                    : element.align === "right"
                      ? "flex-end"
                      : "center",

                backgroundColor:
                  element.style?.backgroundColor ??
                  secondary,

                color:
                  element.style?.color ??
                  getReadableTextColor(secondary),
              }}
            />
          );
        }

        return (
          <div
            key={element.id}
            style={commonTextStyle}
          >
            {resolvedValue}
          </div>
        );
      })}
    </>
  );
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
  logoUrl,
  productUrl,
  details,
  websiteUrl,
  onHeadlineChange,
  onSubheadlineChange,
  onCtaChange,
  containerRef,
  design,
}: PosterTemplateRendererProps) {
  const primary = brandColors[0] ?? "#1E293B";
  const secondary = brandColors[1] ?? "#F59E0B";
  const blueprint = template.blueprint;

  const aspectRatioClass =
    blueprint?.aspectRatio === "4:5"
      ? "aspect-[4/5]"
      : blueprint?.aspectRatio === "16:9"
        ? "aspect-video"
        : "aspect-square";

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
      className={`relative ${aspectRatioClass} w-full overflow-hidden border border-border`}
      style={{ ...backgroundStyle, borderRadius: template.decoration.cornerRadius }}
    >
      {blueprint ? (
        <BlueprintRenderer
          template={template}
          backgroundUrl={backgroundUrl}
          brandColors={brandColors}
          brandName={brandName}
          headline={headline}
          subheadline={subheadline}
          cta={cta}
          instagramHandle={instagramHandle}
          websiteUrl={websiteUrl}
          logoUrl={logoUrl ?? null}
          productUrl={productUrl ?? null}
          details={details}
          onHeadlineChange={onHeadlineChange}
          onSubheadlineChange={onSubheadlineChange}
          onCtaChange={onCtaChange}
        />
      ) : (
        <>
          {/* ✅ Fragment wraps multiple siblings */}

          {isSplit && (
            <div className="absolute right-0 top-0 h-full w-[45%]" style={{ backgroundColor: secondary }} />
          )}

          {isPhoto && template.image?.overlay && (
            <div className="absolute inset-0" style={{ background: `rgba(0,0,0,${template.image.overlayOpacity})` }} />
          )}

          {hasSoftOverlay && (
            <div
              className="absolute inset-0"
              style={{ background: `linear-gradient(180deg, transparent 40%, ${blendColors(primary, secondary)}66 100%)` }}
            />
          )}

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

          {hasAccentShape && (
            <div
              className="absolute rounded-full opacity-20"
              style={{ width: "35%", aspectRatio: "1/1", right: "-8%", top: "-8%", backgroundColor: secondary }}
            />
          )}

          {hasLightFlare && (
            <div
              className="absolute inset-0 opacity-40"
              style={{ background: `radial-gradient(circle at 75% 15%, ${secondary}99, transparent 45%)` }}
            />
          )}

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

          <div style={slotStyle(template.slots.cta)}>
            <EditableText value={cta} onChange={onCtaChange} placeholder="Call to action" style={ctaStyle} />
          </div>

          {(template.layout === "graphic-offer" || template.layout === "graphic-bold") && (
            <div className="absolute bottom-0 left-0 right-0 h-[10%]" style={{ backgroundColor: secondary }} />
          )}

          {template.backgroundMode === "COLOR_PANEL" && !isGraphic && (
            <div className="absolute left-0 top-0 h-full w-[5%]" style={{ backgroundColor: primary }} />
          )}

          {(brandName || contactItems.length > 0) && (
            <div
              style={{
                ...slotStyle(template.slots.footer),
                color: textColor,
              }}
              className="flex flex-wrap items-center gap-3 text-xs opacity-90"
            >
              {brandName && (
                <span className="font-medium">
                  {brandName}
                </span>
              )}

              {contactItems.map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="flex items-center gap-1"
                >
                  <Icon className="h-3 w-3" />
                  {label}
                </span>
              ))}
            </div>
          )}

        </>
      )}

    </div>
  );
}