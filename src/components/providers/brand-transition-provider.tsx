"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";

type BrandTransitionContextType = {
  startTransition: (href: string) => void;
  isTransitioning: boolean;
};

const BrandTransitionContext =
  createContext<BrandTransitionContextType | null>(null);

function BrandMark() {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.5,
        rotate: -20,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        rotate: 0,
      }}
      exit={{
        opacity: 0,
        scale: 0.8,
        filter: "blur(8px)",
      }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
      className="relative flex h-16 w-16 items-center justify-center"
    >
      {/* Outer glow */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.35, 0.7, 0.35],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 rounded-2xl bg-violet-500/30 blur-xl"
      />

      {/* Placeholder logo container */}
      <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-gradient-to-br from-violet-400 via-purple-500 to-fuchsia-500 shadow-[0_20px_60px_rgba(139,92,246,0.45)]">
        {/* Abstract temporary logo */}
        <div className="relative h-6 w-6 rotate-45 rounded-[5px] bg-white shadow-lg">
          <div className="absolute inset-[5px] rounded-[3px] bg-violet-500" />
        </div>
      </div>
    </motion.div>
  );
}

export function BrandTransitionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [phase, setPhase] = useState<
    "idle" | "logo" | "cover" | "reveal"
  >("idle");

  const startTransition = useCallback(
    (href: string) => {
      if (isTransitioning) return;

      setIsTransitioning(true);

      // Phase 1:
      // Logo appears in the center.
      setPhase("logo");

      // Phase 2:
      // The top-left glow expands and covers the screen.
      window.setTimeout(() => {
        setPhase("cover");
      }, 350);

      // Phase 3:
      // Navigate while the transition is covering the screen.
      window.setTimeout(() => {
        router.push(href);
      }, 750);

      // Phase 4:
      // Begin revealing the new page.
      window.setTimeout(() => {
        setPhase("reveal");
      }, 1200);

      // Reset.
      window.setTimeout(() => {
        setPhase("idle");
        setIsTransitioning(false);
      }, 1750);
    },
    [isTransitioning, router],
  );

  return (
    <BrandTransitionContext.Provider
      value={{
        startTransition,
        isTransitioning,
      }}
    >
      {children}

      <AnimatePresence>
        {phase !== "idle" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[9999] overflow-hidden"
          >
            {/* Dark transparent initial layer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{
                opacity:
                  phase === "logo"
                    ? 0.35
                    : phase === "cover"
                      ? 1
                      : 0,
              }}
              transition={{
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="absolute inset-0 bg-background"
            />

            {/* 
              TOP LEFT EXPANDING LIGHT

              This is the main effect.

              It starts from the top-left corner and grows
              across the screen.
            */}
            <motion.div
              initial={{
                scale: 0,
                opacity: 0,
              }}
              animate={{
                scale:
                  phase === "cover"
                    ? 5
                    : phase === "reveal"
                      ? 6
                      : 0,
                opacity:
                  phase === "logo"
                    ? 0
                    : phase === "cover"
                      ? 1
                      : 0,
              }}
              transition={{
                duration: 0.9,
                ease: [0.76, 0, 0.24, 1],
              }}
              className="absolute -left-[20rem] -top-[20rem] h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.5),rgba(99,102,241,0.22)_35%,rgba(0,0,0,0)_70%)] blur-3xl"
              style={{
                transformOrigin: "top left",
              }}
            />

            {/* Secondary colour wash */}
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.8,
              }}
              animate={{
                opacity:
                  phase === "cover"
                    ? 1
                    : 0,
                scale:
                  phase === "cover"
                    ? 1
                    : 1.2,
              }}
              transition={{
                duration: 0.8,
                delay: 0.15,
              }}
              className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(168,85,247,0.18),transparent_45%),radial-gradient(circle_at_100%_100%,rgba(59,130,246,0.1),transparent_40%)]"
            />

            {/* Center logo */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {phase === "logo" || phase === "cover" ? (
                  <motion.div
                    key="brand-logo"
                    initial={{
                      opacity: 0,
                      scale: 0.6,
                    }}
                    animate={{
                      opacity: 1,
                      scale:
                        phase === "cover"
                          ? 0.9
                          : 1,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 1.2,
                      filter: "blur(10px)",
                    }}
                    transition={{
                      duration: 0.45,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <BrandMark />
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            {/* Small loading line */}
            {(phase === "logo" || phase === "cover") && (
              <motion.div
                initial={{
                  scaleX: 0,
                  opacity: 0,
                }}
                animate={{
                  scaleX: 1,
                  opacity: 1,
                }}
                transition={{
                  duration: 0.8,
                  delay: 0.15,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="absolute bottom-10 left-1/2 h-px w-20 -translate-x-1/2 origin-left bg-gradient-to-r from-transparent via-violet-400 to-transparent"
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </BrandTransitionContext.Provider>
  );
}

export function useBrandTransition() {
  const context = useContext(BrandTransitionContext);

  if (!context) {
    throw new Error(
      "useBrandTransition must be used inside BrandTransitionProvider",
    );
  }

  return context;
}