// src/app/dashboard/posters/new/page.tsx
import { Suspense } from "react";
import NewPosterClient from "./new-poster-client";

export default function NewPosterPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="h-8 w-48 animate-pulse rounded bg-secondary" />
          <div className="h-4 w-72 animate-pulse rounded bg-secondary" />
          <div className="h-64 animate-pulse rounded-xl bg-secondary/50" />
        </div>
      }
    >
      <NewPosterClient />
    </Suspense>
  );
}