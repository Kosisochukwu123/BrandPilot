// src/app/admin/content/page.tsx
import { listAllGeneratedContent, listAllPosters } from "@/server/actions/admin-content";
import { ContentModerationList } from "@/components/admin/content-moderation-list";

export default async function AdminContentPage() {
  const content = await listAllGeneratedContent();
  const posters = await listAllPosters();

  return (
    <div>
      <h1 className="text-2xl font-semibold">Content Moderation</h1>
      <p className="mt-1 text-sm text-muted-foreground">Most recent content and posters across all users.</p>

      <div className="mt-6">
        <ContentModerationList content={content} posters={posters} />
      </div>
    </div>
  );
}