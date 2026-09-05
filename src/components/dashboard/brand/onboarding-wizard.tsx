// src/components/dashboard/brand/onboarding-wizard.tsx
// First-time Brand Brain setup — replaces the plain two-panel form for
// brand-new users with a deliberate, guided sequence, matching the
// existing SpotlightCard/Reveal design language rather than dumping
// a dense form on someone who just signed up.
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Reveal, SpotlightCard } from "@/components/dashboard/overview/motion-primitives";
import { Button } from "@/components/ui/button";
import { BrandBrainModal } from "./brand-brain-modal";
import { analyzeWebsite } from "@/server/actions/brand";
import { generateBrandReport } from "@/server/actions/brand-report";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Sparkles, ArrowRight, Instagram } from "lucide-react";

type Step = "welcome" | "choose-path" | "website-input" | "preferences-input";
type Path = "website" | "no-website" | null;

export function OnboardingWizard() {
    const router = useRouter();
    const [step, setStep] = useState<Step>("welcome");
    const [path, setPath] = useState<Path>(null);
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
        const { saveBrandPreferences } = await import("@/server/actions/brand");
        const saveResult = await saveBrandPreferences({
            brandName: brandName || undefined,
            instagramHandle: instagramHandle || undefined,
        });
        if (!saveResult.success) return { success: false, error: saveResult.error };
        const reportResult = await generateBrandReport();
        if (!reportResult.success) return { success: false, error: reportResult.error };
        return { success: true };
    }

    // replace the outer wrapper's ambient glow + step rendering with:
    return (
        <div className="relative flex min-h-[80vh] items-center justify-center overflow-hidden">
            {/* Ambient glow, now gently breathing instead of static */}
            <motion.div
                aria-hidden
                animate={{ opacity: [0.5, 0.8, 0.5], scale: [1, 1.05, 1] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="pointer-events-none absolute inset-x-0 top-0 h-[500px] bg-[radial-gradient(circle_at_50%_0%,color-mix(in_oklab,var(--foreground)_8%,transparent),transparent_60%)]"
            />

            {/* Slow-drifting secondary glow for depth */}
            <motion.div
                aria-hidden
                animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                className="pointer-events-none absolute -right-20 top-1/3 h-[300px] w-[300px] rounded-full bg-[color-mix(in_oklab,var(--foreground)_4%,transparent)] blur-3xl"
            />

            <div className="relative w-full max-w-lg px-4">
                <AnimatePresence mode="wait">
                    {step === "welcome" && (
                        <motion.div
                            key="welcome"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -16, filter: "blur(4px)" }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <SpotlightCard className="p-10 text-center">
                                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                                    Get started
                                </p>
                                <h1 className="mt-4 text-3xl font-semibold tracking-tight">
                                    Let's build your Brand Brain
                                </h1>
                                <p className="mx-auto mt-3 max-w-sm text-sm text-muted-foreground">
                                    A few quick steps, and BrandPilot will understand your business well enough
                                    to generate content and posters in your actual voice.
                                </p>
                                <Button className="mt-8" size="lg" onClick={() => setStep("choose-path")}>
                                    Get started <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </SpotlightCard>
                        </motion.div>
                    )}

                    {step === "choose-path" && (
                        <motion.div
                            key="choose-path"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -16, filter: "blur(4px)" }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <div className="text-center">
                                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                                    Step 1 of 2
                                </p>
                                <h1 className="mt-3 text-2xl font-semibold tracking-tight">How do customers find you?</h1>
                            </div>

                            <div className="mt-8 grid gap-4 sm:grid-cols-2">
                                <motion.button
                                    whileHover={{ y: -3 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        setPath("website");
                                        setStep("website-input");
                                    }}
                                    className="text-left"
                                >
                                    <SpotlightCard className="h-full p-6">
                                        <Globe className="h-5 w-5 text-muted-foreground" />
                                        <p className="mt-4 font-medium">I have a website</p>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            We'll read it and build your brand profile automatically.
                                        </p>
                                    </SpotlightCard>
                                </motion.button>

                                <motion.button
                                    whileHover={{ y: -3 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        setPath("no-website");
                                        setStep("preferences-input");
                                    }}
                                    className="text-left"
                                >
                                    <SpotlightCard className="h-full p-6">
                                        <Instagram className="h-5 w-5 text-muted-foreground" />
                                        <p className="mt-4 font-medium">I don't have a website</p>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            Just Instagram, WhatsApp, or word of mouth — that's fine too.
                                        </p>
                                    </SpotlightCard>
                                </motion.button>
                            </div>
                        </motion.div>
                    )}

                    {step === "website-input" && (
                        <motion.div
                            key="website-input"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -16, filter: "blur(4px)" }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <SpotlightCard className="p-8">
                                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                                    Step 2 of 2
                                </p>
                                <h1 className="mt-3 text-xl font-semibold tracking-tight">What's your website?</h1>

                                <input
                                    value={websiteUrl}
                                    onChange={(e) => setWebsiteUrl(e.target.value)}
                                    placeholder="https://yourbusiness.com"
                                    className="mt-6 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground/30"
                                />
                                {error && <p className="mt-2 text-xs text-red-500">{error}</p>}

                                <div className="mt-6 flex gap-3">
                                    <Button variant="outline" onClick={() => setStep("choose-path")}>Back</Button>
                                    <Button
                                        className="flex-1"
                                        disabled={websiteUrl.trim().length < 4}
                                        onClick={() => {
                                            setError(null);
                                            setShowModal(true);
                                        }}
                                    >
                                        <Sparkles className="mr-2 h-4 w-4" /> Analyze & Continue
                                    </Button>
                                </div>
                            </SpotlightCard>
                        </motion.div>
                    )}

                    {step === "preferences-input" && (
                        <motion.div
                            key="preferences-input"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -16, filter: "blur(4px)" }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <SpotlightCard className="p-8">
                                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                                    Step 2 of 2
                                </p>
                                <h1 className="mt-3 text-xl font-semibold tracking-tight">Tell us about your brand</h1>

                                <div className="mt-6 space-y-4">
                                    <div>
                                        <label className="text-xs font-medium text-muted-foreground">Brand name</label>
                                        <input
                                            value={brandName}
                                            onChange={(e) => setBrandName(e.target.value)}
                                            className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground/30"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-muted-foreground">Instagram handle</label>
                                        <input
                                            value={instagramHandle}
                                            onChange={(e) => setInstagramHandle(e.target.value)}
                                            placeholder="@yourbrand"
                                            className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground/30"
                                        />
                                    </div>
                                </div>
                                {error && <p className="mt-2 text-xs text-red-500">{error}</p>}

                                <div className="mt-6 flex gap-3">
                                    <Button variant="outline" onClick={() => setStep("choose-path")}>Back</Button>
                                    <Button
                                        className="flex-1"
                                        disabled={brandName.trim().length < 1}
                                        onClick={() => {
                                            setError(null);
                                            setShowModal(true);
                                        }}
                                    >
                                        <Sparkles className="mr-2 h-4 w-4" /> Build Brand Brain
                                    </Button>
                                </div>
                            </SpotlightCard>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <BrandBrainModal
                isOpen={showModal}
                run={path === "website" ? runWebsiteFlow : runPreferencesFlow}
                onDone={(result) => {
                    setShowModal(false);
                    if (!result.success) {
                        setError(result.error ?? "Something went wrong");
                        return;
                    }
                    router.push("/dashboard/brand/success");
                }}
            />
        </div>
    );
}