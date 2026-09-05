import { listUsers } from "@/server/actions/admin-users";
import { UsersTable } from "@/components/admin/users-table";

export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const users = await listUsers(q);

  // Helper functions for stats
  const getStatus = (user: any) => user.subscription?.status || "inactive";
  const getPlan = (user: any) => user.subscription?.plan || "free";

  const activeUsers = users.filter(u => getStatus(u) === "active" || getStatus(u) === "trialing");
  const suspendedUsers = users.filter(u => getStatus(u) === "suspended" || getStatus(u) === "canceled");
  const proUsers = users.filter(u => getPlan(u).toLowerCase() === "pro");

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage and monitor all users on the platform
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-secondary/10 px-3 py-1.5 text-sm">
            <span className="font-medium">{users.length}</span>
            <span className="text-muted-foreground"> total users</span>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid gap-3 sm:grid-cols-4">
        <div className="rounded-lg border border-border/70 bg-secondary/10 p-3">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Total</p>
          <p className="text-xl font-semibold">{users.length}</p>
        </div>
        <div className="rounded-lg border border-border/70 bg-secondary/10 p-3">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Active</p>
          <p className="text-xl font-semibold text-green-500">{activeUsers.length}</p>
        </div>
        <div className="rounded-lg border border-border/70 bg-secondary/10 p-3">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Suspended</p>
          <p className="text-xl font-semibold text-red-500">{suspendedUsers.length}</p>
        </div>
        <div className="rounded-lg border border-border/70 bg-secondary/10 p-3">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Pro</p>
          <p className="text-xl font-semibold text-yellow-500">{proUsers.length}</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-xl border border-border/70 bg-secondary/10 p-4 md:p-6">
        <UsersTable users={users} initialSearch={q ?? ""} />
      </div>
    </div>
  );
}