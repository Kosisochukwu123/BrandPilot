// src/app/api/channels/meta/callback/route.ts
import { db } from "@/lib/db";
import {
  exchangeMetaCode,
  getManagedPages,
} from "@/server/services/channels/meta";
import { encryptToken } from "@/lib/crypto";
import { logger } from "@/lib/logger";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  if (!code || !state) {
    return NextResponse.redirect(
      new URL("/dashboard/channels?error=missing_code", req.url),
    );
  }

  const { userId } = JSON.parse(Buffer.from(state, "base64url").toString());

  try {
    const { access_token, expires_in } = await exchangeMetaCode(code);
    const pages = await getManagedPages(access_token);

    // For simplicity, connect the first managed Page. A future pass can
    // let the user pick when they manage multiple Pages.
    const page = pages[0];
    if (!page) throw new Error("No Facebook Page found for this account");

    await db.channel.upsert({
      where: {
        userId_type_externalAccountId: {
          userId,
          type: "FACEBOOK",
          externalAccountId: page.id,
        },
      },
      create: {
        userId,
        type: "FACEBOOK",
        label: page.name,
        externalAccountId: page.id,
        accessToken: encryptToken(page.access_token),
        tokenExpiresAt: new Date(Date.now() + expires_in * 1000),
        status: "CONNECTED",
      },
      update: {
        label: page.name,
        accessToken: encryptToken(page.access_token),
        tokenExpiresAt: new Date(Date.now() + expires_in * 1000),
        status: "CONNECTED",
      },
    });

    return NextResponse.redirect(
      new URL("/dashboard/channels?connected=facebook", req.url),
    );
  } catch (err) {
    logger.error("Meta OAuth callback failed", { error: String(err) });
    return NextResponse.redirect(
      new URL("/dashboard/channels?error=connect_failed", req.url),
    );
  }
}
