// src/app/dashboard/channels/page.tsx
import { auth } from "@/lib/auth";
import { listChannels } from "@/server/actions/channels";
import { CHANNELS } from "@/lib/constants/channels";
import { ChannelCard } from "@/components/dashboard/channels/channel-card";

export default async function ChannelsPage() {
  const session = await auth();
  const channels = session?.user?.id ? await listChannels(session.user.id) : [];

  return (
    <div>
      <h1 className="text-2xl font-semibold">Channels</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Connect where your content gets published — each platform has its own queue.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {CHANNELS.map((config) => (
          <ChannelCard
            key={config.type}
            config={config}
            connected={channels.find((c) => c.type === config.type) ?? null}
          />
        ))}
      </div>
    </div>
  );
}