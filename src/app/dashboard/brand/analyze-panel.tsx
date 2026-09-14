"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  analyzeWebsiteSchema,
  type AnalyzeWebsiteInput,
} from "@/lib/validations/brand";

import { analyzeWebsite } from "@/server/actions/brand";

import { Button } from "@/components/ui/button";

import {
  AlertCircle,
  CheckCircle2,
  Globe2,
  Loader2,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

export function AnalyzePanel() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AnalyzeWebsiteInput>({
    resolver: zodResolver(analyzeWebsiteSchema),
  });

  async function onSubmit(values: AnalyzeWebsiteInput) {
    setServerError(null);
    setSuccess(false);

    const result = await analyzeWebsite(values);

    if (!result.success) {
      setServerError(result.error);
      return;
    }

    setSuccess(true);
  }

  return (
    <div className="relative overflow-hidden">
      {/* Decorative glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative p-6 sm:p-7">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold tracking-tight">
                Analyze your website
              </h3>

              <span className="rounded-full border border-primary/20 bg-primary/5 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary">
                AI
              </span>
            </div>

            <p className="mt-1.5 text-sm leading-5 text-muted-foreground">
              Let BrandPilot scan your website and create a starting point
              for your Brand Brain.
            </p>
          </div>
        </div>

        {/* What happens */}
        <div className="mt-6 rounded-2xl border border-border/60 bg-background/40 p-4">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
            What we'll look at
          </p>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 rounded-xl border border-border/50 bg-card/50 px-3 py-2.5">
              <Globe2 className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs">Business identity</span>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-border/50 bg-card/50 px-3 py-2.5">
              <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs">Brand tone</span>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-border/50 bg-card/50 px-3 py-2.5">
              <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs">Target audience</span>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-border/50 bg-card/50 px-3 py-2.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs">Key themes</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
          <label
            htmlFor="websiteUrl"
            className="mb-2 block text-sm font-medium"
          >
            Website URL
          </label>

          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Globe2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <input
                id="websiteUrl"
                {...register("websiteUrl")}
                placeholder="https://yourbusiness.com"
                disabled={isSubmitting}
                className="h-11 w-full rounded-xl border border-border bg-background/70 pl-10 pr-3 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 rounded-xl px-5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  Analyze
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>

          {errors.websiteUrl && (
            <div className="mt-3 flex items-center gap-2 text-sm text-red-500">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <p>{errors.websiteUrl.message}</p>
            </div>
          )}
        </form>

        {/* Server error */}
        {serverError && (
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-3.5 text-sm text-red-500">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

            <div>
              <p className="font-medium">Analysis couldn't be completed</p>
              <p className="mt-1 text-xs leading-5 opacity-80">
                {serverError}
              </p>
            </div>
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-3.5">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

            <div>
              <p className="text-sm font-medium text-primary">
                Brand analysis complete
              </p>

              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                We've applied the suggestions to your Brand Brain. Review
                them on the right and adjust anything that isn't quite right.
              </p>
            </div>
          </div>
        )}

        {/* No website note */}
        <div className="mt-5 border-t border-border/50 pt-4">
          <p className="text-xs leading-5 text-muted-foreground">
            <span className="font-medium text-foreground">
              Don't have a website?
            </span>{" "}
            No problem. You can define your brand manually using the
            preferences beside this panel.
          </p>
        </div>
      </div>
    </div>
  );
}