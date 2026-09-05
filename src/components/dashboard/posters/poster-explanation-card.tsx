// src/components/dashboard/posters/poster-explanation-card.tsx
import { Sparkles } from "lucide-react";

export function PosterExplanationCard({ points }: { points: string[] }) {
  if (points.length === 0) return null;
  return (
    <div className="rounded-lg border border-border p-5">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <h3 className="font-medium">Why this design?</h3>
      </div>
      <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
        {points.map((point) => (
          <li key={point} className="flex gap-2">
            <span className="text-primary">•</span> {point}
          </li>
        ))}
      </ul>
    </div>
  );
}