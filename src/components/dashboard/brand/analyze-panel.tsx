// src/components/dashboard/brand/analyze-panel.tsx
"use client";

import { useRouter } from "next/navigation";
import { BrandBrainModal } from "./brand-brain-modal";
import { generateBrandReport } from "@/server/actions/brand-report";

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

  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [pendingUrl, setPendingUrl] = useState<AnalyzeWebsiteInput | null>(null);



  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AnalyzeWebsiteInput>({ resolver: zodResolver(analyzeWebsiteSchema) });

  async function onSubmit(values: AnalyzeWebsiteInput) {
    setServerError(null);
    setPendingUrl(values);
    setShowModal(true);
    const result = await analyzeWebsite(values);
    if (!result.success) {
      setServerError(result.error);
      return;
    }
    setSuccess(true);
  }


  async function runAnalyzeAndBuildReport() {
    if (!pendingUrl) return { success: false, error: "Nothing to analyze" };
    const analyzeResult = await analyzeWebsite(pendingUrl);
    if (!analyzeResult.success) return { success: false, error: analyzeResult.error };

    const reportResult = await generateBrandReport();
    if (!reportResult.success) return { success: false, error: reportResult.error };

    return { success: true };
  }

  return (
    <div className="rounded-lg border border-border p-6">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <h2 className="font-medium">Analyze your website</h2>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        We'll read your homepage and suggest a starting brand profile.
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
    
      <BrandBrainModal
        isOpen={showModal}
        run={runAnalyzeAndBuildReport}
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