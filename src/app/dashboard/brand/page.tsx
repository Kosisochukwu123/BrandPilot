import { auth } from "@/lib/auth";
import { getBrand } from "@/server/actions/brand";

import { AnalyzePanel } from "@/components/dashboard/brand/analyze-panel";
import { PreferencesForm } from "@/components/dashboard/brand/preferences-form";
import { OnboardingWizard } from "@/components/dashboard/brand/onboarding-wizard";

export default async function BrandAnalysisPage() {
  const session = await auth();
  const brand = session?.user?.id
    ? await getBrand(session.user.id)
    : null;

  // First-time users get the guided wizard.
  if (!brand) {
    return (
      <main className="min-h-screen px-4 pb-12 pt-24 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <OnboardingWizard />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 pb-16 pt-24 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        {/* Header */}
        <section className="relative mb-8 overflow-hidden rounded-3xl border border-border/60 bg-card/50 px-6 py-8 shadow-sm backdrop-blur-xl sm:px-8 lg:px-10">
          {/* Decorative glow */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 left-1/3 h-48 w-48 rounded-full bg-primary/5 blur-3xl" />

          <div className="relative">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_12px_hsl(var(--primary))]" />
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Brand Intelligence
              </span>
            </div>

            <div className="max-w-3xl">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                Build your{" "}
                <span className="text-primary">Brand Brain.</span>
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                Give BrandPilot the information it needs to understand your
                business, voice, audience, and identity. Everything you create
                later will use this information to stay on-brand.
              </p>
            </div>

            {/* Quick status */}
            <div className="mt-7 flex flex-wrap gap-3">
              <div className="rounded-full border border-border/70 bg-background/50 px-4 py-2 text-xs text-muted-foreground">
                <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-primary" />
                Brand profile
              </div>

              <div className="rounded-full border border-border/70 bg-background/50 px-4 py-2 text-xs text-muted-foreground">
                Website analysis
              </div>

              <div className="rounded-full border border-border/70 bg-background/50 px-4 py-2 text-xs text-muted-foreground">
                AI personalization
              </div>
            </div>
          </div>
        </section>

        {/* Main workspace */}
        <section className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          {/* Website analysis */}
          <div className="min-w-0">
            <div className="mb-3 px-1">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                Step 01
              </p>

              <h2 className="mt-1 text-lg font-semibold">
                Analyze your presence
              </h2>
            </div>

            <div className="overflow-hidden rounded-3xl border border-border/60 bg-card/60 shadow-sm backdrop-blur-xl">
              <AnalyzePanel />
            </div>
          </div>

          {/* Brand preferences */}
          <div className="min-w-0">
            <div className="mb-3 px-1">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                Step 02
              </p>

              <h2 className="mt-1 text-lg font-semibold">
                Define your brand
              </h2>
            </div>

            <div className="overflow-hidden rounded-3xl border border-border/60 bg-card/60 shadow-sm backdrop-blur-xl">
              <PreferencesForm
                initial={{
                  brandName: brand?.brandName ?? null,
                  websiteUrl: brand?.websiteUrl ?? null,
                  instagramHandle: brand?.instagramHandle ?? null,
                  whatsappNumber: brand?.whatsappNumber ?? null,
                  businessType: brand?.businessType ?? null,
                  tone: brand?.tone ?? null,
                  audience: brand?.audience ?? null,
                  keywords: brand?.keywords ?? [],
                }}
              />
            </div>
          </div>
        </section>

        {/* Bottom helper */}
        <section className="mt-6 rounded-2xl border border-border/50 bg-muted/20 px-5 py-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium">
                Your Brand Brain powers everything you create.
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                You can always come back and update these details as your
                brand evolves.
              </p>
            </div>

            <div className="text-xs font-medium text-primary">
              Always editable
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}