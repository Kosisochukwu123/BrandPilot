"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";

import { Reveal } from "@/components/dashboard/overview/motion-primitives";

const steps = [
  {
    n: "01",
    title: "Connect your site",
    body: "Paste your website URL and let BrandPilot understand your business, products, and messaging.",
    icon: Zap,
    label: "Analyze",
  },
  {
    n: "02",
    title: "Review your brand",
    body: "Check your detected tone, audience, and keywords. Update anything that doesn't feel right.",
    icon: Users,
    label: "Personalize",
  },
  {
    n: "03",
    title: "Generate content",
    body: "Create captions, emails, ad copy, and marketing ideas that sound like your brand.",
    icon: Sparkles,
    label: "Create",
  },
  {
    n: "04",
    title: "Schedule everywhere",
    body: "Prepare and organize your content for the channels where your customers already are.",
    icon: Calendar,
    label: "Publish",
  },
] as const;

/**
 * How long one complete train journey takes.
 */
const LAP = 10;

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);

  const [live, setLive] = useState(false);
  const [station, setStation] = useState(0);

  /**
   * Only animate while the section is visible.
   * This prevents unnecessary animations when the user
   * is somewhere else on the page.
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

  /**
   * Move the active card together with the train journey.
   */
  useEffect(() => {
    if (!live) return;

    const durationPerStation = (LAP * 1000) / steps.length;

    const interval = window.setInterval(() => {
      setStation((current) => (current + 1) % steps.length);
    }, durationPerStation);

    return () => window.clearInterval(interval);
  }, [live]);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative isolate overflow-hidden border-y border-border/50 bg-background py-24 sm:py-28 lg:py-32"
    >
      {/* Background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-foreground/[0.035] blur-3xl" />

        <div className="absolute -left-40 bottom-0 h-[400px] w-[400px] rounded-full bg-foreground/[0.025] blur-3xl" />

        <div className="absolute -right-40 top-1/3 h-[400px] w-[400px] rounded-full bg-foreground/[0.025] blur-3xl" />
      </div>

      {/* Subtle grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-40"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,color-mix(in_oklab,var(--foreground)_3%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklab,var(--foreground)_3%,transparent)_1px,transparent_1px)] bg-[size:72px_72px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
        {/* Header */}
        <Reveal className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground shadow-sm backdrop-blur-xl">
            <span className="flex size-5 items-center justify-center rounded-full bg-foreground/5">
              <Sparkles className="size-3 text-foreground/70" />
            </span>

            <span>How BrandPilot works</span>
          </div>

          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            From website to{" "}
            <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/40 bg-clip-text text-transparent">
              marketing momentum.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            BrandPilot learns how your business communicates, then helps you
            turn that knowledge into consistent marketing content.
          </p>
        </Reveal>

        {/* Train journey */}
        <div className="relative mt-16 hidden md:block">
          <div className="relative h-20">
            {/* Top glow */}
            <div
              aria-hidden
              className="absolute left-0 right-0 top-1/2 h-20 -translate-y-1/2 bg-gradient-to-r from-transparent via-foreground/[0.025] to-transparent blur-2xl"
            />

            {/* Railway sleepers */}
            <div
              aria-hidden
              className="absolute inset-x-0 top-1/2 h-8 -translate-y-1/2 opacity-40"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(90deg, color-mix(in oklab, var(--foreground) 15%, transparent) 0px, color-mix(in oklab, var(--foreground) 15%, transparent) 2px, transparent 2px, transparent 18px)",
              }}
            />

            {/* Rail */}
            <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-border" />

            {/* Animated progress rail */}
            <div
              className="absolute left-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-foreground/60 to-transparent"
              style={{
                width: "100%",
                opacity: live ? 1 : 0,
                animation: live
                  ? `rail-pulse ${LAP}s linear infinite`
                  : "none",
              }}
            />

            {/* Stations */}
            {steps.map((step, index) => {
              const active = index === station;

              return (
                <div
                  key={step.n}
                  className="absolute top-1/2 -translate-y-1/2"
                  style={{
                    left: `${(index + 0.5) * (100 / steps.length)}%`,
                  }}
                >
                  {/* Station outer glow */}
                  <span
                    className={`absolute left-1/2 top-1/2 size-10 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-700 ${
                      active
                        ? "scale-100 bg-foreground/10 opacity-100"
                        : "scale-50 bg-transparent opacity-0"
                    }`}
                  />

                  {/* Station */}
                  <span
                    className={`relative block size-4 -translate-x-1/2 rounded-full border transition-all duration-500 ${
                      active
                        ? "scale-125 border-foreground bg-foreground shadow-lg"
                        : "border-border bg-background"
                    }`}
                  >
                    {active && (
                      <>
                        <span className="absolute inset-1 rounded-full bg-background" />

                        <span className="absolute -inset-2 animate-ping rounded-full border border-foreground/30" />
                      </>
                    )}
                  </span>

                  {/* Number */}
                  <span
                    className={`absolute left-1/2 top-7 -translate-x-1/2 font-mono text-[9px] tracking-wider transition-colors duration-500 ${
                      active
                        ? "text-foreground"
                        : "text-muted-foreground/50"
                    }`}
                  >
                    {step.n}
                  </span>
                </div>
              );
            })}

            {/* Train */}
            <div
              className="absolute top-1/2 z-10 -translate-y-1/2 will-change-transform"
              style={{
                left: "-12%",
                animation: live
                  ? `brandpilot-train ${LAP}s linear infinite`
                  : "none",
              }}
            >
              <div className="relative flex items-center">
                {/* Smoke */}
                <span
                  aria-hidden
                  className="absolute -top-7 left-4 size-2 rounded-full bg-foreground/20 blur-[1px]"
                  style={{
                    animation: live
                      ? "brandpilot-smoke 1.8s ease-out infinite"
                      : "none",
                  }}
                />

                <span
                  aria-hidden
                  className="absolute -top-10 left-7 size-1.5 rounded-full bg-foreground/15 blur-[1px]"
                  style={{
                    animation: live
                      ? "brandpilot-smoke 1.8s ease-out 0.6s infinite"
                      : "none",
                  }}
                />

                {/* Carriage */}
                <div className="relative h-4 w-7 rounded-[4px] border border-border bg-background shadow-sm">
                  <span className="absolute bottom-[-4px] left-1 size-1.5 rounded-full bg-foreground/50" />

                  <span className="absolute bottom-[-4px] right-1 size-1.5 rounded-full bg-foreground/50" />
                </div>

                {/* Carriage */}
                <div className="relative ml-1 h-4 w-7 rounded-[4px] border border-border bg-background shadow-sm">
                  <span className="absolute bottom-[-4px] left-1 size-1.5 rounded-full bg-foreground/50" />

                  <span className="absolute bottom-[-4px] right-1 size-1.5 rounded-full bg-foreground/50" />
                </div>

                {/* Engine */}
                <div className="relative ml-1 flex h-6 w-11 items-center justify-end rounded-[5px] border border-foreground/30 bg-foreground px-1.5 shadow-lg">
                  <span className="size-1.5 rounded-full bg-background/90" />

                  <span className="absolute bottom-[-4px] left-2 size-2 rounded-full bg-foreground" />

                  <span className="absolute bottom-[-4px] right-2 size-2 rounded-full bg-foreground" />
                </div>

                {/* Headlight */}
                <div className="h-8 w-20 -translate-x-1 bg-gradient-to-r from-foreground/20 to-transparent blur-sm" />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile progress */}
        <div className="mt-12 flex justify-center gap-2 md:hidden">
          {steps.map((step, index) => (
            <span
              key={step.n}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                index === station
                  ? "w-8 bg-foreground"
                  : "w-2 bg-border"
              }`}
            />
          ))}
        </div>

        {/* Cards */}
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const active = index === station;
            const Icon = step.icon;

            return (
              <Reveal
                key={step.n}
                delay={index * 100}
                className="flex h-full"
              >
                <article
                  className={`group relative flex min-h-[280px] w-full flex-col overflow-hidden rounded-2xl border p-6 backdrop-blur-xl transition-all duration-500 ${
                    active
                      ? "-translate-y-2 border-foreground/30 bg-background shadow-[0_30px_80px_-45px_rgba(0,0,0,0.7)]"
                      : "border-border/60 bg-background/70 hover:-translate-y-1 hover:border-foreground/20 hover:shadow-lg"
                  }`}
                >
                  {/* Active glow */}
                  <div
                    aria-hidden
                    className={`pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-foreground/[0.06] to-transparent transition-opacity duration-500 ${
                      active ? "opacity-100" : "opacity-0"
                    }`}
                  />

                  {/* Card header */}
                  <div className="relative flex items-start justify-between">
                    <div
                      className={`flex size-12 items-center justify-center rounded-2xl border transition-all duration-500 ${
                        active
                          ? "border-foreground/15 bg-foreground text-background shadow-md"
                          : "border-border/60 bg-secondary/50 text-muted-foreground group-hover:bg-secondary"
                      }`}
                    >
                      <Icon className="size-5" />
                    </div>

                    <span
                      className={`font-mono text-xs transition-colors duration-500 ${
                        active
                          ? "text-foreground"
                          : "text-muted-foreground/40"
                      }`}
                    >
                      {step.n}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="relative mt-7 flex flex-1 flex-col">
                    <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground/60">
                      {step.label}
                    </span>

                    <h3 className="mt-2 text-lg font-medium tracking-tight text-foreground">
                      {step.title}
                    </h3>

                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {step.body}
                    </p>

                    {/* Footer */}
                    <div
                      className={`mt-7 flex items-center justify-between border-t pt-4 transition-colors duration-500 ${
                        active ? "border-foreground/10" : "border-border/50"
                      }`}
                    >
                      <span
                        className={`text-[10px] font-medium uppercase tracking-[0.18em] ${
                          active
                            ? "text-foreground/80"
                            : "text-muted-foreground/50"
                        }`}
                      >
                        Step {step.n}
                      </span>

                      <ArrowRight
                        className={`size-4 transition-all duration-500 ${
                          active
                            ? "translate-x-1 text-foreground"
                            : "text-muted-foreground/40 group-hover:translate-x-1"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Active indicator */}
                  <div
                    className={`absolute bottom-0 left-0 h-0.5 bg-foreground transition-all duration-700 ${
                      active ? "w-full" : "w-0"
                    }`}
                  />
                </article>
              </Reveal>
            );
          })}
        </div>

        {/* Bottom statement */}
        <Reveal delay={500} className="mt-16 text-center">
          <div className="flex items-center justify-center gap-4">
            <span className="h-px w-10 bg-border" />

            <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground/60">
              <CheckCircle2 className="size-3" />

              From insight to content in minutes
            </div>

            <span className="h-px w-10 bg-border" />
          </div>
        </Reveal>
      </div>

      {/* Component animations */}
      <style jsx>{`
        @keyframes brandpilot-train {
          from {
            left: -12%;
          }

          to {
            left: 112%;
          }
        }

        @keyframes rail-pulse {
          0% {
            transform: translateY(-50%) scaleX(0);
            transform-origin: left;
            opacity: 0;
          }

          10% {
            opacity: 1;
          }

          80% {
            opacity: 1;
          }

          100% {
            transform: translateY(-50%) scaleX(1);
            transform-origin: left;
            opacity: 0;
          }
        }

        @keyframes brandpilot-smoke {
          0% {
            transform: translate(0, 0) scale(0.7);
            opacity: 0.5;
          }

          100% {
            transform: translate(-14px, -24px) scale(1.8);
            opacity: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>
    </section>
  );
}

export default HowItWorks;