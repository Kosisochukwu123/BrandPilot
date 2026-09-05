// src/server/actions/admin-assets.ts
"use server";

import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import { analyzeAssetImage } from "@/server/services/ai/analyze-asset-image";
import { uploadBase64Image } from "@/server/services/cloudinary";
import { revalidatePath } from "next/cache";
import type { AssetType } from "@prisma/client";

// Step 1 of the admin flow: upload the raw image, get AI's suggested tags
// back for review — nothing is saved to the library yet.
export async function uploadAndAnalyzeAsset(imageBase64: string) {
  const admin = await requireAdmin();
  if (!admin.ok) return { success: false, error: admin.error };

  const imageUrl = await uploadBase64Image(imageBase64, "brandpilot/asset-library/pending");
  const suggested = await analyzeAssetImage(imageUrl);

  return { success: true, data: { imageUrl, suggested } };
}

// Step 2: admin reviews/edits the suggested tags, then confirms — this
// actually creates the PosterAsset row.
export async function saveAsset(input: {
  imageUrl: string;
  type: AssetType;
  description: string;
  businessTypes: string[];
  styleTags: string[];
  colorTags: string[];
  transparent: boolean;
}) {
  const admin = await requireAdmin();
  if (!admin.ok) return { success: false, error: admin.error };

  await db.posterAsset.create({
    data: {
      imageUrl: input.imageUrl,
      type: input.type,
      description: input.description,
      businessTypes: input.businessTypes,
      styleTags: input.styleTags,
      colorTags: input.colorTags,
      transparent: input.transparent,
      source: "LIBRARY",
    },
  });

  revalidatePath("/admin/assets");
  return { success: true };
}

export async function listAssets(type?: AssetType) {
  const admin = await requireAdmin();
  if (!admin.ok) return [];

  return db.posterAsset.findMany({
    where: type ? { type } : undefined,
    orderBy: { createdAt: "desc" },
  });
}

export async function deleteAsset(id: string) {
  const admin = await requireAdmin();
  if (!admin.ok) return { success: false, error: admin.error };

  await db.posterAsset.delete({ where: { id } });
  revalidatePath("/admin/assets");
  return { success: true };
}