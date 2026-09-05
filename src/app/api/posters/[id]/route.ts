// src/app/api/posters/[id]/route.ts
import { auth } from "@/lib/auth";
import { getPoster } from "@/server/actions/poster";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { id } = await params;
  const poster = await getPoster(id, session.user.id);
  if (!poster) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(poster);
}