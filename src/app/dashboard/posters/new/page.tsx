// src/app/dashboard/posters/new/page.tsx
"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { POSTER_TEMPLATES } from "@/lib/constants/poster-templates";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TemplatePreview } from "@/components/dashboard/posters/template-preview";
import { PosterSuccessPanel } from "@/components/dashboard/posters/poster-success-panel";
import { PosterExplanationCard } from "@/components/dashboard/posters/poster-explanation-card";
import { PosterNextActions } from "@/components/dashboard/posters/poster-next-actions";
import { PosterGeneratorForm } from "@/components/dashboard/posters/poster-generator-form";
import PosterGenerating from "@/components/dashboard/posters/poster-generating";

import type { Poster } from "@prisma/client";

type Phase = "idle" | "generating" | "done" | "error";

export default function NewPosterPage() {
  const params = useSearchParams();
  const caption = params.get("caption") ?? "";
  const contentId = params.get("contentId") ?? undefined;

  const [phase, setPhase] = useState<Phase>("idle");
  const [variations, setVariations] = useState<Poster[]>([]);
  const [activeVariation, setActiveVariation] = useState(0);
  const [error, setError] = useState<string | null>(null);
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
  async function handleGenerated(data: {
    posterId: string;
    suggestedCta: string;
    brandName: string | null;
    instagramHandle: string | null;
    websiteUrl: string | null;
    colors: string[];
  }) {
    try {
      setBrandData({
        suggestedCta: data.suggestedCta,
        brandName: data.brandName,
        instagramHandle: data.instagramHandle,
        websiteUrl: data.websiteUrl,
        colors: data.colors,
      });

      const res = await fetch(`/api/posters/${data.posterId}`);
      const poster: Poster = await res.json();

      setVariations([poster]);
      setActiveVariation(0);
      setPhase(poster.status === "READY" ? "done" : "error");

      if (poster.status !== "READY") {
        setError("Poster failed to generate. Please try again.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch poster");
      setPhase("error");
    }
  }

  function handleDownload() {
    const current = variations[activeVariation];
    if (!current?.finalUrl && !current?.backgroundUrl) return;
    const link = document.createElement("a");
    link.href = current.finalUrl ?? current.backgroundUrl!;
    link.download = `poster-${current.variationLabel}.png`;
    link.click();
  }

  function handleRegenerate() {
    setPhase("idle");
    setVariations([]);
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

        {phase === "done" && current && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="mt-6 space-y-6"
          >
            <div className="flex flex-wrap gap-3">
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
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                {current.status === "READY" && (
                  <div className="space-y-3">
                    <div className="overflow-hidden rounded-lg border border-border">
                      <img
                        src={current.finalUrl ?? current.backgroundUrl ?? ""}
                        alt={current.headline || "Poster"}
                        className="w-full aspect-square object-cover"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Full designed poster (text is part of the image).
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <PosterSuccessPanel
                  matchScore={current.matchScore ?? 80}
                  recommendedPlatform={current.recommendedPlatform ?? "Instagram"}
                  engagementLevel={current.engagementLevel ?? "Medium"}
                />
                <PosterExplanationCard points={current.explanationPoints} />
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