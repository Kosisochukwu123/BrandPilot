// src/components/admin/asset-grid.tsx
"use client";

import { deleteAsset } from "@/server/actions/admin-assets";
import { useTransition } from "react";
import type { PosterAsset } from "@prisma/client";

export function AssetGrid({ assets }: { assets: PosterAsset[] }) {
    const [isPending, startTransition] = useTransition();

    if (assets.length === 0) {
        return <p className="mt-2 text-sm text-muted-foreground">None yet.</p>;
    }

    return (
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {assets.map((asset) => (
                <div key={asset.id} className="group relative overflow-hidden rounded-md border border-border">
                    <img src={asset.imageUrl} alt={asset.description} className="aspect-square w-full object-cover" />
                    <button
                        onClick={() =>
                            startTransition(() => {
                                deleteAsset(asset.id);
                            })
                        } disabled={isPending}
                        className="absolute right-1 top-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white opacity-0 group-hover:opacity-100"
                    >
                        Delete
                    </button>
                    <p className="truncate p-1 text-[10px] text-muted-foreground">{asset.description}</p>
                </div>
            ))}
        </div>
    );
}