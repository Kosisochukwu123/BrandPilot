// src/components/admin/subscriptions-table.tsx
"use client";

import { useTransition } from "react";
import { overrideSubscription } from "@/server/actions/admin-subscriptions";
import type { Subscription, Plan, SubscriptionStatus } from "@prisma/client";

type SubWithUser = Subscription & { user: { email: string; name: string | null } };

const PLANS: Plan[] = ["FREE", "PRO"];
const STATUSES: SubscriptionStatus[] = ["ACTIVE", "PAST_DUE", "CANCELED", "TRIALING", "INCOMPLETE"];

export function SubscriptionsTable({ subscriptions }: { subscriptions: SubWithUser[] }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead className="border-b border-border bg-muted text-left text-xs text-muted-foreground">
          <tr>
            <th className="px-4 py-2">User</th>
            <th className="px-4 py-2">Plan</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Renews / Ends</th>
            <th className="px-4 py-2">Override</th>
          </tr>
        </thead>
        <tbody>
          {subscriptions.map((s) => (
            <tr key={s.id} className="border-b border-border last:border-0">
              <td className="px-4 py-2">
                <div>{s.user.name ?? "—"}</div>
                <div className="text-xs text-muted-foreground">{s.user.email}</div>
              </td>
              <td className="px-4 py-2">{s.plan}</td>
              <td className="px-4 py-2">{s.status}</td>
              <td className="px-4 py-2 text-muted-foreground">
                {s.currentPeriodEnd ? new Date(s.currentPeriodEnd).toLocaleDateString() : "—"}
              </td>
              <td className="px-4 py-2">
                <div className="flex gap-2">
                  <select
                    defaultValue={s.plan}
                    disabled={isPending}
                    onChange={(e) =>
                      startTransition(() => {
                        overrideSubscription(s.userId, e.target.value as Plan, s.status);
                      })
                    }
                    className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                  >
                    {PLANS.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <select
                    defaultValue={s.status}
                    disabled={isPending}
                    onChange={(e) =>
                      startTransition(() => {
                        overrideSubscription(s.userId, s.plan, e.target.value as SubscriptionStatus);
                      })
                    }
                    className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                  >
                    {STATUSES.map((st) => <option key={st} value={st}>{st}</option>)}
                  </select>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}