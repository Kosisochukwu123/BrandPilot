// src/components/admin/content-moderation-list.tsx
"use client";

import { useState, useTransition } from "react";
import { adminDeleteContent, adminDeletePoster } from "@/server/actions/admin-content";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import type { GeneratedContent, Poster } from "@prisma/client";

type ContentWithUser = GeneratedContent & { user: { email: string } };
type PosterWithUser = Poster & { user: { email: string } };

export function ContentModerationList({ content, posters }: { content: ContentWithUser[]; posters: PosterWithUser[] }) {
  const [tab, setTab] = useState<"content" | "posters">("content");
  const [isPending, startTransition] = useTransition();
  const [removed, setRemoved] = useState<Set<string>>(new Set());

  return (
    <div>
      <div className="flex gap-2 border-b border-border pb-3">
        <button
          onClick={() => setTab("content")}
          className={`rounded-md px-3 py-1.5 text-sm ${tab === "content" ? "bg-muted font-medium" : "text-muted-foreground"}`}
        >
          Generated Content ({content.length})
        </button>
        <button
          onClick={() => setTab("posters")}
          className={`rounded-md px-3 py-1.5 text-sm ${tab === "posters" ? "bg-muted font-medium" : "text-muted-foreground"}`}
        >
          Posters ({posters.length})
        </button>
      </div>

      {tab === "content" && (
        <div className="mt-4 space-y-2">
          {content.filter((c) => !removed.has(c.id)).map((c) => (
            <div key={c.id} className="flex items-start justify-between rounded-md border border-border p-3 text-sm">
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">{c.user.email} · {c.type}</p>
                <p className="mt-1 truncate">{c.output}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                disabled={isPending}
                onClick={() =>
                  startTransition(async () => {
                    await adminDeleteContent(c.id);
                    setRemoved((prev) => new Set(prev).add(c.id));
                  })
                }
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {tab === "posters" && (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {posters.filter((p) => !removed.has(p.id)).map((p) => (
            <div key={p.id} className="overflow-hidden rounded-md border border-border">
              {p.backgroundUrl && <img src={p.backgroundUrl} alt="" className="aspect-square w-full object-cover" />}
              <div className="p-2">
                <p className="truncate text-xs text-muted-foreground">{p.user.email}</p>
                <p className="truncate text-xs">{p.headline}</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-1 w-full"
                  disabled={isPending}
                  onClick={() =>
                    startTransition(async () => {
                      await adminDeletePoster(p.id);
                      setRemoved((prev) => new Set(prev).add(p.id));
                    })
                  }
                >
                  <Trash2 className="mr-1 h-3 w-3" /> Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}