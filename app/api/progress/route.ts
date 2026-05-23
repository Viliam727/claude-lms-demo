export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { recordProgress } from "@/lib/lms-client";

export async function POST(req: NextRequest) {
  const { enrollmentId, lessonId, completed, score } = await req.json();
  await recordProgress(enrollmentId, lessonId, completed, score);
  return NextResponse.json({ ok: true });
}
