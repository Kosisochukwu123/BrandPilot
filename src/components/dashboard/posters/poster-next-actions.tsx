// src/components/dashboard/posters/poster-next-actions.tsx
"use client";

import Link from "next/link";
import { Download, Edit3, RefreshCw, BookmarkPlus, Send, MessageSquare, Hash, Megaphone } from "lucide-react";

interface PosterNextActionsProps {
  onDownload: () => void;
  onRegenerate: () => void;
  caption: string;
  contentId?: string;
}

export function PosterNextActions({ onDownload, onRegenerate, caption, contentId }: PosterNextActionsProps) {
  const actions = [
    { label: "Download PNG", icon: Download, onClick: onDownload },
    { label: "Generate More Variations", icon: RefreshCw, onClick: onRegenerate },
    { label: "Schedule to Instagram", icon: Send, href: "/dashboard/channels" },
    { label: "Schedule to Facebook", icon: Send, href: "/dashboard/channels" },
    {
      label: "Generate Matching Caption",
      icon: MessageSquare,
      href: `/dashboard/generate?topic=${encodeURIComponent(caption.slice(0, 100))}`,
    },
    { label: "Generate Ad Copy", icon: Megaphone, href: "/dashboard/generate" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {actions.map((action) => {
        const Icon = action.icon;
        const content = (
          <div className="flex flex-col items-center gap-2 rounded-lg border border-border p-4 text-center text-xs transition-colors hover:border-primary hover:bg-muted">
            <Icon className="h-4 w-4 text-primary" />
            {action.label}
          </div>
        );
        return action.href ? (
          <Link key={action.label} href={action.href}>{content}</Link>
        ) : (
          <button key={action.label} onClick={action.onClick}>{content}</button>
        );
      })}
    </div>
  );
}