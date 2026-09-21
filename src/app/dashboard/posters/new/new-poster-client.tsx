// src/app/dashboard/posters/new/page.tsx
"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { POSTER_TEMPLATES } from "@/lib/constants/poster-templates";
import { Button } from "@/components/ui/button";
// import { cn } from "@/lib/utils";
// import { TemplatePreview } from "@/components/dashboard/posters/template-preview";
import { PosterSuccessPanel } from "@/components/dashboard/posters/poster-success-panel";
import { PosterExplanationCard } from "@/components/dashboard/posters/poster-explanation-card";
import { PosterNextActions } from "@/components/dashboard/posters/poster-next-actions";
import { PosterGeneratorForm } from "@/components/dashboard/posters/poster-generator-form";
import PosterGenerating from "@/components/dashboard/posters/poster-generating";

import { PosterTemplateRenderer } from "@/components/dashboard/posters/poster-template-renderer";
import type { ComposedPosterResult } from "@/server/actions/poster";

import type { Poster } from "@prisma/client";

type Phase = "idle" | "generating" | "done" | "error";

export default function NewPosterClient() {
  const params = useSearchParams();
  const caption = params.get("caption") ?? "";
  const contentId = params.get("contentId") ?? undefined;

  const [phase, setPhase] = useState<Phase>("idle");
  const [variations, setVariations] = useState<Poster[]>([]);
  const [activeVariation, setActiveVariation] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const [generatedPoster, setGeneratedPoster] =
    useState<ComposedPosterResult | null>(null);

  const [headline, setHeadline] = useState("");
  const [subheadline, setSubheadline] = useState("");
  const [cta, setCta] = useState("");

  const [brandData, setBrandData] = useState<{
    suggestedCta: string;
    brandName: string | null;
    instagramHandle: string | null;
    websiteUrl: string | null;
    colors: string[];
  } | null>(null);

  // Called the instant generation starts — this is what makes the
  // PosterGenerating animation appear immediately on click, instead of
  // only flashing briefly after the AI call already finished.
  function handleGeneratingStart() {
    setError(null);
    setPhase("generating");
  }

  function handleGenerateFailed(message: string) {
    setError(message);
    setPhase("error");
  }

  // Called once the server action has actually resolved successfully —
  // fetches the finished poster row and moves to the done phase.
  function handleGenerated(data: ComposedPosterResult) {
    setGeneratedPoster(data);

    setHeadline(data.headline);
    setSubheadline(data.subheadline);
    setCta(data.cta);

    setBrandData({
      suggestedCta: data.suggestedCta,
      brandName: data.brandName,
      instagramHandle: data.instagramHandle,
      websiteUrl: data.websiteUrl,
      colors: data.colors,
    });

    setActiveVariation(0);
    setPhase("done");
  }

  // function handleDownload() {
  //   const current = variations[activeVariation];
  //   if (!current?.finalUrl && !current?.backgroundUrl) return;
  //   const link = document.createElement("a");
  //   link.href = current.finalUrl ?? current.backgroundUrl!;
  //   link.download = `poster-${current.variationLabel}.png`;
  //   link.click();
  // }

  function handleDownload() {
    console.warn(
      "Composed poster export will be connected to the DOM compositor next."
    );
  }

  function handleRegenerate() {
    setPhase("idle");
    setVariations([]);
    setGeneratedPoster(null);

    setHeadline("");
    setSubheadline("");
    setCta("");

    setError(null);
  }

  if (phase === "idle" || phase === "error") {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Create Poster</h1>
          <p className="text-sm text-muted-foreground">
            Built from:{" "}
            <span className="italic">
              "{caption.slice(0, 100)}
              {caption.length > 100 ? "..." : ""}"
            </span>
          </p>
        </div>

        {phase === "error" && error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800/30 dark:bg-red-950/20">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <PosterGeneratorForm
          caption={caption}
          contentId={contentId}
          brandColors={brandData?.colors ?? []}
          onGenerating={handleGeneratingStart}
          onGenerateFailed={handleGenerateFailed}
          onGenerated={handleGenerated}
        />
      </div>
    );
  }

  const current = variations[activeVariation];

  const selectedTemplate = generatedPoster
    ? POSTER_TEMPLATES.find(
      (template) => template.id === generatedPoster.templateId
    ) ?? null
    : null;

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Create Poster</h1>

      <AnimatePresence mode="wait">

        {phase === "generating" && (
          <motion.div
            key="generating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-6"
          >
            <PosterGenerating />
          </motion.div>
        )}

        {phase === "done" && generatedPoster && selectedTemplate && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="mt-6 space-y-6"
          >
            {/* <div className="flex flex-wrap gap-3">
              {variations.map((v, i) => {
                const tpl =
                  POSTER_TEMPLATES.find((t) => t.id === v.templateId) ??
                  POSTER_TEMPLATES[0];

                return (
                  <button
                    key={v.id}
                    onClick={() => setActiveVariation(i)}
                    disabled={v.status !== "READY"}
                    className={cn(
                      "w-20 overflow-hidden rounded-lg border p-1 transition",
                      i === activeVariation
                        ? "border-primary ring-2 ring-primary/30"
                        : "border-border opacity-80 hover:opacity-100",
                      v.status !== "READY" && "opacity-40",
                    )}
                  >
                    <TemplatePreview template={tpl} brandColors={brandData?.colors ?? []} />
                    <span className="mt-1 block truncate text-[10px]">
                      {v.variationLabel}
                      {v.status !== "READY" ? " (failed)" : ""}
                    </span>
                  </button>
                );
              })}
            </div> */}

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-3">
                <div className="overflow-hidden rounded-lg">
                  <PosterTemplateRenderer
                    template={selectedTemplate}
                    backgroundUrl={generatedPoster.backgroundUrl}
                    brandColors={
                      generatedPoster.colors.length > 0
                        ? generatedPoster.colors
                        : ["#111827", "#F59E0B", "#F8FAFC"]
                    }
                    brandName={generatedPoster.brandName}
                    headline={headline}
                    subheadline={subheadline}
                    bullets={generatedPoster.bullets}
                    cta={cta}
                    instagramHandle={generatedPoster.instagramHandle}
                    websiteUrl={generatedPoster.websiteUrl}
                    logoUrl={generatedPoster.assets.logoImage}
                    productUrl={generatedPoster.assets.productImage}
                    details={generatedPoster.details}
                    onHeadlineChange={setHeadline}
                    onSubheadlineChange={setSubheadline}
                    onCtaChange={setCta}
                    design={generatedPoster.design}
                  />
                </div>

                <p className="text-xs text-muted-foreground">
                  Composed from your brand, content and poster assets.
                </p>
              </div>

              <div className="space-y-4">

                <PosterSuccessPanel
                  matchScore={80}
                  recommendedPlatform="Instagram"
                  engagementLevel="Medium"
                />

                <PosterExplanationCard
                  points={[
                    `Template: ${selectedTemplate.name}`,
                    generatedPoster.design.hierarchy
                      ? `Hierarchy: ${generatedPoster.design.hierarchy}`
                      : "Balanced marketing hierarchy",
                    generatedPoster.design.visualStyle
                      ? `Visual style: ${generatedPoster.design.visualStyle}`
                      : "Brand-aligned visual direction",
                  ]}
                />
                <PosterNextActions
                  onDownload={handleDownload}
                  onRegenerate={handleRegenerate}
                  caption={caption}
                  contentId={contentId}
                />
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}