// src/components/admin/users-table.tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { suspendUser, unsuspendUser, toggleAdmin } from "@/server/actions/admin-users";
import { Button } from "@/components/ui/button";
import type { User, Subscription } from "@prisma/client";

type UserWithSub = User & { subscription: Subscription | null };

export function UsersTable({ users, initialSearch }: { users: UserWithSub[]; initialSearch: string }) {
  const router = useRouter();
  const [search, setSearch] = useState(initialSearch);
  const [isPending, startTransition] = useTransition();

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          router.push(`/admin/users?q=${encodeURIComponent(search)}`);
        }}
        className="flex gap-2"
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email"
          className="w-full max-w-sm rounded-md border border-border bg-background px-3 py-2 text-sm"
        />
        <Button type="submit" variant="outline">Search</Button>
      </form>

      <div className="mt-4 overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted text-left text-xs text-muted-foreground">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Plan</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Joined</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-border last:border-0">
                <td className="px-4 py-2">{u.name ?? "—"} {u.isAdmin && <span className="ml-1 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary">Admin</span>}</td>
                <td className="px-4 py-2 text-muted-foreground">{u.email}</td>
                <td className="px-4 py-2">{u.subscription?.plan ?? "FREE"}</td>
                <td className="px-4 py-2">
                  {u.suspended ? (
                    <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-xs text-red-500">Suspended</span>
                  ) : (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">Active</span>
                  )}
                </td>
                <td className="px-4 py-2 text-muted-foreground">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-2">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={isPending}
                      onClick={() =>
                        startTransition(() => {
                          u.suspended ? unsuspendUser(u.id) : suspendUser(u.id);
                        })
                      }
                    >
                      {u.suspended ? "Unsuspend" : "Suspend"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={isPending}
                      onClick={() => startTransition(() => { toggleAdmin(u.id); })}
                    >
                      {u.isAdmin ? "Remove admin" : "Make admin"}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}