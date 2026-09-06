// src/components/dashboard/overview/content-queue.tsx
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ImageIcon, Sparkles } from "lucide-react";

import { getContentTypeConfig } from "@/lib/constants/content-types";
import type { GeneratedContent, Poster } from "@prisma/client";

import { SpotlightCard } from "./motion-primitives";

type QueueItem = GeneratedContent & {
  posters: Pick<
    Poster,
    | "id"
    | "headline"
    | "backgroundUrl"
    | "finalUrl"
    | "visualStyle"
  >[];
};

interface ContentQueueProps {
  items: QueueItem[];
}

export function ContentQueue({ items }: ContentQueueProps) {
  if (items.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-dashed border-border bg-muted/20 px-5 py-10 text-center">
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-violet-500/[0.05] to-transparent" />

        <div className="relative mx-auto flex max-w-sm flex-col items-center">
          <div className="flex size-11 items-center justify-center rounded-2xl border border-violet-500/10 bg-violet-500/[0.06]">
            <Sparkles className="size-5 text-violet-500/70" />
          </div>

          <h3 className="mt-4 text-sm font-semibold tracking-tight">
            Your workspace is ready
          </h3>

          <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">
            Generate content and your unfinished ideas will appear here,
            ready to review and schedule.
          </p>

          <Link
            href="/dashboard/generate"
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3.5 py-2 text-[11px] font-medium transition hover:bg-secondary"
          >
            Generate content
            <ArrowUpRight className="size-3" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-2.5">
      {items.map((item, index) => {
        // FIX: optional chaining — item.posters can legitimately be an
        // empty array (content with no poster generated from it yet),
        // and this also guards against the relation ever being omitted
        // from a query again in the future.
        const poster = item.posters?.[0];
        const imageUrl = poster?.finalUrl ?? poster?.backgroundUrl ?? null;
        const config = getContentTypeConfig(item.type);

        return (
          <li key={item.id}>
            <Link href="/dashboard/channels" className="group block">
              <SpotlightCard className="relative overflow-hidden p-0 transition-all duration-300 hover:-translate-y-0.5">
                <div className="flex min-h-[82px] items-center gap-3 p-3">
                  <span className="hidden w-5 shrink-0 font-mono text-[9px] tabular-nums text-muted-foreground/50 sm:block">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="relative size-[58px] shrink-0 overflow-hidden rounded-xl border border-border/60 bg-muted">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={poster?.headline ?? "Generated poster preview"}
                        fill
                        sizes="58px"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="relative flex size-full items-center justify-center overflow-hidden bg-gradient-to-br from-violet-500/15 via-indigo-500/10 to-fuchsia-500/15">
                        <div className="absolute size-10 rounded-full bg-violet-500/15 blur-xl" />
                        <ImageIcon className="relative size-4 text-violet-500/50" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="shrink-0 rounded-md border border-border/60 bg-muted/60 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                        {config.label}
                      </span>

                      <span className="hidden size-1 rounded-full bg-emerald-500 sm:block" />
                    </div>

                    <p className="mt-1.5 line-clamp-1 text-[13px] font-medium leading-snug tracking-tight text-foreground">
                      {item.output}
                    </p>

                    <div className="mt-1 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <span>
                        {new Intl.DateTimeFormat("en", {
                          month: "short",
                          day: "numeric",
                        }).format(new Date(item.createdAt))}
                      </span>

                      <span className="size-0.5 rounded-full bg-muted-foreground/40" />

                      <span>Ready to schedule</span>
                    </div>
                  </div>

                  <div className="hidden shrink-0 flex-col items-end gap-2 sm:flex">
                    <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.12em] text-emerald-600 dark:text-emerald-400">
                      Ready
                    </span>
                  </div>

                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-all duration-300 group-hover:rotate-45 group-hover:border-violet-400/40 group-hover:bg-violet-500/5 group-hover:text-violet-600">
                    <ArrowUpRight className="size-3.5" />
                  </span>
                </div>
              </SpotlightCard>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default ContentQueue;