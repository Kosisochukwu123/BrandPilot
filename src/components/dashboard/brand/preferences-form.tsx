// src/components/dashboard/brand/preferences-form.tsx
"use client";

import { useRouter } from "next/navigation";
import { BrandBrainModal } from "./brand-brain-modal";
import { generateBrandReport } from "@/server/actions/brand-report";


import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { brandPreferencesSchema, type BrandPreferencesInput } from "@/lib/validations/brand";
import { BUSINESS_TYPES, BRAND_TONES, TARGET_AUDIENCES } from "@/lib/constants/brand-options";
import { saveBrandPreferences } from "@/server/actions/brand";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PreferencesFormProps {
  initial: {
    brandName: string | null;
    websiteUrl: string | null;
    instagramHandle: string | null;
    whatsappNumber: string | null;
    businessType: string | null;
    tone: string | null;
    audience: string | null; // comma-separated, as stored
    keywords: string[];
  };
}

export function PreferencesForm({ initial }: PreferencesFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [pendingValues, setPendingValues] = useState<BrandPreferencesInput | null>(null);



  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<BrandPreferencesInput>({
    resolver: zodResolver(brandPreferencesSchema),
    defaultValues: {
      brandName: initial.brandName ?? "",
      websiteUrl: initial.websiteUrl ?? "",
      instagramHandle: initial.instagramHandle ?? "",
      whatsappNumber: initial.whatsappNumber ?? "",
      businessType: (initial.businessType as BrandPreferencesInput["businessType"]) ?? undefined,
      tone: (initial.tone as BrandPreferencesInput["tone"]) ?? undefined,
      audience: (initial.audience?.split(", ").filter(Boolean) as BrandPreferencesInput["audience"]) ?? [],
      keywords: initial.keywords ?? [],
    },
  });

  async function onSubmit(values: BrandPreferencesInput) {
    setServerError(null);
    setPendingValues(values);
    setShowModal(true);
    const result = await saveBrandPreferences(values);
    if (!result.success) {
      setServerError(result.error);
      return;
    }
    setSaved(true);
  }

  async function runSaveAndBuildReport() {
    if (!pendingValues) return { success: false, error: "Nothing to save" };
    const saveResult = await saveBrandPreferences(pendingValues);
    if (!saveResult.success) return { success: false, error: saveResult.error };

    const reportResult = await generateBrandReport();
    if (!reportResult.success) return { success: false, error: reportResult.error };

    return { success: true };
  }

  return (
    <div className="rounded-lg border border-border p-6">
      <h2 className="font-medium">Your brand preferences</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        These are what actually drive content generation. No website yet? No
        problem — just fill in how customers find you below.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-5">
        <div>
          <label className="text-sm font-medium">Brand name</label>
          <input
            {...register("brandName")}
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
        </div>

        <div className="rounded-md border border-dashed border-border p-4">
          <p className="text-sm font-medium">Where can customers find you?</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Fill in whichever apply — a website isn't required.
          </p>

          <div className="mt-3 space-y-3">
            <div>
              <label className="text-xs text-muted-foreground">Website</label>
              <input
                {...register("websiteUrl")}
                placeholder="https://yourbusiness.com"
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
              {errors.websiteUrl && <p className="mt-1 text-xs text-red-500">{errors.websiteUrl.message}</p>}
            </div>

            <div>
              <label className="text-xs text-muted-foreground">Instagram handle</label>
              <input
                {...register("instagramHandle")}
                placeholder="@yourbrand"
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
              {errors.instagramHandle && <p className="mt-1 text-xs text-red-500">{errors.instagramHandle.message}</p>}
            </div>

            <div>
              <label className="text-xs text-muted-foreground">WhatsApp business number</label>
              <input
                {...register("whatsappNumber")}
                placeholder="+2348012345678"
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
              {errors.whatsappNumber && <p className="mt-1 text-xs text-red-500">{errors.whatsappNumber.message}</p>}
            </div>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Business type</label>
          <select
            {...register("businessType")}
            className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="">Select one</option>
            {BUSINESS_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Brand tone</label>
          <div className="mt-2 flex flex-wrap gap-2">
            <Controller
              name="tone"
              control={control}
              render={({ field }) => (
                <>
                  {BRAND_TONES.map((tone) => (
                    <button
                      type="button"
                      key={tone}
                      onClick={() => field.onChange(tone)}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-sm",
                        field.value === tone
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {tone}
                    </button>
                  ))}
                </>
              )}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Target audience (up to 3)</label>
          <div className="mt-2 flex flex-wrap gap-2">
            <Controller
              name="audience"
              control={control}
              render={({ field }) => {
                const value = field.value ?? [];
                return (
                  <>
                    {TARGET_AUDIENCES.map((aud) => {
                      const selected = value.includes(aud);
                      return (
                        <button
                          type="button"
                          key={aud}
                          onClick={() => {
                            if (selected) {
                              field.onChange(value.filter((v) => v !== aud));
                            } else if (value.length < 3) {
                              field.onChange([...value, aud]);
                            }
                          }}
                          className={cn(
                            "rounded-full border px-3 py-1.5 text-sm",
                            selected
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {aud}
                        </button>
                      );
                    })}
                  </>
                );
              }}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Keywords (comma separated)</label>
          <Controller
            name="keywords"
            control={control}
            render={({ field }) => (
              <input
                defaultValue={field.value?.join(", ") ?? ""}
                onBlur={(e) =>
                  field.onChange(
                    e.target.value.split(",").map((k) => k.trim()).filter(Boolean).slice(0, 10)
                  )
                }
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                placeholder="organic, skincare, cruelty-free"
              />
            )}
          />
        </div>

        {errors.root && <p className="text-sm text-red-500">{errors.root.message}</p>}
        {serverError && <p className="text-sm text-red-500">{serverError}</p>}
        {saved && <p className="text-sm text-primary">Preferences saved.</p>}

        <Button type="submit" disabled={isSubmitting}>
          Save preferences
        </Button>
      </form>

      <BrandBrainModal
        isOpen={showModal}
        run={runSaveAndBuildReport}
        onDone={(result) => {
          setShowModal(false);
          if (!result.success) {
            setServerError(result.error ?? "Something went wrong");
            return;
          }
          router.push("/dashboard/brand/success");
        }}
      />
    </div>
  );
}