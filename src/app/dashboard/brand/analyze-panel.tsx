// src/components/dashboard/brand/analyze-panel.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { analyzeWebsiteSchema, type AnalyzeWebsiteInput } from "@/lib/validations/brand";
import { analyzeWebsite } from "@/server/actions/brand";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";

export function AnalyzePanel() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AnalyzeWebsiteInput>({ resolver: zodResolver(analyzeWebsiteSchema) });

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
    <div className="rounded-lg border border-border p-6">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <h2 className="font-medium">Analyze your website</h2>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Have a site? We'll read it and suggest a starting brand profile — otherwise, use the preferences form instead.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 flex gap-2">
        <input
          {...register("websiteUrl")}
          placeholder="https://yourbusiness.com"
          className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm"
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Analyze"}
        </Button>
      </form>

      {errors.websiteUrl && (
        <p className="mt-2 text-sm text-red-500">{errors.websiteUrl.message}</p>
      )}
      {serverError && <p className="mt-2 text-sm text-red-500">{serverError}</p>}
      {success && (
        <p className="mt-2 text-sm text-primary">
          Done — suggestions applied on the right. Review and adjust as needed.
        </p>
      )}
    </div>
  );
}