import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { Course, Enrollment, Progress } from "./types";

const DEMO_USER_ID = "demo_user_001";

async function lmsFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const { env } = getCloudflareContext();
  const envRecord = env as Record<string, unknown>;

  const apiKey = (envRecord.LMS_API_KEY as string) ?? process.env.LMS_API_KEY ?? "";
  const lmsBinding = envRecord.LMS_API as { fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response> } | undefined;

  if (!apiKey) {
    console.error("[LMS] LMS_API_KEY is missing!");
    throw new Error("LMS_API_KEY not configured");
  }

  if (!lmsBinding) {
    console.error("[LMS] LMS_API service binding is missing!");
    throw new Error("LMS_API service binding not configured");
  }

  console.log(`[LMS] ${init?.method ?? "GET"} ${path} (via service binding)`);

  const res = await lmsBinding.fetch(`https://internal${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      ...init?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error(`[LMS] Error ${res.status} on ${path}: ${body}`);
    throw new Error(`LMS API error: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  return ("data" in json ? json.data : json) as T;
}

function parseLessonContent(raw: unknown): unknown {
  if (typeof raw === "string") {
    try { return JSON.parse(raw); } catch { return {}; }
  }
  return raw;
}

function parseCourse(course: Course): Course {
  return {
    ...course,
    modules: (course.modules ?? []).map((m) => ({
      ...m,
      lessons: (m.lessons ?? []).map((l) => ({
        ...l,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        content: parseLessonContent(l.content) as any,
      })),
    })),
  };
}

export async function getCourses(): Promise<Course[]> {
  const list = await lmsFetch<Course[]>("/api/v1/courses");
  const full = await Promise.all(list.map((c) => getCourse(c.id)));
  return full;
}

export async function getCourse(id: string): Promise<Course> {
  const course = await lmsFetch<Course>(`/api/v1/courses/${id}`);
  return parseCourse(course);
}

export function enroll(courseId: string): Promise<Enrollment> {
  return lmsFetch("/api/v1/enrollments", {
    method: "POST",
    body: JSON.stringify({ user_id: DEMO_USER_ID, course_id: courseId }),
  });
}

export function getEnrollments(): Promise<Enrollment[]> {
  return lmsFetch(`/api/v1/enrollments?user_id=${DEMO_USER_ID}`);
}

export async function getEnrollmentForCourse(courseId: string): Promise<Enrollment | null> {
  const enrollments = await getEnrollments();
  return enrollments.find((e) => e.course_id === courseId) ?? null;
}

export function getProgress(courseId: string): Promise<Progress[]> {
  return lmsFetch(
    `/api/v1/progress?user_id=${DEMO_USER_ID}&course_id=${courseId}`
  );
}

export function recordProgress(
  enrollmentId: string,
  lessonId: string,
  completed: boolean,
  score?: number
): Promise<void> {
  return lmsFetch("/api/v1/progress", {
    method: "POST",
    body: JSON.stringify({
      user_id: DEMO_USER_ID,
      enrollment_id: enrollmentId,
      lesson_id: lessonId,
      completed,
      ...(score !== undefined && { score }),
    }),
  });
}
