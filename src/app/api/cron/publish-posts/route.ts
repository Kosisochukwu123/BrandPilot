// src/app/api/cron/publish-posts/route.ts
// Triggered by Vercel Cron (see vercel.json) every 5 minutes. Next.js has
// no persistent background worker, so due posts are picked up here rather
// than fired at schedule time — this is why scheduledAt has a minimum
// 5-minute buffer in schedulePost above.
import { db } from "@/lib/db";
import { decryptToken } from "@/lib/crypto";
import { publishFacebookPost, publishInstagramPost } from "@/server/services/channels/meta";
import { publishTweet } from "@/server/services/channels/x";
import { sendWhatsappTemplate } from "@/server/services/channels/whatsapp";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const due = await db.scheduledPost.findMany({
    where: { status: "QUEUED", scheduledAt: { lte: new Date() } },
    include: { channel: true },
    take: 25,
  });

  const results = await Promise.allSettled(
    due.map(async (post) => {
      const token = post.channel.accessToken ? decryptToken(post.channel.accessToken) : "";

      switch (post.channel.type) {
        case "FACEBOOK":
          await publishFacebookPost(post.channel.externalAccountId!, token, post.body);
          break;
        case "INSTAGRAM":
          if (!post.mediaUrl) throw new Error("Instagram posts require an image");
          await publishInstagramPost(post.channel.externalAccountId!, token, post.body, post.mediaUrl);
          break;
        case "X":
          await publishTweet(token, post.body);
          break;
        case "WHATSAPP":
          // externalAccountId here holds the recipient number for simplicity;
          // a production version would separate a contact list model out.
          await sendWhatsappTemplate(post.channel.externalAccountId!, "marketing_update", "en_US", [post.body]);
          break;
      }

      await db.scheduledPost.update({
        where: { id: post.id },
        data: { status: "PUBLISHED", publishedAt: new Date() },
      });
    })
  );

  const failed = results.filter((r) => r.status === "rejected");
  await Promise.all(
    due
      .filter((_, i) => results[i].status === "rejected")
      .map((post, i) =>
        db.scheduledPost.update({
          where: { id: post.id },
          data: { status: "FAILED", errorMessage: String((failed[i] as PromiseRejectedResult).reason) },
        })
      )
  );

  return NextResponse.json({ processed: due.length, failed: failed.length });
}