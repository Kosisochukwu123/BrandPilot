// src/components/admin/asset-upload-form.tsx
"use client";

import { useState } from "react";
import { uploadAndAnalyzeAsset, saveAsset } from "@/server/actions/admin-assets";
import { Button } from "@/components/ui/button";
import { BUSINESS_TYPES } from "@/lib/constants/brand-options";
import type { AssetType } from "@prisma/client";

export function AssetUploadForm() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [type, setType] = useState<AssetType>("BACKGROUND");
  const [description, setDescription] = useState("");
  const [businessTypes, setBusinessTypes] = useState<string[]>([]);
  const [styleTags, setStyleTags] = useState("");
  const [colorTags, setColorTags] = useState("");
  const [transparent, setTransparent] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    setSaved(false);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(",")[1];
      const result = await uploadAndAnalyzeAsset(base64);
      setIsAnalyzing(false);
      if (result.success && result.data) {
        setImageUrl(result.data.imageUrl);
        setType(result.data.suggested.type);
        setDescription(result.data.suggested.description);
        setBusinessTypes(result.data.suggested.businessTypes);
        setStyleTags(result.data.suggested.styleTags.join(", "));
        setColorTags(result.data.suggested.colorTags.join(", "));
        setTransparent(result.data.suggested.transparent);
      }
    };
    reader.readAsDataURL(file);
  }

  async function handleSave() {
    if (!imageUrl) return;
    setIsSaving(true);
    const result = await saveAsset({
      imageUrl,
      type,
      description,
      businessTypes,
      styleTags: styleTags.split(",").map((s) => s.trim()).filter(Boolean),
      colorTags: colorTags.split(",").map((s) => s.trim()).filter(Boolean),
      transparent,
    });
    setIsSaving(false);
    if (result.success) {
      setSaved(true);
      setImageUrl(null);
      setDescription("");
      setBusinessTypes([]);
      setStyleTags("");
      setColorTags("");
    }
  }

  return (
    <div className="rounded-lg border border-border p-6">
      <input type="file" accept="image/*" onChange={handleFileSelect} className="text-sm" />
      {isAnalyzing && <p className="mt-2 text-sm text-muted-foreground">Analyzing image...</p>}

      {imageUrl && (
        <div className="mt-4 grid gap-4 sm:grid-cols-[200px_1fr]">
          <img src={imageUrl} alt="" className="rounded-md border border-border object-cover" />

          <div className="space-y-3">
            <div className="flex gap-2">
              <button
                onClick={() => setType("BACKGROUND")}
                className={`rounded-md px-3 py-1.5 text-sm ${type === "BACKGROUND" ? "bg-primary text-primary-foreground" : "border border-border"}`}
              >
                Background
              </button>
              <button
                onClick={() => setType("OBJECT")}
                className={`rounded-md px-3 py-1.5 text-sm ${type === "OBJECT" ? "bg-primary text-primary-foreground" : "border border-border"}`}
              >
                Object
              </button>
              <button
                onClick={() => setType("POSTER_REFERENCE")}
                className={`rounded-md px-3 py-1.5 text-sm ${type === "POSTER_REFERENCE" ? "bg-primary text-primary-foreground" : "border border-border"}`}
              >
                Poster Reference
              </button>
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Business types</label>
              <div className="mt-1 flex flex-wrap gap-2">
                {BUSINESS_TYPES.map((bt) => (
                  <button
                    key={bt}
                    onClick={() =>
                      setBusinessTypes((prev) =>
                        prev.includes(bt) ? prev.filter((b) => b !== bt) : [...prev, bt]
                      )
                    }
                    className={`rounded-full border px-2.5 py-1 text-xs ${businessTypes.includes(bt) ? "border-primary bg-primary text-primary-foreground" : "border-border"
                      }`}
                  >
                    {bt}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Style tags</label>
                <input
                  value={styleTags}
                  onChange={(e) => setStyleTags(e.target.value)}
                  placeholder="warm, minimal, industrial"
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Color tags</label>
                <input
                  value={colorTags}
                  onChange={(e) => setColorTags(e.target.value)}
                  placeholder="blue, earth-tone"
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                />
              </div>
            </div>

            {type === "OBJECT" && (
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={transparent} onChange={(e) => setTransparent(e.target.checked)} />
                Transparent background (isolated object)
              </label>
            )}

            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save to library"}
            </Button>
          </div>
        </div>
      )}

      {saved && <p className="mt-3 text-sm text-primary">Saved to library.</p>}
    </div>
  );
}