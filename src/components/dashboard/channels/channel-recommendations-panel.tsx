// src/components/dashboard/channels/channel-recommendations-panel.tsx
"use client";

import { useEffect, useState } from "react";
import { getOrRefreshChannelRecommendations } from "@/server/actions/channel-recommendations";
import { Loader2, Clock, Hash, TrendingUp, Lightbulb } from "lucide-react";
import type { ChannelRecommendations } from "@/server/services/ai/channel-recommendations";

export function ChannelRecommendationsPanel({ channelId }: { channelId: string }) {
  const [data, setData] = useState<ChannelRecommendations | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getOrRefreshChannelRecommendations(channelId).then((result) => {
      if (!active) return;
      if (result.success) setData(result.data as ChannelRecommendations);
      setLoading(false);
    });
    return () => { active = false; };
  }, [channelId]);

  if (loading) {
    return (
      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
        <Loader2 className="h-3 w-3 animate-spin" /> Loading recommendations...
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="mt-4 space-y-3 border-t border-border pt-3 text-xs">
      <div className="flex items-start gap-2">
        <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        <div>
          <p className="font-medium">Best times: {data.bestPostingTimes.join(", ")}</p>
          <p className="text-muted-foreground">Suggested frequency: {data.suggestedFrequency}</p>
        </div>
      </div>

      {data.hashtags.length > 0 && (
        <div className="flex items-start gap-2">
          <Hash className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <div className="flex flex-wrap gap-1">
            {data.hashtags.map((tag) => (
              <span key={tag} className="rounded-full bg-muted px-2 py-0.5">#{tag.replace(/^#/, "")}</span>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-start gap-2">
        <TrendingUp className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        <p className="text-muted-foreground">{data.expectedEngagement}</p>
      </div>

      <div className="flex items-start gap-2">
        <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        <p className="text-muted-foreground">{data.contentTip}</p>
      </div>
    </div>
  );
}