// src/components/dashboard/generate/generator-form.tsx

"use client";

import { useState } from "react";

import { CONTENT_TYPES } from "@/lib/constants/content-types";
import { saveGeneratedContent } from "@/server/actions/content";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import {
  AlertCircle,
  Check,
  CheckCircle2,
  Clipboard,
  Copy,
  FileText,
  Hash,
  Instagram,
  Loader2,
  MessageSquare,
  Save,
  Search,
  Sparkles,
  WandSparkles,
} from "lucide-react";

import type { ContentType } from "@prisma/client";

const GROUPS = ["Social", "Marketing", "SEO"] as const;

interface GeneratorFormProps {
  brandName: string | null;
  contentPillars: string[];
}

export function GeneratorForm({
  brandName,
  contentPillars,
}: GeneratorFormProps) {
  const [group, setGroup] =
    useState<(typeof GROUPS)[number]>("Social");

  const [type, setType] =
    useState<ContentType>("INSTAGRAM_CAPTION");

  const [topic, setTopic] = useState("");
  const [output, setOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const visibleTypes = CONTENT_TYPES.filter(
    (c) => c.group === group
  );

  const activeConfig =
    CONTENT_TYPES.find((c) => c.value === type) ??
    visibleTypes[0];

  async function handleGenerate() {
    setError(null);
    setSaved(false);
    setCopied(false);
    setOutput("");
    setIsGenerating(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          topic,
        }),
      });

      if (!res.ok) {
        setError(await res.text());
        return;
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        setError("Unable to read the generated response.");
        return;
      }

      let full = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        full += decoder.decode(value, {
          stream: true,
        });

        setOutput(full);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleSave() {
    if (!output) return;

    const result = await saveGeneratedContent(
      type,
      topic,
      output
    );

    if (result.success) {
      setSaved(true);
    }
  }

  async function handleCopy() {
    if (!output) return;

    await navigator.clipboard.writeText(output);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  function getTypeIcon(value: ContentType) {
    if (value.includes("INSTAGRAM")) return Instagram;
    if (value.includes("SEO")) return Search;
    if (value.includes("EMAIL")) return MessageSquare;
    if (value.includes("BLOG")) return FileText;
    if (value.includes("META")) return Hash;

    return FileText;
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
      {/* ========================================================= */}
      {/* LEFT — GENERATOR                                          */}
      {/* ========================================================= */}

      <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {/* Header */}
        <div className="border-b border-border px-5 py-5 sm:px-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <WandSparkles className="h-5 w-5" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-semibold">
                  Create content
                </h2>

                <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary">
                  AI
                </span>
              </div>

              <p className="mt-1 text-sm text-muted-foreground">
                Choose what you want to create and give the AI
                some direction.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6 p-5 sm:p-6">
          {/* Content category */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <label className="text-sm font-semibold">
                Content category
              </label>

              <span className="text-xs text-muted-foreground">
                01
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 rounded-xl bg-muted/50 p-1">
              {GROUPS.map((g) => {
                const active = group === g;

                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => {
                      setGroup(g);

                      const firstType = CONTENT_TYPES.find(
                        (c) => c.group === g
                      );

                      if (firstType) {
                        setType(firstType.value);
                      }
                    }}
                    className={cn(
                      "rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                      active
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {g}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content type */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <label className="text-sm font-semibold">
                What are you creating?
              </label>

              <span className="text-xs text-muted-foreground">
                02
              </span>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              {visibleTypes.map((c) => {
                const active = type === c.value;
                const Icon = getTypeIcon(c.value);

                return (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => {
                      setType(c.value);
                      setSaved(false);
                    }}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-xl border p-3 text-left transition-all",
                      active
                        ? "border-primary/50 bg-primary/5 shadow-sm"
                        : "border-border bg-background hover:border-primary/30 hover:bg-muted/30"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors",
                        active
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground group-hover:text-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p
                        className={cn(
                          "truncate text-sm font-medium",
                          active
                            ? "text-foreground"
                            : "text-muted-foreground group-hover:text-foreground"
                        )}
                      >
                        {c.label}
                      </p>
                    </div>

                    {active && (
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check className="h-3 w-3" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Brand report suggestions */}
          {contentPillars.length > 0 && (
            <div className="rounded-xl border border-dashed border-primary/20 bg-primary/[0.03] p-4">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>

                <div>
                  <p className="text-xs font-semibold">
                    Ideas from your Brand Brain
                  </p>

                  <p className="text-[11px] text-muted-foreground">
                    Use one as a starting point
                  </p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {contentPillars.slice(0, 5).map((pillar) => (
                  <button
                    key={pillar}
                    type="button"
                    onClick={() => setTopic(pillar)}
                    className={cn(
                      "rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground transition-all",
                      "hover:border-primary/40 hover:bg-primary/5 hover:text-foreground",
                      topic === pillar &&
                        "border-primary/40 bg-primary/10 text-foreground"
                    )}
                  >
                    {pillar}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Topic */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <label
                htmlFor="content-topic"
                className="text-sm font-semibold"
              >
                What's this about?
              </label>

              <span className="text-xs text-muted-foreground">
                03
              </span>
            </div>

            <div className="relative">
              <textarea
                id="content-topic"
                value={topic}
                onChange={(e) => {
                  setTopic(e.target.value);
                  setSaved(false);
                }}
                placeholder={
                  activeConfig?.placeholder ??
                  "Tell us what you want to create..."
                }
                rows={6}
                className={cn(
                  "w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm",
                  "placeholder:text-muted-foreground/60",
                  "outline-none transition-all",
                  "focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
                )}
              />

              <div className="pointer-events-none absolute bottom-3 right-3 text-[10px] text-muted-foreground">
                {topic.length} characters
              </div>
            </div>

            <p className="mt-2 text-xs text-muted-foreground">
              The more context you give, the more relevant your
              content will be.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />

              <div>
                <p className="text-sm font-medium text-red-500">
                  Generation failed
                </p>

                <p className="mt-1 text-xs text-red-500/80">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* Generate */}
          <Button
            type="button"
            className="h-11 w-full rounded-xl"
            onClick={handleGenerate}
            disabled={
              isGenerating || topic.trim().length < 3
            }
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating your content...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate for {brandName ?? "your brand"}
              </>
            )}
          </Button>
        </div>
      </section>

      {/* ========================================================= */}
      {/* RIGHT — RESULT                                             */}
      {/* ========================================================= */}

      <section className="flex min-h-[500px] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>

            <div>
              <h2 className="font-semibold">
                Generated content
              </h2>

              <p className="text-xs text-muted-foreground">
                Your AI output will appear here
              </p>
            </div>
          </div>

          {output && !isGenerating && (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopy}
                className="h-8 rounded-lg px-2.5 sm:px-3"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                    <span className="hidden sm:inline">
                      Copied
                    </span>
                  </>
                ) : (
                  <>
                    <Copy className="mr-1.5 h-3.5 w-3.5" />
                    <span className="hidden sm:inline">
                      Copy
                    </span>
                  </>
                )}
              </Button>

              <Button
                size="sm"
                onClick={handleSave}
                disabled={saved}
                className="h-8 rounded-lg px-2.5 sm:px-3"
              >
                {saved ? (
                  <>
                    <Check className="mr-1.5 h-3.5 w-3.5" />
                    <span className="hidden sm:inline">
                      Saved
                    </span>
                  </>
                ) : (
                  <>
                    <Save className="mr-1.5 h-3.5 w-3.5" />
                    <span className="hidden sm:inline">
                      Save
                    </span>
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Result body */}
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          {isGenerating ? (
            <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 p-8 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Sparkles className="h-5 w-5 animate-pulse" />
              </div>

              <p className="mt-4 text-sm font-medium">
                Creating your content...
              </p>

              <p className="mt-1 max-w-xs text-xs text-muted-foreground">
                BrandPilot is writing in your brand voice.
              </p>

              <div className="mt-5 flex items-center gap-1">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" />
              </div>
            </div>
          ) : output ? (
            <div className="flex flex-1 flex-col">
              <div className="flex-1 whitespace-pre-wrap rounded-xl border border-border bg-muted/20 p-5 text-sm leading-7 text-foreground">
                {output}
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {output.length.toLocaleString()} characters
                </span>

                {saved && (
                  <span className="flex items-center gap-1.5 text-primary">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Saved to your content library
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 p-8 text-center">
              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                  <WandSparkles className="h-6 w-6 text-muted-foreground" />
                </div>

                <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border border-border bg-background">
                  <Sparkles className="h-2.5 w-2.5 text-primary" />
                </div>
              </div>

              <h3 className="mt-5 text-sm font-semibold">
                Nothing here yet
              </h3>

              <p className="mt-1 max-w-xs text-xs leading-5 text-muted-foreground">
                Choose a content type, describe what you want,
                and BrandPilot will create it for you.
              </p>

              <div className="mt-5 flex flex-wrap justify-center gap-2">
                <span className="rounded-full bg-muted px-3 py-1 text-[10px] text-muted-foreground">
                  Brand-aware
                </span>

                <span className="rounded-full bg-muted px-3 py-1 text-[10px] text-muted-foreground">
                  AI-powered
                </span>

                <span className="rounded-full bg-muted px-3 py-1 text-[10px] text-muted-foreground">
                  Ready to use
                </span>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}