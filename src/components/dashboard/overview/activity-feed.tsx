// src/components/dashboard/overview/activity-feed.tsx
import type { ActivityLog } from "@prisma/client";
import { Globe, Brain, Sparkles, ImageIcon, Send, Radio } from "lucide-react";

const ICONS: Record<ActivityLog["type"], typeof Globe> = {
  WEBSITE_ANALYZED: Globe,
  BRAND_BRAIN_UPDATED: Brain,
  CONTENT_GENERATED: Sparkles,
  POSTER_GENERATED: ImageIcon,
  CONTENT_PUBLISHED: Send,
  CHANNEL_CONNECTED: Radio,
};

// Helper to get relative time
function getTimeAgo(date: Date): string {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  const intervals = [
    { label: "y", seconds: 31536000 },
    { label: "mo", seconds: 2592000 },
    { label: "w", seconds: 604800 },
    { label: "d", seconds: 86400 },
    { label: "h", seconds: 3600 },
    { label: "m", seconds: 60 },
    { label: "s", seconds: 1 },
  ];
  
  for (const interval of intervals) {
    const count = Math.floor(diff / interval.seconds);
    if (count > 0) return `${count}${interval.label}`;
  }
  return "now";
}

export function ActivityFeed({ items }: { items: ActivityLog[] }) {
  if (items.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-border p-8 text-center text-[13px] text-muted-foreground">
        No activity yet — it'll show up here as you use BrandPilot.
      </p>
    );
  }

  return (
    <ol className="relative flex flex-col">
      {/* Timeline line */}
      <span
        aria-hidden
        className="absolute left-[3px] top-2 bottom-2 w-px bg-gradient-to-b from-foreground/25 via-border to-transparent"
      />
      
      {items.map((item) => {
        const Icon = ICONS[item.type];
        return (
          <li key={item.id} className="group relative flex gap-4 py-3 pl-5">
            {/* Timeline dot with icon */}
            <span className="absolute left-0 top-[18px] flex size-[7px] items-center justify-center rounded-full border border-border bg-background transition-colors duration-300 group-hover:border-accent group-hover:bg-accent">
              <Icon className="hidden size-3 text-muted-foreground group-hover:block" />
            </span>
            
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium tracking-tight text-foreground">
                {item.message}
              </p>
              <p className="mt-0.5 truncate text-[12px] text-muted-foreground">
                {item.type.replace(/_/g, " ").toLowerCase()}
              </p>
            </div>
            
            <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              {getTimeAgo(new Date(item.createdAt))}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export default ActivityFeed;