// src/components/dashboard/posters/poster-editor-panel.tsx
"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { PosterTemplateRenderer } from "./poster-template-renderer";
import { savePosterFinal } from "@/server/actions/poster";
import { Button } from "@/components/ui/button";
import type { PosterTemplate } from "@/lib/constants/poster-templates";

interface DesignDecisions {
  visualStyle?: string;
  hierarchy?: string;
  imageFocus?: string;
  spacingMood?: string;
  ctaEmphasis?: string;
  decorationHints?: string[];
}

interface PosterEditorPanelProps {
  posterId: string;
  template: PosterTemplate;
  backgroundUrl: string | null;
  initialHeadline: string;
  initialSubheadline: string;
  initialBullets: string[];
  initialCta: string;
  instagramHandle: string | null;
  websiteUrl: string | null;
  brandName: string | null;
  brandColors: string[];
  design?: DesignDecisions; // ← add this
}

export function PosterEditorPanel({
  posterId,
  template,
  backgroundUrl,
  initialHeadline,
  initialSubheadline,
  initialBullets,
  initialCta,
  instagramHandle,
  websiteUrl,
  brandName,
  brandColors,
  design, // ← receive it
}: PosterEditorPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [headline, setHeadline] = useState(initialHeadline);
  const [subheadline, setSubheadline] = useState(initialSubheadline);
  const [cta, setCta] = useState(initialCta);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function exportToPng(): Promise<string | null> {
    if (!containerRef.current) return null;
    const dataUrl = await toPng(containerRef.current, { pixelRatio: 2, cacheBust: true });
    return dataUrl;
  }

  async function handleSave() {
    setIsSaving(true);
    const dataUrl = await exportToPng();
    if (dataUrl) {
      const base64 = dataUrl.split(",")[1];
      const result = await savePosterFinal(posterId, base64);
      if (result.success) setSaved(true);
    }
    setIsSaving(false);
  }

  async function handleDownload() {
    const dataUrl = await exportToPng();
    if (!dataUrl) return;
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `poster-${template.id}.png`;
    link.click();
  }

  return (
    <div>
      <PosterTemplateRenderer
        containerRef={containerRef}
        template={template}
        backgroundUrl={backgroundUrl}
        brandColors={brandColors}
        brandName={brandName}
        headline={headline}
        subheadline={subheadline}
        bullets={initialBullets}
        cta={cta}
        instagramHandle={instagramHandle}
        websiteUrl={websiteUrl}
        onHeadlineChange={setHeadline}
        onSubheadlineChange={setSubheadline}
        onCtaChange={setCta}
        design={design} // ← now this is valid
      />

      <p className="mt-2 text-xs text-muted-foreground">
        Click any text on the poster to edit it directly.
      </p>

      <div className="mt-4 flex gap-2">
        <Button onClick={handleDownload} variant="outline">
          Download PNG
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : saved ? "Saved" : "Save final poster"}
        </Button>
      </div>
    </div>
  );
}