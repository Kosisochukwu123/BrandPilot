// src/lib/admin.ts
// Simple admin gate — checks the isAdmin flag on the current session's
// user. Every admin route/action calls this first; nothing here trusts
// the client.
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id)
    return { ok: false as const, error: "Not authenticated" };

  const user = await db.user.findUnique({ where: { id: session.user.id } });
  if (!user?.isAdmin) return { ok: false as const, error: "Not authorized" };

  return { ok: true as const, userId: user.id };
}
