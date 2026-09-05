// src/components/dashboard/billing/billing-actions.tsx
"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { startCheckout, cancelSubscription } from "@/server/actions/billing";
import { Loader2 } from "lucide-react";

export function BillingActions({ isPro }: { isPro: boolean }) {
  const [isPending, startTransition] = useTransition();

  if (isPro) {
    return (
      <Button
        variant="outline"
        disabled={isPending}
        onClick={() => {
          if (!confirm("Cancel your Pro subscription? You'll keep access until the current period ends.")) return;
          
          // Using a standard function body with curly braces ensures nothing is returned
          startTransition(async () => {
            await cancelSubscription();
          });
        }}
      >
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Cancel subscription"}
      </Button>
    );
  }

  return (
    <Button 
      disabled={isPending} 
      onClick={() => {
        startTransition(async () => {
          await startCheckout();
        });
      }}
    >
      {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Upgrade to Pro"}
    </Button>
  );
}
