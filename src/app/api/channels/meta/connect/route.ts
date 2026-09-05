// src/app/api/channels/meta/connect/route.ts
import { auth } from "@/lib/auth";
import { getMetaAuthUrl } from "@/server/services/channels/meta";
import { redirect } from "next/navigation";
import crypto from "crypto";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  // state binds the callback back to this user and guards against CSRF —
  // Meta echoes it back verbatim on redirect.
  const state = Buffer.from(JSON.stringify({ userId: session.user!.id, nonce: crypto.randomUUID() })).toString("base64url");
  redirect(getMetaAuthUrl(state));
}