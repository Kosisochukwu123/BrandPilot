// src/app/dashboard/channels/page.tsx

import { auth } from "@/lib/auth";
import { listChannels } from "@/server/actions/channels";
import { CHANNELS } from "@/lib/constants/channels";
import { ChannelCard } from "@/components/dashboard/channels/channel-card";

import {
  ArrowUpRight,
  CheckCircle2,
  Link2,
  Radio,
  Sparkles,
} from "lucide-react";

export default async function ChannelsPage() {
  const session = await auth();

  const channels = session?.user?.id
    ? await listChannels(session.user.id)
    : [];

  const connectedCount = channels.length;
  const totalChannels = CHANNELS.length;

  return (
    <main className="min-h-screen px-4 pb-16 pt-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* ====================================================== */}
        {/* HEADER                                                 */}
        {/* ====================================================== */}

        <section className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          {/* Decorative glow */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative p-6 sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary">
                  <Radio className="h-3.5 w-3.5" />
                  Publishing channels
                </div>

                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  Connect your channels
                </h1>

                <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
                  Connect the platforms where your content lives.
                  Once connected, BrandPilot can prepare and manage
                  content for each channel.
                </p>
              </div>

              {/* Connection summary */}
              <div className="shrink-0 rounded-xl border border-border bg-background/70 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Link2 className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-2xl font-semibold leading-none">
                      {connectedCount}
                      <span className="text-muted-foreground">
                        /{totalChannels}
                      </span>
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      channels connected
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================== */}
        {/* CHANNELS                                                */}
        {/* ====================================================== */}

        <section className="mt-8">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">
                Your channels
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Connect a platform to start building your publishing
                workflow.
              </p>
            </div>

            {connectedCount > 0 && (
              <div className="hidden items-center gap-1.5 text-xs text-primary sm:flex">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {connectedCount} connected
              </div>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {CHANNELS.map((config) => (
              <ChannelCard
                key={config.type}
                config={config}
                connected={
                  channels.find(
                    (channel) => channel.type === config.type
                  ) ?? null
                }
              />
            ))}
          </div>
        </section>

        {/* ====================================================== */}
        {/* HELPER                                                  */}
        {/* ====================================================== */}

        <section className="mt-8 overflow-hidden rounded-2xl border border-border bg-muted/20">
          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Sparkles className="h-4 w-4" />
              </div>

              <div>
                <p className="text-sm font-medium">
                  Your content stays brand-aware
                </p>

                <p className="mt-1 max-w-2xl text-xs leading-5 text-muted-foreground">
                  BrandPilot uses your Brand Brain when generating
                  content, so your posts stay aligned with your
                  voice, audience, and positioning.
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
              Manage your workflow
              <ArrowUpRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}