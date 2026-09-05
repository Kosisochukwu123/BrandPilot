// src/app/dashboard/brand/report/page.tsx
import { auth } from "@/lib/auth";
import { getLatestBrandReport } from "@/server/actions/brand-report";
import { BrandReportView } from "@/components/dashboard/brand/brand-report-view";

export default async function BrandReportPage() {
  const session = await auth();
  const report = session?.user?.id ? await getLatestBrandReport(session.user.id) : null;

  if (!report) {
    return (
      <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
        No Brand Report yet — save your brand preferences first to generate one.
      </div>
    );
  }

  return <BrandReportView report={report} />;
}