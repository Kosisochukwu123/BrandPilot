// src/app/api/posters/batch/[batchId]/route.ts
import { auth } from "@/lib/auth";
import { getBatchPosters } from "@/server/actions/poster";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ batchId: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { batchId } = await params;
  const posters = await getBatchPosters(batchId, session.user.id);
  return NextResponse.json(posters);
}