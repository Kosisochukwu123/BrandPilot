// src/components/dashboard/posters/poster-generator-form.tsx
"use client";

import { useState } from "react";
import { generateReferencePosterProof } from "@/server/actions/poster";
import { Button } from "@/components/ui/button";
import {
  PosterDetailForm,
  type PosterDetails,
} from "@/components/dashboard/posters/poster-detail-form";

export type PosterType =
  | "church"
  | "event"
  | "product"
  | "business"
  | "real_estate"
  | "other";

export type PosterGoal =
  | "promote"
  | "announce"
  | "sell"
  | "invite"
  | "awareness"
  | "celebrate";

interface GeneratedPosterData {
  posterId: string;
  suggestedCta: string;
  brandName: string | null;
  instagramHandle: string | null;
  websiteUrl: string | null;
  colors: string[];
}

interface PosterGeneratorFormProps {
  caption: string;
  contentId?: string;
  brandColors: string[];
  onGenerating?: () => void;
  onGenerateFailed?: (error: string) => void;
  onGenerated: (data: GeneratedPosterData) => void;
}

type PersonState = {
  id: string;
  name: string;
  role: string;
  file: File | null;
};

const emptyDetails: PosterDetails = {
  offer: "",
  price: "",
  date: "",
  time: "",
  address: "",
  phone: "",
  website: "",
  extra: "",
};

async function fileToBase64(
  file: File,
  maxEdge = 1024,
  quality = 0.85,
): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not process image");
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((b) => resolve(b), "image/jpeg", quality),
  );
  if (!blob) throw new Error("Could not compress image");

  const buffer = await blob.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function PosterGeneratorForm({
  caption,
  contentId,
  brandColors,
  onGenerated,
  onGenerating,
  onGenerateFailed,
}: PosterGeneratorFormProps) {
  const [details, setDetails] = useState<PosterDetails>(emptyDetails);
  const [posterType, setPosterType] = useState<PosterType>("business");
  const [goal, setGoal] = useState<PosterGoal>("promote");
  const [mainMessage, setMainMessage] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [people, setPeople] = useState<PersonState[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateDetail(key: keyof PosterDetails, value: string) {
    setDetails((prev) => ({ ...prev, [key]: value }));
  }

  function addPerson() {
    setPeople((prev) => {
      if (prev.length >= 4) return prev;
      return [
        ...prev,
        { id: crypto.randomUUID(), name: "", role: "", file: null },
      ];
    });
  }

  function removePerson(id: string) {
    setPeople((prev) => prev.filter((p) => p.id !== id));
  }

  function onPersonChange(
    id: string,
    field: "name" | "role",
    value: string,
  ) {
    setPeople((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    );
  }

  function onPersonPhoto(id: string, file: File | null) {
    setPeople((prev) =>
      prev.map((p) => (p.id === id ? { ...p, file } : p)),
    );
  }

  async function handleGenerate() {
    setError(null);
    setIsGenerating(true);
    onGenerating?.();

    try {
      const brief =
        caption.trim() ||
        mainMessage.trim() ||
        "Professional marketing poster for this brand.";

      const cleanedDetails: Record<string, string> = Object.fromEntries(
        Object.entries(details).filter(([, v]) => v.trim() !== ""),
      );

      if (additionalInfo.trim()) {
        cleanedDetails.extra = additionalInfo.trim();
      }

      const logoBase64 = logoFile ? await fileToBase64(logoFile) : undefined;
      const mainImageBase64 = mainImageFile
        ? await fileToBase64(mainImageFile)
        : undefined;

      const peoplePayload = [];
      for (const person of people) {
        if (!person.name.trim() && !person.role.trim() && !person.file) {
          continue;
        }
        peoplePayload.push({
          name: person.name.trim() || undefined,
          role: person.role.trim() || undefined,
          imageBase64: person.file
            ? await fileToBase64(person.file)
            : undefined,
        });
      }

      const result = await generateReferencePosterProof({
        caption: brief,
        contentId,
        details:
          Object.keys(cleanedDetails).length > 0 ? cleanedDetails : undefined,
        logoBase64,
        mainImageBase64,
        // main message steers copy; still sent as keywords-style signal
        keywords: mainMessage
          .split(/[,.\n]/)
          .map((k) => k.trim())
          .filter(Boolean)
          .slice(0, 12),
        people: peoplePayload.length > 0 ? peoplePayload : undefined,
        posterType,
        goal,
        mainMessage: mainMessage.trim() || undefined,
      });

      if (!result.success) {
        const message = result.error ?? "Generation failed";
        setError(message);
        onGenerateFailed?.(message);
        return;
      }

      onGenerated({
        posterId: result.data!.posterId,
        suggestedCta: result.data!.suggestedCta,
        brandName: result.data!.brandName,
        instagramHandle: result.data!.instagramHandle,
        websiteUrl: result.data!.websiteUrl,
        colors: result.data!.colors,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Generation failed";
      setError(message);
      onGenerateFailed?.(message);
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="space-y-6">
      {brandColors.length > 0 && (
        <div>
          <p className="text-xs text-muted-foreground">Using your brand colors</p>
          <div className="mt-2 flex gap-2">
            {brandColors.map((hex) => (
              <div
                key={hex}
                className="h-6 w-6 rounded-full border border-border"
                style={{ backgroundColor: hex }}
              />
            ))}
          </div>
        </div>
      )}

      <PosterDetailForm
        details={details}
        onChange={updateDetail}
        posterType={posterType}
        onPosterTypeChange={setPosterType}
        goal={goal}
        onGoalChange={setGoal}
        mainMessage={mainMessage}
        onMainMessageChange={setMainMessage}
        additionalInfo={additionalInfo}
        onAdditionalInfoChange={setAdditionalInfo}
        logoName={logoFile?.name}
        imageName={mainImageFile?.name}
        onLogo={setLogoFile}
        onImage={setMainImageFile}
        people={people.map((p) => ({
          id: p.id,
          name: p.name,
          role: p.role,
          fileName: p.file?.name ?? null,
        }))}
        onPersonChange={onPersonChange}
        onPersonPhoto={onPersonPhoto}
        onAddPerson={addPerson}
        onRemovePerson={removePerson}
      />

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button
        className="w-full"
        onClick={handleGenerate}
        disabled={isGenerating}
      >
        {isGenerating ? "Creating poster..." : "Create poster"}
      </Button>
    </div>
  );
}