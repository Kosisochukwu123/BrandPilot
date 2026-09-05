"use client";

import { useEffect, useState } from "react";
import { getPoster } from "@/server/actions/poster";
// import { PosterCanvas } from "./poster-canvas";
import { SpotlightCard } from "@/components/dashboard/overview/motion-primitives";
import { Loader2, Download, RefreshCw, Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type PosterVariation = {
  id: string;
  variationLabel: string;
  status: "READY" | "FAILED";
  templateName: string;
  accentColors: string[];
  headline: string;
  cta: string;
};

interface PosterResultProps {
  posterId?: string;
  variations?: PosterVariation[];
  active?: number;
  onSelect?: (i: number) => void;
  onDownload?: () => void;
  onRegenerate?: () => void;
  brandName?: string;
  suggestedCta?: string;
  instagramHandle?: string | null;
  websiteUrl?: string | null;
  brandColors?: string[];
}

export function PosterResult({
  posterId,
  variations: propVariations,
  active: propActive,
  onSelect,
  onDownload,
  onRegenerate,
  brandName = "Brand",
  suggestedCta = "Learn More",
  instagramHandle = null,
  websiteUrl = null,
  brandColors = [],
}: PosterResultProps) {
  const [poster, setPoster] = useState<Awaited<ReturnType<typeof getPoster>> | null>(null);
  const [variations, setVariations] = useState<PosterVariation[]>(propVariations || []);
  const [activeVariation, setActiveVariation] = useState(propActive || 0);

  // If we have a posterId, poll for updates
  useEffect(() => {
    if (!posterId) return;
    
    let active = true;
    async function poll() {
      try {
        const res = await fetch(`/api/posters/${posterId}`);
        const data = await res.json();
        if (active) {
          setPoster(data);
          if (data && data.status === "READY") {
            setVariations([
              {
                id: data.id,
                variationLabel: data.variationLabel || "Poster",
                status: data.status as "READY" | "FAILED",
                templateName: data.templateName || "Template",
                accentColors: brandColors.length > 0 ? brandColors : ["#6366f1", "#8b5cf6"],
                headline: data.headline || "Poster",
                cta: data.cta || "Learn More",
              }
            ]);
            setActiveVariation(0);
          }
        }
        if (active && data?.status === "GENERATING") {
          setTimeout(poll, 1500);
        }
      } catch (error) {
        console.error("Failed to fetch poster:", error);
      }
    }
    poll();
    return () => { active = false; };
  }, [posterId, brandColors]);

  const displayVariations = propVariations || variations;
  const active = propActive !== undefined ? propActive : activeVariation;
  const current = displayVariations[active];

  // Single poster from polling
  if (posterId && poster) {
    if (poster.status === "GENERATING") {
      return (
        <div className="flex items-center gap-3 text-sm text-muted-foreground p-4 rounded-xl border border-border/50 bg-secondary/20">
          <Loader2 className="h-4 w-4 animate-spin text-accent" />
          <span>Generating your poster...</span>
        </div>
      );
    }

    if (poster.status === "FAILED") {
      return (
        <div className="p-4 rounded-xl border border-red-200/50 bg-red-50/50 dark:border-red-800/30 dark:bg-red-950/20">
          <p className="text-sm text-red-600 dark:text-red-400">{poster.errorMessage ?? "Generation failed"}</p>
        </div>
      );
    }

    // if (poster.textMode === "OVERLAY" && poster.backgroundUrl) {
    //   return (
    //     <PosterCanvas
    //       posterId={poster.id}
    //       backgroundUrl={poster.backgroundUrl}
    //       initialHeadline={poster.headline}
    //       initialCta={suggestedCta}
    //       instagramHandle={instagramHandle}
    //       websiteUrl={websiteUrl}
    //       brandColors={brandColors}
    //     />
    //   );
    // }

    if (poster.status === "READY") {
      return (
        <div className="space-y-5">
          <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-secondary/20">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent pointer-events-none" />
            <img
              src={poster.finalUrl ?? poster.backgroundUrl ?? ""}
              alt={poster.headline || "Poster"}
              className="w-full aspect-square object-cover"
            />
          </div>
          {onDownload && (
            <button
              type="button"
              onClick={onDownload}
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-2.5 text-[12px] font-medium uppercase tracking-[0.14em] text-background transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            >
              <Download className="h-4 w-4" />
              Download PNG
            </button>
          )}
        </div>
      );
    }
  }

  // Multi-variation display
  if (displayVariations.length > 0 && current) {
    return (
      <div className="animate-fade-in space-y-8">
        {/* Variation strip */}
        <div className="flex flex-wrap items-center gap-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground mr-2">
            Variations
          </p>
          {displayVariations.map((v, i) => (
            <button
              key={v.id}
              type="button"
              onClick={() => {
                setActiveVariation(i);
                onSelect?.(i);
              }}
              disabled={v.status !== "READY"}
              className={cn(
                "group w-24 shrink-0 overflow-hidden rounded-xl border p-1.5 text-left transition-all duration-300",
                i === active
                  ? "border-accent/60 shadow-[0_8px_30px_-8px_rgba(99,102,241,0.3)]"
                  : "border-border/50 opacity-60 hover:opacity-100 hover:border-border",
                v.status !== "READY" && "opacity-30 cursor-not-allowed"
              )}
            >
              <PosterFace variation={v} brandName={brandName} compact />
              <span className="mt-1.5 block truncate font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                {v.variationLabel}
                {v.status !== "READY" && " · failed"}
              </span>
              {i === active && (
                <div className="mt-1 h-0.5 w-full rounded-full bg-accent/50" />
              )}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_1fr]">
          {/* Poster preview */}
          <SpotlightCard className="p-4 bg-gradient-to-br from-secondary/20 to-secondary/5 border-border/50">
            <div className="relative">
              <PosterFace variation={current} brandName={brandName} />
              {current.status === "READY" && (
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[9px] font-medium text-accent border border-accent/20">
                    <Sparkles className="h-3 w-3" />
                    Ready
                  </span>
                </div>
              )}
            </div>
            <p className="mt-3 px-1 text-[12px] text-muted-foreground text-center">
              Full designed poster — text is baked into the image
            </p>
          </SpotlightCard>

          <div className="space-y-4">
            {/* Why this works */}
            <SpotlightCard className="p-6 border-border/50">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-accent" />
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                  Why this works
                </p>
              </div>
              <h3 className="text-lg font-medium tracking-tight">
                {current.templateName}
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                The headline carries the offer, the CTA sits on the strongest
                contrast, and your brand mark stays out of the focal path — so the
                message reads before the logo does.
              </p>
              <div className="mt-5 flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  {current.accentColors.map((c) => (
                    <span
                      key={c}
                      className="size-5 rounded-full border border-border/50 shadow-sm"
                      style={{ background: c }}
                    />
                  ))}
                </div>
                <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                  Brand palette
                </span>
              </div>
            </SpotlightCard>

            {/* Next actions */}
            <SpotlightCard className="p-6 border-border/50">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                Next steps
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={onDownload}
                  className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-background transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>
                <button
                  type="button"
                  onClick={onRegenerate}
                  className="inline-flex items-center gap-2 rounded-full border border-border/70 px-5 py-2.5 text-[11px] uppercase tracking-[0.14em] text-muted-foreground transition-all duration-200 hover:bg-secondary hover:text-foreground"
                >
                  <RefreshCw className="h-4 w-4" />
                  Regenerate
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-border/70 px-5 py-2.5 text-[11px] uppercase tracking-[0.14em] text-muted-foreground transition-all duration-200 hover:bg-secondary hover:text-foreground"
                >
                  Save to queue
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="mt-4 text-[12px] leading-relaxed text-muted-foreground">
                Saved posters land in your content queue, ready to schedule to any
                connected channel.
              </p>
            </SpotlightCard>
          </div>
        </div>
      </div>
    );
  }

  // Fallback loading state
  return (
    <div className="flex items-center gap-3 text-sm text-muted-foreground p-4 rounded-xl border border-border/50 bg-secondary/20">
      <Loader2 className="h-4 w-4 animate-spin text-accent" />
      <span>Loading poster...</span>
    </div>
  );
}

