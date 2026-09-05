// src/components/dashboard/generate/generator-form.tsx
"use client";

import { useState } from "react";
import { CONTENT_TYPES } from "@/lib/constants/content-types";
import { saveGeneratedContent } from "@/server/actions/content";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2, Copy, Save, Sparkles } from "lucide-react";
import type { ContentType } from "@prisma/client";

const GROUPS = ["Social", "Marketing", "SEO"] as const;

interface GeneratorFormProps {
  brandName: string | null;
  contentPillars: string[];
}

export function GeneratorForm({ brandName, contentPillars }: GeneratorFormProps) {
  const [group, setGroup] = useState<(typeof GROUPS)[number]>("Social");
  const [type, setType] = useState<ContentType>("INSTAGRAM_CAPTION");
  const [topic, setTopic] = useState("");
  const [output, setOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const visibleTypes = CONTENT_TYPES.filter((c) => c.group === group);
  const activeConfig = CONTENT_TYPES.find((c) => c.value === type) ?? visibleTypes[0];

  async function handleGenerate() {
    setError(null);
    setSaved(false);
    setOutput("");
    setIsGenerating(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, topic }),
      });

      if (!res.ok) {
        setError(await res.text());
        return;
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) return;

      let full = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        setOutput(full);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleSave() {
    const result = await saveGeneratedContent(type, topic, output);
    if (result.success) setSaved(true);
  }

  function handleCopy() {
    navigator.clipboard.writeText(output);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-lg border border-border p-6">
        <div className="flex gap-2 border-b border-border pb-3">
          {GROUPS.map((g) => (
            <button
              key={g}
              onClick={() => {
                setGroup(g);
                setType(CONTENT_TYPES.find((c) => c.group === g)!.value);
              }}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm",
                group === g ? "bg-muted font-medium" : "text-muted-foreground"
              )}
            >
              {g}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {visibleTypes.map((c) => (
            <button
              key={c.value}
              onClick={() => setType(c.value)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm",
                type === c.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground"
              )}
            >
              {c.label}
            </button>
          ))}
        </div>

        {contentPillars.length > 0 && (
          <div className="mt-4">
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Sparkles className="h-3 w-3" /> From your Brand Report
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {contentPillars.slice(0, 5).map((pillar) => (
                <button
                  key={pillar}
                  type="button"
                  onClick={() => setTopic(pillar)}
                  className="rounded-full border border-dashed border-border px-3 py-1 text-xs text-muted-foreground hover:border-primary hover:text-foreground"
                >
                  {pillar}
                </button>
              ))}
            </div>
          </div>
        )}

        <label className="mt-5 block text-sm font-medium">What's this about?</label>
        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder={activeConfig?.placeholder}
          rows={4}
          className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
        />

        <Button className="mt-4" onClick={handleGenerate} disabled={isGenerating || topic.trim().length < 3}>
          {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : `Generate for ${brandName ?? "your brand"}`}
        </Button>

        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
      </div>

      <div className="rounded-lg border border-border p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Result</h3>
          {output && !isGenerating && (
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={handleCopy}>
                <Copy className="mr-1.5 h-3.5 w-3.5" /> Copy
              </Button>
              <Button size="sm" onClick={handleSave} disabled={saved}>
                <Save className="mr-1.5 h-3.5 w-3.5" /> {saved ? "Saved" : "Save"}
              </Button>
            </div>
          )}
        </div>
        <div className="mt-4 min-h-[200px] whitespace-pre-wrap rounded-md bg-muted p-4 text-sm">
          {output || <span className="text-muted-foreground">Your generated content will appear here.</span>}
        </div>
      </div>
    </div>
  );
}