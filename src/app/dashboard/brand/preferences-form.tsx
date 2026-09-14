"use client";

import { useState } from "react";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  brandPreferencesSchema,
  type BrandPreferencesInput,
} from "@/lib/validations/brand";

import {
  BUSINESS_TYPES,
  BRAND_TONES,
  TARGET_AUDIENCES,
} from "@/lib/constants/brand-options";

import { saveBrandPreferences } from "@/server/actions/brand";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import {
  AlertCircle,
  Check,
  ChevronDown,
  Loader2,
  Save,
  Sparkles,
  Users,
} from "lucide-react";

interface PreferencesFormProps {
  initial: {
    brandName: string | null;
    businessType: string | null;
    tone: string | null;
    audience: string | null;
    keywords: string[];
  };
}

export function PreferencesForm({ initial }: PreferencesFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<BrandPreferencesInput>({
    resolver: zodResolver(brandPreferencesSchema),
    defaultValues: {
      brandName: initial.brandName ?? "",
      businessType:
        (initial.businessType as BrandPreferencesInput["businessType"]) ??
        undefined,
      tone:
        (initial.tone as BrandPreferencesInput["tone"]) ??
        undefined,
      audience:
        (initial.audience
          ?.split(", ")
          .filter(Boolean) as BrandPreferencesInput["audience"]) ?? [],
      keywords: initial.keywords ?? [],
    },
  });

  async function onSubmit(values: BrandPreferencesInput) {
    setServerError(null);
    setSaved(false);

    const result = await saveBrandPreferences(values);

    if (!result.success) {
      setServerError(result.error);
      return;
    }

    setSaved(true);
  }

  return (
    <div className="relative overflow-hidden">
      {/* Decorative glow */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative p-6 sm:p-7">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>

          <div>
            <h3 className="font-semibold tracking-tight">
              Your brand preferences
            </h3>

            <p className="mt-1.5 text-sm leading-5 text-muted-foreground">
              Fine-tune the details BrandPilot uses to make your content feel
              like your brand.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-7">
          {/* Brand name */}
          <div>
            <label
              htmlFor="brandName"
              className="mb-2 block text-sm font-medium"
            >
              Brand name
            </label>

            <input
              id="brandName"
              {...register("brandName")}
              disabled={isSubmitting}
              placeholder="e.g. GH Studios"
              className="h-11 w-full rounded-xl border border-border bg-background/70 px-3.5 text-sm outline-none transition placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
            />

            {errors.brandName && (
              <p className="mt-2 text-xs text-red-500">
                {errors.brandName.message}
              </p>
            )}
          </div>

          {/* Business type */}
          <div>
            <label
              htmlFor="businessType"
              className="mb-2 block text-sm font-medium"
            >
              What kind of business is this?
            </label>

            <div className="relative">
              <select
                id="businessType"
                {...register("businessType")}
                disabled={isSubmitting}
                className="h-11 w-full appearance-none rounded-xl border border-border bg-background/70 px-3.5 pr-10 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="">Select your business type</option>

                {BUSINESS_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>

              <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>

            {errors.businessType && (
              <p className="mt-2 text-xs text-red-500">
                {errors.businessType.message}
              </p>
            )}
          </div>

          {/* Brand tone */}
          <div>
            <div className="flex items-end justify-between gap-3">
              <div>
                <label className="block text-sm font-medium">
                  How should your brand sound?
                </label>

                <p className="mt-1 text-xs text-muted-foreground">
                  Choose the personality you want your content to have.
                </p>
              </div>
            </div>

            <Controller
              name="tone"
              control={control}
              render={({ field }) => (
                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {BRAND_TONES.map((tone) => {
                    const selected = field.value === tone;

                    return (
                      <button
                        type="button"
                        key={tone}
                        disabled={isSubmitting}
                        onClick={() => field.onChange(tone)}
                        className={cn(
                          "group flex min-h-[46px] items-center justify-between rounded-xl border px-3.5 text-left text-sm transition-all",
                          selected
                            ? "border-primary bg-primary/10 text-foreground shadow-[0_0_0_1px_hsl(var(--primary)/0.15)]"
                            : "border-border/70 bg-background/30 text-muted-foreground hover:border-border hover:bg-background/60 hover:text-foreground",
                          isSubmitting &&
                            "cursor-not-allowed opacity-60"
                        )}
                      >
                        <span>{tone}</span>

                        <span
                          className={cn(
                            "flex h-5 w-5 items-center justify-center rounded-full border transition-all",
                            selected
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-background/50"
                          )}
                        >
                          {selected && <Check className="h-3 w-3" />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            />

            {errors.tone && (
              <p className="mt-2 text-xs text-red-500">
                {errors.tone.message}
              </p>
            )}
          </div>

          {/* Target audience */}
          <div>
            <div className="flex items-end justify-between gap-3">
              <div>
                <label className="block text-sm font-medium">
                  Who are you trying to reach?
                </label>

                <p className="mt-1 text-xs text-muted-foreground">
                  Select up to 3 audiences.
                </p>
              </div>

              <Controller
                name="audience"
                control={control}
                render={({ field }) => {
                  const count = field.value?.length ?? 0;

                  return (
                    <div
                      className={cn(
                        "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium",
                        count === 3
                          ? "border-primary/30 bg-primary/10 text-primary"
                          : "border-border/60 text-muted-foreground"
                      )}
                    >
                      <Users className="h-3 w-3" />
                      {count}/3
                    </div>
                  );
                }}
              />
            </div>

            <Controller
              name="audience"
              control={control}
              render={({ field }) => {
                const value = field.value ?? [];

                return (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {TARGET_AUDIENCES.map((audience) => {
                      const selected = value.includes(audience);

                      return (
                        <button
                          type="button"
                          key={audience}
                          disabled={isSubmitting}
                          onClick={() => {
                            if (selected) {
                              field.onChange(
                                value.filter((item) => item !== audience)
                              );
                            } else if (value.length < 3) {
                              field.onChange([...value, audience]);
                            }
                          }}
                          className={cn(
                            "rounded-full border px-3 py-2 text-xs transition-all",
                            selected
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border/70 bg-background/30 text-muted-foreground hover:border-border hover:bg-background/60 hover:text-foreground",
                            !selected &&
                              value.length >= 3 &&
                              "cursor-not-allowed opacity-40",
                            isSubmitting &&
                              "cursor-not-allowed opacity-60"
                          )}
                        >
                          {audience}
                        </button>
                      );
                    })}
                  </div>
                );
              }}
            />

            {errors.audience && (
              <p className="mt-2 text-xs text-red-500">
                {errors.audience.message}
              </p>
            )}
          </div>

          {/* Keywords */}
          <div>
            <label
              htmlFor="keywords"
              className="block text-sm font-medium"
            >
              Keywords
            </label>

            <p className="mt-1 text-xs text-muted-foreground">
              Add words, products, or ideas that are strongly associated with
              your brand.
            </p>

            <Controller
              name="keywords"
              control={control}
              render={({ field }) => (
                <input
                  id="keywords"
                  defaultValue={field.value?.join(", ") ?? ""}
                  onBlur={(event) =>
                    field.onChange(
                      event.target.value
                        .split(",")
                        .map((keyword) => keyword.trim())
                        .filter(Boolean)
                        .slice(0, 10)
                    )
                  }
                  disabled={isSubmitting}
                  className="mt-3 h-11 w-full rounded-xl border border-border bg-background/70 px-3.5 text-sm outline-none transition placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
                  placeholder="organic, skincare, premium, sustainable"
                />
              )}
            />

            <p className="mt-2 text-[11px] text-muted-foreground">
              Separate keywords with commas · up to 10
            </p>
          </div>

          {/* Error */}
          {errors.root && (
            <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-500">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errors.root.message}</span>
            </div>
          )}

          {serverError && (
            <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-3.5 text-sm text-red-500">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

              <div>
                <p className="font-medium">
                  We couldn't save your preferences
                </p>

                <p className="mt-1 text-xs opacity-80">
                  {serverError}
                </p>
              </div>
            </div>
          )}

          {/* Saved state */}
          {saved && (
            <div className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 p-3.5 text-sm text-primary">
              <Check className="h-4 w-4" />

              <span>
                Your Brand Brain has been updated successfully.
              </span>
            </div>
          )}

          {/* Submit */}
          <div className="border-t border-border/50 pt-5">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 w-full rounded-xl sm:w-auto sm:min-w-[180px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : saved ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Saved
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save preferences
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}