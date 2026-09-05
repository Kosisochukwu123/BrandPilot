// src/app/dashboard/settings/page.tsx
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { SettingsForm } from "@/components/dashboard/settings/settings-form";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await db.user.findUnique({ where: { id: session.user.id } });

  return (
    <div>
      <h1 className="text-2xl font-semibold">Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">Manage your profile and password.</p>

      <div className="mt-6 max-w-md">
        <SettingsForm
          initialName={session.user.name ?? ""}
          email={session.user.email ?? ""}
          hasPassword={!!user?.passwordHash}
        />
      </div>
    </div>
  );
}