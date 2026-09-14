"use client";

import { useState, useTransition } from "react";

import {
  deleteGeneratedContent,
  toggleFavorite,
  duplicateContent,
  regenerateContent,
} from "@/server/actions/content";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import {
  Copy,
  Trash2,
  Star,
  Files,
  RefreshCw,
  Image as ImageIcon,
  Check,
  Sparkles,
  Search,
  FileText,
} from "lucide-react";

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
  const [filter, setFilter] =
    useState<(typeof FILTERS)[number]>("All");
  const [isPending, startTransition] = useTransition();
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const visible = items.filter((item) => {
    if (filter === "All") return true;
    if (filter === "Favorites") return item.favorited;
    return item.group === filter;
  });

  function handleToggleFavorite(id: string) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, favorited: !item.favorited }
          : item
      )
    );

    startTransition(async () => {
      await toggleFavorite(id);
    });
  }

  function handleDelete(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));

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
      setItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                output: result.data!.output,
              }
            : item
        )
      );
    }
  }

  async function handleCopy(id: string, output: string) {
    await navigator.clipboard.writeText(output);

    setCopiedId(id);

    setTimeout(() => {
      setCopiedId(null);
    }, 1800);
  }

  function getGroupLabel(group: ContentItem["group"]) {
    if (group === "Social") return "Social";
    if (group === "Marketing") return "Marketing";
    return "SEO";
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5 rounded-xl border border-border/60 bg-muted/30 p-1.5">
          {FILTERS.map((filterOption) => {
            const count =
              filterOption === "All"
                ? items.length
                : filterOption === "Favorites"
                  ? items.filter((item) => item.favorited).length
                  : items.filter((item) => item.group === filterOption).length;

            return (
              <button
                key={filterOption}
                type="button"
                onClick={() => setFilter(filterOption)}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all",
                  filter === filterOption
                    ? "bg-background font-medium text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {filterOption === "Favorites" && (
                  <Star className="h-3.5 w-3.5" />
                )}

                {filterOption}

                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px]",
                    filter === filterOption
                      ? "bg-muted text-foreground"
                      : "bg-background/60 text-muted-foreground"
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <FileText className="h-3.5 w-3.5" />
          {visible.length}{" "}
          {visible.length === 1 ? "piece" : "pieces"} shown
        </div>
      </div>

      {/* Content */}
      <div className="mt-6">
        {visible.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/70 bg-muted/10 px-6 py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-background">
              {filter === "Favorites" ? (
                <Star className="h-5 w-5 text-muted-foreground" />
              ) : (
                <Search className="h-5 w-5 text-muted-foreground" />
              )}
            </div>

            <h3 className="mt-4 text-sm font-semibold">
              {filter === "Favorites"
                ? "No favorite content yet"
                : "Nothing here yet"}
            </h3>

            <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-muted-foreground">
              {filter === "Favorites"
                ? "Star content you want to keep close so you can find it quickly later."
                : "Generate some content and it will appear here in your library."}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {visible.map((item) => {
              const isRegenerating = regeneratingId === item.id;
              const isCopied = copiedId === item.id;

              return (
                <article
                  key={item.id}
                  className="group overflow-hidden rounded-2xl border border-border/70 bg-card transition-all duration-200 hover:border-border hover:shadow-sm"
                >
                  {/* Card header */}
                  <div className="flex flex-col gap-3 border-b border-border/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                        <Sparkles className="h-3.5 w-3.5 text-primary" />
                      </span>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-semibold">
                            {item.typeLabel}
                          </span>

                          <span className="rounded-full border border-border/60 bg-muted/40 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                            {getGroupLabel(item.group)}
                          </span>
                        </div>

                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {new Date(item.createdAt).toLocaleDateString(
                            undefined,
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleFavorite(item.id)}
                      aria-label={
                        item.favorited
                          ? "Remove from favorites"
                          : "Add to favorites"
                      }
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-lg border transition-all",
                        item.favorited
                          ? "border-primary/20 bg-primary/10"
                          : "border-transparent text-muted-foreground hover:border-border hover:bg-muted"
                      )}
                    >
                      <Star
                        className={cn(
                          "h-4 w-4 transition-all",
                          item.favorited
                            ? "fill-primary text-primary"
                            : "text-muted-foreground"
                        )}
                      />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="px-5 py-5">
                    <div
                      className={cn(
                        "rounded-xl border border-border/50 bg-muted/20 p-4",
                        isRegenerating && "animate-pulse"
                      )}
                    >
                      {isRegenerating ? (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Regenerating your content...
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap text-sm leading-7 text-foreground/90">
                          {item.output}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleCopy(item.id, item.output)
                        }
                        className="h-9"
                      >
                        {isCopied ? (
                          <>
                            <Check className="mr-1.5 h-3.5 w-3.5 text-primary" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="mr-1.5 h-3.5 w-3.5" />
                            Copy
                          </>
                        )}
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDuplicate(item.id)}
                        disabled={isPending}
                        className="h-9"
                      >
                        <Files className="mr-1.5 h-3.5 w-3.5" />
                        Duplicate
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRegenerate(item.id)}
                        disabled={isRegenerating || isPending}
                        className="h-9"
                      >
                        <RefreshCw
                          className={cn(
                            "mr-1.5 h-3.5 w-3.5",
                            isRegenerating && "animate-spin"
                          )}
                        />
                        {isRegenerating ? "Regenerating" : "Regenerate"}
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        asChild
                        className="h-9"
                      >
                        <a
                          href={`/dashboard/posters/new?caption=${encodeURIComponent(
                            item.output
                          )}&contentId=${item.id}`}
                        >
                          <ImageIcon className="mr-1.5 h-3.5 w-3.5" />
                          Create Poster
                        </a>
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(item.id)}
                        disabled={isPending}
                        className="h-9 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}