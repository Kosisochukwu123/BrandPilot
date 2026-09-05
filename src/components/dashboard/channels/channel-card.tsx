// src/components/dashboard/channels/channel-card.tsx
"use client";

import { useTransition } from "react";
import type { Channel } from "@prisma/client";
import type { ChannelConfig } from "@/lib/constants/channels";
import { Button } from "@/components/ui/button";
import { disconnectChannel } from "@/server/actions/channels";
import { cn } from "@/lib/utils";
import { ChannelRecommendationsPanel } from "./channel-recommendations-panel";


interface ChannelCardProps {
    config: ChannelConfig;
    connected: Channel | null;
}

export function ChannelCard({ config, connected }: ChannelCardProps) {
    const [isPending, startTransition] = useTransition();

    return (
        <div className="rounded-lg border border-border p-5">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: `var(--tw-color-${config.colorVar})` }}
                    />
                    <h3 className="font-medium">{config.label}</h3>
                </div>
                <span
                    className={cn(
                        "rounded-full px-2 py-0.5 text-xs",
                        connected ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    )}
                >
                    {connected ? "Connected" : "Not connected"}
                </span>
            </div>

            <p className="mt-2 text-sm text-muted-foreground">{config.description}</p>
            {connected?.label && <p className="mt-2 text-sm">{connected.label}</p>}

            <div className="mt-4">
                {connected ? (
                    <Button
                        size="sm"
                        variant="outline"
                        disabled={isPending}
                        // onClick={() => startTransition(() => disconnectChannel(connected.id))}
                        onClick={() =>
                            startTransition(async () => {
                                await disconnectChannel(connected.id);
                            })
                        }
                    >
                        Disconnect
                    </Button>
                ) : config.connectFlow === "oauth" ? (
                    <Button size="sm" asChild>
                        <a href={`/api/channels/${config.type === "X" ? "x" : "meta"}/connect`}>Connect</a>
                    </Button>
                ) : (
                    <Button size="sm" asChild>
                        <a href="/dashboard/channels/whatsapp-setup">Set up broadcasts</a>
                    </Button>
                )}
            </div>

            {connected && <ChannelRecommendationsPanel channelId={connected.id} />}
        </div>
    );
}