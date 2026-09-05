// src/components/dashboard/brand/brand-report-view.tsx
import type { BrandReport } from "@prisma/client";

interface AudienceRating { label: string; stars: number }
interface PersonalityTrait { trait: string; value: number }
interface PlatformRanking { platform: string; stars: number; reason: string }
interface Opportunity { title: string; detail: string }

function Stars({ count }: { count: number }) {
  return (
    <span className="text-primary">
      {"★".repeat(count)}
      <span className="text-muted-foreground">{"★".repeat(5 - count)}</span>
    </span>
  );
}

export function BrandReportView({ report }: { report: BrandReport }) {
  const audienceRatings = report.audienceRatings as unknown as AudienceRating[];
  const personality = report.personality as unknown as PersonalityTrait[];
  const platformRankings = report.platformRankings as unknown as PlatformRanking[];
  const opportunities = report.opportunities as unknown as Opportunity[];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Brand Report</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Generated {new Date(report.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Brand Score */}
      <div className="rounded-lg border border-border p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">Brand Health</h2>
          <span className="text-3xl font-semibold text-primary">{report.score}%</span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{report.scoreExplanation}</p>
      </div>

      {/* Summary */}
      <div className="rounded-lg border border-border p-6">
        <h2 className="font-medium">Brand Summary</h2>
        <p className="mt-2 text-sm text-muted-foreground">{report.summary}</p>
      </div>

      {/* Audience */}
      <div className="rounded-lg border border-border p-6">
        <h2 className="font-medium">Target Audience</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {audienceRatings.map((a) => (
            <div key={a.label} className="rounded-md bg-muted p-4 text-center">
              <p className="text-sm font-medium">{a.label}</p>
              <p className="mt-1"><Stars count={a.stars} /></p>
            </div>
          ))}
        </div>
      </div>

      {/* Personality sliders */}
      <div className="rounded-lg border border-border p-6">
        <h2 className="font-medium">Brand Personality</h2>
        <div className="mt-4 space-y-3">
          {personality.map((p) => (
            <div key={p.trait}>
              <div className="flex justify-between text-sm">
                <span>{p.trait}</span>
                <span className="text-muted-foreground">{p.value}/10</span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-muted">
                <div className="h-2 rounded-full bg-primary" style={{ width: `${p.value * 10}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Voice + colors + typography */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg border border-border p-6">
          <h2 className="font-medium">Brand Voice</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {report.voiceTags.map((tag) => (
              <span key={tag} className="rounded-full bg-muted px-3 py-1 text-xs">{tag}</span>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-border p-6">
          <h2 className="font-medium">Recommended Colors</h2>
          <div className="mt-3 flex gap-2">
            {report.colors.map((hex) => (
              <div key={hex} className="flex flex-col items-center gap-1">
                <div className="h-8 w-8 rounded-full border border-border" style={{ backgroundColor: hex }} />
                <span className="text-[10px] text-muted-foreground">{hex}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm text-muted-foreground">Typography style: {report.typography}</p>
        </div>
      </div>

      {/* Content pillars */}
      <div className="rounded-lg border border-border p-6">
        <h2 className="font-medium">Content Pillars</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {report.contentPillars.map((pillar) => (
            <span key={pillar} className="rounded-full border border-border px-3 py-1 text-xs">{pillar}</span>
          ))}
        </div>
      </div>

      {/* Platform rankings */}
      <div className="rounded-lg border border-border p-6">
        <h2 className="font-medium">Recommended Platforms</h2>
        <div className="mt-4 space-y-3">
          {platformRankings.map((p) => (
            <div key={p.platform} className="flex items-start justify-between border-b border-border pb-3 last:border-0">
              <div>
                <p className="text-sm font-medium">{p.platform}</p>
                <p className="text-xs text-muted-foreground">{p.reason}</p>
              </div>
              <Stars count={p.stars} />
            </div>
          ))}
        </div>
      </div>

      {/* Opportunities */}
      <div className="rounded-lg border border-border p-6">
        <h2 className="font-medium">AI Opportunities</h2>
        <div className="mt-4 space-y-4">
          {opportunities.map((o) => (
            <div key={o.title}>
              <p className="text-sm font-medium">{o.title}</p>
              <p className="text-sm text-muted-foreground">{o.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}