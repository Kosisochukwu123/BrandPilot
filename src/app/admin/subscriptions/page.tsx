// src/app/admin/subscriptions/page.tsx
import { listSubscriptions } from "@/server/actions/admin-subscriptions";
import { SubscriptionsTable } from "@/components/admin/subscriptions-table";

export default async function AdminSubscriptionsPage() {
  const subscriptions = await listSubscriptions();

  return (
    <div>
      <h1 className="text-2xl font-semibold">Subscriptions</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {subscriptions.length} subscription records. Manual overrides should only be used for verified support cases.
      </p>

      <div className="mt-6">
        <SubscriptionsTable subscriptions={subscriptions} />
      </div>
    </div>
  );
}