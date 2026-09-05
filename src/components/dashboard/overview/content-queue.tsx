// src/components/dashboard/overview/content-queue.tsx
import Link from "next/link";
import { getContentTypeConfig } from "@/lib/constants/content-types";
import type { GeneratedContent } from "@prisma/client";
import { SpotlightCard } from "./motion-primitives";

export function ContentQueue({ items }: { items: GeneratedContent[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-8 text-center text-[13px] text-muted-foreground">
        Nothing queued — generate content and it'll show up here, ready to schedule.
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {items.map((item, index) => (
        <li key={item.id}>
          <Link href="/dashboard/channels" className="block">
            <SpotlightCard className="px-4 py-3.5 transition-all hover:scale-[1.01]">
              <div className="flex items-center gap-4">
                <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium">
                      {getContentTypeConfig(item.type).label}
                    </span>
                    <p className="truncate text-[14px] font-medium tracking-tight text-foreground">
                      {item.output.slice(0, 60)}
                    </p>
                  </div>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {new Date(item.createdAt).toLocaleDateString()} · Ready to schedule
                  </p>
                </div>
                <span className="hidden rounded-full border border-border/70 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground sm:inline-flex">
                  Draft
                </span>
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border text-foreground transition-transform duration-300 group-hover:rotate-45">
                  <svg viewBox="0 0 16 16" className="size-3" fill="none" aria-hidden>
                    <path
                      d="M4 12L12 4M12 4H6M12 4v6"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
            </SpotlightCard>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default ContentQueue;