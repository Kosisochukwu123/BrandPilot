// src/app/api/billing/paystack/callback/route.ts
import { verifyPaystackTransaction } from "@/server/services/paystack/checkout";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const reference = req.nextUrl.searchParams.get("reference") || req.nextUrl.searchParams.get("trxref");

  if (!reference) {
    return NextResponse.redirect(new URL("/dashboard/billing?error=missing_reference", req.url));
  }

  try {
    await verifyPaystackTransaction(reference);
    return NextResponse.redirect(new URL("/dashboard/billing?checkout=success", req.url));
  } catch (err) {
    console.error("Paystack verification failed:", err);
    return NextResponse.redirect(new URL("/dashboard/billing?checkout=failed", req.url));
  }
}