// src/app/dashboard/content/page.tsx
import { auth } from "@/lib/auth";
import { listGeneratedContent } from "@/server/actions/content";
import { getContentTypeConfig } from "@/lib/constants/content-types";
import { ContentList } from "@/components/dashboard/content/content-list";

export default async function SavedContentPage() {
  const session = await auth();
  const content = session?.user?.id ? await listGeneratedContent(session.user.id) : [];

  return (
    <div>
      <h1 className="text-2xl font-semibold">Saved Content</h1>
      <p className="mt-1 text-sm text-muted-foreground">Everything you've generated and kept.</p>

      <div className="mt-6">
        {content.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            Nothing saved yet — generate something and hit Save.
          </div>
        ) : (
          <ContentList
            items={content.map((c) => ({
              id: c.id,
              type: c.type,
              typeLabel: getContentTypeConfig(c.type).label,
              group: getContentTypeConfig(c.type).group,
              output: c.output,
              favorited: c.favorited,
              createdAt: c.createdAt.toISOString(),
            }))}
          />
        )}
      </div>
    </div>
  );
}