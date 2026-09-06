"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

interface BrandHealthWidgetProps {
  score: number | null;
  delta: number | null;
}

/**
 * Small hanging brand health clock.
 *
 * The clock hangs from a small nail and stretches slightly when dragged.
 * When released it springs back and swings naturally.
 */
export function BrandHealthWidget({
  score,
  delta,
}: BrandHealthWidgetProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const ropeRef = useRef<HTMLDivElement>(null);
  const clockRef = useRef<HTMLDivElement>(null);

  const [display, setDisplay] = useState(0);
  const [grabbed, setGrabbed] = useState(false);

  const angle = useRef(-10);
  const velocity = useRef(0);

  const stretch = useRef(1);
  const stretchVelocity = useRef(0);

  const dragging = useRef(false);
  const reduceMotion = useRef(false);

  const lastPointer = useRef<{
    angle: number;
    y: number;
    time: number;
  } | null>(null);

  const countRaf = useRef(0);

  const effectiveScore = score ?? 0;

  const tone =
    effectiveScore >= 80
      ? "Excellent"
      : effectiveScore >= 60
        ? "Healthy"
        : "Needs attention";

  /**
   * Score count animation
   */
  const runCount = useCallback(
    (from: number) => {
      cancelAnimationFrame(countRaf.current);

      const start = performance.now();

      const tick = (time: number) => {
        const progress = Math.min((time - start) / 900, 1);

        const eased = 1 - Math.pow(1 - progress, 4);

        setDisplay(
          Math.round(
            from + (effectiveScore - from) * eased,
          ),
        );

        if (progress < 1) {
          countRaf.current = requestAnimationFrame(tick);
        }
      };

      countRaf.current = requestAnimationFrame(tick);
    },
    [effectiveScore],
  );

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    reduceMotion.current = reduce;

    runCount(0);

    if (reduce) {
      angle.current = 0;
      stretch.current = 1;

      clockRef.current?.style.setProperty(
        "--clock-angle",
        "0deg",
      );

      ropeRef.current?.style.setProperty(
        "--rope-stretch",
        "1",
      );

      return () => {
        cancelAnimationFrame(countRaf.current);
      };
    }

    let raf = 0;

    const animate = () => {
      if (!dragging.current) {
        /**
         * Pendulum spring
         */
        velocity.current += -angle.current * 0.008;

        /**
         * Damping
         */
        velocity.current *= 0.965;

        angle.current += velocity.current;

        /**
         * Keep the clock movement realistic
         */
        angle.current = Math.max(
          -32,
          Math.min(32, angle.current),
        );

        /**
         * Rubber / elastic rope spring
         */
        stretchVelocity.current +=
          (1 - stretch.current) * 0.12;

        stretchVelocity.current *= 0.72;

        stretch.current += stretchVelocity.current;

        stretch.current = Math.max(
          0.92,
          Math.min(1.45, stretch.current),
        );
      }

      clockRef.current?.style.setProperty(
        "--clock-angle",
        `${angle.current.toFixed(2)}deg`,
      );

      ropeRef.current?.style.setProperty(
        "--rope-stretch",
        stretch.current.toFixed(3),
      );

      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(countRaf.current);
    };
  }, [runCount]);

  const getAngle = (
    event: React.PointerEvent,
  ) => {
    const rect =
      wrapRef.current?.getBoundingClientRect();

    if (!rect) return null;

    const centerX =
      rect.left + rect.width / 2;

    const topY = rect.top + 8;

    const x =
      event.clientX - centerX;

    const y =
      event.clientY - topY;

    const nextAngle =
      (Math.atan2(x, y) * 180) /
      Math.PI;

    return Math.max(
      -32,
      Math.min(32, nextAngle),
    );
  };

  const onPointerDown = (
    event: React.PointerEvent,
  ) => {
    if (reduceMotion.current) return;

    event.preventDefault();
    event.stopPropagation();

    dragging.current = true;

    setGrabbed(true);

    velocity.current = 0;

    lastPointer.current = null;

    event.currentTarget.setPointerCapture?.(
      event.pointerId,
    );
  };

  const onPointerMove = (
    event: React.PointerEvent,
  ) => {
    if (!dragging.current) return;

    const nextAngle =
      getAngle(event);

    if (nextAngle === null) return;

    const rect =
      wrapRef.current?.getBoundingClientRect();

    if (!rect) return;

    const now =
      performance.now();

    /**
     * How far downward the user pulled.
     * This controls the rubber stretch.
     */
    const pullDistance =
      Math.max(
        0,
        event.clientY -
          (rect.top + 20),
      );

    const nextStretch =
      Math.max(
        1,
        Math.min(
          1.4,
          1 + pullDistance / 220,
        ),
      );

    const previous =
      lastPointer.current;

    if (previous) {
      const deltaTime =
        Math.max(
          now - previous.time,
          8,
        );

      velocity.current =
        Math.max(
          -5,
          Math.min(
            5,
            ((nextAngle -
              previous.angle) /
              deltaTime) *
              16,
          ),
        );
    }

    lastPointer.current = {
      angle: nextAngle,
      y: event.clientY,
      time: now,
    };

    angle.current = nextAngle;

    stretch.current = nextStretch;
  };

  const releaseClock = () => {
    if (!dragging.current) return;

    dragging.current = false;

    setGrabbed(false);

    /**
     * Small extra momentum on release.
     */
    velocity.current =
      Math.max(
        -6,
        Math.min(
          6,
          velocity.current * 1.3,
        ),
      );

    lastPointer.current = null;

    runCount(
      Math.round(
        effectiveScore * 0.7,
      ),
    );
  };

  if (score === null) {
    return (
      <Link
        href="/dashboard/brand"
        className="inline-flex rounded-xl border border-dashed border-border bg-card px-4 py-3 text-xs text-muted-foreground transition hover:border-violet-400 hover:bg-violet-500/5"
      >
        Set up Brand Brain
      </Link>
    );
  }

  return (
    <Link
      href="/dashboard/brand/report"
      className="group relative block w-[116px]"
      onClick={(event) => {
        if (grabbed) {
          event.preventDefault();
        }
      }}
    >
      <div
        ref={wrapRef}
        className="relative flex min-h-[142px] w-full select-none flex-col items-center touch-none"
      >
        {/* ================= NAIL ================= */}

        <div className="relative z-20">
          <span className="block size-[7px] rounded-full bg-foreground shadow-[0_1px_5px_rgba(0,0,0,0.35)]" />

          <span className="absolute left-1/2 top-1 size-[13px] -translate-x-1/2 rounded-full border border-border bg-background/80" />
        </div>

        {/* ================= RUBBER ROPE ================= */}

        <div
          ref={ropeRef}
          className="relative h-[38px] w-[24px] origin-top"
          style={{
            transform:
              "scaleY(var(--rope-stretch, 1))",
            willChange: "transform",
          }}
        >
          {/* Left rubber strand */}

          <span className="absolute left-[7px] top-0 h-full w-[2px] rounded-full bg-gradient-to-b from-violet-400/80 via-violet-500/60 to-violet-700/50" />

          {/* Right rubber strand */}

          <span className="absolute right-[7px] top-0 h-full w-[2px] rounded-full bg-gradient-to-b from-violet-400/80 via-violet-500/60 to-violet-700/50" />

          {/* Middle subtle highlight */}

          <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/20" />
        </div>

        {/* ================= CLOCK ================= */}

        <div
          ref={clockRef}
          className={`relative origin-top ${
            grabbed
              ? "cursor-grabbing"
              : "cursor-grab"
          }`}
          style={{
            transform:
              "rotate(var(--clock-angle, 0deg))",
            willChange: "transform",
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={releaseClock}
          onPointerCancel={releaseClock}
        >
          {/* connector */}

          <div className="absolute left-1/2 -top-[5px] size-[11px] -translate-x-1/2 rounded-full border border-violet-400/40 bg-background" />

          {/* CLOCK BODY */}

          <div
            className={`relative grid size-[74px] place-items-center rounded-full border bg-card shadow-[0_12px_25px_-14px_rgba(0,0,0,0.7)] transition-shadow ${
              grabbed
                ? "border-violet-400 shadow-[0_18px_35px_-16px_rgba(139,92,246,0.9)]"
                : "border-border"
            }`}
          >
            {/* Clock face */}

            <span className="absolute inset-[5px] rounded-full border border-border/70 bg-background/70" />

            {/* Score ring */}

            <svg
              viewBox="0 0 100 100"
              className="absolute inset-[4px] -rotate-90"
            >
              <circle
                cx="50"
                cy="50"
                r="43"
                fill="none"
                stroke="currentColor"
                className="text-border/70"
                strokeWidth="3"
              />

              <circle
                cx="50"
                cy="50"
                r="43"
                fill="none"
                stroke="currentColor"
                className="text-violet-500"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={
                  2 *
                  Math.PI *
                  43
                }
                strokeDashoffset={
                  2 *
                  Math.PI *
                  43 *
                  (1 -
                    display /
                      100)
                }
              />
            </svg>

            {/* SCORE */}

            <div className="relative text-center">
              <p className="font-mono text-[22px] font-semibold leading-none tabular-nums tracking-tight">
                {display}
              </p>

              <p className="mt-1 font-mono text-[6px] uppercase tracking-[0.18em] text-muted-foreground">
                Health
              </p>
            </div>
          </div>

          {/* LABEL */}

          <div className="mt-1.5 text-center">
            <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {tone}
            </p>

            {delta !== null &&
            delta !== 0 ? (
              <p
                className={`mt-0.5 text-[8px] font-medium ${
                  delta > 0
                    ? "text-emerald-500"
                    : "text-red-500"
                }`}
              >
                {delta > 0
                  ? "↑"
                  : "↓"}{" "}
                {Math.abs(delta)}%
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default BrandHealthWidget;