/** Purely presentational stand-in for the generated poster bitmap. */
function PosterFace({
  variation,
  brandName,
  compact = false,
}: {
  variation: PosterVariation;
  brandName: string;
  compact?: boolean;
}) {
  const [a, b] = variation.accentColors;
  return (
    <div
      className="relative w-full overflow-hidden rounded-lg"
      style={{ aspectRatio: "4 / 5" }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(120% 90% at 20% 0%, ${a ?? "#333"} 0%, transparent 60%), linear-gradient(160deg, ${b ?? "#111"} 0%, #0b0b0d 75%)`,
        }}
      />
      {/* Subtle overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
      <div
        className={`absolute inset-0 flex flex-col justify-between ${compact ? "p-2" : "p-7"}`}
      >
        <div className="flex items-center justify-between">
          <span
            className={`grid place-items-center rounded-full bg-white/90 font-semibold text-black shadow-sm ${
              compact ? "size-3 text-[5px]" : "size-9 text-[11px]"
            }`}
          >
            {brandName.slice(0, 2).toUpperCase()}
          </span>
          {!compact && (
            <span className="h-1.5 w-12 rounded-full bg-white/20" />
          )}
        </div>
        <div>
          <p
            className={`font-semibold leading-[1.05] tracking-tight text-white ${
              compact ? "text-[6px]" : "text-2xl sm:text-3xl"
            }`}
          >
            {variation.headline}
          </p>
          <p
            className={`mt-1 text-white/70 ${compact ? "text-[4px]" : "text-[13px]"}`}
          >
            {brandName}
          </p>
        </div>
        <span
          className={`inline-flex w-fit items-center rounded-full bg-white font-semibold uppercase tracking-[0.14em] text-black shadow-sm ${
            compact ? "px-1.5 py-0.5 text-[4px]" : "px-5 py-2.5 text-[11px]"
          }`}
        >
          {variation.cta}
        </span>
      </div>
    </div>
  );
}

export default PosterResult;