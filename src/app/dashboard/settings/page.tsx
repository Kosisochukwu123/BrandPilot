// src/app/dashboard/settings/page.tsx

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { SettingsForm } from "@/components/dashboard/settings/settings-form";
import {
  Settings,
  User,
  ShieldCheck,
  Mail,
} from "lucide-react";

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user?.id) return null;

  const user = await db.user.findUnique({
    where: { id: session.user.id },
  });

  return (
    <main className="min-h-screen px-4 pb-16 pt-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-card px-6 py-8 shadow-sm sm:px-8">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative">
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Settings className="h-4 w-4 text-primary" />
              </span>

              <span className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
                Account Settings
              </span>
            </div>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Settings
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Manage your profile information and account security.
            </p>
          </div>
        </div>

        {/* Settings content */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          {/* Profile settings */}
          <section className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
            <div className="border-b border-border/60 px-6 py-5 sm:px-7">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>

                <div>
                  <h2 className="font-semibold">Profile & security</h2>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Update your personal information and password.
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 py-6 sm:px-7">
              <SettingsForm
                initialName={session.user.name ?? ""}
                email={session.user.email ?? ""}
                hasPassword={!!user?.passwordHash}
              />
            </div>
          </section>

          {/* Account information */}
          <aside className="h-fit rounded-2xl border border-border/70 bg-card p-6 shadow-sm sm:p-7">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <ShieldCheck className="h-5 w-5 text-primary" />
            </div>

            <h3 className="mt-5 text-lg font-semibold">
              Account security
            </h3>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Keep your account details up to date and use a strong password
              to protect your BrandPilot workspace.
            </p>

            <div className="mt-6 space-y-4">
              <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">
                      Account email
                    </p>

                    <p className="mt-1 truncate text-sm font-medium">
                      {session.user.email ?? "Not available"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Password
                    </p>

                    <p className="mt-1 text-sm font-medium">
                      {user?.passwordHash
                        ? "Password enabled"
                        : "No password set"}
                    </p>
                  </div>

                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-medium text-primary">
                    {user?.passwordHash ? "Protected" : "Action needed"}
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Footer note */}
        <div className="mt-6 flex items-center gap-2 px-1 text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>
            Changes to your profile are saved securely to your account.
          </span>
        </div>
      </div>
    </main>
  );
}