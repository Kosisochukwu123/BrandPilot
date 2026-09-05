// src/app/api/webhooks/paystack/route.ts
// Paystack signs webhooks with HMAC-SHA512 of the raw body using your
// secret key — verify this before trusting anything, same principle as
// Stripe's signature check.
import crypto from "crypto";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-paystack-signature");

  const expectedSignature = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
    .update(rawBody)
    .digest("hex");

  if (signature !== expectedSignature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody);

  try {
    switch (event.event) {
      case "subscription.create": {
        const { customer, subscription_code, next_payment_date } = event.data;
        await db.subscription.updateMany({
          where: { paystackCustomerCode: customer.customer_code },
          data: {
            paystackSubscriptionCode: subscription_code,
            status: "ACTIVE",
            plan: "PRO",
            currentPeriodEnd: new Date(next_payment_date),
          },
        });
        break;
      }

      // Fired on every successful renewal charge — this is Paystack's
      // equivalent of Stripe's recurring invoice.paid.
      case "charge.success": {
        const { customer, plan } = event.data;
        if (plan?.plan_code) {
          await db.subscription.updateMany({
            where: { paystackCustomerCode: customer.customer_code },
            data: { status: "ACTIVE", plan: "PRO" },
          });
        }
        break;
      }

      case "subscription.disable": {
        const { customer } = event.data;
        await db.subscription.updateMany({
          where: { paystackCustomerCode: customer.customer_code },
          data: { status: "CANCELED", plan: "FREE", cancelAtPeriodEnd: false },
        });
        break;
      }

      case "invoice.payment_failed": {
        const { customer } = event.data;
        await db.subscription.updateMany({
          where: { paystackCustomerCode: customer.customer_code },
          data: { status: "PAST_DUE" },
        });
        break;
      }
    }
  } catch (err) {
    logger.error("Paystack webhook handler failed", { event: event.event, error: String(err) });    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}