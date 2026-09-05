// src/app/dashboard/layout.tsx
import { Sidebar } from "@/components/dashboard/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {/* Sidebar handles both desktop (fixed) and mobile (hamburger) */}
      <Sidebar />

      {/* Content area */}
      <main className="md:pl-60">
        <div className="p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}