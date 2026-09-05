"use client";

import { useEffect, useRef, useState } from "react";
import {
  Calendar,
  Library,
  Sparkles,
  Zap,
  ArrowRight,
  CircleDot,
} from "lucide-react";
import { Reveal } from "@/components/dashboard/overview/motion-primitives";

const features = [
  {
    number: "01",
    title: "Brand analysis",
    body: "We crawl your site and extract your business type, audience, tone, and keywords — giving the AI the context it needs to understand your brand.",
    icon: Sparkles,
    label: "Understand",
  },
  {
    number: "02",
    title: "Content generator",
    body: "Create captions, product descriptions, email campaigns, and SEO content written around your actual brand voice.",
    icon: Zap,
    label: "Create",
  },
  {
    number: "03",
    title: "Per-channel scheduling",
    body: "Plan content for Instagram, Facebook, X, and WhatsApp with a workflow designed around how each channel actually works.",
    icon: Calendar,
    label: "Publish",
  },
  {
    number: "04",
    title: "Content library",
    body: "Everything you generate stays organised, searchable, editable, and ready whenever you need it again.",
    icon: Library,
    label: "Manage",
  },
] as const;

const ACTIVE_DURATION = 3500;

export function Features() {
  const sectionRef = useRef<HTMLElement>(null);

  const [live, setLive] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  /*
   * Only run the feature spotlight animation
   * while the section is visible.
   */
  useEffect(() => {
    const element = sectionRef.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setLive(Boolean(entry?.isIntersecting));
      },
      {
        rootMargin: "-10% 0px -10% 0px",
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  /*
   * Rotate through the features.
   */
  useEffect(() => {
    if (!live) return;

    const interval = window.setInterval(() => {
      setActiveFeature((current) => (current + 1) % features.length);
    }, ACTIVE_DURATION);

    return () => window.clearInterval(interval);
  }, [live]);

  return (
    <section
      ref={sectionRef}
      id="features"
      className="relative overflow-hidden border-t border-border/60 py-24 sm:py-28"
    >
      {/* Background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,color-mix(in_oklab,var(--foreground)_7%,transparent),transparent_45%)]"
      />

      {/* Dot pattern */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(color-mix(in oklab, var(--foreground) 18%, transparent) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 50%, black, transparent)",
        }}
      />

      {/* Large ambient blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-[-12rem] top-1/3 h-[28rem] w-[28rem] rounded-full bg-foreground/[0.025] blur-3xl"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute right-[-12rem] top-1/2 h-[28rem] w-[28rem] rounded-full bg-foreground/[0.025] blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}

        <Reveal className="mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground shadow-sm backdrop-blur-xl">
            <CircleDot className="size-3" />
            Everything connected
          </div>

          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            Your entire content workflow,
            <span className="block bg-gradient-to-r from-foreground via-foreground to-foreground/40 bg-clip-text text-transparent">
              in one place.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            BrandPilot connects the important parts of your marketing workflow
            so you spend less time switching tools and more time creating.
          </p>
        </Reveal>

        {/* Feature system */}

        <div className="relative mt-16">
          {/* Desktop connection lines */}

          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-[12%] top-1/2 hidden h-px -translate-y-1/2 md:block"
          >
            <div className="h-full w-full bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>

          {/* Central glow */}

          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 hidden size-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/[0.035] blur-3xl md:block"
          />

          {/* Cards */}

          <div className="relative grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const active = index === activeFeature;

              return (
                <Reveal
                  key={feature.title}
                  delay={index * 100}
                  className="flex h-full"
                >
                  <article
                    className={`group relative flex h-full w-full flex-col overflow-hidden rounded-[1.75rem] border p-6 transition-all duration-700 sm:p-7 ${
                      active
                        ? "-translate-y-2 border-foreground/25 bg-background shadow-[0_35px_80px_-45px_rgba(0,0,0,0.75)]"
                        : "border-border/60 bg-background/70 hover:-translate-y-2 hover:border-foreground/20 hover:shadow-[0_25px_60px_-45px_rgba(0,0,0,0.55)]"
                    }`}
                  >
                    {/* Active spotlight */}

                    <div
                      aria-hidden
                      className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ${
                        active ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <div className="absolute -right-20 -top-20 size-48 rounded-full bg-foreground/[0.06] blur-3xl" />

                      <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-foreground/30 to-transparent" />
                    </div>

                    {/* Top */}

                    <div className="relative flex items-start justify-between">
                      <div
                        className={`relative flex size-12 items-center justify-center rounded-2xl border transition-all duration-500 ${
                          active
                            ? "border-foreground/15 bg-foreground text-background shadow-lg"
                            : "border-border/60 bg-secondary/50 text-muted-foreground group-hover:text-foreground"
                        }`}
                      >
                        <Icon className="size-5" />

                        {active && (
                          <span className="absolute -inset-2 -z-10 animate-ping rounded-2xl border border-foreground/20 opacity-20" />
                        )}
                      </div>

                      <span
                        className={`font-mono text-[10px] tracking-[0.18em] transition-colors duration-500 ${
                          active
                            ? "text-foreground"
                            : "text-muted-foreground/40"
                        }`}
                      >
                        {feature.number}
                      </span>
                    </div>

                    {/* Content */}

                    <div className="relative mt-8 flex flex-1 flex-col">
                      <span
                        className={`mb-3 text-[10px] font-medium uppercase tracking-[0.2em] transition-colors duration-500 ${
                          active
                            ? "text-foreground/70"
                            : "text-muted-foreground/40"
                        }`}
                      >
                        {feature.label}
                      </span>

                      <h3 className="text-lg font-medium tracking-tight text-foreground">
                        {feature.title}
                      </h3>

                      <p className="mt-3 flex-1 text-[13px] leading-relaxed text-muted-foreground">
                        {feature.body}
                      </p>

                      {/* Footer */}

                      <div className="mt-8 flex items-center justify-between border-t border-border/50 pt-4">
                        <span
                          className={`font-mono text-[9px] uppercase tracking-[0.18em] transition-colors duration-500 ${
                            active
                              ? "text-foreground/70"
                              : "text-muted-foreground/40"
                          }`}
                        >
                          Feature {feature.number}
                        </span>

                        <ArrowRight
                          className={`size-4 transition-all duration-500 ${
                            active
                              ? "translate-x-1 text-foreground"
                              : "text-muted-foreground/40 group-hover:translate-x-1 group-hover:text-foreground"
                          }`}
                        />
                      </div>
                    </div>

                    {/* Active progress */}

                    <div className="absolute bottom-0 left-0 h-[2px] w-full bg-border/40">
                      {active && (
                        <div
                          className="h-full origin-left bg-foreground"
                          style={{
                            animation: live
                              ? `feature-progress ${ACTIVE_DURATION}ms linear forwards`
                              : "none",
                          }}
                        />
                      )}
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* Bottom status */}

        <Reveal delay={500} className="mt-16">
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            {/* Progress indicators */}

            <div className="flex items-center gap-2">
              {features.map((feature, index) => (
                <button
                  key={feature.number}
                  type="button"
                  onClick={() => setActiveFeature(index)}
                  aria-label={`Show ${feature.title}`}
                  className="group relative flex h-5 w-8 items-center justify-center"
                >
                  <span
                    className={`h-[2px] w-full rounded-full transition-all duration-500 ${
                      index === activeFeature
                        ? "bg-foreground"
                        : "bg-border group-hover:bg-foreground/40"
                    }`}
                  />
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <span className="h-px w-8 bg-border" />

              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/50">
                One system. Every step connected.
              </p>

              <span className="h-px w-8 bg-border" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default Features;