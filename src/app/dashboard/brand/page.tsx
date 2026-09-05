// src/app/dashboard/brand/page.tsx
import { auth } from "@/lib/auth";
import { getBrand } from "@/server/actions/brand";
import { AnalyzePanel } from "@/components/dashboard/brand/analyze-panel";
import { PreferencesForm } from "@/components/dashboard/brand/preferences-form";
import { OnboardingWizard } from "@/components/dashboard/brand/onboarding-wizard";

export default async function BrandAnalysisPage() {
  const session = await auth();
  const brand = session?.user?.id ? await getBrand(session.user.id) : null;

  // First-time users get the guided wizard; anyone with an existing
  // Brand row is editing their setup, so they get the regular panels.
  if (!brand) {
    return <OnboardingWizard />;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">Brand Analysis</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Have a site? Analyze it for a starting point. No website? Skip
        straight to preferences and tell us about your brand directly.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <AnalyzePanel />
        <PreferencesForm
          initial={{
            brandName: brand?.brandName ?? null,
            websiteUrl: brand?.websiteUrl ?? null,
            instagramHandle: brand?.instagramHandle ?? null,
            whatsappNumber: brand?.whatsappNumber ?? null,
            businessType: brand?.businessType ?? null,
            tone: brand?.tone ?? null,
            audience: brand?.audience ?? null,
            keywords: brand?.keywords ?? [],
          }}
        />
      </div>
    </div>
  );
}