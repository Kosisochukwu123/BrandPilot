// src/components/dashboard/content/content-list.tsx
"use client";

import { useState, useTransition } from "react";
import { deleteGeneratedContent, toggleFavorite, duplicateContent, regenerateContent } from "@/server/actions/content";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Copy, Trash2, Star, Files, RefreshCw, Image as ImageIcon } from "lucide-react";

interface ContentItem {
  id: string;
  type: string;
  typeLabel: string;
  group: "Social" | "Marketing" | "SEO";
  output: string;
  favorited: boolean;
  createdAt: string;
}

const FILTERS = ["All", "Favorites", "Social", "Marketing", "SEO"] as const;

export function ContentList({ items: initialItems }: { items: ContentItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [isPending, startTransition] = useTransition();
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);

  const visible = items.filter((item) => {
    if (filter === "All") return true;
    if (filter === "Favorites") return item.favorited;
    return item.group === filter;
  });

  // Fixed: Added async/await wrapper block
  function handleToggleFavorite(id: string) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, favorited: !i.favorited } : i)));
    startTransition(async () => {
      await toggleFavorite(id);
    });
  }

  // Fixed: Added async/await wrapper block
  function handleDelete(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
    startTransition(async () => {
      await deleteGeneratedContent(id);
    });
  }

  function handleDuplicate(id: string) {
    startTransition(async () => {
      await duplicateContent(id);
      window.location.reload(); 
    });
  }

  async function handleRegenerate(id: string) {
    setRegeneratingId(id);
    const result = await regenerateContent(id);
    setRegeneratingId(null);
    if (result.success && result.data) {
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, output: result.data!.output } : i)));
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 border-b border-border pb-3">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm",
              filter === f ? "bg-muted font-medium" : "text-muted-foreground"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-3">
        {visible.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nothing here yet.</p>
        ) : (
          visible.map((item) => (
            <div key={item.id} className="rounded-lg border border-border p-4">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs">{item.typeLabel}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                  <button onClick={() => handleToggleFavorite(item.id)} aria-label="Favorite">
                    <Star
                      className={cn(
                        "h-4 w-4",
                        item.favorited ? "fill-primary text-primary" : "text-muted-foreground"
                      )}
                    />
                  </button>
                </div>
              </div>

              <p className="mt-3 whitespace-pre-wrap text-sm">
                {regeneratingId === item.id ? (
                  <span className="text-muted-foreground">Regenerating...</span>
                ) : (
                  item.output
                )}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(item.output)}>
                  <Copy className="mr-1.5 h-3.5 w-3.5" /> Copy
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDuplicate(item.id)} disabled={isPending}>
                  <Files className="mr-1.5 h-3.5 w-3.5" /> Duplicate
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRegenerate(item.id)}
                  disabled={regeneratingId === item.id}
                >
                  <RefreshCw className={cn("mr-1.5 h-3.5 w-3.5", regeneratingId === item.id && "animate-spin")} />
                  Regenerate
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <a href={`/dashboard/posters/new?caption=${encodeURIComponent(item.output)}&contentId=${item.id}`}>
                    <ImageIcon className="mr-1.5 h-3.5 w-3.5" /> Create Poster
                  </a>
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(item.id)} disabled={isPending}>
                  <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
