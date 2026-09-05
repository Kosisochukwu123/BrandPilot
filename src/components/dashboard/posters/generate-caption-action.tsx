// src/components/dashboard/posters/generate-caption-action.tsx
"use client";

import { useState } from "react";
import { generateCaptionForPoster } from "@/server/actions/poster-caption";
import { Button } from "@/components/ui/button";
import { MessageSquare, Copy, Loader2 } from "lucide-react";

export function GenerateCaptionAction({ posterId }: { posterId: string }) {
  const [output, setOutput] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setIsLoading(true);
    setError(null);
    const result = await generateCaptionForPoster(posterId);
    setIsLoading(false);
    if (!result.success) {
      setError(result.error ?? "Failed to generate caption");
      return;
    }
    setOutput(result.data!.output);
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={isLoading}
        className="flex w-full flex-col items-center gap-2 rounded-lg border border-border p-4 text-center text-xs transition-colors hover:border-primary hover:bg-muted"
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : <MessageSquare className="h-4 w-4 text-primary" />}
        Generate Matching Caption
      </button>

      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}

      {output && (
        <div className="mt-2 rounded-md bg-muted p-3 text-xs">
          <p className="whitespace-pre-wrap">{output}</p>
          <button
            onClick={() => navigator.clipboard.writeText(output)}
            className="mt-2 flex items-center gap-1 text-primary"
          >
            <Copy className="h-3 w-3" /> Copy
          </button>
        </div>
      )}
    </div>
  );
}