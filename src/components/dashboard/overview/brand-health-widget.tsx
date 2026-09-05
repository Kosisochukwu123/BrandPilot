// src/components/dashboard/overview/brand-health-widget.tsx

"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

interface BrandHealthWidgetProps {
  score: number | null;
  delta: number | null;
}

/**
 * Brand Health Widget
 *
 * Designed like a small wall clock / hanging medal:
 *
 * - The nail stays fixed.
 * - The hanging strap visually stretches while dragged.
 * - The health widget follows the pointer within limits.
 * - On release, spring physics pulls it back into place.
 * - A pendulum-like swing continues briefly after release.
 */

export function BrandHealthWidget({
  score,
  delta,
}: BrandHealthWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const medalRef = useRef<HTMLDivElement>(null);

  const [display, setDisplay] = useState(0);
  const [grabbed, setGrabbed] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);

  /* -----------------------------------------------
   * PHYSICS
   * --------------------------------------------- */

  // Horizontal displacement
  const x = useRef(0);

  // Horizontal velocity
  const velocityX = useRef(0);

  // Vertical displacement
  const y = useRef(0);

  // Vertical velocity
  const velocityY = useRef(0);

  const dragging = useRef(false);

  const lastPointer = useRef<{
    x: number;
    y: number;
    time: number;
  } | null>(null);

  const reduceMotion = useRef(false);

  const physicsRaf = useRef(0);
  const countRaf = useRef(0);

  const effectiveScore = score ?? 0;

  /* -----------------------------------------------
   * SCORE COUNTING
   * --------------------------------------------- */

  const runCount = useCallback(
    (from: number) => {
      cancelAnimationFrame(countRaf.current);

      const start = performance.now();

      const tick = (time: number) => {
        const progress = Math.min((time - start) / 900, 1);

        // Smooth ease-out
        const eased = 1 - Math.pow(1 - progress, 4);

        setDisplay(
          Math.round(
            from + (effectiveScore - from) * eased,
          ),
        );

        if (progress < 1) {
          countRaf.current =
            requestAnimationFrame(tick);
        }
      };

      countRaf.current =
        requestAnimationFrame(tick);
    },
    [effectiveScore],
  );

  /* -----------------------------------------------
   * MAIN SPRING PHYSICS LOOP
   * --------------------------------------------- */

  useEffect(() => {
    const prefersReducedMotion =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

    reduceMotion.current =
      prefersReducedMotion;

    runCount(0);

    if (prefersReducedMotion) {
      return () =>
        cancelAnimationFrame(
          countRaf.current,
        );
    }

    const animate = () => {
      if (!dragging.current) {
        /*
         * Spring force.
         *
         * Pulls the widget back toward x = 0.
         */
        const springStrength = 0.055;

        velocityX.current +=
          -x.current * springStrength;

        /*
         * Horizontal damping.
         *
         * Lower = more bounce.
         */
        velocityX.current *= 0.86;

        x.current += velocityX.current;

        /*
         * Vertical spring.
         *
         * Slightly softer than horizontal
         * so the rubber stretch feels natural.
         */
        const verticalSpring =
          0.04;

        velocityY.current +=
          -y.current * verticalSpring;

        velocityY.current *= 0.82;

        y.current += velocityY.current;

        /*
         * Stop micro-jitter once settled.
         */
        if (
          Math.abs(x.current) < 0.01 &&
          Math.abs(velocityX.current) < 0.01
        ) {
          x.current = 0;
          velocityX.current = 0;
        }

        if (
          Math.abs(y.current) < 0.01 &&
          Math.abs(velocityY.current) < 0.01
        ) {
          y.current = 0;
          velocityY.current = 0;
        }
      }

      updateWidget();

      physicsRaf.current =
        requestAnimationFrame(animate);
    };

    physicsRaf.current =
      requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(
        physicsRaf.current,
      );

      cancelAnimationFrame(
        countRaf.current,
      );
    };
  }, [runCount]);

  /* -----------------------------------------------
   * UPDATE VISUAL POSITION
   * --------------------------------------------- */

  const updateWidget = () => {
    if (!containerRef.current) return;

    /*
     * Calculate the rope angle.
     *
     * The rope points from the fixed nail
     * toward the current widget position.
     */

    const angle =
      Math.atan2(
        x.current,
        88 + y.current,
      ) *
      (180 / Math.PI);

    /*
     * Rope length.
     *
     * Pulling downward stretches it.
     */

    const ropeLength =
      Math.max(
        74,
        Math.min(
          145,
          88 + y.current,
        ),
      );

    /*
     * Slight rotation of the widget
     * gives the hanging-clock feeling.
     */

    const medalRotation =
      Math.max(
        -18,
        Math.min(
          18,
          x.current * 0.08,
        ),
      );

    containerRef.current.style.setProperty(
      "--widget-x",
      `${x.current}px`,
    );

    containerRef.current.style.setProperty(
      "--widget-y",
      `${y.current}px`,
    );

    containerRef.current.style.setProperty(
      "--rope-angle",
      `${angle}deg`,
    );

    containerRef.current.style.setProperty(
      "--rope-height",
      `${ropeLength}px`,
    );

    containerRef.current.style.setProperty(
      "--medal-rotation",
      `${medalRotation}deg`,
    );
  };

  /* -----------------------------------------------
   * POINTER INTERACTION
   * --------------------------------------------- */

  const onPointerDown = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    if (reduceMotion.current) return;

    event.preventDefault();

    dragging.current = true;

    setGrabbed(true);
    setHasDragged(false);

    velocityX.current = 0;
    velocityY.current = 0;

    lastPointer.current = {
      x: event.clientX,
      y: event.clientY,
      time: performance.now(),
    };

    event.currentTarget.setPointerCapture?.(
      event.pointerId,
    );
  };

  const onPointerMove = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    if (!dragging.current) return;

    const container =
      containerRef.current?.getBoundingClientRect();

    if (!container) return;

    /*
     * Fixed nail location.
     */

    const nailX =
      container.left +
      container.width / 2;

    const nailY =
      container.top + 8;

    /*
     * Pointer distance from nail.
     */

    let nextX =
      event.clientX - nailX;

    let nextY =
      event.clientY - nailY - 115;

    /*
     * Drag limits.
     */

    nextX = Math.max(
      -115,
      Math.min(115, nextX),
    );

    nextY = Math.max(
      -30,
      Math.min(90, nextY),
    );

    /*
     * Detect actual dragging.
     *
     * Prevents a simple click from
     * being treated as a drag.
     */

    if (
      Math.abs(nextX - x.current) > 4 ||
      Math.abs(nextY - y.current) > 4
    ) {
      setHasDragged(true);
    }

    const now =
      performance.now();

    const previous =
      lastPointer.current;

    if (previous) {
      const dt = Math.max(
        now - previous.time,
        10,
      );

      velocityX.current =
        ((event.clientX - previous.x) /
          dt) *
        12;

      velocityY.current =
        ((event.clientY - previous.y) /
          dt) *
        12;

      velocityX.current =
        Math.max(
          -12,
          Math.min(
            12,
            velocityX.current,
          ),
        );

      velocityY.current =
        Math.max(
          -12,
          Math.min(
            12,
            velocityY.current,
          ),
        );
    }

    lastPointer.current = {
      x: event.clientX,
      y: event.clientY,
      time: now,
    };

    x.current = nextX;
    y.current = nextY;

    updateWidget();
  };

  const onPointerUp = () => {
    if (!dragging.current) return;

    dragging.current = false;

    setGrabbed(false);

    lastPointer.current = null;

    /*
     * Give the release some momentum.
     */

    velocityX.current *= 1.2;
    velocityY.current *= 1.05;

    /*
     * Re-animate the score slightly.
     */

    runCount(
      Math.round(
        effectiveScore * 0.72,
      ),
    );
  };

  /* -----------------------------------------------
   * KEYBOARD SUPPORT
   * --------------------------------------------- */

  const nudge = (amount: number) => {
    if (reduceMotion.current) return;

    velocityX.current += amount;

    velocityX.current =
      Math.max(
        -8,
        Math.min(
          8,
          velocityX.current,
        ),
      );
  };

  const onKeyDown = (
    event: React.KeyboardEvent,
  ) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      nudge(-2);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      nudge(2);
    }

    if (
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();

      nudge(3);

      runCount(
        Math.round(
          effectiveScore * 0.7,
        ),
      );
    }
  };

  /* -----------------------------------------------
   * EMPTY STATE
   * --------------------------------------------- */

  if (score === null) {
    return (
      <Link
        href="/dashboard/brand"
        className="flex min-h-[180px] items-center justify-center rounded-3xl border border-dashed border-violet-300/60 bg-violet-50/30 p-5 text-center text-sm text-muted-foreground transition hover:border-violet-400 hover:bg-violet-50/60 dark:border-violet-500/20 dark:bg-violet-500/[0.03]"
      >
        Set up your Brand Brain to unlock your
        Brand Health score.
      </Link>
    );
  }

  const tone =
    score >= 80
      ? "Excellent"
      : score >= 60
        ? "Steady"
        : "Needs attention";

  const scoreColor =
    score >= 80
      ? "text-emerald-500"
      : score >= 60
        ? "text-violet-500"
        : "text-orange-500";

  const progressColor =
    score >= 80
      ? "stroke-emerald-500"
      : score >= 60
        ? "stroke-violet-500"
        : "stroke-orange-500";

  const circumference =
    2 * Math.PI * 42;

  /* -----------------------------------------------
   * WIDGET
   * --------------------------------------------- */

  return (
    <Link
      href="/dashboard/brand/report"
      onClick={(event) => {
        /*
         * Don't navigate when the user
         * was dragging the widget.
         */

        if (hasDragged) {
          event.preventDefault();

          setHasDragged(false);
        }
      }}
      className="group block"
    >
      <div
        ref={containerRef}
        className={`relative flex h-[265px] w-[250px] select-none items-start justify-center outline-none ${
          grabbed
            ? "cursor-grabbing"
            : "cursor-grab"
        }`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onMouseEnter={() => nudge(0.6)}
        onKeyDown={onKeyDown}
        tabIndex={0}
        role="slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={score}
        aria-label={`Brand health score ${score} out of 100. ${tone}. Drag the hanging widget.`}
      >
        {/* =====================================
            NAIL
        ====================================== */}

        <div className="absolute top-1 z-30 flex flex-col items-center">
          {/* Nail head */}

          <div className="relative">
            <div className="absolute left-1/2 top-1 h-3 w-3 -translate-x-1/2 rounded-full bg-gradient-to-br from-zinc-100 to-zinc-500 shadow-md dark:from-zinc-300 dark:to-zinc-700" />

            {/* Nail */}

            <div className="h-1.5 w-10 rounded-full bg-gradient-to-b from-zinc-300 via-zinc-400 to-zinc-600 shadow-sm dark:from-zinc-200 dark:via-zinc-500 dark:to-zinc-700" />
          </div>
        </div>

        {/* =====================================
            ROPE
        ====================================== */}

        <div
          className="absolute top-4 z-10 origin-top"
          style={{
            height: "var(--rope-height, 88px)",
            transform:
              "rotate(var(--rope-angle, 0deg))",
          }}
        >
          <div className="relative h-full w-5">
            {/* Left rubber strand */}

            <span className="absolute left-[7px] top-0 h-full w-[2px] rounded-full bg-gradient-to-b from-violet-400 via-indigo-400 to-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.25)]" />

            {/* Right rubber strand */}

            <span className="absolute right-[7px] top-0 h-full w-[2px] rounded-full bg-gradient-to-b from-indigo-400 via-fuchsia-400 to-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.2)]" />
          </div>
        </div>

        {/* =====================================
            HANGING MEDAL
        ====================================== */}

        <div
          ref={medalRef}
          className="absolute top-[104px] z-20"
          style={{
            transform:
              "translate3d(var(--widget-x, 0px), var(--widget-y, 0px), 0) rotate(var(--medal-rotation, 0deg))",
            willChange:
              "transform",
          }}
        >
          {/* Connector ring */}

          <div className="mx-auto flex h-5 w-5 items-center justify-center rounded-full border-2 border-violet-300 bg-background shadow-sm dark:border-violet-400/40">
            <div className="h-1.5 w-1.5 rounded-full bg-violet-400" />
          </div>

          {/* Main widget */}

          <div className="relative mt-[-2px] w-[178px] overflow-hidden rounded-[28px] border border-violet-200/60 bg-background/90 p-4 shadow-[0_22px_55px_-24px_rgba(76,29,149,0.5)] backdrop-blur-xl transition-shadow duration-300 group-hover:shadow-[0_28px_65px_-22px_rgba(124,58,237,0.32)] dark:border-violet-400/15">
            {/* Ambient glow */}

            <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-violet-500/15 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-10 -left-8 h-20 w-20 rounded-full bg-fuchsia-500/10 blur-3xl" />

            <div className="relative">
              {/* Header */}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/15 to-indigo-500/10">
                    <Activity className="h-3.5 w-3.5 text-violet-600" />
                  </div>

                  <span className="text-[10px] font-semibold tracking-tight">
                    Brand health
                  </span>
                </div>

                <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground/50 transition group-hover:text-violet-500" />
              </div>

              {/* Score */}

              <div className="relative mx-auto mt-5 flex h-[112px] w-[112px] items-center justify-center">
                <svg
                  viewBox="0 0 100 100"
                  className="absolute inset-0 -rotate-90"
                >
                  {/* Background ring */}

                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="currentColor"
                    className="text-violet-100 dark:text-violet-500/10"
                    strokeWidth="5"
                  />

                  {/* Progress */}

                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="currentColor"
                    className={`${progressColor} transition-[stroke-dashoffset] duration-[1400ms] ease-out`}
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={
                      circumference *
                      (1 - display / 100)
                    }
                  />
                </svg>

                <div className="relative text-center">
                  <p
                    className={`text-3xl font-bold tracking-tight tabular-nums ${scoreColor}`}
                  >
                    {display}
                  </p>

                  <p className="mt-0.5 text-[8px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                    out of 100
                  </p>
                </div>
              </div>

              {/* Status */}

              <div className="mt-3 flex items-center justify-center gap-1.5">
                <Sparkles className="h-3 w-3 text-violet-500" />

                <span className="text-[10px] font-semibold text-foreground">
                  {tone}
                </span>
              </div>

              {/* Delta */}

              {delta !== null &&
                delta !== 0 && (
                  <div className="mt-1.5 flex items-center justify-center gap-1 text-[9px]">
                    {delta > 0 ? (
                      <TrendingUp className="h-3 w-3 text-emerald-500" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-rose-500" />
                    )}

                    <span
                      className={
                        delta > 0
                          ? "font-medium text-emerald-600"
                          : "font-medium text-rose-600"
                      }
                    >
                      {delta > 0 ? "+" : ""}
                      {delta}%
                    </span>

                    <span className="text-muted-foreground">
                      this week
                    </span>
                  </div>
                )}

              {/* Hint */}

              <p className="mt-3 text-center text-[8px] uppercase tracking-[0.14em] text-muted-foreground/45">
                {grabbed
                  ? "Release me"
                  : "Pull to inspect"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default BrandHealthWidget;