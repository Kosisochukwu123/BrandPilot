// src/app/dashboard/content/page.tsx

import { auth } from "@/lib/auth";
import { listGeneratedContent } from "@/server/actions/content";
import { getContentTypeConfig } from "@/lib/constants/content-types";
import { ContentList } from "@/components/dashboard/content/content-list";

import {
  ArrowRight,
  BookOpen,
  FileText,
  Plus,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export default async function SavedContentPage() {
  const session = await auth();

  const content = session?.user?.id
    ? await listGeneratedContent(session.user.id)
    : [];

  return (
    <main className="min-h-screen px-4 pb-16 pt-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* ====================================================== */}
        {/* HEADER                                                 */}
        {/* ====================================================== */}

        <section className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary">
                <BookOpen className="h-3.5 w-3.5" />
                Content library
              </div>

              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Saved Content
              </h1>

              <p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">
                Everything you've generated and decided to keep.
                Your content library gives you one place to find,
                review, and reuse your best AI-generated work.
              </p>
            </div>

            <Link
              href="/dashboard/generate"
              className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create content
            </Link>
          </div>
        </section>

        {/* ====================================================== */}
        {/* CONTENT SUMMARY                                        */}
        {/* ====================================================== */}

        <div className="mt-8 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              Your library
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {content.length === 0
                ? "No saved content yet."
                : `${content.length} saved ${
                    content.length === 1 ? "item" : "items"
                  }`}
            </p>
          </div>

          {content.length > 0 && (
            <div className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
              <FileText className="h-3.5 w-3.5" />
              Content library
            </div>
          )}
        </div>

        {/* ====================================================== */}
        {/* CONTENT                                                 */}
        {/* ====================================================== */}

        <div className="mt-4">
          {content.length === 0 ? (
            <div className="relative overflow-hidden rounded-2xl border border-dashed border-border bg-card p-8 sm:p-12">
              <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-64 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />

              <div className="relative mx-auto flex max-w-md flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                  <FileText className="h-6 w-6 text-muted-foreground" />
                </div>

                <h3 className="mt-5 text-base font-semibold">
                  Your library is empty
                </h3>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Generate your first piece of content and save
                  it here. BrandPilot will keep it organized for
                  you.
                </p>

                <Link
                  href="/dashboard/generate"
                  className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate something
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          ) : (
            <ContentList
              items={content.map((c) => {
                const config = getContentTypeConfig(c.type);

                return {
                  id: c.id,
                  type: c.type,
                  typeLabel: config.label,
                  group: config.group,
                  output: c.output,
                  favorited: c.favorited,
                  createdAt: c.createdAt.toISOString(),
                };
              })}
            />
          )}
        </div>
      </div>
    </main>
  );
}