// src/app/dashboard/posters/page.tsx
// The "Posters" library — everything already generated. Separate from
// /dashboard/posters/new, which is the generation flow itself. This page
// is read-only browsing + delete; creating happens on /new.
import { auth } from "@/lib/auth";
import { listPosters } from "@/server/actions/poster";
import { PosterLibraryGrid } from "@/components/dashboard/posters/poster-library-grid";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function PostersLibraryPage() {
  const session = await auth();
  const posters = session?.user?.id ? await listPosters(session.user.id) : [];

  return (
    // Only add padding on mobile and tablet where the navbar is fixed
    <div className="pt-20 md:pt-24 lg:pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Posters</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Everything you've generated, saved here.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/posters/new">
            <Plus className="mr-1.5 h-4 w-4" /> Create New Poster
          </Link>
        </Button>
      </div>

      <div className="mt-6">
        {posters.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            No posters yet — generate your first one to see it here.
            <div className="mt-4">
              <Button asChild>
                <Link href="/dashboard/posters/new">Create a poster</Link>
              </Button>
            </div>
          </div>
        ) : (
          <PosterLibraryGrid posters={posters} />
        )}
      </div>
    </div>
  );
}