import { Sidebar } from "@/components/dashboard/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Sidebar />

      <div className="min-h-screen md:ml-60">
        <header className="flex h-16 items-center justify-end border-b border-border px-6">
          {/* User menu / theme toggle */}
        </header>

        <main className="p-6">
          {children}
        </main>
      </div>
    </>
  );
}