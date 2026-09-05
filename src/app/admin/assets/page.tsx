// src/app/admin/assets/page.tsx
import { requireAdmin } from "@/lib/admin";
import { listAssets } from "@/server/actions/admin-assets";
import { AssetUploadForm } from "@/components/admin/asset-upload-form";
import { AssetGrid } from "@/components/admin/asset-grid";
import { redirect } from "next/navigation";

export default async function AdminAssetsPage() {
  const admin = await requireAdmin();
  const references = await listAssets("POSTER_REFERENCE");


  if (!admin.ok) redirect("/dashboard");

  const backgrounds = await listAssets("BACKGROUND");
  const objects = await listAssets("OBJECT");

  return (
    <div className="mx-auto max-w-5xl p-8">
      <h1 className="text-2xl font-semibold">Poster Asset Library</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Upload backgrounds and objects. AI suggests tags — review and correct before saving.
      </p>

      <div className="mt-8">
        <AssetUploadForm />
      </div>

      <div className="mt-10">
        <h2 className="font-medium">Backgrounds ({backgrounds.length})</h2>
        <AssetGrid assets={backgrounds} />
      </div>

      <div className="mt-10">
        <h2 className="font-medium">Objects ({objects.length})</h2>
        <AssetGrid assets={objects} />
      </div>


      <div className="mt-10">
        <h2 className="font-medium">Poster References ({references.length})</h2>
        <AssetGrid assets={references} />
      </div>
    </div>
  );
}