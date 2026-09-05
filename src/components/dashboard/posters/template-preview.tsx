// src/components/dashboard/posters/template-preview.tsx
"use client";

import type { PosterTemplate } from "@/lib/constants/poster-templates";

interface TemplatePreviewProps {
  template: PosterTemplate;
  brandColors?: string[];
  className?: string;
  showLabel?: boolean;
}

export function TemplatePreview({
  template,
  brandColors = ["#1E293B", "#F59E0B", "#F8FAFC"],
  className = "",
  showLabel = false,
}: TemplatePreviewProps) {
  const primary = brandColors[0] ?? "#1E293B";
  const secondary = brandColors[1] ?? "#F59E0B";
  const panel = brandColors[2] ?? "#F8FAFC";

  const isPhoto = template.backgroundMode === "PHOTO";
  const isGradient = template.backgroundMode === "GRADIENT";
  const isSplit = template.backgroundMode === "SPLIT";
  const isGraphic = template.layout.startsWith("graphic-");

  const bg: React.CSSProperties = isPhoto
    ? {
        background: `linear-gradient(145deg, ${primary}88, ${secondary}55), #334155`,
      }
    : isGradient
    ? {
        background:
          template.decoration.gradientDirection === "diagonal"
            ? `linear-gradient(135deg, ${primary}, ${secondary})`
            : `linear-gradient(180deg, ${primary}, ${secondary})`,
      }
    : isSplit
    ? { backgroundColor: primary }
    : { backgroundColor: isGraphic ? primary : panel };

  const textColor =
    isPhoto || isGradient || isGraphic || isSplit ? "#fff" : "#0f172a";

  return (
    <div className={className}>
      <div
        className="relative aspect-square w-full overflow-hidden rounded-md border border-border shadow-sm"
        style={bg}
      >
        {/* Static image if you ever set previewUrl */}
        {template.previewUrl ? (
          <img
            src={template.previewUrl}
            alt={template.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <>
            {/* Split right panel */}
            {isSplit && (
              <div
                className="absolute right-0 top-0 h-full w-[45%]"
                style={{ backgroundColor: secondary }}
              />
            )}

            {/* Photo faux subject */}
            {isPhoto && (
              <div className="absolute inset-0 opacity-30">
                <div className="absolute left-[20%] top-[15%] h-[40%] w-[35%] rounded-full bg-white/20" />
                <div className="absolute bottom-0 left-0 right-0 h-[45%] bg-gradient-to-t from-black/70 to-transparent" />
              </div>
            )}

            {/* Offer badge */}
            {template.layout === "graphic-offer" && (
              <div
                className="absolute left-1/2 top-[10%] -translate-x-1/2 rounded-full px-2 py-0.5 text-[7px] font-bold uppercase tracking-wider"
                style={{ backgroundColor: secondary, color: "#111" }}
              >
                Offer
              </div>
            )}

            {/* Fake headline */}
            <div
              className="absolute"
              style={{
                left: `${template.slots.textZone.x * 100}%`,
                top: `${template.slots.textZone.y * 100}%`,
                width: `${template.slots.textZone.w * 100}%`,
                textAlign: template.slots.textZone.align,
              }}
            >
              <div
                className="mb-1 font-black leading-none"
                style={{
                  color: textColor,
                  fontSize: "clamp(0.55rem, 2.8vw, 0.85rem)",
                  letterSpacing: "-0.02em",
                }}
              >
                Headline
              </div>
              <div
                className="opacity-70"
                style={{
                  color: textColor,
                  fontSize: "clamp(0.35rem, 1.4vw, 0.5rem)",
                }}
              >
                Subline text
              </div>
            </div>

            {/* Fake CTA */}
            <div
              className="absolute"
              style={{
                left: `${template.slots.cta.x * 100}%`,
                top: `${Math.min(template.slots.cta.y, 0.88) * 100}%`,
              }}
            >
              {template.layout === "graphic-offer" ||
              template.layout === "graphic-bold" ? (
                <div
                  className="rounded-sm px-2 py-0.5 text-[6px] font-bold uppercase"
                  style={{ backgroundColor: secondary, color: "#111" }}
                >
                  CTA
                </div>
              ) : (
                <div
                  className="rounded-full px-2 py-0.5 text-[6px] font-semibold"
                  style={{
                    backgroundColor:
                      template.button.style === "ghost"
                        ? "transparent"
                        : secondary,
                    color:
                      template.button.style === "ghost" ? textColor : "#111",
                    border:
                      template.button.style === "ghost"
                        ? `1px solid ${textColor}`
                        : "none",
                  }}
                >
                  CTA
                </div>
              )}
            </div>

            {/* Bottom CTA bar */}
            {(template.layout === "graphic-offer" ||
              template.layout === "graphic-bold") && (
              <div
                className="absolute bottom-0 left-0 right-0 h-[12%]"
                style={{ backgroundColor: secondary }}
              />
            )}

            {/* Accent bar for normal color panels */}
            {template.backgroundMode === "COLOR_PANEL" && !isGraphic && (
              <div
                className="absolute left-0 top-0 h-full w-[6%]"
                style={{ backgroundColor: primary }}
              />
            )}
          </>
        )}
      </div>

      {showLabel && (
        <p className="mt-1.5 truncate text-center text-xs text-muted-foreground">
          {template.name}
        </p>
      )}
    </div>
  );
}