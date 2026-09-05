// src/server/services/paystack/checkout.ts
// Paystack's flow: initialize a transaction (server-side) → redirect the
// user to the returned authorization_url (Paystack's hosted checkout) →
// Paystack redirects back to our callback_url with a `reference` → we
// verify that reference server-side before trusting anything happened.
// This mirrors Stripe Checkout Sessions, just with an explicit verify
// step instead of relying purely on webhooks for the initial payment.
import { paystackRequest } from "./client";
import { db } from "@/lib/db";

interface InitializeTransactionResponse {
  authorization_url: string;
  access_code: string;
  reference: string;
}

export async function createPaystackCheckout(userId: string, email: string): Promise<string> {
  const reference = `bp_${userId}_${Date.now()}`;

  const result = await paystackRequest<InitializeTransactionResponse>("/transaction/initialize", {
    method: "POST",
    body: {
      email,
      // amount is in kobo (smallest NGN unit) — only used if no plan code
      // is supplied; when `plan` is set, Paystack uses the plan's amount
      // and handles recurring billing automatically.
      plan: process.env.PAYSTACK_PLAN_CODE_PRO_MONTHLY,
      reference,
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/billing/paystack/callback`,
      metadata: { userId },
    },
  });

  return result.authorization_url;
}

interface VerifyTransactionResponse {
  status: string; // "success" | "failed" | "abandoned"
  customer: { customer_code: string; email: string };
  authorization: { authorization_code: string; reusable: boolean };
  plan: string | null;
  metadata: { userId?: string } | string; // Paystack sometimes returns this as a raw string if malformed
  paid_at: string;
}

export async function verifyPaystackTransaction(reference: string) {
  const result = await paystackRequest<VerifyTransactionResponse>(`/transaction/verify/${reference}`);

  if (result.status !== "success") {
    throw new Error("Payment was not successful");
  }

  const userId =
    typeof result.metadata === "object" ? result.metadata.userId : undefined;
  if (!userId) throw new Error("Missing userId in transaction metadata");

  await db.subscription.upsert({
    where: { userId },
    create: {
      userId,
      paystackCustomerCode: result.customer.customer_code,
      authorizationCode: result.authorization.authorization_code,
      plan: "PRO",
      status: "ACTIVE",
      currentPeriodEnd: addOneMonth(new Date(result.paid_at)),
    },
    update: {
      paystackCustomerCode: result.customer.customer_code,
      authorizationCode: result.authorization.authorization_code,
      plan: "PRO",
      status: "ACTIVE",
      currentPeriodEnd: addOneMonth(new Date(result.paid_at)),
    },
  });

  return { userId };
}

function addOneMonth(date: Date): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + 1);
  return d;
}

export async function cancelPaystackSubscription(subscriptionCode: string, emailToken: string) {
  await paystackRequest("/subscription/disable", {
    method: "POST",
    body: { code: subscriptionCode, token: emailToken },
  });
}