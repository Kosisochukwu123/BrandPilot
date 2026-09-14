import { auth } from "@/lib/auth";
import { getBrandContext } from "@/server/services/brand-context";
import { GeneratorForm } from "@/components/dashboard/generate/generator-form";
import Link from "next/link";

import {
  ArrowRight,
  FileText,
  Lightbulb,
  Sparkles,
  WandSparkles,
} from "lucide-react";

export default async function ContentGeneratorPage() {
  const session = await auth();

  const { brand, report } = session?.user?.id
    ? await getBrandContext(session.user.id)
    : { brand: null, report: null };

  if (!brand) {
    return (
      <main className="min-h-screen px-4 pb-16 pt-24 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-5xl">
          <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/60 px-6 py-10 text-center shadow-sm backdrop-blur-xl sm:px-10 lg:py-14">
            <div className="pointer-events-none absolute left-1/2 top-0 h-56 w-56 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

            <div className="relative mx-auto flex max-w-2xl flex-col items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
                <WandSparkles className="h-6 w-6 text-primary" />
              </div>

              <div className="mt-6">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
                  Content Studio
                </p>

                <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                  Your content starts with your Brand Brain.
                </h1>

                <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
                  Set up your brand first so BrandPilot can create content
                  that sounds like your business instead of generic AI copy.
                </p>
              </div>

              <Link
                href="/dashboard/brand"
                className="mt-8 inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
              >
                Set up Brand Brain
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 pb-16 pt-24 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        {/* Page header */}
        <section className="relative mb-7 overflow-hidden rounded-3xl border border-border/60 bg-card/50 px-6 py-8 shadow-sm backdrop-blur-xl sm:px-8 lg:px-10">
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/20 bg-primary/10">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>

                <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  Content Studio
                </span>
              </div>

              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                What are we creating?
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                Turn an idea into content tailored to{" "}
                <span className="font-medium text-foreground">
                  {brand.brandName ?? "your brand"}
                </span>
                .
              </p>
            </div>

            {/* Brand context */}
            <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-border/60 bg-background/40 px-4 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Creating for</p>
                <p className="text-sm font-medium">
                  {brand.brandName ?? "Your brand"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Quick context cards */}
        <section className="mb-7 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-border/60 bg-card/40 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-background/70">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Brand voice</p>
                <p className="mt-0.5 text-sm font-medium">
                  {brand.tone ?? "Not defined"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/40 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-background/70">
                <UsersIcon />
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Audience</p>
                <p className="mt-0.5 line-clamp-1 text-sm font-medium">
                  {brand.audience ?? "Not defined"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/40 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-background/70">
                <FileText className="h-4 w-4 text-primary" />
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  Content pillars
                </p>
                <p className="mt-0.5 text-sm font-medium">
                  {report?.contentPillars?.length ?? 0} defined
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Generator */}
        <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/60 shadow-sm backdrop-blur-xl">
          <div className="pointer-events-none absolute -left-24 bottom-0 h-56 w-56 rounded-full bg-primary/5 blur-3xl" />

          <div className="relative p-5 sm:p-7 lg:p-8">
            <div className="mb-6 flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
                <WandSparkles className="h-5 w-5 text-primary" />
              </div>

              <div>
                <h2 className="font-semibold tracking-tight">
                  Create something new
                </h2>

                <p className="mt-1.5 text-sm leading-5 text-muted-foreground">
                  Tell BrandPilot what you want to create and let your Brand
                  Brain handle the voice, audience, and positioning.
                </p>
              </div>
            </div>

            <GeneratorForm
              brandName={brand.brandName}
              contentPillars={report?.contentPillars ?? []}
            />
          </div>
        </section>

        {/* Inspiration */}
        <section className="mt-6 rounded-2xl border border-border/50 bg-muted/20 px-5 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

              <div>
                <p className="text-sm font-medium">
                  Not sure what to create?
                </p>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Use your content pillars as a starting point and turn them
                  into posts, campaigns, or other marketing ideas.
                </p>
              </div>
            </div>

            <span className="shrink-0 text-xs font-medium text-primary">
              AI-powered
            </span>
          </div>
        </section>
      </div>
    </main>
  );
}

/**
 * Small inline icon component so we don't need another dependency/import
 * just for the audience card.
 */
function UsersIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4 text-primary"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
      />
      <circle cx="9" cy="7" r="4" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
      />
    </svg>
  );
}