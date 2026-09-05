// src/app/dashboard/generate/page.tsx
import { auth } from "@/lib/auth";
import { getBrandContext } from "@/server/services/brand-context";
import { GeneratorForm } from "@/components/dashboard/generate/generator-form";
import Link from "next/link";

export default async function ContentGeneratorPage() {
  const session = await auth();
  const { brand, report } = session?.user?.id
    ? await getBrandContext(session.user.id)
    : { brand: null, report: null };

  if (!brand) {
    return (
      <div>
        <h1 className="text-2xl font-semibold">Content Generator</h1>
        <div className="mt-6 rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          Set up your Brand Brain first so content generates in your actual voice, not a generic one.
          <div className="mt-4">
            <Link href="/dashboard/brand" className="text-primary underline underline-offset-4">
              Go to Brand Analysis
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">Content Generator</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Generating for <span className="font-medium text-foreground">{brand.brandName ?? "your brand"}</span>
        {" · "}
        {brand.tone ?? "brand voice"} tone
      </p>
      <div className="mt-6">
        <GeneratorForm
          brandName={brand.brandName}
          contentPillars={report?.contentPillars ?? []}
        />
      </div>
    </div>
  );
}