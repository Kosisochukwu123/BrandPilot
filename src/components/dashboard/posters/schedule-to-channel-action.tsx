// src/components/dashboard/posters/schedule-to-channel-action.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getConnectedChannel, schedulePosterToChannel } from "@/server/actions/schedule-poster";
import { Send, Loader2 } from "lucide-react";
import type { ChannelType } from "@prisma/client";

interface ScheduleToChannelActionProps {
  posterId: string;
  channelType: ChannelType;
  label: string;
}

export function ScheduleToChannelAction({ posterId, channelType, label }: ScheduleToChannelActionProps) {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [scheduledAt, setScheduledAt] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    getConnectedChannel(channelType).then((c) => setIsConnected(!!c));
  }, [channelType]);

  async function handleSchedule() {
    if (!scheduledAt) {
      setMessage("Pick a date and time first");
      return;
    }
    setIsSaving(true);
    const result = await schedulePosterToChannel({
      posterId,
      channelType,
      scheduledAt: new Date(scheduledAt).toISOString(),
    });
    setIsSaving(false);
    setMessage(result.success ? "Scheduled." : result.error ?? "Failed to schedule");
    if (result.success) setShowForm(false);
  }

  if (isConnected === null) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-lg border border-border p-4 text-center text-xs opacity-50">
        <Loader2 className="h-4 w-4 animate-spin" />
        {label}
      </div>
    );
  }

  if (!isConnected) {
    return (
      <Link
        href="/dashboard/channels"
        className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground hover:border-primary hover:text-foreground"
      >
        <Send className="h-4 w-4" />
        Connect to {label.replace("Schedule to ", "")}
      </Link>
    );
  }

  return (
    <div>
      <button
        onClick={() => setShowForm((v) => !v)}
        className="flex w-full flex-col items-center gap-2 rounded-lg border border-border p-4 text-center text-xs transition-colors hover:border-primary hover:bg-muted"
      >
        <Send className="h-4 w-4 text-primary" />
        {label}
      </button>

      {showForm && (
        <div className="mt-2 space-y-2 rounded-md border border-border p-3">
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-xs"
          />
          <button
            onClick={handleSchedule}
            disabled={isSaving}
            className="w-full rounded-md bg-primary py-1.5 text-xs text-primary-foreground"
          >
            {isSaving ? "Scheduling..." : "Confirm schedule"}
          </button>
        </div>
      )}

      {message && <p className="mt-1 text-xs text-muted-foreground">{message}</p>}
    </div>
  );
}