// src/server/services/ai/load-reference-images.ts
import { readFile } from "node:fs/promises";
import path from "node:path";

/**
 * Loads images from:
 * - full URLs (Cloudinary / admin uploads)
 * - local paths relative to public/poster-references/
 */
export async function loadReferenceImages(
  pathsOrUrls: string[],
): Promise<Buffer[]> {
  return Promise.all(pathsOrUrls.map((item) => loadOne(item)));
}

async function loadOne(pathOrUrl: string): Promise<Buffer> {
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    const res = await fetch(pathOrUrl);
    if (!res.ok) {
      throw new Error(
        `Failed to fetch reference: ${pathOrUrl} (${res.status})`,
      );
    }
    const arr = await res.arrayBuffer();
    return Buffer.from(arr);
  }

  const root = path.join(process.cwd(), "public", "poster-references");
  const full = path.join(root, pathOrUrl);
  return readFile(full);
}

/**
 * Loads reference images from remote URLs (e.g. Cloudinary-hosted
 * PosterAsset images from the admin library) and converts them to
 * Buffers — the shape generatePosterFromReferences expects. Sibling to
 * loadReferenceImages, which only handles local public/ files.
 */
export async function loadReferenceImagesFromUrls(
  urls: string[],
): Promise<Buffer[]> {
  const buffers = await Promise.all(
    urls.map(async (url) => {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(
          `Failed to fetch reference image: ${url} (status ${res.status})`,
        );
      }
      const arrayBuffer = await res.arrayBuffer();
      return Buffer.from(arrayBuffer);
    }),
  );

  return buffers;
}
