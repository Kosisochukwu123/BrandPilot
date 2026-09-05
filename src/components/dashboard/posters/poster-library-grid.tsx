// src/components/dashboard/posters/poster-library-grid.tsx
"use client";

import { useState, useTransition } from "react";
import { deletePoster } from "@/server/actions/poster";

import { Trash2, Download, Loader2, Send, ImageOff } from "lucide-react";
import { PublishPosterDialog } from "./publish-poster-dialog";
import { Reveal, SpotlightCard } from "@/components/dashboard/overview/motion-primitives";

// In your Next.js app, swap the line above for:
// import type { Poster } from "@prisma/client";
// import { deletePoster } from "@/server/actions/poster";

export type Poster = {
  id: string;
  headline: string | null;
  subheadline: string | null;
  finalUrl: string | null;
  backgroundUrl: string | null;
  status: "READY" | "GENERATING" | "FAILED";
  createdAt: Date | string;
  variationLabel?: string | null;
};

export function PosterLibraryGrid({ posters }: { posters: Poster[] }) {
  const [items, setItems] = useState(posters);
  const [isPending, startTransition] = useTransition();
  const [publishPoster, setPublishPoster] = useState<Poster | null>(null);

  function handleDelete(id: string) {
    setItems((prev) => prev.filter((p) => p.id !== id));
    startTransition(() => {
      deletePoster(id);
    });
  }

  function handleDownload(poster: Poster) {
    const url = poster.finalUrl ?? poster.backgroundUrl;
    if (!url) return;
    const link = document.createElement("a");
    link.href = url;
    link.download = `poster-${poster.id}.png`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.click();
  }

  if (items.length === 0) {
    return (
      <div className="grid min-h-[320px] place-items-center rounded-2xl border border-dashed border-border/60 bg-secondary/20 px-6">
        <div className="text-center">
          <ImageOff className="mx-auto h-6 w-6 text-muted-foreground/50" />
          <p className="mt-3 text-sm font-medium text-foreground">No posters yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Generate your first poster to see it here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((poster, index) => {
          const imageUrl = poster.finalUrl ?? poster.backgroundUrl;
          const canPublish =
            !!imageUrl &&
            poster.status !== "GENERATING" &&
            poster.status !== "FAILED";
          const isGenerating = poster.status === "GENERATING";

          return (
            <Reveal key={poster.id} delay={index * 60}>
              <SpotlightCard as="article" className="group flex h-full flex-col overflow-hidden">
                {/* Image stage */}
                <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
                  {isGenerating ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Generating…</span>
                    </div>
                  ) : poster.status === "FAILED" ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 text-center">
                      <span className="rounded-full bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive">
                        Failed to generate
                      </span>
                    </div>
                  ) : imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={poster.headline || "Poster"}
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                  ) : null}

                  {/* Status pill sits on the image, top-right */}
                  <div className="absolute right-3 top-3">
                    <StatusBadge status={poster.status} />
                  </div>
                </div>

                {/* Card body */}
                <div className="flex flex-1 flex-col justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <h3 className="truncate text-[15px] font-medium leading-snug text-foreground">
                      {poster.headline || "Untitled"}
                    </h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {new Date(poster.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                      {poster.variationLabel ? ` · ${poster.variationLabel}` : ""}
                    </p>
                  </div>

                  {/* Always-visible actions */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPublishPoster(poster)}
                      disabled={!canPublish}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-foreground px-3 py-2 text-[13px] font-medium text-background transition-colors hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      <Send className="h-3.5 w-3.5" />
                      Publish
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownload(poster)}
                      disabled={!imageUrl}
                      aria-label="Download poster"
                      title="Download"
                      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(poster.id)}
                      disabled={isPending}
                      aria-label="Delete poster"
                      title="Delete"
                      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border text-destructive transition-colors hover:border-destructive/40 hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </SpotlightCard>
            </Reveal>
          );
        })}
      </div>

      {publishPoster && (
        <PublishPosterDialog
          poster={publishPoster}
          open={!!publishPoster}
          onClose={() => setPublishPoster(null)}
        />
      )}
    </>
  );
}

function StatusBadge({ status }: { status: Poster["status"] }) {
  if (status === "READY") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-background/90 px-2.5 py-1 text-[11px] font-medium text-foreground shadow-sm backdrop-blur-sm">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
        </span>
        Ready
      </span>
    );
  }
  if (status === "GENERATING") {
    return (
      <span className="rounded-full bg-background/90 px-2.5 py-1 text-[11px] font-medium text-muted-foreground shadow-sm backdrop-blur-sm">
        Generating
      </span>
    );
  }
  return (
    <span className="rounded-full bg-destructive/90 px-2.5 py-1 text-[11px] font-medium text-destructive-foreground shadow-sm backdrop-blur-sm">
      Failed
    </span>
  );
}

export default PosterLibraryGrid;