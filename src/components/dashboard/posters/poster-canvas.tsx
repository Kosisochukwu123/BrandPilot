// src/components/dashboard/posters/poster-canvas.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { savePosterFinal } from "@/server/actions/poster";
import { POSTER_TEMPLATES } from "@/lib/constants/poster-templates";
import { getReadableTextColor, blendColors } from "@/lib/color-utils";

interface PosterCanvasProps {
  posterId: string;
  templateId: string | null;
  backgroundUrl: string | null;
  initialHeadline: string;
  initialSubheadline: string;
  initialBullets: string[];
  initialCta: string;
  instagramHandle: string | null;
  websiteUrl: string | null;
  brandName: string | null;
  brandColors: string[];
}

const CANVAS_SIZE = 1024;

export function PosterCanvas({
  posterId,
  templateId,
  backgroundUrl,
  initialHeadline,
  initialSubheadline,
  initialBullets,
  initialCta,
  instagramHandle,
  websiteUrl,
  brandName,
  brandColors,
}: PosterCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [headline, setHeadline] = useState(initialHeadline);
  const [subheadline, setSubheadline] = useState(initialSubheadline);
  const [cta, setCta] = useState(initialCta);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const template = POSTER_TEMPLATES.find((t) => t.id === templateId) ?? POSTER_TEMPLATES[2];
  const primary = brandColors[0] ?? "#1E293B";
  const secondary = brandColors[1] ?? "#F59E0B";
  const panelColor = brandColors[2] ?? "#F8FAFC";
  const footerLine = [instagramHandle, websiteUrl].filter(Boolean).join("   ·   ");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;

    // Determine the actual background color to test contrast against,
    // per template mode — this replaces the old hardcoded assumption
    // that photo=white-text, everything-else=black-text.
    const backgroundForContrast =
      template.backgroundMode === "GRADIENT"
        ? blendColors(primary, secondary)
        : template.backgroundMode === "COLOR_PANEL"
        ? panelColor
        : "#000000"; // photo backgrounds always get white text + shadow, handled separately below

    const textColor = template.backgroundMode === "PHOTO" ? "#ffffff" : getReadableTextColor(backgroundForContrast);
    const ctaTextColor = getReadableTextColor(secondary);

    function drawContent() {
      const s = template.slots;
      const textOnPhoto = template.backgroundMode === "PHOTO";

      ctx.textBaseline = "top";
      ctx.shadowColor = textOnPhoto ? "rgba(0,0,0,0.45)" : "transparent";
      ctx.shadowBlur = textOnPhoto ? 10 : 0;

      if (headline) {
        ctx.font = `bold ${Math.round(CANVAS_SIZE * 0.065)}px Inter, sans-serif`;
        ctx.fillStyle = textColor;
        ctx.textAlign = s.headline.align;
        const alignX =
          s.headline.align === "center"
            ? CANVAS_SIZE * (s.headline.x + s.headline.w / 2)
            : s.headline.align === "right"
            ? CANVAS_SIZE * (s.headline.x + s.headline.w)
            : CANVAS_SIZE * s.headline.x;
        ctx.fillText(headline, alignX, CANVAS_SIZE * s.headline.y, CANVAS_SIZE * s.headline.w);
      }

      if (subheadline && s.subheadline) {
        ctx.font = `500 ${Math.round(CANVAS_SIZE * 0.028)}px Inter, sans-serif`;
        ctx.fillStyle = textColor;
        ctx.textAlign = s.subheadline.align;
        const alignX =
          s.subheadline.align === "center"
            ? CANVAS_SIZE * (s.subheadline.x + s.subheadline.w / 2)
            : CANVAS_SIZE * s.subheadline.x;
        ctx.fillText(subheadline, alignX, CANVAS_SIZE * s.subheadline.y, CANVAS_SIZE * s.subheadline.w);
      }

      if (initialBullets.length > 0 && s.bullets) {
        ctx.font = `${Math.round(CANVAS_SIZE * 0.024)}px Inter, sans-serif`;
        ctx.fillStyle = textColor;
        ctx.textAlign = "left";
        initialBullets.slice(0, s.bullets.maxItems).forEach((bullet, i) => {
          const lineY = CANVAS_SIZE * s.bullets!.y + i * CANVAS_SIZE * 0.055;
          ctx.fillText(`•  ${bullet}`, CANVAS_SIZE * s.bullets!.x, lineY, CANVAS_SIZE * s.bullets!.w);
        });
      }

      if (cta) {
        const ctaFontSize = Math.round(CANVAS_SIZE * 0.03);
        ctx.font = `600 ${ctaFontSize}px Inter, sans-serif`;
        const ctaWidth = ctx.measureText(cta).width + 56;
        const alignX =
          s.cta.align === "center" ? CANVAS_SIZE * (s.cta.x + s.cta.w / 2) - ctaWidth / 2 : CANVAS_SIZE * s.cta.x;

        ctx.shadowBlur = 0;
        ctx.fillStyle = secondary;
        ctx.beginPath();
        ctx.roundRect(alignX, CANVAS_SIZE * s.cta.y, ctaWidth, ctaFontSize * 1.9, 999);
        ctx.fill();

        ctx.fillStyle = ctaTextColor;
        ctx.textAlign = "center";
        ctx.fillText(cta, alignX + ctaWidth / 2, CANVAS_SIZE * s.cta.y + ctaFontSize * 0.45);
      }

      const footerText = [brandName, footerLine].filter(Boolean).join("   ·   ");
      if (footerText) {
        ctx.shadowBlur = textOnPhoto ? 6 : 0;
        ctx.font = `${Math.round(CANVAS_SIZE * 0.018)}px Inter, sans-serif`;
        ctx.fillStyle = textColor;
        ctx.textAlign = s.footer.align;
        const alignX =
          s.footer.align === "center" ? CANVAS_SIZE * (s.footer.x + s.footer.w / 2) : CANVAS_SIZE * s.footer.x;
        ctx.fillText(footerText, alignX, CANVAS_SIZE * s.footer.y, CANVAS_SIZE * s.footer.w);
      }
    }

    if (template.backgroundMode === "PHOTO" && backgroundUrl) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = backgroundUrl;
      img.onload = () => {
        ctx.drawImage(img, 0, 0, CANVAS_SIZE, CANVAS_SIZE);
        drawContent();
      };
    } else if (template.backgroundMode === "GRADIENT") {
      const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_SIZE);
      gradient.addColorStop(0, primary);
      gradient.addColorStop(1, secondary);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      drawContent();
    } else {
      ctx.fillStyle = panelColor;
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      ctx.fillStyle = primary;
      ctx.fillRect(0, 0, CANVAS_SIZE * 0.05, CANVAS_SIZE);
      drawContent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backgroundUrl, headline, subheadline, cta, template, brandColors, brandName, footerLine]);

  async function handleSave() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsSaving(true);
    const base64 = canvas.toDataURL("image/png").split(",")[1];
    const result = await savePosterFinal(posterId, base64);
    setIsSaving(false);
    if (result.success) setSaved(true);
  }

  return (
    <div>
      <canvas ref={canvasRef} className="w-full rounded-lg border border-border" />

      <div className="mt-4 space-y-3">
        <div>
          <label className="text-sm font-medium">Headline</label>
          <input
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
        {template.slots.subheadline && (
          <div>
            <label className="text-sm font-medium">Subheading</label>
            <input
              value={subheadline}
              onChange={(e) => setSubheadline(e.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
        )}
        <div>
          <label className="text-sm font-medium">Call to action</label>
          <input
            value={cta}
            onChange={(e) => setCta(e.target.value)}
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : saved ? "Saved" : "Save final poster"}
        </Button>
      </div>
    </div>
  );
}