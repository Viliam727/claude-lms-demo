export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.LMS_API_URL!;
const API_KEY = process.env.LMS_API_KEY!;
const DEMO_USER_ID = "demo_user_001";

export async function POST(req: NextRequest) {
  const { courseId } = await req.json();

  const res = await fetch(`${BASE_URL}/api/v1/enrollments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({ user_id: DEMO_USER_ID, course_id: courseId }),
  });

  if (res.status === 409) {
    return NextResponse.json({ ok: true, alreadyEnrolled: true });
  }

  if (!res.ok) {
    return NextResponse.json({ error: "Enrollment failed" }, { status: res.status });
  }

  const json = await res.json();
  return NextResponse.json(json.data ?? json);
}
