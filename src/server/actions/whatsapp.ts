// src/server/actions/whatsapp.ts
"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import { redirect } from "next/navigation";

const phoneSchema = z.object({
  phoneNumber: z.string().regex(/^\+[1-9]\d{6,14}$/, "Use E.164 format, e.g. +15551234567"),
});

export async function connectWhatsappNumber(input: unknown) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Not authenticated" };

  const parsed = phoneSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };

  await db.channel.upsert({
    where: {
      userId_type_externalAccountId: {
        userId: session.user.id,
        type: "WHATSAPP",
        externalAccountId: parsed.data.phoneNumber,
      },
    },
    create: {
      userId: session.user.id,
      type: "WHATSAPP",
      label: parsed.data.phoneNumber,
      externalAccountId: parsed.data.phoneNumber,
      status: "CONNECTED",
    },
    update: { status: "CONNECTED" },
  });

  redirect("/dashboard/channels");
}