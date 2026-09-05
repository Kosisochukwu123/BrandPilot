// src/server/actions/billing.ts
"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { createPaystackCheckout, cancelPaystackSubscription } from "@/server/services/paystack/checkout";
import { redirect } from "next/navigation";

export async function startCheckout() {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) redirect("/login");

  const url = await createPaystackCheckout(session.user.id, session.user.email);
  redirect(url);
}

// Paystack has no hosted "billing portal" like Stripe — cancellation is
// a direct API call. We ask for confirmation client-side, then call this.
export async function cancelSubscription() {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Not authenticated" };

  const sub = await db.subscription.findUnique({ where: { userId: session.user.id } });
  if (!sub?.paystackSubscriptionCode) {
    return { success: false, error: "No active subscription found" };
  }

  // Paystack's disable endpoint requires an email_token, sent to the
  // customer's email on subscription creation — for MVP simplicity we
  // fetch it fresh via the subscription-fetch endpoint rather than storing it.
  const { paystackRequest } = await import("@/server/services/paystack/client");
  const subDetails = await paystackRequest<{ email_token: string }>(
    `/subscription/${sub.paystackSubscriptionCode}`
  );

  await cancelPaystackSubscription(sub.paystackSubscriptionCode, subDetails.email_token);

  await db.subscription.update({
    where: { userId: session.user.id },
    data: { cancelAtPeriodEnd: true },
  });

  return { success: true };
}

export async function getSubscription(userId: string) {
  return db.subscription.findUnique({ where: { userId } });
}