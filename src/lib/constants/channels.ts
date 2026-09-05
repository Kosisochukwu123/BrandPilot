// src/lib/constants/channels.ts
import type { ChannelType } from "@prisma/client";

export interface ChannelConfig {
  type: ChannelType;
  label: string;
  colorVar: string; // matches tailwind.config.ts channel.* colors
  connectFlow: "oauth" | "none"; // WhatsApp has no per-user OAuth
  description: string;
}

export const CHANNELS: ChannelConfig[] = [
  { type: "INSTAGRAM", label: "Instagram", colorVar: "channel-instagram", connectFlow: "oauth", description: "Publish feed posts to your Instagram Business account." },
  { type: "FACEBOOK", label: "Facebook", colorVar: "channel-facebook", connectFlow: "oauth", description: "Publish posts to a Facebook Page you manage." },
  { type: "X", label: "X", colorVar: "channel-x", connectFlow: "oauth", description: "Post directly to your X account." },
  { type: "WHATSAPP", label: "WhatsApp Broadcast", colorVar: "channel-whatsapp", connectFlow: "none", description: "Schedule template-based broadcast messages to opted-in contacts." },
];

export function getChannelConfig(type: ChannelType): ChannelConfig {
  const found = CHANNELS.find((c) => c.type === type);
  if (!found) throw new Error(`Unknown channel: ${type}`);
  return found;
}