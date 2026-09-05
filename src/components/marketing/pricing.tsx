// src/components/marketing/pricing.tsx

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Crown,
  Sparkles,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    tag: "Start here",
    description: "Everything you need to explore BrandPilot.",

    features: [
      "1 connected brand",
      "15 AI generations / month",
      "1 connected channel",
      "Content library",
    ],

    cta: "Start for free",

    icon: Sparkles,

    theme: {
      card:
        "border-emerald-500/25 bg-gradient-to-br from-emerald-500/10 via-background to-cyan-500/5",

      glow: "bg-emerald-500/15",

      badge:
        "border border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",

      icon:
        "bg-gradient-to-br from-emerald-400 to-cyan-500 text-white shadow-md shadow-emerald-500/20",

      price:
        "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent",

      check:
        "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",

      button:
        "border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500 hover:text-white dark:text-emerald-400",
    },
  },

  {
    name: "Pro",
    price: "$29",
    period: "/month",
    tag: "Most popular",
    description: "More power for brands ready to create at scale.",

    features: [
      "Unlimited brands",
      "Unlimited AI generations",
      "All channels",
      "Priority AI models",
      "Scheduling across channels",
    ],

    cta: "Start Pro trial",

    highlighted: true,

    icon: Crown,

    theme: {
      card:
        "border-violet-500/30 bg-gradient-to-br from-violet-500/10 via-background to-fuchsia-500/10",

      glow: "bg-violet-500/20",

      badge:
        "bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white shadow-md shadow-violet-500/20",

      icon:
        "bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/25",

      price:
        "bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent",

      check:
        "bg-violet-500/10 text-violet-600 dark:text-violet-400",

      button:
        "border-0 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white shadow-md shadow-violet-500/20 hover:shadow-lg hover:shadow-violet-500/30",
    },
  },
];

