import { NextRequest, NextResponse } from "next/server";
import { enroll } from "@/lib/lms-client";

export async function POST(req: NextRequest) {
  const { courseId } = await req.json();

  try {
    const data = await enroll(courseId);
    return NextResponse.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes("409")) {
      return NextResponse.json({ ok: true, alreadyEnrolled: true });
    }
    return NextResponse.json({ error: "Enrollment failed" }, { status: 500 });
  }
}
