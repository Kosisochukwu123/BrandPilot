// src/app/admin/analytics/page.tsx
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";

export default async function AdminAnalyticsPage() {
  const admin = await requireAdmin();
  if (!admin.ok) redirect("/dashboard");

  // Content generated per type, all-time — shows which features are
  // actually getting used.
  const contentByType = await db.generatedContent.groupBy({
    by: ["type"],
    _count: { type: true },
    orderBy: { _count: { type: "desc" } },
  });

  // Posters by status — surfaces how often generation is failing, a
  // real operational signal.
  const postersByStatus = await db.poster.groupBy({
    by: ["status"],
    _count: { status: true },
  });

  // Channel connections by type — shows platform adoption.
  const channelsByType = await db.channel.groupBy({
    by: ["type"],
    _count: { type: true },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold">Analytics</h1>
      <p className="mt-1 text-sm text-muted-foreground">Usage breakdown across the platform.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-lg border border-border p-5">
          <h2 className="font-medium">Content by type</h2>
          <div className="mt-3 space-y-2 text-sm">
            {contentByType.map((c) => (
              <div key={c.type} className="flex justify-between">
                <span className="text-muted-foreground">{c.type}</span>
                <span className="font-medium">{c._count.type}</span>
              </div>
            ))}
            {contentByType.length === 0 && <p className="text-muted-foreground">No data yet</p>}
          </div>
        </div>

        <div className="rounded-lg border border-border p-5">
          <h2 className="font-medium">Posters by status</h2>
          <div className="mt-3 space-y-2 text-sm">
            {postersByStatus.map((p) => (
              <div key={p.status} className="flex justify-between">
                <span className="text-muted-foreground">{p.status}</span>
                <span className="font-medium">{p._count.status}</span>
              </div>
            ))}
            {postersByStatus.length === 0 && <p className="text-muted-foreground">No data yet</p>}
          </div>
        </div>

        <div className="rounded-lg border border-border p-5">
          <h2 className="font-medium">Channels connected</h2>
          <div className="mt-3 space-y-2 text-sm">
            {channelsByType.map((c) => (
              <div key={c.type} className="flex justify-between">
                <span className="text-muted-foreground">{c.type}</span>
                <span className="font-medium">{c._count.type}</span>
              </div>
            ))}
            {channelsByType.length === 0 && <p className="text-muted-foreground">No data yet</p>}
          </div>
        </div>
      </div>
    </div>
  );
}