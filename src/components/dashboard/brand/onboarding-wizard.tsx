// src/components/dashboard/brand/onboarding-wizard.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Sparkles,
  Globe2,
  Instagram,
  ArrowRight,
  Check,
} from "lucide-react";

import {
  analyzeWebsite,
  saveBrandPreferences,
} from "@/server/actions/brand";

import { generateBrandReport } from "@/server/actions/brand-report";

import { BrandBrainModal } from "./brand-brain-modal";

type Step =
  | "welcome"
  | "choose-path"
  | "website-input"
  | "preferences-input";

export function OnboardingWizard() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("welcome");
  const [path, setPath] = useState<"website" | "no-website" | null>(null);

  const [websiteUrl, setWebsiteUrl] = useState("");
  const [brandName, setBrandName] = useState("");
  const [instagramHandle, setInstagramHandle] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runWebsiteFlow() {
    const analyzeResult = await analyzeWebsite({ websiteUrl });
    if (!analyzeResult.success) return { success: false, error: analyzeResult.error };
    const reportResult = await generateBrandReport();
    if (!reportResult.success) return { success: false, error: reportResult.error };
    return { success: true };
  }

  async function runPreferencesFlow() {
    const saveResult = await saveBrandPreferences({
      brandName: brandName || undefined,
      instagramHandle: instagramHandle || undefined,
    });
    if (!saveResult.success) return { success: false, error: saveResult.error };
    const reportResult = await generateBrandReport();
    if (!reportResult.success) return { success: false, error: reportResult.error };
    return { success: true };
  }

  function goBack() {
    setError(null);
    if (step === "welcome") {
      router.back();
      return;
    }
    if (step === "choose-path") {
      setStep("welcome");
      return;
    }
    setStep("choose-path");
  }

  // TopBar now takes a single visual mode: "onLight" for the welcome
  // screen (bg-foreground hero), "onPhoto" for screens with a photo scrim
  // behind them (dark overlay regardless of theme).
  const TopBar = ({ mode = "onLight" }: { mode?: "onLight" | "onPhoto" }) => {
    const isPhoto = mode === "onPhoto";
    return (
      <div className="absolute inset-x-0 top-0 z-50 px-5 pt-5 sm:px-7 sm:pt-7 lg:px-10 lg:pt-8">
        <div className="flex items-center">
          <button
            type="button"
            onClick={goBack}
            aria-label="Go back"
            className={[
              "flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-200",
              isPhoto
                ? "border-white/10 bg-white/[0.07] text-white hover:bg-white/[0.12]"
                : "border-background/15 bg-background/15 text-background hover:bg-background/25",
            ].join(" ")}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div
            className={[
              "absolute left-1/2 flex -translate-x-1/2 items-center gap-2",
              isPhoto ? "text-white" : "text-background",
            ].join(" ")}
          >
            <div
              className={[
                "flex h-8 w-8 items-center justify-center rounded-xl",
                isPhoto ? "bg-white text-foreground" : "bg-background text-foreground",
              ].join(" ")}
            >
              <span className="text-sm font-black">B</span>
            </div>

            <span className="hidden text-sm font-bold tracking-tight sm:block">
              BrandPilot
              <span className={isPhoto ? "text-white/40" : "text-background/40"}> AI</span>
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden bg-background font-sans">
      <AnimatePresence mode="wait">
        {/* =========================================================
            SCREEN 1 — WELCOME
        ========================================================= */}
        {step === "welcome" && (
          <motion.section
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col overflow-y-auto bg-foreground"
          >
            <TopBar mode="onLight" />

            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-background/15 blur-3xl" />
              <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-background/[0.05] blur-3xl" />
              <div className="absolute left-[8%] top-[22%] h-2 w-2 rounded-full bg-background/30" />
              <div className="absolute right-[12%] top-[34%] h-3 w-3 rounded-full bg-background/20" />
            </div>

            <div className="relative z-10 flex min-h-full flex-col items-center justify-center px-4 pt-20 pb-12 sm:pt-24 lg:pt-20">
              <div
                className="relative flex shrink-0 items-center justify-center"
                style={{ width: "min(75vw, 38vh, 360px)", height: "min(75vw, 38vh, 360px)" }}
                data-laptop-size="true"
              >
                <style jsx>{`
                  @media (min-width: 1024px) {
                    div[data-laptop-size="true"] {
                      width: min(75vw, 46vh, 430px) !important;
                      height: min(75vw, 46vh, 430px) !important;
                    }
                  }
                `}</style>

                <div className="absolute left-1/2 top-1/2 h-[55%] w-[55%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-background/10 blur-3xl" />

                {/* LEFT CARD (Website) */}
                <motion.div
                  initial={{ opacity: 0, x: -20, y: 15, rotate: -20, scale: 0.9 }}
                  animate={{ opacity: 1, x: "-40%", y: "-30%", rotate: -14, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 m-auto w-[38%] aspect-[9/13] rounded-[1.2rem] bg-card p-1 shadow-[0_18px_40px_rgba(0,0,0,0.25)] sm:rounded-[1.4rem] sm:p-1.5 lg:[transform:translateX(-50%)_translateY(-30%)_rotate(-14deg)]"
                >
                  <div className="relative h-full w-full overflow-hidden rounded-[0.95rem] bg-muted sm:rounded-[1.1rem]">
                    <Image src="/onboarding/path-website.png" alt="Website" fill priority sizes="(max-width: 640px) 120px, 200px" className="object-cover" />
                    <div className="absolute inset-0 bg-black/10" />
                  </div>
                </motion.div>

                {/* RIGHT CARD (Social) */}
                <motion.div
                  initial={{ opacity: 0, x: 20, y: 15, rotate: 20, scale: 0.9 }}
                  animate={{ opacity: 1, x: "40%", y: "-30%", rotate: 14, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 m-auto w-[42%] aspect-[9/13] rounded-[1.2rem] bg-card p-1 shadow-[0_18px_40px_rgba(0,0,0,0.25)] sm:rounded-[1.4rem] sm:p-1.5 lg:[transform:translateX(50%)_translateY(-30%)_rotate(14deg)]"
                >
                  <div className="relative h-full w-full overflow-hidden rounded-[0.95rem] bg-muted sm:rounded-[1.1rem]">
                    <Image src="/onboarding/path-social.png" alt="Social media" fill priority sizes="(max-width: 640px) 130px, 210px" className="object-cover" />
                  </div>
                </motion.div>

                {/* CENTER CARD (BrandPilot) */}
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: "0%", scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 m-auto z-20 w-[55%] aspect-[9/13] rounded-[1.4rem] bg-background p-1.5 shadow-[0_30px_70px_rgba(0,0,0,0.35)] sm:rounded-[1.6rem] sm:p-2"
                >
                  <div className="relative flex h-full flex-col overflow-hidden rounded-[1.1rem] bg-foreground sm:rounded-[1.2rem]">
                    <div className="flex items-center justify-between border-b border-background/10 px-3 py-2 sm:px-4 sm:py-2.5">
                      <div className="flex items-center gap-1.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-background sm:h-2 sm:w-2" />
                        <span className="text-[7px] font-bold tracking-wide text-background/60 sm:text-[9px]">
                          BRANDPILOT
                        </span>
                      </div>
                      <Sparkles className="h-2.5 w-2.5 text-background sm:h-3.5 sm:w-3.5" />
                    </div>

                    <div className="flex flex-1 flex-col justify-center px-3 sm:px-5">
                      <div className="text-[6px] uppercase tracking-[0.16em] text-background/25 sm:text-[8px]">
                        Brand Brain
                      </div>
                      <div className="mt-1 text-[0.7rem] font-bold leading-[1.05] text-background sm:mt-1.5 sm:text-[1.1rem] md:text-[1.3rem]">
                        Know your brand.
                        <span className="block text-background/70">Create better.</span>
                      </div>
                      <div className="mt-2 space-y-1 sm:mt-4 sm:space-y-1.5">
                        <div className="h-1 w-full rounded-full bg-background/10 sm:h-1.5">
                          <div className="h-full w-[78%] rounded-full bg-background" />
                        </div>
                        <div className="flex justify-between text-[5px] text-background/25 sm:text-[7px]">
                          <span>Brand intelligence</span>
                          <span>78%</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-background/[0.06] px-3 py-1.5 sm:px-4 sm:py-2.5">
                      <div className="flex items-center justify-between text-[5px] uppercase tracking-wider text-background/20 sm:text-[7px]">
                        <span>AI analysis</span>
                        <span className="text-background/80">Ready</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* AI READY BADGE */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, rotate: 16 }}
                  animate={{ opacity: 1, scale: 1, rotate: 6 }}
                  transition={{ duration: 0.5, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute bottom-[2%] right-[5%] z-30 flex w-[22%] aspect-square items-center justify-center rounded-full bg-background shadow-[0_12px_30px_rgba(0,0,0,0.3)]"
                >
                  <div className="text-center">
                    <Sparkles className="mx-auto h-2.5 w-2.5 text-foreground sm:h-3.5 sm:w-3.5" />
                    <span className="mt-0.5 block text-[5px] font-bold text-foreground sm:text-[7px]">
                      AI READY
                    </span>
                  </div>
                </motion.div>
              </div>

              <div className="mt-6 w-full max-w-lg text-center sm:mt-8 lg:mt-4">
                <h1 className="text-[1.65rem] font-extrabold leading-[1.02] tracking-[-0.045em] text-background sm:text-3xl lg:text-[1.75rem]">
                  Let&apos;s make your brand
                  <br />
                  <span className="text-background/60">easier to market.</span>
                </h1>

                <p className="mx-auto mt-2 max-w-md text-[12px] font-medium leading-4 text-background/60 sm:mt-3 sm:text-[13px] lg:text-[12px] lg:leading-[1.3]">
                  Give BrandPilot a little context and let AI turn it into
                  content, ideas and campaigns that actually sound like you.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setStep("choose-path");
                  }}
                  className="mx-auto mt-4 flex w-full max-w-sm items-center justify-center gap-2 rounded-2xl bg-background py-3.5 text-sm font-bold text-foreground shadow-xl transition-all hover:scale-[1.01] active:scale-[0.98] sm:mt-5 lg:py-3 lg:text-[13px]"
                >
                  Let&apos;s get started
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.section>
        )}

        {/* =========================================================
            SCREEN 2 — CHOOSE PATH
        ========================================================= */}
        {step === "choose-path" && (
          <motion.section
            key="choose-path"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col overflow-hidden bg-foreground"
          >
            <div className="absolute inset-0">
              <Image src="/onboarding/path-social.png" alt="" fill priority sizes="100vw" className="object-cover" />
              <div className="absolute inset-0 bg-black/55" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/95" />
            </div>

            <TopBar mode="onPhoto" />

            <div className="absolute right-6 top-24 z-30 sm:right-10">
              <motion.div
                initial={{ opacity: 0, y: -10, rotate: 8 }}
                animate={{ opacity: 1, y: 0, rotate: 5 }}
                transition={{ delay: 0.3 }}
                className="flex h-20 w-20 items-center justify-center rounded-full border border-background/20 bg-background text-center shadow-xl"
              >
                <div>
                  <Sparkles className="mx-auto mb-1 h-4 w-4 text-foreground" />
                  <span className="text-[9px] font-black uppercase leading-tight text-foreground">
                    AI will
                    <br />
                    do the work
                  </span>
                </div>
              </motion.div>
            </div>

            <div className="relative z-20 flex flex-1 items-center px-5 py-28 sm:px-8 lg:px-10">
              <div className="mx-auto w-full max-w-3xl">
                <div className="mb-7 text-center">
                  <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                    Step 02 · Your brand
                  </div>
                  <h2 className="text-[2.2rem] font-extrabold leading-[0.95] tracking-[-0.045em] text-white sm:text-5xl">
                    Tell us where
                    <br />
                    your brand lives.
                  </h2>
                </div>

                <div className="relative mx-auto max-w-2xl">
                  <div className="absolute -top-3 left-3 right-3 h-full rounded-[1.7rem] border border-white/10 bg-white/[0.08] backdrop-blur-sm" />

                  <div className="relative rounded-[1.7rem] bg-card p-5 shadow-2xl sm:p-7">
                    <div className="mb-5">
                      <h3 className="text-lg font-bold tracking-tight text-card-foreground">
                        What can we use to understand your brand?
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Choose the option that works best for you.
                      </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => {
                          setPath("website");
                          setError(null);
                          setStep("website-input");
                        }}
                        className="group flex items-center justify-between rounded-2xl bg-muted p-4 text-left transition-all hover:bg-foreground/[0.08]"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground text-background">
                            <Globe2 className="h-4 w-4" />
                          </div>
                          <div>
                            <span className="block text-sm font-bold text-card-foreground">
                              I have a website
                            </span>
                            <span className="mt-0.5 block text-[10px] text-muted-foreground">
                              Fastest way to get started
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-card-foreground" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setPath("no-website");
                          setError(null);
                          setStep("preferences-input");
                        }}
                        className="group flex items-center justify-between rounded-2xl bg-muted p-4 text-left transition-all hover:bg-foreground/[0.08]"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground text-background">
                            <Sparkles className="h-4 w-4" />
                          </div>
                          <div>
                            <span className="block text-sm font-bold text-card-foreground">
                              No website yet
                            </span>
                            <span className="mt-0.5 block text-[10px] text-muted-foreground">
                              We&apos;ll build from your input
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-card-foreground" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* =========================================================
            SCREEN 3 — WEBSITE INPUT
        ========================================================= */}
        {step === "website-input" && (
          <motion.section
            key="website-input"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 flex flex-col overflow-hidden bg-foreground"
          >
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-foreground via-foreground to-black/90" />
              <div className="absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full bg-background/[0.12] blur-[140px]" />
              <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-channel-instagram/[0.10] blur-[140px]" />

              <motion.div
                initial={{ opacity: 0, rotate: -18, y: -20 }}
                animate={{ opacity: 0.35, rotate: -18, y: 0 }}
                transition={{ duration: 1.2, delay: 0.3 }}
                className="absolute left-[4%] top-[20%] rounded-2xl bg-card p-1.5 shadow-2xl"
              >
                <div className="relative h-[190px] w-[140px] overflow-hidden rounded-xl">
                  <Image src="/onboarding/onboarding-hero-1.jpg" alt="" fill className="object-cover" sizes="140px" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, rotate: 22, y: -20 }}
                animate={{ opacity: 0.32, rotate: 22, y: 0 }}
                transition={{ duration: 1.2, delay: 0.4 }}
                className="absolute right-[4%] top-[26%] rounded-2xl bg-card p-1.5 shadow-2xl"
              >
                <div className="relative h-[210px] w-[160px] overflow-hidden rounded-xl">
                  <Image src="/onboarding/onboarding-hero-2.jpg" alt="" fill className="object-cover" sizes="160px" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, rotate: -8, y: 20 }}
                animate={{ opacity: 0.28, rotate: -8, y: 0 }}
                transition={{ duration: 1.2, delay: 0.5 }}
                className="absolute bottom-[16%] left-[8%] rounded-2xl bg-card p-1.5 shadow-2xl"
              >
                <div className="relative h-[170px] w-[135px] overflow-hidden rounded-xl">
                  <Image src="/onboarding/onboarding-hero-3.jpg" alt="" fill className="object-cover" sizes="135px" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, rotate: 14, y: 20 }}
                animate={{ opacity: 0.3, rotate: 14, y: 0 }}
                transition={{ duration: 1.2, delay: 0.6 }}
                className="absolute bottom-[20%] right-[6%] rounded-2xl bg-card p-1.5 shadow-2xl"
              >
                <div className="relative h-[190px] w-[140px] overflow-hidden rounded-xl">
                  <Image src="/onboarding/onboarding-hero-4.jpg" alt="" fill className="object-cover" sizes="140px" />
                </div>
              </motion.div>

              <div
                className="absolute inset-0 opacity-[0.04]"
                style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: "28px 28px" }}
              />

              <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-foreground via-foreground/80 to-transparent" />
            </div>

            <div className="relative z-20 flex items-center justify-between px-5 pt-6 sm:px-8">
              <button
                type="button"
                onClick={goBack}
                className="group flex h-11 w-11 items-center justify-center rounded-full border border-background/10 bg-background/[0.06] backdrop-blur-xl transition-all hover:border-background/20 hover:bg-background/[0.12]"
              >
                <ChevronLeft className="h-5 w-5 text-background/80 transition-colors group-hover:text-background" />
              </button>

              <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-background/10 bg-background/[0.06] px-3.5 py-1.5 backdrop-blur-xl">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-background" />
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-background/70">
                  Step 2 of 3
                </span>
              </div>

              <div className="h-11 w-11" />
            </div>

            <div className="relative z-10 flex flex-1 flex-col overflow-y-auto px-5 pt-8 pb-6 sm:px-8">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="mb-6"
              >
                <h1 className="text-[2rem] font-extrabold leading-[1.05] tracking-[-0.03em] text-background sm:text-[2.5rem]">
                  Let&apos;s find your
                  <br />
                  <span className="bg-gradient-to-r from-background to-background/50 bg-clip-text text-transparent">
                    website.
                  </span>
                </h1>
                <p className="mt-3 max-w-sm text-sm leading-6 text-background/50">
                  We&apos;ll scan it to understand your brand, your voice, and your audience.
                </p>
              </motion.div>

              <div className="flex-1 min-h-8" />

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="relative mx-auto w-full max-w-md"
              >
                <div className="relative overflow-hidden rounded-[2rem] bg-card p-6 shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.8)]">
                  <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-border" />

                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-foreground">
                      <Globe2 className="h-5 w-5 text-background" strokeWidth={2.5} />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                        Website URL
                      </div>
                      <div className="text-sm font-semibold text-card-foreground">
                        Where can we find you?
                      </div>
                    </div>
                  </div>

                  <input
                    value={websiteUrl}
                    onChange={(e) => {
                      setWebsiteUrl(e.target.value);
                      setError(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && websiteUrl.trim().length >= 4) {
                        setError(null);
                        setShowModal(true);
                      }
                    }}
                    placeholder="https://yourbusiness.com"
                    className="h-14 w-full rounded-2xl border border-border bg-muted px-4 text-sm font-medium text-card-foreground outline-none transition-all placeholder:text-muted-foreground/60 focus:border-foreground/40 focus:bg-card focus:shadow-[0_0_0_4px_hsl(var(--foreground)/0.12)]"
                    autoFocus
                  />

                  {error && <p className="mt-3 text-xs font-medium text-red-500">{error}</p>}

                  <div className="mt-5 flex flex-wrap gap-2">
                    {["Business", "Audience", "Voice", "Themes"].map((item, i) => (
                      <motion.span
                        key={item}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 + i * 0.05 }}
                        className="flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-[10px] font-semibold text-muted-foreground"
                      >
                        <Check className="h-3 w-3 text-card-foreground" strokeWidth={3} />
                        {item}
                      </motion.span>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setError(null);
                      if (websiteUrl.trim().length < 4) {
                        setError("Enter your website address to continue.");
                        return;
                      }
                      setShowModal(true);
                    }}
                    disabled={websiteUrl.trim().length < 4}
                    className="group mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-foreground py-4 text-sm font-bold text-background shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] transition-all hover:scale-[1.01] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
                  </button>

                  <p className="mt-3 text-center text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground/70">
                    Takes about 30 seconds
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.section>
        )}

        {/* =========================================================
            SCREEN 4 — NO WEBSITE INPUT
        ========================================================= */}
        {step === "preferences-input" && (
          <motion.section
            key="preferences-input"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 flex flex-col overflow-hidden bg-foreground"
          >
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-foreground via-foreground to-black/90" />
              <div className="absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full bg-channel-instagram/[0.14] blur-[140px]" />
              <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-background/[0.10] blur-[140px]" />

              <motion.div
                initial={{ opacity: 0, rotate: -16, y: -20 }}
                animate={{ opacity: 0.32, rotate: -16, y: 0 }}
                transition={{ duration: 1.2, delay: 0.3 }}
                className="absolute left-[6%] top-[22%] rounded-2xl bg-card p-1.5 shadow-2xl"
              >
                <div className="relative h-[170px] w-[135px] overflow-hidden rounded-xl">
                  <Image src="/onboarding/onboarding-hero-2.jpg" alt="" fill className="object-cover" sizes="135px" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, rotate: 20, y: -20 }}
                animate={{ opacity: 0.3, rotate: 20, y: 0 }}
                transition={{ duration: 1.2, delay: 0.4 }}
                className="absolute right-[5%] top-[28%] rounded-2xl bg-card p-1.5 shadow-2xl"
              >
                <div className="relative h-[190px] w-[140px] overflow-hidden rounded-xl">
                  <Image src="/onboarding/onboarding-hero-3.jpg" alt="" fill className="object-cover" sizes="140px" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, rotate: -10, y: 20 }}
                animate={{ opacity: 0.28, rotate: -10, y: 0 }}
                transition={{ duration: 1.2, delay: 0.5 }}
                className="absolute bottom-[18%] left-[4%] rounded-2xl bg-card p-1.5 shadow-2xl"
              >
                <div className="relative h-[190px] w-[140px] overflow-hidden rounded-xl">
                  <Image src="/onboarding/onboarding-hero-4.jpg" alt="" fill className="object-cover" sizes="140px" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, rotate: 12, y: 20 }}
                animate={{ opacity: 0.3, rotate: 12, y: 0 }}
                transition={{ duration: 1.2, delay: 0.6 }}
                className="absolute bottom-[22%] right-[6%] rounded-2xl bg-card p-1.5 shadow-2xl"
              >
                <div className="relative h-[170px] w-[135px] overflow-hidden rounded-xl">
                  <Image src="/onboarding/onboarding-hero-1.jpg" alt="" fill className="object-cover" sizes="135px" />
                </div>
              </motion.div>

              <div
                className="absolute inset-0 opacity-[0.04]"
                style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: "28px 28px" }}
              />

              <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-foreground via-foreground/80 to-transparent" />
            </div>

            <div className="relative z-20 flex items-center justify-between px-5 pt-6 sm:px-8">
              <button
                type="button"
                onClick={goBack}
                className="group flex h-11 w-11 items-center justify-center rounded-full border border-background/10 bg-background/[0.06] backdrop-blur-xl transition-all hover:border-background/20 hover:bg-background/[0.12]"
              >
                <ChevronLeft className="h-5 w-5 text-background/80 transition-colors group-hover:text-background" />
              </button>

              <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-background/10 bg-background/[0.06] px-3.5 py-1.5 backdrop-blur-xl">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-background" />
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-background/70">
                  Step 2 of 3
                </span>
              </div>

              <div className="h-11 w-11" />
            </div>

            <div className="relative z-10 flex flex-1 flex-col overflow-y-auto px-5 pt-8 pb-6 sm:px-8">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="mb-6"
              >
                <h1 className="text-[2rem] font-extrabold leading-[1.05] tracking-[-0.03em] text-background sm:text-[2.5rem]">
                  Tell us about
                  <br />
                  <span className="bg-gradient-to-r from-background to-background/50 bg-clip-text text-transparent">
                    your brand.
                  </span>
                </h1>
                <p className="mt-3 max-w-sm text-sm leading-6 text-background/50">
                  No website? No problem. Just a couple details.
                </p>
              </motion.div>

              <div className="flex-1 min-h-8" />

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="relative mx-auto w-full max-w-md"
              >
                <div className="relative overflow-hidden rounded-[2rem] bg-card p-6 shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.8)]">
                  <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-border" />

                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-foreground">
                      <Sparkles className="h-5 w-5 text-background" strokeWidth={2.5} />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                        Brand Name
                      </div>
                      <div className="text-sm font-semibold text-card-foreground">
                        What should we call you?
                      </div>
                    </div>
                  </div>

                  <input
                    value={brandName}
                    onChange={(e) => {
                      setBrandName(e.target.value);
                      setError(null);
                    }}
                    placeholder="e.g. GH Studios"
                    className="h-14 w-full rounded-2xl border border-border bg-muted px-4 text-sm font-medium text-card-foreground outline-none transition-all placeholder:text-muted-foreground/60 focus:border-foreground/40 focus:bg-card focus:shadow-[0_0_0_4px_hsl(var(--foreground)/0.12)]"
                    autoFocus
                  />

                  <div className="mt-5 mb-3 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-channel-instagram">
                      <Instagram className="h-5 w-5 text-white" strokeWidth={2.5} />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                        Instagram
                      </div>
                      <div className="text-sm font-semibold text-card-foreground">
                        Optional but helpful
                      </div>
                    </div>
                  </div>

                  <input
                    value={instagramHandle}
                    onChange={(e) => {
                      setInstagramHandle(e.target.value);
                      setError(null);
                    }}
                    placeholder="@yourbrand"
                    className="h-14 w-full rounded-2xl border border-border bg-muted px-4 text-sm font-medium text-card-foreground outline-none transition-all placeholder:text-muted-foreground/60 focus:border-channel-instagram/60 focus:bg-card focus:shadow-[0_0_0_4px_rgba(225,48,108,0.15)]"
                  />

                  {error && <p className="mt-3 text-xs font-medium text-red-500">{error}</p>}

                  <button
                    type="button"
                    onClick={() => {
                      setError(null);
                      if (!brandName.trim()) {
                        setError("Enter your brand name to continue.");
                        return;
                      }
                      setShowModal(true);
                    }}
                    disabled={!brandName.trim()}
                    className="group mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-foreground py-4 text-sm font-bold text-background shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] transition-all hover:scale-[1.01] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
                  </button>

                  <p className="mt-3 text-center text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground/70">
                    You can edit these later
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <BrandBrainModal
        isOpen={showModal}
        run={path === "website" ? runWebsiteFlow : runPreferencesFlow}
        onDone={(result) => {
          setShowModal(false);
          if (!result.success) {
            setError(result.error ?? "Something went wrong.");
            return;
          }
          router.push("/dashboard/brand/success");
        }}
      />
    </div>
  );
}