export function Pricing() {
  return (
    <section
      id="pricing"
      className="relative overflow-hidden border-t border-border/50 py-16 sm:py-20"
    >
      {/* Background decoration */}

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -left-40 top-0 size-[350px] rounded-full bg-emerald-500/10 blur-[120px]" />

        <div className="absolute -right-40 top-1/3 size-[350px] rounded-full bg-violet-500/10 blur-[120px]" />

        <div
          className="
            absolute inset-0
            opacity-[0.025]
            [background-image:linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)]
            [background-size:48px_48px]
          "
        />

        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      </div>

      <div className="relative mx-auto max-w-5xl px-5 sm:px-6">
        {/* Header */}

        <motion.div
          initial={{
            opacity: 0,
            y: 18,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
          viewport={{
            once: true,
          }}
          className="text-center"
        >
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.92,
            }}
            whileInView={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 0.4,
              delay: 0.1,
            }}
            viewport={{
              once: true,
            }}
            className="
              mb-4 inline-flex items-center gap-2
              rounded-full
              border border-violet-500/20
              bg-gradient-to-r
              from-violet-500/10
              to-fuchsia-500/10
              px-3 py-1.5
              text-[11px]
              font-medium
              text-violet-600
              backdrop-blur-sm
              dark:text-violet-300
            "
          >
            <Zap className="size-3" />

            Simple pricing
          </motion.div>

          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Pick a plan that{" "}

            <span className="bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent">
              grows with you.
            </span>
          </h2>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
            Start free and upgrade when you need more power.
          </p>
        </motion.div>

        {/* Pricing cards */}

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {plans.map((plan, index) => {
            const Icon = plan.icon;

            return (
              <motion.div
                key={plan.name}
                initial={{
                  opacity: 0,
                  y: 28,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                }}
                viewport={{
                  once: true,
                }}
                className="group relative flex"
              >
                {/* Hover glow */}

                <div
                  className={`
                    absolute -inset-1
                    rounded-[1.2rem]
                    ${plan.theme.glow}
                    opacity-0
                    blur-xl
                    transition-opacity
                    duration-500
                    group-hover:opacity-100
                  `}
                />

                <div
                  className={`
                    relative
                    flex w-full flex-col
                    overflow-hidden
                    rounded-xl
                    border
                    ${plan.theme.card}
                    p-5
                    shadow-lg
                    shadow-black/[0.025]
                    backdrop-blur-xl
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    sm:p-6
                  `}
                >
                  {/* Top colour line */}

                  <div
                    className={`
                      absolute inset-x-0 top-0 h-px
                      ${
                        plan.highlighted
                          ? "bg-gradient-to-r from-transparent via-violet-500 to-transparent"
                          : "bg-gradient-to-r from-transparent via-emerald-500 to-transparent"
                      }
                    `}
                  />

                  {/* Plan header */}

                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span
                        className={`
                          inline-flex
                          rounded-full
                          px-2.5 py-1
                          text-[9px]
                          font-semibold
                          uppercase
                          tracking-[0.1em]
                          ${plan.theme.badge}
                        `}
                      >
                        {plan.tag}
                      </span>

                      <h3 className="mt-4 text-xl font-semibold tracking-tight">
                        {plan.name}
                      </h3>

                      <p className="mt-1.5 max-w-xs text-[13px] leading-relaxed text-muted-foreground">
                        {plan.description}
                      </p>
                    </div>

                    {/* Icon */}

                    <motion.div
                      initial={{
                        opacity: 0,
                        scale: 0.7,
                        rotate: -15,
                      }}
                      whileInView={{
                        opacity: 1,
                        scale: 1,
                        rotate: 0,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 180,
                        damping: 16,
                        delay: 0.15 + index * 0.1,
                      }}
                      viewport={{
                        once: true,
                      }}
                      className={`
                        flex size-11 shrink-0
                        items-center justify-center
                        rounded-xl
                        ${plan.theme.icon}
                      `}
                    >
                      <Icon className="size-5" />
                    </motion.div>
                  </div>

                  {/* Price */}

                  <div className="mt-6">
                    <div className="flex items-end gap-1.5">
                      <motion.span
                        initial={{
                          opacity: 0,
                          y: 10,
                          scale: 0.95,
                        }}
                        whileInView={{
                          opacity: 1,
                          y: 0,
                          scale: 1,
                        }}
                        transition={{
                          duration: 0.45,
                          delay: 0.2 + index * 0.1,
                        }}
                        viewport={{
                          once: true,
                        }}
                        className={`
                          text-4xl
                          font-bold
                          leading-none
                          tracking-[-0.05em]
                          sm:text-5xl
                          ${plan.theme.price}
                        `}
                      >
                        {plan.price}
                      </motion.span>

                      <span className="mb-0.5 text-xs text-muted-foreground">
                        {plan.period}
                      </span>
                    </div>

                    <div
                      className={`
                        mt-5 h-px w-full
                        ${
                          plan.highlighted
                            ? "bg-gradient-to-r from-violet-500/40 via-fuchsia-500/20 to-transparent"
                            : "bg-gradient-to-r from-emerald-500/40 via-cyan-500/20 to-transparent"
                        }
                      `}
                    />
                  </div>

                  {/* Features */}

                  <ul className="mt-5 flex flex-1 flex-col gap-3">
                    {plan.features.map((feature, i) => (
                      <motion.li
                        key={feature}
                        initial={{
                          opacity: 0,
                          x: -8,
                        }}
                        whileInView={{
                          opacity: 1,
                          x: 0,
                        }}
                        transition={{
                          duration: 0.3,
                          delay: 0.3 + index * 0.1 + i * 0.05,
                        }}
                        viewport={{
                          once: true,
                        }}
                        className="flex items-center gap-2.5 text-[13px]"
                      >
                        <span
                          className={`
                            flex size-5 shrink-0
                            items-center justify-center
                            rounded-full
                            ${plan.theme.check}
                          `}
                        >
                          <Check className="size-3" />
                        </span>

                        <span className="text-muted-foreground">
                          {feature}
                        </span>
                      </motion.li>
                    ))}
                  </ul>

                  {/* CTA */}

                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.4,
                      delay: 0.5 + index * 0.1,
                    }}
                    viewport={{
                      once: true,
                    }}
                    className="mt-6"
                  >
                    <Button
                      className={`
                        group/button
                        h-10
                        w-full
                        rounded-lg
                        text-[13px]
                        font-semibold
                        transition-all
                        duration-300
                        ${plan.theme.button}
                      `}
                      asChild
                    >
                      <Link href="/register">
                        <span className="flex items-center justify-center gap-2">
                          {plan.cta}

                          <ArrowRight
                            className="
                              size-3.5
                              transition-transform
                              duration-300
                              group-hover/button:translate-x-1
                            "
                          />
                        </span>
                      </Link>
                    </Button>
                  </motion.div>

                  {/* Subtle bottom glow */}

                  <div
                    aria-hidden
                    className={`
                      pointer-events-none
                      absolute
                      -bottom-24
                      -right-24
                      size-36
                      rounded-full
                      blur-3xl
                      opacity-15
                      ${
                        plan.highlighted
                          ? "bg-fuchsia-500"
                          : "bg-emerald-500"
                      }
                    `}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Compact trust indicator */}

        <motion.div
          initial={{
            opacity: 0,
            y: 12,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
            delay: 0.25,
          }}
          viewport={{
            once: true,
          }}
          className="mt-9 flex justify-center"
        >
          <div
            className="
              flex flex-wrap
              items-center
              justify-center
              gap-x-4
              gap-y-2
              rounded-full
              border border-border/50
              bg-background/60
              px-5 py-2.5
              text-center
              backdrop-blur-xl
            "
          >
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <span className="size-6 rounded-full border-2 border-background bg-gradient-to-br from-emerald-400 to-cyan-500" />

                <span className="size-6 rounded-full border-2 border-background bg-gradient-to-br from-violet-400 to-purple-600" />

                <span className="size-6 rounded-full border-2 border-background bg-gradient-to-br from-pink-400 to-rose-500" />
              </div>

              <span className="text-xs font-medium">
                Built for growing brands
              </span>
            </div>

            <span className="hidden h-4 w-px bg-border sm:block" />

            <span className="text-xs text-muted-foreground">
              Start free
            </span>

            <span className="hidden h-4 w-px bg-border sm:block" />

            <span className="text-xs text-muted-foreground">
              Upgrade anytime
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}