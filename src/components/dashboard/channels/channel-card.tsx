// src/components/dashboard/channels/channel-card.tsx

"use client";

import { useTransition } from "react";

import type { Channel } from "@prisma/client";
import type { ChannelConfig } from "@/lib/constants/channels";

import { Button } from "@/components/ui/button";
import { disconnectChannel } from "@/server/actions/channels";
import { cn } from "@/lib/utils";

import { ChannelRecommendationsPanel } from "./channel-recommendations-panel";

import {
  CheckCircle2,
  ExternalLink,
  Instagram,
  Loader2,
  MessageCircle,
  Radio,
  Settings2,
  Unplug,
} from "lucide-react";

interface ChannelCardProps {
  config: ChannelConfig;
  connected: Channel | null;
}

function getChannelColor(colorVar: string) {
  const colors: Record<string, string> = {
    "channel-instagram": "#E1306C",
    "channel-facebook": "#1877F2",
    "channel-x": "#0F1419",
    "channel-whatsapp": "#25D366",
  };

  return colors[colorVar] ?? "hsl(var(--primary))";
}

function ChannelIcon({
  type,
  className,
}: {
  type: ChannelConfig["type"];
  className?: string;
}) {
  switch (type) {
    case "INSTAGRAM":
      return <Instagram className={className} />;

    case "FACEBOOK":
      return (
        <span
          className={cn(
            "font-bold leading-none",
            className
          )}
        >
          f
        </span>
      );

    case "X":
      return (
        <span
          className={cn(
            "font-semibold leading-none",
            className
          )}
        >
          𝕏
        </span>
      );

    case "WHATSAPP":
      return <MessageCircle className={className} />;

    default:
      return null;
  }
}

export function ChannelCard({
  config,
  connected,
}: ChannelCardProps) {
  const [isPending, startTransition] = useTransition();

  const isConnected = Boolean(connected);
  const color = getChannelColor(config.colorVar);

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-card transition-all duration-200",
        isConnected
          ? "border-primary/20 shadow-sm"
          : "border-border hover:border-primary/20 hover:shadow-sm"
      )}
    >
      {/* Platform accent */}
      <div
        className="absolute inset-x-0 top-0 h-0.5"
        style={{ backgroundColor: color }}
      />

      <div className="p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
              style={{
                backgroundColor: `${color}15`,
                color,
              }}
            >
              <ChannelIcon
                type={config.type}
                className="h-5 w-5"
              />
            </div>

            <div className="min-w-0">
              <h3 className="font-semibold">
                {config.label}
              </h3>

              <div className="mt-1 flex items-center gap-1.5">
                {isConnected ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" />

                    <span className="text-xs font-medium text-primary">
                      Connected
                    </span>
                  </>
                ) : (
                  <>
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />

                    <span className="text-xs text-muted-foreground">
                      Not connected
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Status */}
          <span
            className={cn(
              "shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider",
              isConnected
                ? "border-primary/20 bg-primary/5 text-primary"
                : "border-border bg-muted/50 text-muted-foreground"
            )}
          >
            {isConnected ? "Active" : "Available"}
          </span>
        </div>

        {/* Description */}
        <p className="mt-5 text-sm leading-6 text-muted-foreground">
          {config.description}
        </p>

        {/* Connected account */}
        {connected?.label && (
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-3">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
              style={{
                backgroundColor: `${color}15`,
                color,
              }}
            >
              <ChannelIcon
                type={config.type}
                className="h-4 w-4"
              />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Connected account
              </p>

              <p className="mt-0.5 truncate text-sm font-medium">
                {connected.label}
              </p>
            </div>

            <CheckCircle2 className="ml-auto h-4 w-4 shrink-0 text-primary" />
          </div>
        )}

        {/* Actions */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {isConnected ? (
            <>
              <Button
                size="sm"
                variant="outline"
                disabled={isPending}
                onClick={() =>
                  startTransition(async () => {
                    await disconnectChannel(
                      connected!.id
                    );
                  })
                }
                className="rounded-lg"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    Disconnecting...
                  </>
                ) : (
                  <>
                    <Unplug className="mr-1.5 h-3.5 w-3.5" />
                    Disconnect
                  </>
                )}
              </Button>

              {config.type === "WHATSAPP" && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="rounded-lg"
                  asChild
                >
                  <a href="/dashboard/channels/whatsapp-setup">
                    <Settings2 className="mr-1.5 h-3.5 w-3.5" />
                    Settings
                  </a>
                </Button>
              )}
            </>
          ) : config.connectFlow === "oauth" ? (
            <Button
              size="sm"
              className="rounded-lg"
              asChild
            >
              <a
                href={`/api/channels/${
                  config.type === "X" ? "x" : "meta"
                }/connect`}
              >
                Connect {config.label}
                <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
              </a>
            </Button>
          ) : (
            <Button
              size="sm"
              className="rounded-lg"
              asChild
            >
              <a href="/dashboard/channels/whatsapp-setup">
                <MessageCircle className="mr-1.5 h-3.5 w-3.5" />
                Set up broadcasts
              </a>
            </Button>
          )}
        </div>

        {/* Recommendations */}
        {connected && (
          <div className="mt-5 border-t border-border pt-5">
            <div className="mb-3 flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Radio className="h-3.5 w-3.5" />
              Channel recommendations
            </div>

            <ChannelRecommendationsPanel
              channelId={connected.id}
            />
          </div>
        )}
      </div>
    </div>
  );
}